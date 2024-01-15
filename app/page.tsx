"use client"
import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { NextUIProvider } from "@nextui-org/react"
import AutoComplete from "@/app/components/Autocomplete"
import { getPosterUrl } from "@/app/constants/client"
import type { Movie } from "@/types"

const queryClient = new QueryClient()

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>(
    undefined
  )
  const backdrop = selectedMovie
    ? getPosterUrl(selectedMovie.poster_path)
    : undefined
  const backdropStyle = backdrop
    ? { backgroundImage: `url(${backdrop})`, backgroundSize: "cover" }
    : {}
  const h1ClassName = selectedMovie ? "text-slate-100" : "text-black"

  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <main
          className="flex min-h-screen flex-col items-center justify-center p-24"
          style={backdropStyle}
        >
          <h1 className={h1ClassName}>TMDB Autocomplete</h1>
          <div className="mt-5">
            <AutoComplete onSelectMovie={(movie) => setSelectedMovie(movie)} />
          </div>
        </main>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </NextUIProvider>
  )
}
