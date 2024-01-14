export type Movie = {
  id: number
  title: string
  poster_path: string
  release_date: string
}

export const EOF = "EOF" as const
export const ID = "ID" as const

export type PrefixTrie = {
  readonly [key: string]: PrefixTrie
} & {
  readonly [EOF]: boolean
  readonly [ID]?: number
}
