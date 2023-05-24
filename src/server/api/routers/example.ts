import { TaskStatusEnum } from "@prisma/client";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const exampleRouter = createTRPCRouter({
    addTask: protectedProcedure
        .input(z.object({ task: z.string() }))
        .mutation(
            async ({ ctx, input }) => {
                const data = prisma.task.create(
                    {
                        data: {
                            taskName: input.task,
                            userId: ctx.session.user.id
                        },
                        select: {
                            id: true,
                            taskName: true,
                        }
                    }
                );

                return data;
            }
        ),
    getTasks: protectedProcedure
        .query(
            async ({ ctx }) => {
                const data = prisma.task.findMany(
                    {
                        where: {
                            userId: ctx.session.user.id
                        },
                        select: {
                            id: true,
                            taskName: true,
                            status: true,
                        },
                        orderBy: {
                            createdAt: "desc"
                        }
                    }
                );

                return data;
            }
        ),
    updateTask: protectedProcedure
        .input(z.object({ id: z.string(), status: z.nativeEnum(TaskStatusEnum) }))
        .mutation(
            async ({ ctx, input }) => {
                const data = prisma.task.update(
                    {
                        where: {
                            id: input.id
                        },
                        data: {
                            status: input.status
                        },
                        select: {
                            id: true,
                            taskName: true,
                            status: true,
                        }
                    }
                );

                return data;
            }
        ),
    deleteTask: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(
            async ({ ctx, input }) => {
                const data = await prisma.task.delete(
                    {
                        where: {
                            id: input.id
                        },
                        select: {
                            id: true,
                        }
                    }
                );

                return input;
            }
        ),

});
