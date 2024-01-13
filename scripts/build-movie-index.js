const path = require("path")
const { createWriteStream } = require("fs")

const MOVIES_DATA_PATH = path.resolve(process.cwd(), "./data/movies.json")
const MOVIES_INDEX_PATH = path.resolve(process.cwd(), "./data/movies-index.json")

const createIndex = (movies) => {
  const index = {}

  movies.forEach((movie) => {
    const { id } = movie
    index[id] = movie
  })

  return index
}

const movies = require(MOVIES_DATA_PATH)

const index = createIndex(movies)

const indexStream = createWriteStream(MOVIES_INDEX_PATH, { flags: "w" })
indexStream.write(JSON.stringify(index, null, 2))
indexStream.end()
