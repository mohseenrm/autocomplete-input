import { useQuery } from "@tanstack/react-query"
import Autocomplete from "@/app/components/Autocomplete/Autocomplete"
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

export default function AutoCompleteContainer() {
  const { data: movies } = useQuery({
    queryKey: ["movies", { page: 1 }],
    queryFn: ({ queryKey }) => fetchMovies((queryKey[1] as { page: number }).page),
  })
  console.log(movies)
  return <Autocomplete />
}
