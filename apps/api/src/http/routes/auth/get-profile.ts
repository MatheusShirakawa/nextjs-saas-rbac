import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "node_modules/fastify-type-provider-zod/dist/esm/core";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { auth } from "@/http/middlewares/auth";

export async function getProfile(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/profile', {
        schema:{
            tags: ['Auth'],
            summary: 'Get authenticated user profile',
            response:{
                404: z.object({
                    message: z.string()
                }),
                200: z.object({
                    user: z.object({
                        id: z.uuid(),
                        name: z.string().nullable(),
                        email: z.email(),
                        avatarUrl: z.url().nullable(),
                    })
                })
            }
        }
    }, async (request, reply) => {
        const userId =  await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
            },
            where: { id: userId }
        })

        if (!user){
            throw new BadRequestError('User not found');
        }

        return reply.send({ user })
    })
}