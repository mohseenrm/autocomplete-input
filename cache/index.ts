import "server-only"
import { cache } from "react"
import { resolve } from "path"
import { readFile } from "fs/promises"


export const preload = () => {
  void getTrie()
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
