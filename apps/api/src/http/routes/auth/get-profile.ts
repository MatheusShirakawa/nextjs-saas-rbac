import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "node_modules/fastify-type-provider-zod/dist/esm/core";
import z from "zod";

export async function getProfile(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/profile', {
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
        const { sub } =  await request.jwtVerify<{sub: string}>()

        const user = await prisma.user.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
            },
            where: { id: sub }
        })

        if (!user){
            return reply.status(404).send({ message: 'User not found' });
        }

        return reply.send({ user })
    })
}