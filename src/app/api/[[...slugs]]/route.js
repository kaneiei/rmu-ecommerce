// app/api/[[...slugs]]/route.ts
import { Elysia, t } from 'elysia'
import swagger from '@elysiajs/swagger'
import { products } from '@/lib/mock-data'

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
    .get('/', () => 'hello Next')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })
    .get('/products', () => {
        return products
    })

export const GET = app.handle
export const POST = app.handle 