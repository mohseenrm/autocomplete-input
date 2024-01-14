import { Autocomplete, AutocompleteItem, Avatar } from "@nextui-org/react"

type AutoCompleteProps<T> = {
  isLoading?: boolean
  items: T[]
}

export default function AutoComplete<T extends { id: number; title: string }>(props: AutoCompleteProps<T>) {
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
    >
      {(item: T) => (
        <AutocompleteItem
          key={item.id}
          // startContent={
          //   <Avatar
          //     alt={item}
          //     className="w-6 h-6"
          //     src={`https://flagcdn.com/${item.toLowerCase()}.svg`}
          //   />
          // }
        >
          {item.title}
        </AutocompleteItem>
      )}
    </Autocomplete>
  )
}
