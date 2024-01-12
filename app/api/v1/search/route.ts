import { type NextRequest } from "next/server"

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

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
