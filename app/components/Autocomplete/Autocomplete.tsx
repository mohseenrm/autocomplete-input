import { Autocomplete, AutocompleteItem, Avatar } from "@nextui-org/react"

type AutoCompleteProps<T> = {
  isLoading?: boolean
  setIsOpen?: (isOpen: boolean) => void
  items: T[]
  scrollRef?: React.RefObject<HTMLElement>
  inputValue?: string
  onInputChange?: (value: string) => void
  onSelectionChange?: (key: string | number) => void
}

export default function AutoComplete<T extends { id: number; title: string }>(
  props: AutoCompleteProps<T>
) {
  return (
    <Autocomplete
      className={"min-w-96"}
      size={"lg"}
      radius={"full"}
      label="Select a movie"
      fullWidth={true}
      scrollShadowProps={{ isEnabled: true }}
      description="Search from 10,000 movies after year 2000"
      defaultItems={props.items}
      isLoading={props.isLoading}
      onOpenChange={props.setIsOpen}
      scrollRef={props.scrollRef}
      inputValue={props.inputValue}
      onInputChange={props.onInputChange}
      onSelectionChange={props.onSelectionChange}
    >
      {(item: T) => (
        <AutocompleteItem key={item.id}>{item.title}</AutocompleteItem>
      )}
    </Autocomplete>
  )
}
