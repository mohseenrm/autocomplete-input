import "server-only"
import { cache } from "react"
import { resolve } from "path"
import { readFile } from "fs/promises"
import { PAGE_SIZE } from "@/app/constants"

export const preload = () => {
  void getTrie()
  void getMovieIndex()
  void getMovies()
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
    const movieIndexPath = resolve(process.cwd(), "data/movies-index.json")
    const movieIndex = await readFile(movieIndexPath, { encoding: "utf-8" })
    return JSON.parse(movieIndex)
  } catch (error) {
    console.error(error)
    return {}
  }
})

export const getMovies = cache(async () => {
  try {
    console.log("Reading movies from disk")
    const moviesPath = resolve(process.cwd(), "data/movies.json")
    const movies = await readFile(moviesPath, { encoding: "utf-8" })
    return JSON.parse(movies)
  } catch (error) {
    console.error(error)
    return []
  }
})

export const getMoviesWithArgs = cache(async (args: { page: number }) => {
  try {
    const movies = await getMovies()
    const { page } = args
    const results = movies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    return results
  } catch (error) {
    console.error(error)
    return []
  }
})
