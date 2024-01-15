"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Movie } from "@/types"
import { getBaseUrl } from "@/app/constants/client"
import { stringify } from "qs"

const fetchMovies = async (query: string = "", page: number = 1): Promise<Movie[]> => {
  const params = {
    page,
    query,
  }
  console.log("baseUrl: ", getBaseUrl())
  const response = await fetch(
    `${getBaseUrl()}/api/v1/search${stringify(params, { addQueryPrefix: true })}`
  )
  const data = (await response.json()) as { results: Movie[] }
  return data.results
}

const hasMore = (page: number, query: string = ""): boolean => {
  if (query !== "") {
    return true
  }
  return page >= 1 && page < 1000
}

type UseMovieList = {
  movies: Movie[]
  isLoading: boolean
  hasMore: boolean
  loadMore: () => void
}

export default function useMovieList(query: string = "", page: number = 1): UseMovieList {
  const [pageNumber, setPageNumber] = useState<number>(page)
  const [movies, setMovies] = useState<Movie[]>([])
  const [restoreMovies, setRestoreMovies] = useState<boolean>(false)

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["movies", query, pageNumber],
    queryFn: ({ queryKey }) => fetchMovies(queryKey[1] as string, queryKey[2] as number),
  })
  const isLoading = isPending || isFetching

  useEffect(() => {
    if (data && data.length > 0 && query === "") {
      setMovies((prev) => prev.concat(data))
    } else if (data && data.length > 0 && query !== "") {
      setMovies(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    // restore previous movies if query is cleared
    if (query === "" && restoreMovies) {
      setMovies([])
      setRestoreMovies(false)
      setPageNumber(1)
    }

    if (query !== "" && !restoreMovies) {
      setRestoreMovies(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const loadMore = () => {
    if (hasMore(pageNumber)) {
      setPageNumber(pageNumber + 1)
    }
  }

  return {
    movies,
    isLoading,
    hasMore: hasMore(pageNumber, query),
    loadMore,
  }
}
