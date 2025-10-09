import { MapPinIcon } from "@heroicons/react/24/outline";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Location } from '@/types/location';

export default function AutocompleteLocation({ locations, selectedLocation, setSelectedLocation: setSearchQuery, label, placeholder, allowsCustomValue, isRequired, errorMessage, isInvalid }: { label?: string, placeholder?: string, locations: Location[], selectedLocation: string, setSelectedLocation: (value: string) => void, allowsCustomValue?: boolean, isRequired?: boolean, errorMessage?: string, isInvalid?: boolean }) {
  return (
    <Autocomplete
        isRequired={isRequired || false}
        label={label}
        placeholder={placeholder}
        allowsCustomValue={allowsCustomValue || true}
        onSelectionChange={(key) => setSearchQuery(key as string)}
        className="flex-1"
        defaultItems={locations}
        defaultSelectedKey={selectedLocation}
        startContent={<MapPinIcon className="w-5 h-5 text-default-400" />}
        variant="bordered"
        radius="full"
        size="lg"
        isClearable
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        aria-label="Rechercher une localisation"
    >
        {(locationItem) => <AutocompleteItem key={locationItem.displayName} endContent={`(${locationItem.divisionName})`}>{locationItem.name}</AutocompleteItem>}
    </Autocomplete>
  );
}