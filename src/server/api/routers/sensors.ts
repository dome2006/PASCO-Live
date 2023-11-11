/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MeasurementType, SensorType } from '@prisma/client'
import moment from 'moment'
import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

const cards = [
	{
		id: '4e36bwbe465b65e',
		name: 'Zimmerteperatur',
		sensorID: '202-838',
		status: 'green',
		type: 'Temperatur',
		measurementDuration: 5,
		lastMeasurement: 3,
		measurements: [
			{
				name: 'Temperatur',
				value: '20°C',
			},
			{
				name: 'Batterie',
				value: '52%',
			},
		],
	},
	{
		id: '3w364wvv6wve',
		name: 'Zimmerluft',
		sensorID: '138-468',
		status: 'green',
		type: 'Luftqualität',
		measurementDuration: 5,
		lastMeasurement: 2,
		measurements: [
			{
				name: 'CO2',
				value: '512 ppm',
			},
			{
				name: 'Batterie',
				value: '52%',
			},
		],
	},
]

export const sensorRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const sensors = await ctx.db.sensor.findMany({ include: { Measurement: true } })

		const sensorWithLatestMeasurement = sensors.map((sensor) => {
			const { Measurement, ...strippedSensorData } = sensor

			let latestMeasurement = -1
			let latestMeasurementDataGroupedByType: Record<string, { timestamp: number; value: number | string }> = {}

			if (Measurement.length != 0) {
				latestMeasurementDataGroupedByType = Measurement.reduce<Record<string, { timestamp: number; value: number | string }>>((prev, current) => {
					const prevValue = prev[current.type]

					if (prevValue && prevValue.timestamp > moment().diff(moment(current.timestamp), 'minutes')) {
						return prev
					}

					let einheit = ''

					if (current.type == 'Temperatur') {
						einheit = '°C'
					}
					if (current.type == 'Batterie') {
						einheit = '%'
					}

					return {
						...prev,
						[current.type]: {
							timestamp: moment().diff(moment(current.timestamp), 'minutes'),
							value: current.value + ' ' + einheit,
						},
					}
				}, {})
				Object.entries(latestMeasurementDataGroupedByType).forEach(([_, { timestamp }]) => {
					if (latestMeasurement == -1 || timestamp < latestMeasurement) {
						latestMeasurement = timestamp
					}
				})
			}

			const measurements = Object.entries(latestMeasurementDataGroupedByType).map(([name, { value }]) => ({
				name,
				value,
			}))

			return {
				...strippedSensorData,
				measurements,
				lastMeasurement: latestMeasurement,
			}
		})

		return { cards: sensorWithLatestMeasurement }
	}),

	//TODO: update type
	create: publicProcedure
		.input(
			z.object({
				name: z.string().min(1),
				sensorID: z.string().regex(/[0-9]{3}\-[0-9]{3}/g),
				measurementDuration: z.number().min(1).max(9999),
				sensorType: z.nativeEnum(SensorType),
			})
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.sensor.create({
				data: {
					name: input.name,
					sensorID: input.sensorID,
					measurementDuration: input.measurementDuration,
					sensorType: input.sensorType,
					status: 'yellow',
				},
			})

			return true
		}),

	update: publicProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1).optional(),
				sensorID: z.string().regex(/[0-9]{3}\-[0-9]{3}/g).optional(),
				measurementDuration: z.number().min(1).max(9999).optional(),
				sensorType: z.nativeEnum(SensorType).optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.sensor.update({
				where: { id: input.id },
				data: {
					name: input.name,
					sensorID: input.sensorID,
					measurementDuration: input.measurementDuration,
					sensorType: input.sensorType,
				},
			})

			return true
		}),
})

