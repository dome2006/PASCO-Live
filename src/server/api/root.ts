/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { sensorRouter } from "~/server/api/routers/sensors";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  sensor: sensorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
