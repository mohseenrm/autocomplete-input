const path = require("path")
const { createWriteStream } = require("fs")

const MOVIES_DATA_PATH = path.resolve(process.cwd(), "./data/movies.json")
const PREFIX_TRIE_DATA_PATH = path.resolve(process.cwd(), "./data/prefix-trie.json")

const EOF = "EOF"
const ID = "ID"

const movies = require(MOVIES_DATA_PATH)

const createPrefixTrie = (movies, trie = {}) => {
  // const trie = {}

  movies.forEach((movie) => {
    const prefixes = []

    for (let i = 0; i < movie.title.length; i++) {
      prefixes.push(movie.title.slice(i, movie.title.length).toLowerCase())
    }

    // console.log("prefixes", prefixes)

    prefixes.forEach((prefix) => {
      let currentNode = trie
      prefix.split("").forEach((char) => {
        const lowerChar = char.toLowerCase()

        if (!currentNode[lowerChar]) {
          currentNode[lowerChar] = {}
        }

        currentNode = currentNode[lowerChar]

        if (!currentNode[EOF]) {
          currentNode[EOF] = false
        }
      })
      currentNode[EOF] = true
      currentNode[ID] = movie.id
    })
  })

  return trie
}

const prefixTrie = createPrefixTrie(movies, {})
const prefixTrieStream = createWriteStream(PREFIX_TRIE_DATA_PATH, { flags: "w" })
prefixTrieStream.write(JSON.stringify(prefixTrie, null, 2))
prefixTrieStream.end()

// console.log("prefixTrie", JSON.stringify(prefixTrie, null, 2))
