import { MapPinIcon } from "@heroicons/react/24/outline";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Location } from '@/types/location';

export default function AutocompleteLocation({ locations, selectedLocation, setSelectedLocation: setSearchQuery, label, placeholder }: { label?: string, placeholder?: string, locations: Location[], selectedLocation: string, setSelectedLocation: (value: string) => void }) {
  return (
    <Autocomplete
        label={label || "Localisation"}
        placeholder={placeholder || ""}
        allowsCustomValue
        onSelectionChange={(key) => setSearchQuery(key as string)}
        className="flex-1"
        defaultItems={locations}
        defaultSelectedKey={selectedLocation}
        startContent={<MapPinIcon className="w-5 h-5 text-default-400" />}
        variant="bordered"
        radius="full"
        size="lg"
        isClearable
        aria-label="Rechercher une localisation"
    >
        {(locationItem) => <AutocompleteItem key={locationItem.displayName} endContent={`(${locationItem.divisionName})`}>{locationItem.name}</AutocompleteItem>}
    </Autocomplete>
  );
}