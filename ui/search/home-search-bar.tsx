'use client';

import { City } from "@/types/location";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Autocomplete, AutocompleteItem, Button, Card, CardBody, Link, Select, SelectItem } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomeSearchBarHome({ locations }: { locations: City[] }) {
    const { replace } = useRouter();

    const [searchLocation, setSearchLocation] = useState('');
    const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
    const [transactionType, setTransactionType] = useState('');

    const locationItems = locations.map((location) => ({ key: location.displayName, label: location.name, divisionName: location.divisionName || '' }));

    const handleSearch = () => {
        const params = new URLSearchParams();
        params.set('page', '1');
        if (searchLocation) {
            params.set('location', searchLocation);
        } else {
            params.delete('location');
        }

        if (propertyTypes.length > 0) {
            params.set('propertyTypes', propertyTypes.join(','));
        } else {
            params.delete('propertyTypes');
        }

        if (transactionType) {
            params.set('transactionType', transactionType);
        } else {
            params.delete('transactionType');
        }

        replace(`/rechercher?${params.toString()}`);
    };

  return (
    <div>
    <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl">
    <CardBody className="p-6 text-foreground">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2">
            <Autocomplete
                label="Localisation"
                allowsCustomValue
                onSelectionChange={(key) => setSearchLocation(key as string)}
                className="max-w-xs"
                defaultItems={locationItems}
                defaultSelectedKey=""
                startContent={<MapPinIcon className="w-5 h-5 text-default-400" />}
                variant="bordered"
                radius="full"
                size="lg"
                isClearable
                aria-label="Rechercher une localisation"
                >
                {(locationItem) => <AutocompleteItem key={locationItem.key} endContent={`(${locationItem.divisionName})`}>{locationItem.label}</AutocompleteItem>}
            </Autocomplete>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="space-y-2">
            <Select
                label="Transaction"
                selectedKeys={[transactionType]}
                onSelectionChange={(keys) => setTransactionType(Array.from(keys)[0] as string)}
                className="w-full sm:w-32"
                size="lg"
                variant="bordered"
                radius="full"
                aria-label="Sélectionner le type de transaction"
            >
                <SelectItem key="">Tous</SelectItem>
                <SelectItem key="achat">Acheter</SelectItem>
                <SelectItem key="location">Louer</SelectItem>
            </Select>
            </div>

            <div className="space-y-2">
            <Select
                label="Type de bien"
                selectedKeys={propertyTypes.length > 0 ? propertyTypes : []}
                onSelectionChange={(keys) => setPropertyTypes(Array.from(keys) as string[])}
                placeholder="Tous types"
                className="w-full sm:w-40"
                size="lg"
                variant="bordered"
                radius="full"
                aria-label="Sélectionner le type de bien"
            >
                <SelectItem key="">Tous</SelectItem>
                <SelectItem key="appartement">Appartement</SelectItem>
                <SelectItem key="maison">Maison</SelectItem>
                <SelectItem key="villa">Villa</SelectItem>
                <SelectItem key="terrain">Terrain</SelectItem>
                <SelectItem key="bureau_commerce">Bureau/Commerce</SelectItem>
            </Select>
            </div>
        </div>

        <Button
            size="lg"
            color="warning"
            className="h-12 px-8 font-semibold"
            radius="full"
            onPress={handleSearch}
        >
            <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
            Rechercher
        </Button>
        </div>
    </CardBody>
    </Card>
    </div>
  );
}