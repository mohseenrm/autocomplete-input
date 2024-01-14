"use client"
import { useState } from "react"
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll"

import Autocomplete from "@/app/components/Autocomplete/Autocomplete"
import useMovieList from "@/app/hooks/useMovieList"

export default function AutoCompleteContainer() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [query, setQuery] = useState<string>("")
  const { movies, isLoading, hasMore, loadMore } = useMovieList()

  const [_, scrollRef] = useInfiniteScroll({
    hasMore,
    isEnabled: isOpen,
    shouldUseLoader: false,
    onLoadMore: loadMore,
  })

  return (
    <Autocomplete
      isLoading={isLoading}
      items={movies}
      setIsOpen={setIsOpen}
      scrollRef={query !== "" ? undefined : scrollRef}
      inputValue={query}
      onInputChange={setQuery}
    />
  )
}
