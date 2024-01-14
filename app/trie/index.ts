import "server-only"
import { cache } from "react"
import { getMovieIndex } from "@/cache"
import { Movie, PrefixTrie, EOF, ID } from "@/types"

export const preload = (prefixTrie: PrefixTrie, query: string) => {
  void searchTrie(prefixTrie, query)
}

const traverseTree = cache(
  async (node: PrefixTrie, index: Record<string, Movie>): Promise<Movie[]> => {
    const results = new Set<number>()
    const keys = Object.keys(node)

    if (!node) {
      return []
    }

    for (const key of keys) {
      if (results.size === 10) {
        break
      }

      if (key === EOF && node[EOF]) {
        const id = node[ID]
        if (id !== undefined) {
          results.add(id)
        }
      } else if (typeof node[key] !== "object") {
        continue
      } else {
        const nextNode = node[key]
        const nextResults = await traverseTree(nextNode, index)
        nextResults.forEach((result) => results.add(result.id))
      }
    }

    const finalResults = Array.from(results).map((id) => index[id])

    return finalResults
  }
)

export const searchTrie = cache(
  async (prefixTrie: PrefixTrie, query: string): Promise<Movie[]> => {
    const index = await getMovieIndex()
    const lowerCaseQuery = query.toLowerCase()
    const chars = lowerCaseQuery.split("")
    const results = chars.reduce((acc, char: string) => {
      if (acc.hasOwnProperty(char)) {
        return acc[char]
      }
      return acc
    }, prefixTrie)

    return traverseTree(results, index)
  }
)
