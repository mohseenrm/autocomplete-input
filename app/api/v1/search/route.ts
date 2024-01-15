import { type NextRequest } from "next/server"
import { getTrie, getMoviesWithArgs } from "@/cache"
import { searchTrie } from "@/app/trie"
import { getRedis } from "@/app/redis"

export async function GET(request: NextRequest) {
  const start = Date.now()
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")
  const page = searchParams.get("page")

  if (query === null || query === undefined) {
    return Response.json(
      {
        results: [],
        error: "No query provided",
      },
      { status: 400 }
    )
  }

  if (page && (isNaN(Number(page)) || Number(page) > 1000 || Number(page) < 1)) {
    return Response.json(
      {
        results: [],
        error: "Page must be a number between 1 and 1000",
      },
      { status: 400 }
    )
  }

  if (query === "" && page) {
    const diff = Date.now() - start
    const results = await getMoviesWithArgs({ page: Number(page) })
    return Response.json({
      query,
      results,
      serverTime: diff,
    })
  }

  if (query.length > 100) {
    return Response.json(
      {
        results: [],
        error: "Query must be less than 100 characters",
      },
      { status: 400 }
    )
  }

  const redisKey = `query:${query.toLowerCase()}`
  const redis = getRedis()

  try {
    // await redis.connect()
    const cachedResults = await redis.call("JSON.GET", redisKey, "$")
    const parsedCachedResults = JSON.parse(cachedResults as string)

    if (parsedCachedResults && Array.isArray(parsedCachedResults)) {
      const diff = Date.now() - start
      return Response.json({
        query,
        results: parsedCachedResults[0],
        serverTime: diff,
        cached: true,
      })
    }
  } catch (error) {
    console.error("Failed to connect to redis")
    console.error(error)
  }

  const trie = await getTrie()
  const prefixTrie = trie
  const results = await searchTrie(prefixTrie, query)
  const diff = Date.now() - start

  try {
    await redis.call("JSON.SET", redisKey, "$", JSON.stringify(results))
  } catch (error) {
    console.error("Failed to set cache in redis")
    console.error(error)
  }

  return Response.json({
    query,
    results,
    serverTime: diff,
    cached: false,
  })
}
