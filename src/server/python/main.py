# ../../../python-env/bin/prisma generate --schema=../../../prisma/schema.prisma
#source ../../../python-env/bin/activate

import asyncio
import string
import time
from pasco import PASCOBLEDevice
from prisma import Prisma

# device = PASCOBLEDevice()
# device.connect_by_id("ID")
prisma = Prisma()

pascoSensors = {}
pascoSensorsLastMeasurementTime = {}
pascoSensorsLastUpdateTime = {}

async def main() -> None:
    await prisma.connect()

    print("start")

    while True:
        await updateSensors()
        await asyncio.sleep(2)


async def connectToSensor(id: string, sensorId: string):
    try:
        pascoSensors[sensorId] = PASCOBLEDevice()
        print("Connecting to sensor " + sensorId)
        pascoSensors[sensorId].connect_by_id(sensorId)

        print(pascoSensors[sensorId].get_measurement_list())

        await prisma.sensor.update(
            where={
                "id": id
            },
            data={
                "status": "green"
            }
        )
    except:
        await prisma.sensor.update(
            where={
                "id": id
            },
            data={
                "status": "red"
            }
        )
        pass

async def checkSensorStatus(id: string, sensorId: string):
    if pascoSensors[sensorId].is_connected():
        await prisma.sensor.update(
            where={
                "id": id
            },
            data={
                "status": "green"
            }
        )
    else:
        sensor = await prisma.sensor.find_unique(
            where={
                "id": id
            }
        )

        if sensor.status == "yellow": ##yellow means it is should reconnect
            print("Reconnect to " + sensor.sensorID)
            await connectToSensor(id, sensorId)
        else:
            await prisma.sensor.update(
                where={
                    "id": id
                },
                data={
                    "status": "red"
                }
            )

