// app/api/[[...slugs]]/route.ts
import { Elysia, t } from 'elysia'
import swagger from '@elysiajs/swagger'
import { products } from '@/lib/mock-data'
import { productsRoute } from '@/server/routes/productRoute'
import { authenRoute } from '@/server/routes/authenRoute'

const swaggerconfig = {
    title: 'Elysia',
    description: 'Elysia API',
    version: '1.0.0',
    contact: {
        name: 'Elysia',
        email: 'lHs8F@example.com',
    },
}
const app = new Elysia({ prefix: '/api' })
    .use(swagger(swaggerconfig))
    .use(productsRoute)
    .use(authenRoute)

export const GET = app.handle
export const POST = app.handle 
export const PUT = app.handle
export const DELETE = app.handle