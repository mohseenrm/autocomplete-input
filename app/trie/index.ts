import "server-only"
import { cache } from "react"
import { getMovieIndex } from "@/cache"

type Movie = {
  id: number
  title: string
  poster_path: string
  release_date: string
}

const EOF = "EOF" as const
const ID = "ID" as const

type PrefixTrie = {
  readonly [key: string]: PrefixTrie
} & {
  readonly [EOF]: boolean
  readonly [ID]?: number
}

// export const preload = () => {
//   void getPrefixTrie()
// }

const traverseTree = cache(
  async (node: PrefixTrie): Promise<Movie[]> => {
    const index = await getMovieIndex()
    const results = new Set<Movie>()
    const keys = Object.keys(node)
  
    for (const key of keys) {
      if (results.size === 10) {
        break
      }
      if (key === EOF && node[EOF]) {
        const id = node[ID]
        if (id !== undefined) {
          results.add(index[id])
        }
      } else if (typeof node[key] !== "object") {
        continue
      } else {
        const nextNode = node[key]
        const nextResults = await traverseTree(nextNode)
        nextResults.forEach((result) => results.add(result))
      }
    }
    return Array.from(results)
  }
)

const searchTrie = cache(
  async (
    prefixTrie: PrefixTrie,
    query: string
  ): Promise<Movie[]> => {
    const lowerCaseQuery = query.toLowerCase()
    const chars = lowerCaseQuery.split("")
    const results = chars.reduce((acc, char: string) => {
      if (acc.hasOwnProperty(char)) {
        return acc[char]
      }
      return acc
    }, prefixTrie)
  
    return traverseTree(results)
  }
)
