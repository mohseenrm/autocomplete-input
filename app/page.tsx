"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { NextUIProvider } from "@nextui-org/react"
import AutoComplete from "@/app/components/Autocomplete"

const queryClient = new QueryClient()

export default function Home() {
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <h1>TMDB Autocomplete</h1>
          <div className="mt-5">
            <AutoComplete />
          </div>
        </main>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </NextUIProvider>
  )
}
