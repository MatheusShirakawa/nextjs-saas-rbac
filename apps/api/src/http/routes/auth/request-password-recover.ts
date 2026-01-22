import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "node_modules/fastify-type-provider-zod/dist/esm/core";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { auth } from "@/http/middlewares/auth";

export async function requestPasswordRecover(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/password/recover', {
        schema:{
            tags: ['Auth'],
            summary: 'Request password recovery',
            body: z.object({
                email: z.email()
            })
        }
    }, async (request, reply) => {
        const { email } = request.body

        const userFromEmail = await prisma.user.findUnique({
            where: { email }
        })

        if (!userFromEmail){
            // we don't want people to know if user really exists
            return reply.status(201).send()
        }

        const {id: code } = await prisma.token.create({
            data:{
                type: 'PASSWORD_RECOVER',
                userId: userFromEmail.id,
            }
        })

        // send e-mail with password recover link (TODO)
        console.log('recover password token: ', code)

        return reply.status(201).send()
    })
}