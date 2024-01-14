"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Movie } from "@/types"
import { baseUrl } from "@/app/constants"
import { stringify } from "qs"

const fetchMovies = async (page: number = 1): Promise<Movie[]> => {
  const params = {
    page,
    query: "",
  }
  const response = await fetch(
    `${baseUrl}/api/v1/search${stringify(params, { addQueryPrefix: true })}`
  )
  const data = (await response.json()) as { results: Movie[] }
  return data.results
}

const hasMore = (page: number): boolean => page >= 1 && page < 1000

type UseMovieList = {
  movies: Movie[]
  isLoading: boolean
  hasMore: boolean
  loadMore: () => void
}

export default function useMovieList(page: number = 1) {
  const [pageNumber, setPageNumber] = useState<number>(page)
  const [movies, setMovies] = useState<Movie[]>([])
  const { data, isPending, isFetching } = useQuery({
    queryKey: ["movies", { page: pageNumber }],
    queryFn: ({ queryKey }) => fetchMovies((queryKey[1] as { page: number }).page),
  })
  const isLoading = isPending || isFetching

  useEffect(() => {
    if (data && data.length > 0) {
      setMovies((prev) => [...prev, ...data])
    }
  }, [data])

  const loadMore = () => {
    console.log("loadMore: ", pageNumber)
    if (hasMore(pageNumber)) {
      setPageNumber(pageNumber + 1)
    }
  }

  return {
    movies,
    isLoading,
    hasMore: hasMore(pageNumber),
    loadMore,
  }
}
