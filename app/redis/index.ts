import { Redis } from "ioredis"

export const getRedis = (): Redis => {
  const host = process.env.REDIS_HOST
  const port = Number(process.env.REDIS_PORT)
  const password = process.env.REDIS_PASSWORD
  const username = process.env.REDIS_USERNAME

  const redis = new Redis({
    host,
    port,
    password,
    username,
  })

  return redis
}
