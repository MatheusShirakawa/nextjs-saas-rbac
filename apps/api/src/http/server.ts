import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
    jsonSchemaTransform,
    validatorCompiler,
    serializerCompiler,
    ZodTypeProvider
 } from 'fastify-type-provider-zod'
import { createAccount } from "./routes/auth/create-account";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Fullstack SaaS app with multi-tenant & RBAC',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,

  // You can also create transform with custom skiplist of endpoints that should not be included in the specification:
  //
  // transform: createJsonSchemaTransform({
  //   skipList: [ '/documentation/static/*' ]
  // })
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwaggerUi, {routePrefix:'/docs'})
app.register(fastifyCors)
app.register(createAccount)

app.listen({ port: 3333 }).then(() => {
    console.log("http server running")
})