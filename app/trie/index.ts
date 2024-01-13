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

const traverseTree = async (node: PrefixTrie): Promise<Movie[]> => {
  const index = await getMovieIndex()
  const results: Movie[] = []
  const keys = Object.keys(node)

  for (const key of keys) {
    if (key === EOF && node[EOF] === true) {
      const id = node[ID]
      if (id !== undefined) {
        results.push(index[id])
      }
    } else {
      const nextNode = node[key]
      if (typeof nextNode !== "object") {
        continue
      }
      const nextResults = await traverseTree(nextNode)
      results.push(...nextResults)
    }
  }
  return results
}

const searchTrie = async (prefixTrie: PrefixTrie, query: string): Promise<Movie[]> => {
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
