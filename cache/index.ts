import "server-only"
import { cache } from "react"
import { resolve } from "path"
import { readFile } from "fs/promises"

export const preload = () => {
  void getTrie()
  void getMovieIndex()
}

export const getTrie = cache(async () => {
  try {
    console.log("Reading trie from disk")
    const triePath = resolve(process.cwd(), "data/prefix-trie.json")
    const trie = await readFile(triePath, { encoding: "utf-8" })
    return JSON.parse(trie)
  } catch (error) {
    console.error(error)
    return {}
  }
})

export const getMovieIndex = cache(async () => {
  try {
    console.log("Reading movie index from disk")
    const movieIndexPath = resolve(process.cwd(), "data/movie-index.json")
    const movieIndex = await readFile(movieIndexPath, { encoding: "utf-8" })
    return JSON.parse(movieIndex)
  } catch (error) {
    console.error(error)
    return {}
  }
})
