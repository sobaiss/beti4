'use client';

import { City } from "@/types/location";
import { AdjustmentsHorizontalIcon, BuildingOffice2Icon, BuildingOfficeIcon, ChevronDownIcon, GlobeAltIcon, HomeIcon, MagnifyingGlassIcon, MapPinIcon, ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Autocomplete, AutocompleteItem, Button, Card, CardBody, Checkbox, Chip, Link, Select, SelectItem, Slider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FullSearchBarHome({ locations, totalProperties }: { locations: City[]; totalProperties: number }) {
    const { replace } = useRouter();

    const [searchLocation, setSearchLocation] = useState('');
    const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
    const [transactionType, setTransactionType] = useState('achat');

    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [areaRange, setAreaRange] = useState([0, 300]);
    const [bedrooms, setBedrooms] = useState('all');
    const [sortBy, setSortBy] = useState('relevance');

    const activeFiltersCount = [
        searchLocation,
        propertyTypes.length > 0,
        transactionType !== 'all',
        priceRange[0] > 0 || priceRange[1] < 2000000,
        areaRange[0] > 0 || areaRange[1] < 300,
        bedrooms !== 'all'
    ].filter(Boolean).length;

    const getPropertyTypeIcon = (type: string) => {
        switch (type) {
            case 'appartement': return <BuildingOfficeIcon className="w-4 h-4" />;
            case 'maison': return <HomeIcon className="w-4 h-4" />;
            case 'villa': return <BuildingOffice2Icon className="w-4 h-4" />;
            case 'terrain': return <GlobeAltIcon className="w-4 h-4" />;
            case 'bureau_commerce': return <ShoppingBagIcon className="w-4 h-4" />;
            default: return <HomeIcon className="w-4 h-4" />;
        }
    };

    const clearAllFilters = () => {
        setSearchLocation('');
        setPropertyTypes([]);
        setTransactionType('all');
        setPriceRange([0, 2000000]);
        setAreaRange([0, 300]);
        setBedrooms('all');
    };
    
    const handlePropertyTypeChange = (type: string, checked: boolean) => {
        if (checked) {
            setPropertyTypes(prev => [...prev, type]);
        } else {
            setPropertyTypes(prev => prev.filter(t => t !== type));
        }
    };

    // Generate location items for the autocomplete
    const locationItems = locations.map((location) => ({ key: location.sk, label: location.name }));

    const handleSearch = () => {
        const params = new URLSearchParams();
        params.set('page', '1');
        if (searchLocation) {
            params.set('location', searchLocation);
        } else {
            params.delete('location');
        }

        if (propertyTypes) {
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
    <div className="bg-content1 border-b border-content4 sticky top-16 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center text-foreground">
        {/* Search Bar */}
        <div className="flex-1 flex gap-2">
            <Autocomplete
                allowsCustomValue
                onChange={(e) => setSearchLocation(e.target.value)}
                className="max-w-xs"
                defaultItems={locationItems}
                defaultSelectedKey=""
                placeholder="Ville, quartier..."
                startContent={<MapPinIcon className="w-5 h-5 text-default-400" />}
                variant="bordered"
                radius="full"
                size="lg"
                isClearable
                >
                {(locationItem) => <AutocompleteItem key={locationItem.key}>{locationItem.label}</AutocompleteItem>}
            </Autocomplete>
            <Select 
                selectedKeys={[transactionType]}
                onSelectionChange={(keys) => setTransactionType(Array.from(keys)[0] as string)}
                className="w-full sm:w-32"
                size="lg"
                variant="bordered"
                radius="full"
            >
                <SelectItem key="achat">Acheter</SelectItem>
                <SelectItem key="location">Louer</SelectItem>
            </Select>
        </div>

        {/* Filter Toggle */}
        <Button
            variant="bordered"
            onPress={() => setShowFilters(!showFilters)}
            startContent={<AdjustmentsHorizontalIcon className="w-4 h-4" />}
            endContent={
            <>
                {activeFiltersCount > 0 && (
                <Chip size="sm" color="primary" variant="solid">
                    {activeFiltersCount}
                </Chip>
                )}
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </>
            }
        >
            Filtres
        </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && ( // Changed from bg-gray-50 to bg-content2
        <div className="mt-4 p-4 bg-content2 rounded-lg border border-content4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Property Types */}
            <div className="space-y-3"> 
                <label className="text-sm font-medium text-gray-700">Type de Bien</label>
                <div className="space-y-2">
                {[
                    { value: 'appartement', label: 'Appartement' },
                    { value: 'maison', label: 'Maison' },
                    { value: 'villa', label: 'Villa' },
                    { value: 'terrain', label: 'Terrain' },
                    { value: 'bureau_commerce', label: 'Bureau/Commerce' }
                ].map((type) => (
                    <Checkbox
                    key={type.value}
                    isSelected={propertyTypes.includes(type.value)}
                    onValueChange={(checked) => 
                        handlePropertyTypeChange(type.value, checked)
                    }
                    >
                    <div className="flex items-center gap-2">
                        {getPropertyTypeIcon(type.value)}
                        {type.label}
                    </div>
                    </Checkbox>
                ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3"> 
                <label className="text-sm font-medium text-gray-700">Fourchette de Prix</label>
                <div className="px-2">
                <Slider
                    value={priceRange}
                    onChange={setPriceRange}
                    maxValue={2000000}
                    minValue={0}
                    step={10000}
                    className="w-full"
                    formatOptions={{style: "currency", currency: "EUR"}}
                />
                </div>
                <div className="flex justify-between text-xs text-default-600">
                <span>€{priceRange[0].toLocaleString()}</span>
                <span>€{priceRange[1].toLocaleString()}</span>
                </div>
            </div>

            {/* Area Range */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Surface (m²)</label>
                <div className="px-2">
                <Slider
                    value={areaRange}
                    onChange={setAreaRange}
                    maxValue={300}
                    minValue={0}
                    step={5}
                    className="w-full"
                />
                </div>
                <div className="flex justify-between text-xs text-default-600">
                <span>{areaRange[0]}m²</span>
                <span>{areaRange[1]}m²</span>
                </div>
            </div>
            {/* Bedrooms */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Chambres</label>
                <Select 
                selectedKeys={[bedrooms]}
                onSelectionChange={(keys) => setBedrooms(Array.from(keys)[0] as string)}
                >
                <SelectItem key="all">Toutes</SelectItem>
                <SelectItem key="1">1+</SelectItem>
                <SelectItem key="2">2+</SelectItem>
                <SelectItem key="3">3+</SelectItem>
                <SelectItem key="4">4+</SelectItem>
                </Select>
            </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-content4">
            <Button
                variant="light"
                onPress={clearAllFilters}
                startContent={<XMarkIcon className="w-4 h-4" />}
            >
                Effacer tous les filtres
            </Button>
            <div className="text-sm text-default-600">
                {totalProperties} biens trouvés
            </div>
            </div>
        </div>
        )}
    </div>
    </div>
  );
}