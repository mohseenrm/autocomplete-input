"use client"

import { NextUIProvider } from "@nextui-org/react"
import AutoComplete from "@/app/components/Autocomplete"

export default function Home() {
  return (
    <NextUIProvider>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1>Aloha!</h1>
        <div className="mt-5">
          <AutoComplete />
        </div>
      </main>
    </NextUIProvider>
  )
}
