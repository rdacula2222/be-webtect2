import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import studentsRoute from './students/students.route.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/students', studentsRoute);

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})