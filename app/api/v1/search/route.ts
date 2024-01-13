import { type NextRequest } from "next/server"
import { getTrie } from "@/cache"
import { searchTrie } from "@/app/trie"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

  const trie = await getTrie()

  if (query === null || query === undefined) {
    return Response.json(
      {
        results: [],
        error: "No query provided",
      },
      { status: 400 }
    )
  }

  const prefixTrie = trie
  const results = await searchTrie(prefixTrie, query)

  return Response.json({
    query,
    results,
  })
}
