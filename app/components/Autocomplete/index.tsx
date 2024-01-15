"use client"
import { useEffect, useState, useRef } from "react"
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll"
import { useDebounce } from "@uidotdev/usehooks"

import Autocomplete from "@/app/components/Autocomplete/Autocomplete"
import useMovieList from "@/app/hooks/useMovieList"
import type { Movie } from "@/types"

type AutoCompleteContainerProps = {
  onSelectMovie: (movie: Movie) => void
}

export default function AutoCompleteContainer({ onSelectMovie }: AutoCompleteContainerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [query, setQuery] = useState<string>("")
  const debouncedQuery = useDebounce(query, 750)
  const { movies, isLoading, hasMore, loadMore, setMovies } = useMovieList(debouncedQuery)
  const prevMovies = useRef<Movie[]>(movies)

  useEffect(() => {
    if (debouncedQuery === "" && movies.length > 0) {
      prevMovies.current = movies
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies])

  useEffect(() => {
    if (debouncedQuery === "" && prevMovies.current.length > 0) {
      setMovies(prevMovies.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  const [_, scrollRef] = useInfiniteScroll({
    hasMore,
    isEnabled: isOpen,
    shouldUseLoader: false,
    onLoadMore: loadMore,
  })

  const onSelectionChange = (key: string | number) => {
    const movie = movies.find((m) => m.id === Number(key))
    if (movie) {
      onSelectMovie(movie)
    }
  }

  return (
    <Autocomplete
      isLoading={isLoading}
      items={movies}
      setIsOpen={setIsOpen}
      scrollRef={query !== "" ? undefined : scrollRef}
      inputValue={query}
      onInputChange={setQuery}
      onSelectionChange={onSelectionChange}
    />
  )
}
