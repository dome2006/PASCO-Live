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

async def main() -> None:
    await prisma.connect()

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
                #if pascoSensorsLastMeasurementTime not exists, or more than 5 minutes ago write current system time in it
                seconds = sensor.measurementDuration * 60
                if sensor.sensorID not in pascoSensorsLastMeasurementTime or (sensor.sensorID in pascoSensorsLastMeasurementTime and pascoSensorsLastMeasurementTime[sensor.sensorID] + seconds < time.time()):
                    print("Update Measurement of " + sensor.sensorID)
                    pascoSensorsLastMeasurementTime[sensor.sensorID] = time.time()
                    temp = pascoSensors[sensor.sensorID].read_data("Temperature")
                    await prisma.measurement.create(
                        data={
                            "sensorId": sensor.id,
                            "value": temp,
                            "type": "Temperatur"
                        }
                    )
                    print("Temperature: " + str(temp))
                    
            except Exception as e:
                await checkSensorStatus(sensor.id, sensor.sensorID)


if __name__ == '__main__':
    asyncio.run(main())