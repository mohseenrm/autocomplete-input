import { type NextRequest } from "next/server"
import { getTrie, getMoviesWithArgs } from "@/cache"
import { searchTrie } from "@/app/trie"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")
  const page = searchParams.get("page")

  console.log("env: ", process.env)

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
    const results = await getMoviesWithArgs({ page: Number(page) })
    return Response.json({
      query,
      results,
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

  const trie = await getTrie()
  const prefixTrie = trie
  const results = await searchTrie(prefixTrie, query)

  return Response.json({
    query,
    results,
  })
}
