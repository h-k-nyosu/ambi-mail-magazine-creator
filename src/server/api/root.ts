import { createTRPCRouter } from "~/server/api/trpc";
import { jobRouter } from "./routers/job";
import { magazineRouter } from "./routers/magazine";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  job: jobRouter,
  magazine: magazineRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
