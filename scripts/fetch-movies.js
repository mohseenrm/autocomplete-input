#!/usr/bin/env node

require("dotenv").config()
const { stringify } = require("qs")

const args = process.argv.slice(2)

if (args.length !== 2) {
  console.error("Usage: fetch-movies.js <start page> <end page>")
  process.exit(1)
}

const startPage = parseInt(args[0])
const endPage = parseInt(args[1])

if (isNaN(startPage) || isNaN(endPage)) {
  console.error("Pages must be integers")
  process.exit(1)
}

if (startPage < 1 || endPage < 1) {
  console.error("Pages must be positive integers")
  process.exit(1)
}

if (startPage > endPage) {
  console.error("Start page must be less than or equal to end page")
  process.exit(1)
}

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN

if (!TMDB_ACCESS_TOKEN) {
  console.error("TMDB_ACCESS_TOKEN environment variable is not set")
  process.exit(1)
}

const fetchMovies = async (page) => {
  try {
    const url = "https://api.themoviedb.org/3/discover/movie"
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    }
    const params = {
      include_adult: true,
      include_video: false,
      language: "en-US",
      page,
      "primary_release_date.gte": "2000-01-01T00:00:00.000Z",
      sort_by: "popularity.desc",
    }
    const response = await fetch(
      `${url}${stringify(params, { addQueryPrefix: true })}`,
      options
    )
    const data = await response.json()
    const dataOfInterest = data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    }))
    return dataOfInterest
  } catch (error) {
    console.error(error)
  }
}

const main = async () => {
  const movies = []
  for (let page = startPage; page <= endPage; page++) {
    const results = await fetchMovies(page)
    // 1. append (stream) results to movies file
    // 2. if results is empty, break
    movies.push(...results)
  }
  console.log(JSON.stringify(movies))
}

main()
