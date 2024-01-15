"use client"
import { useEffect, useState, useRef } from "react"
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll"
import { useDebounce } from "@uidotdev/usehooks"

import Autocomplete from "@/app/components/Autocomplete/Autocomplete"
import useMovieList from "@/app/hooks/useMovieList"
import type { Movie } from "@/types"

type AutoCompleteContainerProps = {
  onSelectMovie: (movie: Movie) => void
  selectedMovie?: boolean
}

export default function AutoCompleteContainer({
  onSelectMovie,
  selectedMovie,
}: AutoCompleteContainerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [query, setQuery] = useState<string>("")
  const debouncedQuery = useDebounce(query, 750)
  const {
    movies,
    isLoading,
    hasMore,
    loadMore,
    setMovies,
    time,
    serverTime,
    cached,
  } = useMovieList(debouncedQuery)
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

  const textClassName = selectedMovie ? "text-slate-100" : "text-black"

  return (
    <>
      <Autocomplete
        isLoading={isLoading}
        items={movies}
        setIsOpen={setIsOpen}
        scrollRef={query !== "" ? undefined : scrollRef}
        inputValue={query}
        onInputChange={setQuery}
        onSelectionChange={onSelectionChange}
      />

      <div
        style={{
          position: "fixed",
          top: "0px",
          right: "0px",
          margin: "2rem 3rem",
        }}
      >
        {Number(serverTime) !== 0 && movies.length && (
          <div
            className={`text-s ${textClassName} mt-2 ml-1`}
            data-testid="server"
          >
            Server: {movies.length} result(s) in {serverTime}ms
          </div>
        )}
        {Number(time) !== 0 && movies.length && (
          <div
            className={`text-s ${textClassName} mt-2 ml-1`}
            data-testid="network"
          >
            Network: {movies.length} result(s) in {time}ms
          </div>
        )}
        {cached !== undefined && (
          <div
            className={`text-s ${textClassName} mt-2 ml-1`}
            data-testid="cached"
          >
            Redis Cached: {cached ? "true" : "false"}
          </div>
        )}
      </div>
    </>
  )
}
