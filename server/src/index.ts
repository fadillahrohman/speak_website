import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRoutes from '../routes/auth-routes.js'
import connectionToDatabase from '../lib/database.js'


const app = new Hono()
// Connect database when application starts
connectionToDatabase()
  .then(() => console.log("-> Database connection successful"))
  .catch(error => console.log("-> Database connection failed :", error))

app.use('*', cors({
  origin: process.env.ORIGIN_URL || 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Authentication & Authorization
app.route('/auth', authRoutes)

const PORT = Number(process.env.PORT) || 3000;
serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
