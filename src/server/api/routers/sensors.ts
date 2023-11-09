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
	getAll: publicProcedure.query(async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000))

		return {
			cards,
		}
	}),

	//TODO: update type
	create: publicProcedure
		.input(z.object({ name: z.string().min(1), sensorID: z.string().length(7), measurementDuration: z.number().min(1).max(9999), type: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// simulate a slow db call
			await new Promise((resolve) => setTimeout(resolve, 1000))

			cards.push({
				id: Math.random().toString(36).substr(2, 9),
				name: input.name,
				sensorID: input.sensorID,
				status: 'yellow',
				type: input.type,
				measurementDuration: input.measurementDuration,
				lastMeasurement: 0,
				measurements: [],
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

