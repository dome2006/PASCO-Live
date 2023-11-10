/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SensorType } from '@prisma/client'
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

			let latestMeasurementTime = -1
			let latestMeasurementDataGroupedByType: Record<string, { timestamp: Date; value: number | string }> = {}

			if (Measurement.length != 0) {
				latestMeasurementTime = Measurement.reduce((prev, current) => (prev.timestamp > current.timestamp ? prev : current)).timestamp.getTime()
				latestMeasurementDataGroupedByType = Measurement.reduce<Record<string, { timestamp: Date; value: number | string }>>((prev, current) => {
					const prevValue = prev[current.type]

					if (prevValue && prevValue.timestamp > current.timestamp) {
						return prev
					}

					return {
						...prev,
						[current.type]: {
							timestamp: current.timestamp,
							value: current.value,
						},
					}
				}, {})
			}

			const measurements = Object.entries(latestMeasurementDataGroupedByType).map(([name, { value }]) => ({
				name,
				value,
			}))

			return {
				...strippedSensorData,
				measurements,
				lastMeasurement: latestMeasurementTime,
			}
		})

		return { cards: sensorWithLatestMeasurement }
	}),

	//TODO: update type
	create: publicProcedure
		.input(z.object({ name: z.string().min(1), sensorID: z.string().length(7), measurementDuration: z.number().min(1).max(9999), sensorType: z.nativeEnum(SensorType) }))
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
				sensorID: z.string().length(7).optional(),
				measurementDuration: z.number().min(1).max(9999).optional(),
				type: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			// simulate a slow db call
			await new Promise((resolve) => setTimeout(resolve, 1000))

			const card = cards.find((card) => card.id === input.id)

			if (!card) {
				return false
			}

			card.name = input.name ?? card.name
			card.sensorID = input.sensorID ?? card.sensorID
			card.type = input.type ?? card.type
			card.measurementDuration = input.measurementDuration ?? card.measurementDuration

			return true
		}),
})

