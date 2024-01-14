import Autocomplete from "@/app/components/Autocomplete/Autocomplete"
import useMovieList from "@/app/hooks/useMovieList"

export default function AutoCompleteContainer() {
  const { movies, isLoading } = useMovieList()
  console.log("render AutoCompleteContainer: ", movies, isLoading)
  return <Autocomplete isLoading={isLoading} items={movies} />
}
