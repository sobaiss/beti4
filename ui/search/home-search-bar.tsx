'use client';

import { Location } from "@/types/location";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Autocomplete, AutocompleteItem, Button, Card, CardBody, Link, Select, SelectItem } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AutocompleteLocation from "../components/AutocompleteLocation";
import SelectTransaction from "../components/SelectTransaction";
import SelectPropertyType from "../components/SelectPropertyType";

export default function HomeSearchBarHome({ locations }: { locations: Location[] }) {
    const { replace } = useRouter();

    const [searchLocation, setSearchLocation] = useState('');
    const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
    const [transactionType, setTransactionType] = useState('');

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
            <AutocompleteLocation
                locations={locations}
                selectedLocation={searchLocation}
                setSelectedLocation={setSearchLocation}
            />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="space-y-2">
            <SelectTransaction
                label="Transaction"
                placeholder=""
                transactionType={transactionType}
                setTransactionType={setTransactionType}
            />
            </div>

            <div className="space-y-2">
            <SelectPropertyType
                label="Type de bien" 
                placeholder=""
                propertyTypes={propertyTypes}
                setPropertyTypes={setPropertyTypes}
            />
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