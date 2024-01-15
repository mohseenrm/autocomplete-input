"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Movie } from "@/types"
import { getBaseUrl, STALE_TIME } from "@/app/constants/client"
import { stringify } from "qs"

const fetchMovies = async (
  query: string = "",
  page: number = 1
): Promise<{
  results: Movie[]
  time: number
  serverTime: number
  cached?: boolean
}> => {
  const start = Date.now()
  const params = {
    page,
    query,
  }
  const response = await fetch(
    `${getBaseUrl()}/api/v1/search${stringify(params, {
      addQueryPrefix: true,
    })}`
  )
  const data = (await response.json()) as {
    results: Movie[]
    serverTime: number
    cached?: boolean
  }
  const diff = Date.now() - start
  return { results: data.results, time: diff, serverTime: data.serverTime, cached: data.cached }
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
  setMovies: (movies: Movie[]) => void
  time?: number
  serverTime?: number
  cached?: boolean
}

export default function useMovieList(query: string = ""): UseMovieList {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [movies, setMovies] = useState<Movie[]>([])

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["movies", query, pageNumber],
    queryFn: ({ queryKey }) =>
      fetchMovies(queryKey[1] as string, queryKey[2] as number),
    staleTime: STALE_TIME,
  })
  const isLoading = isPending || isFetching

  useEffect(() => {
    if (data?.results && data.results.length > 0 && query === "") {
      setMovies((prev) => prev.concat(data.results))
    } else if (data?.results && data.results.length > 0 && query !== "") {
      setMovies(data.results)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const loadMore = () => {
    if (hasMore(pageNumber, query)) {
      setPageNumber(pageNumber + 1)
    }
  }

  return {
    movies,
    isLoading,
    hasMore: hasMore(pageNumber, query),
    loadMore,
    setMovies,
    time: data?.time,
    serverTime: data?.serverTime,
    cached: data?.cached,
  }
}
