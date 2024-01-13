import { type NextRequest } from "next/server"
import { getTrie } from "@/cache"

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
  const lowerCaseQuery = query.toLowerCase()
  const chars = lowerCaseQuery.split("")
  const results = chars.reduce((acc, char: string) => {
    if (acc.hasOwnProperty(char)) {
      return acc[char]
    }
    return acc
  }, prefixTrie)
  console.log(results)

  return Response.json({
    query,
    results: [
      {
        title: "Hello World",
        description: "This is a test",
      },
    ],
  })
}