async def updateSensors():
    sensors = await prisma.sensor.find_many()

    #add sensors that are in the database but not in the list
    for sensor in sensors:
        if sensor.sensorID not in pascoSensors:
            pascoSensors[sensor.sensorID] = PASCOBLEDevice()
            await connectToSensor(sensor.id, sensor.sensorID)
        else:
            try:
                if not pascoSensors[sensor.sensorID].is_connected():
                    #throw error
                    raise Exception("Sensor is not connected")
                
                if sensor.sensorID not in pascoSensorsLastUpdateTime or pascoSensorsLastUpdateTime[sensor.sensorID] + 60 * 4 < time.time():
                    pascoSensorsLastUpdateTime[sensor.sensorID] = time.time()
                    pascoSensors[sensor.sensorID].keepalive()

                #if pascoSensorsLastMeasurementTime not exists, or more than 5 minutes ago write current system time in it
                seconds = sensor.measurementDuration
                if sensor.sensorID not in pascoSensorsLastMeasurementTime or (sensor.sensorID in pascoSensorsLastMeasurementTime and pascoSensorsLastMeasurementTime[sensor.sensorID] + seconds < time.time()):
                    print("Update Measurement of " + sensor.sensorID + sensor.sensorType)
                    pascoSensorsLastMeasurementTime[sensor.sensorID] = time.time()
                    pascoSensorsLastUpdateTime[sensor.sensorID] = time.time()
                    if sensor.sensorType == "O2":
                        OxygenGasConcentration = pascoSensors[sensor.sensorID].read_data("OxygenGasConcentration")
                        await prisma.measurement.create(
                            data={
                                "sensorId": sensor.id,
                                "value": OxygenGasConcentration,
                                "type": "O2"
                            }
                        )
                        print("O2: " + str(OxygenGasConcentration))
                        Temperature = pascoSensors[sensor.sensorID].read_data("Temperature")
                        await prisma.measurement.create(
                            data={
                                "sensorId": sensor.id,
                                "value": Temperature,
                                "type": "temperatur"
                            }
                        )
                        print("Temperature: " + str(Temperature))
                        RelativeHumidity = pascoSensors[sensor.sensorID].read_data("RelativeHumidity")
                        await prisma.measurement.create(
                            data={
                                "sensorId": sensor.id,
                                "value": RelativeHumidity,
                                "type": "humidity"
                            }
                        )
                        print("Humidity: " + str(RelativeHumidity))
                    elif sensor.sensorType == "Temperatur":
                        Temperature = pascoSensors[sensor.sensorID].read_data("Temperature")
                        await prisma.measurement.create(
                            data={
                                "sensorId": sensor.id,
                                "value": Temperature,
                                "type": "temperatur"
                            }
                        )
                        print("Temperature: " + str(Temperature))
                    elif sensor.sensorType == "CO2":
                        print("CO2")
                        CO2GasConcentration = pascoSensors[sensor.sensorID].read_data("CO2Concentration")
                        await prisma.measurement.create(
                            data={
                                "sensorId": sensor.id,
                                "value": CO2GasConcentration,
                                "type": "CO2"
                            }
                        )
                        print("CO2: " + str(CO2GasConcentration))
                    elif sensor.sensorType == "SoileMoisture":
                        VWCLoam = pascoSensors[sensor.sensorID].read_data("VWCLoam")
                        await prisma.measurement.create(
                            data={
                                "sensorId": sensor.id,
                                "value": VWCLoam,
                                "type": "VWCLoam"
                            }
                        )
                        print("VWCLoam: " + str(VWCLoam))
                        VWCSand = pascoSensors[sensor.sensorID].read_data("VWCSand")
                        await prisma.measurement.create(
                            data={
                                "sensorId": sensor.id,
                                "value": VWCSand,
                                "type": "VWCSand"
                            }
                        )
                        print("VWCSand: " + str(VWCSand))
                        VWCClay = pascoSensors[sensor.sensorID].read_data("VWCClay")
                        await prisma.measurement.create(
                            data={
                                "sensorId": sensor.id,
                                "value": VWCClay,
                                "type": "VWCClay"
                            }
                        )
                        print("VWCClay: " + str(VWCClay))
                    # elif sensor.sensorType == "SoileMoisture":
                    #     VWCLoam = pascoSensors[sensor.sensorID].read_data("VWCLoam")
                    #     await prisma.measurement.create(
                    #         data={
                    #             "sensorId": sensor.id,
                    #             "value": VWCLoam,
                    #             "type": "VWCLoam"
                    #         }
                    #     )
                    #     print("VWCLoam: " + str(VWCLoam))
                    #     VWCSand = pascoSensors[sensor.sensorID].read_data("VWCSand")
                    #     await prisma.measurement.create(
                    #         data={
                    #             "sensorId": sensor.id,
                    #             "value": VWCSand,
                    #             "type": "VWCSand"
                    #         }
                    #     )
                    #     print("VWCSand: " + str(VWCSand))
                    #     VWCClay = pascoSensors[sensor.sensorID].read_data("VWCClay")
                    #     await prisma.measurement.create(
                    #         data={
                    #             "sensorId": sensor.id,
                    #             "value": VWCClay,
                    #             "type": "VWCClay"
                    #         }
                    #     )
                    #     print("VWCClay: " + str(VWCClay))
                    elif sensor.sensorType == "DesolvedOxygen":
                        DO2Saturation = pascoSensors[sensor.sensorID].read_data("DO2Saturation")
                        await prisma.measurement.create(
                            data={
                                "sensorId": sensor.id,
                                "value": DO2Saturation,
                                "type": "DO2Saturation"
                            }
                        )
                        print("DO2Saturation: " + str(DO2Saturation))
                        DO2Concentraition = pascoSensors[sensor.sensorID].read_data("DO2Concentraition")
                        await prisma.measurement.create(
                            data={
                                "sensorId": sensor.id,
                                "value": DO2Concentraition,
                                "type": "DO2Concentraition"
                            }
                        )
                        print("DO2Concentraition: " + str(DO2Concentraition))
                        O2GasConcentraiton = pascoSensors[sensor.sensorID].read_data("O2GasConcentraiton")
                        await prisma.measurement.create(
                            data={
                                "sensorId": sensor.id,
                                "value": O2GasConcentraiton,
                                "type": "O2GasConcentraiton"
                            }
                        )
                        print("O2GasConcentraiton: " + str(O2GasConcentraiton))
                        temperatur = pascoSensors[sensor.sensorID].read_data("Temperature")
                        await prisma.measurement.create(
                            data={
                                "sensorId": sensor.id,
                                "value": temperatur,
                                "type": "temperatur"
                            }
                        )
                        print("temperatur: " + str(temperatur))
                    elif sensor.sensorType == "Pressure":
                        Pressure = pascoSensors[sensor.sensorID].read_data("Pressure")
                        await prisma.measurement.create(
                            data={
                                "sensorId": sensor.id,
                                "value": Pressure,
                                "type": "pressure"
                            }
                        )
                        print("Pressure: " + str(Pressure))

                    
            except Exception as e:
                print(e)
                await checkSensorStatus(sensor.id, sensor.sensorID)


if __name__ == '__main__':
    asyncio.run(main())