'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  AdjustmentsHorizontalIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  MapIcon,
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  ShoppingBagIcon,
  CheckIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { 
  Button, 
  Select, 
  SelectItem,
  Card, 
  CardBody,
  Chip,
  Checkbox,
  ButtonGroup,
  Autocomplete,
  AutocompleteItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  DatePicker
} from '@heroui/react';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { Amenity, Property } from '@/types/property';
import { getProperties } from '@/lib/actions/property';
import { getCachedLocations } from '@/lib/utils/location-cache';
import { Location } from '@/types/location';
import { getCachedAmenities } from '@/lib/utils/amenity-cache';
import { ITEMS_PER_PAGE, propertyTypesConfig, sortOptionsConfig, transactionsConfig } from '@/lib/config';

const displayRange = (range: number[], metric: string) => {
  if (range[0] === 0 && range[1] === 0) return 'Tous';
  if (range[0] === 0) return `Jusqu'à ${range[1]} ${metric}`;
  if (range[1] === 0) return `À partir de ${range[0]} ${metric}`;
  return `${range[0]}-${range[1]} ${metric}`;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '');
  const [propertyTypes, setPropertyTypes] = useState<string[]>(searchParams.get('propertyTypes')?.split(',') || []);
  const [transactionType, setTransactionType] = useState(searchParams.get('transactionType') || '');
  const [locations, setLocations] = useState<Location[]>([]);
  const [amenities, setAmenities] = useState<Record<string, Amenity[]>>({});
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [areaRange, setAreaRange] = useState([0, 0]);
  const [landAreaRange, setLandAreaRange] = useState([0, 0]);
  const [bedroomsRange, setBedroomsRange] = useState([0, 0]);
  const [roomsRange, setRoomsRange] = useState([0, 0]);
  const [sortBy, setSortBy] = useState('pertinence');
  const [viewMode, setViewMode] = useState('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1') || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit') || ITEMS_PER_PAGE.toString()) || ITEMS_PER_PAGE);
  const [total, setTotal] = useState(0);

  // Modal state for filters
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  // Temporary filter state for dialog
  const [tempPropertyTypes, setTempPropertyTypes] = useState<string[]>([]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 0]);
  const [tempAreaRange, setTempAreaRange] = useState([0, 0]);
  const [tempLandAreaRange, setTempLandAreaRange] = useState([0, 0]);
  const [tempBedroomsRange, setTempBedroomsRange] = useState([0, 0]);
  const [tempRoomsRange, setTempRoomsRange] = useState([0, 0]);

  // Features state
  const [features, setFeatures] = useState<string[]>([]);
  
  // Temporary features state for dialog
  const [tempFeatures, setTempFeatures] = useState<string[]>([]);
  
  // Available at state
  const [availableAt, setAvailableAt] = useState('');
  const [tempAvailableAt, setTempAvailableAt] = useState('');

  // Proposed by state
  const [proposedBy, setProposedBy] = useState('');
  const [tempProposedBy, setTempProposedBy] = useState('');

  // Initialize filters from URL params
  useEffect(() => {
    const searchPropertyTypes = searchParams.get('propertyTypes');
    if (searchPropertyTypes) {
      setPropertyTypes(searchPropertyTypes.split(','));
    }
    const searchTransactionType = searchParams.get('transactionType');
    if (searchTransactionType) {
      setTransactionType(searchTransactionType);
    }
    const searchLocations = searchParams.get('location');
    if (searchLocations) {
      setSearchQuery(searchLocations);
    }
    const searchBedrooms = searchParams.get('bedrooms');
    if (searchBedrooms) {
      const bedroomsValue = parseInt(searchBedrooms);
      setBedroomsRange([bedroomsValue, 10]);
    }
    const searchRooms = searchParams.get('rooms');
    if (searchRooms) {
      const roomsValue = parseInt(searchRooms);
      setRoomsRange([roomsValue, 10]);
    }
    
    // Initialize temp filters with current values
    setTempPropertyTypes(propertyTypes);
    setTempPriceRange(priceRange);
    setTempAreaRange(areaRange);
    setTempLandAreaRange(landAreaRange);
    setTempBedroomsRange(bedroomsRange);
    setTempRoomsRange(roomsRange);
    setTempFeatures(features);
  }, [searchParams]);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const filters = {
          location: searchQuery !== '' ? searchQuery : undefined,
          propertyTypes: propertyTypes.length > 0 ? propertyTypes.join(',') : undefined,
          transactionType: transactionType !== '' ? transactionType : undefined,
          price: priceRange.filter(Boolean).length > 0 ? priceRange.join(',') : undefined,
          area: areaRange.filter(Boolean).length > 0 ? areaRange.join(',') : undefined,
          landArea: landAreaRange.filter(Boolean).length > 0 ? landAreaRange.join(',') : undefined,
          rooms: roomsRange.filter(Boolean).length > 0 ? roomsRange.join(',') : undefined,
          bedrooms: bedroomsRange.filter(Boolean).length > 0 ? bedroomsRange.join(',') : undefined,
          ownerType: proposedBy !== '' ? proposedBy : undefined,
          amenities: features.length > 0 ? features.join(',') : undefined,
          availableAt: availableAt !== '' ? availableAt : undefined,
        };

        const response = await getProperties(filters, page, limit/* , { field: 'createdAt', direction: 'desc' } */);

        setProperties(response?.properties || []);
        setTotal(response?.pagination.total || 0);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchQuery, page, limit, propertyTypes, transactionType, priceRange, areaRange, landAreaRange, bedroomsRange, roomsRange, features, availableAt, proposedBy, sortBy]);

  useEffect(() => {
    loadLocations();
    loadAmenities();
  }, []);

  const loadLocations = async () => {
    await getCachedLocations().then(locations => {
      setLocations(locations);
    }).catch((error) => {
      console.error('Error loading locations:', error);
      setLocations([]);
    });
  }

  const loadAmenities = async () => {
    getCachedAmenities().then(amenities => {
      const amenitiesByGroup = amenities.reduce((acc: Record<string, Amenity[]>, amenity) => {
        if (!acc[amenity.category]) {
          acc[amenity.category] = [];
        }

        acc[amenity.category].push({ id: amenity.id, name: amenity.name, category: amenity.category });

        return acc;
      }, {});
      // Flatten the grouped amenities into a single array for setAmenities if needed
      setAmenities(amenitiesByGroup);
    }).catch((error) => {
      console.error('Error loading amenities:', error);
      setAmenities({});
    });
  }

  const handleTempPropertyTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setTempPropertyTypes(prev => [...prev, type]);
    } else {
      setTempPropertyTypes(prev => prev.filter(t => t !== type));
    }
  };

  const openFiltersDialog = () => {
    // Reset temp filters to current values when opening dialog
    setTempPropertyTypes(propertyTypes);
    setTempPriceRange(priceRange);
    setTempAreaRange(areaRange);
    setTempLandAreaRange(landAreaRange);
    setTempBedroomsRange(bedroomsRange);
    setTempRoomsRange(roomsRange);
    setTempFeatures(features);
    setTempAvailableAt(availableAt);
    setTempProposedBy(proposedBy);
    onOpen();
  };

  const applyFilters = () => {
    // Apply temp filters to actual filters
    setPropertyTypes(tempPropertyTypes);
    setPriceRange(tempPriceRange);
    setAreaRange(tempAreaRange);
    setLandAreaRange(tempLandAreaRange);
    setBedroomsRange(tempBedroomsRange);
    setRoomsRange(tempRoomsRange);
    setFeatures(tempFeatures);
    setAvailableAt(tempAvailableAt);
    setProposedBy(tempProposedBy);
    onOpenChange();
  };

  const resetFilters = () => {
    setTempPropertyTypes([]);
    setTempPriceRange([0, 0]);
    setTempAreaRange([0, 0]);
    setTempLandAreaRange([0, 0]);
    setTempBedroomsRange([0, 0]);
    setTempRoomsRange([0, 0]);
    setTempFeatures([]);
    setTempAvailableAt('');
    setTempProposedBy('');
  };

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setPropertyTypes(prev => [...prev, type]);
    } else {
      setPropertyTypes(prev => prev.filter(t => t !== type));
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setPropertyTypes([]);
    setTransactionType('');
    resetFilters();
  };

  const activeFiltersCount = [
    searchQuery,
    propertyTypes.length > 0,
    transactionType !== '',
    priceRange[0] > 0 || priceRange[1] > 0,
    areaRange[0] > 0 || areaRange[1] > 0,
    landAreaRange[0] > 0 || landAreaRange[1] > 0,
    bedroomsRange[0] > 0 || bedroomsRange[1] > 0,
    roomsRange[0] > 0 || roomsRange[1] > 0,
    features.length > 0,
    availableAt !== '',
    proposedBy.length > 0
  ].filter(Boolean).length;

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'appartement': return <BuildingOfficeIcon className="w-4 h-4" />;
      case 'maison': return <HomeIcon className="w-4 h-4" />;
      case 'immeuble': return <BuildingOfficeIcon className="w-4 h-4" />;
      case 'villa': return <BuildingOffice2Icon className="w-4 h-4" />;
      case 'terrain': return <MapIcon className="w-4 h-4" />;
      case 'terrain_agricole': return <GlobeAltIcon className="w-4 h-4" />;
      case 'bureau_commerce': return <ShoppingBagIcon className="w-4 h-4" />;
      default: return <HomeIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Header */}
      <div className="bg-content1 border-b border-content4 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center text-foreground">
            {/* Search Bar */}
            <div className="flex-1 flex gap-2">
              <Autocomplete
                label="Localisation"
                allowsCustomValue
                onSelectionChange={(key) => setSearchQuery(key as string)}
                className="flex-1"
                defaultItems={locations}
                defaultSelectedKey={searchQuery}
                startContent={<MapPinIcon className="w-5 h-5 text-default-400" />}
                variant="bordered"
                radius="full"
                size="lg"
                isClearable
                aria-label="Rechercher une localisation"
                >
                {(locationItem) => <AutocompleteItem key={locationItem.displayName} endContent={`(${locationItem.divisionName})`}>{locationItem.name}</AutocompleteItem>}
              </Autocomplete>
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
                <>
                  {transactionsConfig.map((transaction) => (
                    <SelectItem key={transaction.value}>{transaction.label}</SelectItem>
                  ))}
                </>
            </Select>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="bordered"
              onClick={openFiltersDialog}
              startContent={<AdjustmentsHorizontalIcon className="w-4 h-4" />}
              endContent={
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <Chip size="sm" color="primary" variant="solid">
                      {activeFiltersCount}
                    </Chip>
                  )}
                </div>
              }
            >
              Filtres
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="4xl"
            aria-label="Ouvrir les filtres avancés"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh]",
          body: "py-6",
          header: "border-b border-content4",
          footer: "border-t border-content4"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                  <AdjustmentsHorizontalIcon className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-default-900">Filtres Avancés</h3>
                  <p className="text-sm text-default-600">Affinez votre recherche</p>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-8">
                  {/* Property Types */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-default-900 flex items-center gap-2">
                      <HomeIcon className="w-5 h-5 text-primary-600" />
                      Type de Bien
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {propertyTypesConfig.map((propertyType) => (
                        <Card
                          key={propertyType.value}
                          isPressable
                          onPress={() => handleTempPropertyTypeChange(propertyType.value, !tempPropertyTypes.includes(propertyType.value))}
                          className={`transition-all duration-200 cursor-pointer ${
                            tempPropertyTypes.includes(propertyType.value)
                              ? 'bg-primary-50 border-2 border-primary-300 shadow-md'
                              : 'border border-content4 hover:border-primary-200 hover:shadow-sm'
                          }`}
                        >
                          <CardBody className="p-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                              {getPropertyTypeIcon(propertyType.value)}
                              <span className="text-sm font-medium">{propertyType.label}</span>
                              {tempPropertyTypes.includes(propertyType.value) && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Price and Area Ranges */}
                  {/* Price Range */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-default-900 flex items-center gap-2">
                      <span className="text-primary-600">€</span>
                      Fourchette de Prix
                    </h4>
                    <Card className="p-4 bg-content1">
                      <CardBody className="p-0">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-default-700">Prix minimum</label>
                              <Input
                                type="number"
                                min={0}
                                value={tempPriceRange[0] === 0 ? '' : tempPriceRange[0].toString()}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setTempPriceRange([value, tempPriceRange[1]]);
                                }}
                                startContent={<span className="text-default-400">€</span>}
                                variant="bordered"
                                size="lg"
                                aria-label="Prix minimum"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-default-700">Prix maximum</label>
                              <Input
                                type="number"
                                min={0}
                                value={tempPriceRange[1] === 0 ? '' : tempPriceRange[1].toString()}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setTempPriceRange([tempPriceRange[0], value]);
                                }}
                                startContent={<span className="text-default-400">€</span>}
                                variant="bordered"
                                size="lg"
                                aria-label="Prix maximum"
                              />
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Area Range */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-default-900 flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-600"></div>
                      Surface (m²)
                    </h4>
                    <Card className="p-4 bg-content1">
                      <CardBody className="p-0">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-default-700">Surface minimum</label>
                              <Input
                                type="number"
                                min={0}
                                value={tempAreaRange[0] === 0 ? '' : tempAreaRange[0].toString()}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setTempAreaRange([value, tempAreaRange[1]]);
                                }}
                                endContent={<span className="text-default-400">m²</span>}
                                variant="bordered"
                                size="lg"
                                aria-label="Surface minimum"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-default-700">Surface maximum</label>
                              <Input
                                type="number"
                                min={0}
                                value={tempAreaRange[1] === 0 ? '' : tempAreaRange[1].toString()}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setTempAreaRange([tempAreaRange[0], value]);
                                }}
                                endContent={<span className="text-default-400">m²</span>}
                                variant="bordered"
                                size="lg"
                                aria-label="Surface maximum"
                              />
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Land Area Range */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-default-900 flex items-center gap-2">
                      <GlobeAltIcon className="w-5 h-5 text-primary-600" />
                      Surface du Terrain (m²)
                    </h4>
                    <Card className="p-4 bg-content1">
                      <CardBody className="p-0">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-default-700">Surface terrain minimum</label>
                              <Input
                                type="number"
                                min={0}
                                value={tempLandAreaRange[0] === 0 ? '' : tempLandAreaRange[0].toString()}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setTempLandAreaRange([value, tempLandAreaRange[1]]);
                                }}
                                endContent={<span className="text-default-400">m²</span>}
                                variant="bordered"
                                size="lg"
                                aria-label="Surface terrain minimum"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-default-700">Surface terrain maximum</label>
                              <Input
                                type="number"
                                min={0}
                                value={tempLandAreaRange[1] === 0 ? '' : tempLandAreaRange[1].toString()}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setTempLandAreaRange([tempLandAreaRange[0], value]);
                                }}
                                endContent={<span className="text-default-400">m²</span>}
                                variant="bordered"
                                size="lg"
                                aria-label="Surface terrain maximum"
                              />
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Rooms */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-default-900 flex items-center gap-2">
                      <HomeIcon className="w-5 h-5 text-primary-600" />
                      Pièces
                    </h4>
                    <Card className="p-4 bg-content1">
                      <CardBody className="p-0">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-default-700">Pièces minimum</label>
                              <Input
                                type="number"
                                min={0}
                                value={tempRoomsRange[0] === 0 ? '' : tempRoomsRange[0].toString()}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setTempRoomsRange([value, tempRoomsRange[1]]);
                                }}
                                startContent={<HomeIcon className="w-4 h-4 text-default-400" />}
                                variant="bordered"
                                size="lg"
                                aria-label="Nombre minimum de pièces"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-default-700">Pièces maximum</label>
                              <Input
                                type="number"
                                min={0}
                                value={tempRoomsRange[1] === 0 ? '' : tempRoomsRange[1].toString()}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setTempRoomsRange([tempRoomsRange[0], value]);
                                }}
                                startContent={<HomeIcon className="w-4 h-4 text-default-400" />}
                                variant="bordered"
                                size="lg"
                                aria-label="Nombre maximum de pièces"
                              />
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Bedrooms */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-default-900 flex items-center gap-2">
                      <BuildingOfficeIcon className="w-5 h-5 text-primary-600" />
                      Chambres
                    </h4>
                    <Card className="p-4 bg-content1">
                      <CardBody className="p-0">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-default-700">Chambres minimum</label>
                              <Input
                                type="number"
                                min={0}
                                value={tempBedroomsRange[0] === 0 ? '' : tempBedroomsRange[0].toString()}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setTempBedroomsRange([value, tempBedroomsRange[1]]);
                                }}
                                startContent={<BuildingOfficeIcon className="w-4 h-4 text-default-400" />}
                                variant="bordered"
                                size="lg"
                                aria-label="Nombre minimum de chambres"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-default-700">Chambres maximum</label>
                              <Input
                                type="number"
                                min={0}
                                value={tempBedroomsRange[1] === 0 ? '' : tempBedroomsRange[1].toString()}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setTempBedroomsRange([tempBedroomsRange[0], value]);
                                }}
                                startContent={<BuildingOfficeIcon className="w-4 h-4 text-default-400" />}
                                variant="bordered"
                                size="lg"
                                aria-label="Nombre maximum de chambres"
                              />
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-default-900 flex items-center gap-2">
                      <CheckIcon className="w-5 h-5 text-primary-600" />
                      Caractéristiques
                    </h4>
                    <Card className="p-4 bg-content1">
                      <CardBody className="p-0">
                        <div className="space-y-6">
                          {Object.keys(amenities).map((key) => (
                            <div className="space-y-3">
                              <h5 className="text-base font-semibold text-default-800 flex items-center gap-2">
                                <GlobeAltIcon className="w-4 h-4 text-success-600" />
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </h5>
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {amenities[key]
                                  .map((amenity) => (
                                    <div key={amenity.id} className="flex items-center space-x-2 p-2 rounded-lg hover:border-default-300 transition-colors">
                                      <Checkbox
                                        size="sm"
                                        isSelected={tempFeatures.includes(amenity.id)}
                                        onValueChange={(checked) => {
                                          if (checked) {
                                            setTempFeatures(prev => [...prev, amenity.id]);
                                          } else {
                                            setTempFeatures(prev => prev.filter(f => f !== amenity.id));
                                          }
                                        }}
                                      >
                                        <span className="text-sm font-medium">{amenity.name}</span>
                                      </Checkbox>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  {/* Available at */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-default-900 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary-600" />
                      Disponible à partir de
                    </h4>
                    <Card className="p-4 bg-content1">
                      <CardBody className="p-0">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-default-700">Date de disponibilité</label>
                            <DatePicker
                              //value={tempAvailableAt ? new Date(tempAvailableAt) : null}
                              onChange={(date) => setTempAvailableAt(date ? date.toString().split('T')[0] : '')}
                              variant="bordered"
                              size="lg"
                              aria-label="Date de disponibilité"
                              showMonthAndYearPickers
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Proposed by */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-default-900 flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-primary-600" />
                      Proposé par
                    </h4>
                    <Card className="p-4 bg-content1">
                      <CardBody className="p-0">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center space-x-2 p-3 rounded-lg hover:border-default-300 transition-colors">
                              <Checkbox
                                size="sm"
                                isSelected={tempProposedBy === 'particulier'}
                                onValueChange={(checked) => {setTempProposedBy(checked ? 'particulier' : '');}}
                              >
                                <span className="text-sm font-medium">Particulier</span>
                              </Checkbox>
                            </div>
                            <div className="flex items-center space-x-2 p-3 rounded-lg hover:border-default-300 transition-colors">
                              <Checkbox
                                size="sm"
                                isSelected={tempProposedBy === 'professionnel'}
                                onValueChange={(checked) => {setTempProposedBy(checked ? 'professionnel' : '');}}
                              >
                                <span className="text-sm font-medium">Professionnel</span>
                              </Checkbox>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="gap-3">
                <Button 
                  variant="light"
                  onClick={resetFilters}
                  startContent={<XMarkIcon className="w-4 h-4" />}
                >
                  Réinitialiser
                </Button>
                <Button 
                  variant="bordered" 
                  onClick={onClose}
                >
                  Annuler
                </Button>
                <Button 
                  color="primary" 
                  onClick={applyFilters}
                  startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
                  className="font-semibold"
                >
                  Appliquer les Filtres
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <Card className="mb-6">
          <CardBody className="p-4 text-foreground">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-default-900">
                  Résultats de Recherche
                </h1>
                <p className="text-default-600">
                  {total} biens trouvés
                  {searchQuery && ` dans "${searchQuery}"`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select 
                  selectedKeys={[sortBy]}
                  onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
                  className="w-48"
                  aria-label="Trier par"
                >
                  {sortOptionsConfig.map(option => (
                    <SelectItem key={option.value}>{option.label}</SelectItem>
                  ))}
                </Select>

                <ButtonGroup>
                  <Button
                    variant={viewMode === 'grid' ? 'solid' : 'bordered'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    isIconOnly
                    aria-label="Vue en grille"
                  >
                    <Squares2X2Icon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'solid' : 'bordered'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    isIconOnly
                    aria-label="Vue en liste"
                  >
                    <ListBulletIcon className="w-4 h-4" />
                  </Button>
                </ButtonGroup>
                 {availableAt && (
                   <Chip 
                     variant="flat" 
                     onClose={() => setAvailableAt('')}
                     size="sm"
                     aria-label={`Supprimer le filtre disponible à partir de: ${availableAt}`}
                   >
                     Disponible: {new Date(availableAt).toLocaleDateString('fr-FR')}
                   </Chip>
                 )}
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && ( // Changed from border-t to border-t border-content4
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Chip 
                      variant="flat" 
                      onClose={() => setSearchQuery('')}
                      size="sm"
                      aria-label={`Supprimer le filtre localisation: ${searchQuery}`}
                    >
                      Localisation: {searchQuery}
                    </Chip>
                  )}
                  {transactionType !== '' && (
                    <Chip 
                      variant="flat" 
                      onClose={() => setTransactionType('')}
                      size="sm"
                      aria-label={`Supprimer le filtre transaction: ${transactionType === 'achat' ? 'À Vendre' : 'À Louer'}`}
                    >
                      {transactionType === 'achat' ? 'À Vendre' : 'À Louer'}
                    </Chip>
                  )}
                  {propertyTypes.map(type => (
                    <Chip 
                      key={type} 
                      variant="flat" 
                      onClose={() => handlePropertyTypeChange(type, false)}
                      size="sm"
                      aria-label={`Supprimer le filtre type: ${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                    </Chip>
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] > 0) && (
                    <Chip 
                      variant="flat" 
                      onClose={() => setPriceRange([0, 0])}
                      size="sm"
                      aria-label={`Supprimer le filtre prix: ${displayRange(priceRange, '€')}`}
                    >
                      Prix: {displayRange(priceRange, '€')}
                    </Chip>
                  )}
                  {(areaRange[0] > 0 || areaRange[1] > 0) && (
                    <Chip 
                      variant="flat" 
                      onClose={() => setAreaRange([0, 0])}
                      size="sm"
                      aria-label={`Supprimer le filtre surface: ${displayRange(areaRange, 'm²')}`}
                    >
                      Surface: {displayRange(areaRange, 'm²')}
                    </Chip>
                  )}
                  {(landAreaRange[0] > 0 || landAreaRange[1] > 0) && (
                    <Chip 
                      variant="flat" 
                      onClose={() => setLandAreaRange([0, 0])}
                      size="sm"
                      aria-label={`Supprimer le filtre surface du terrain: ${displayRange(landAreaRange, 'm²')}`}
                    >
                      Terrain: {displayRange(landAreaRange, 'm²')}
                    </Chip>
                  )}
                  {(roomsRange[0] > 0 || roomsRange[1] > 0) && (
                    <Chip 
                      variant="flat" 
                      onClose={() => setRoomsRange([0, 0])}
                      size="sm"
                      aria-label={`Supprimer le filtre pièces: ${displayRange(roomsRange, 'pièces')}`}
                    >
                      {displayRange(roomsRange, 'pièces')}
                    </Chip>
                  )}
                  {(bedroomsRange[0] > 0 || bedroomsRange[1] > 0) && (
                    <Chip 
                      variant="flat" 
                      onClose={() => setBedroomsRange([0, 0])}
                      size="sm"
                      aria-label={`Supprimer le filtre chambres: ${displayRange(bedroomsRange, 'chambres')}`}
                    >
                      {displayRange(bedroomsRange, 'chambres')}
                    </Chip>
                  )}
                  {proposedBy && (
                    <Chip 
                      variant="flat" 
                      onClose={() => setProposedBy('')}
                      size="sm"
                      aria-label={`Supprimer le filtre proposé par: ${proposedBy === 'particulier' ? 'Particulier' : 'Professionnel'}`}
                    >
                      Proposé par: {proposedBy === 'particulier' ? 'Particulier' : 'Professionnel'}
                    </Chip>
                  )}
                  {availableAt && (
                    <Chip 
                      variant="flat" 
                      onClose={() => setAvailableAt('')}
                      size="sm"
                      aria-label={`Supprimer le filtre disponible à partir de: ${availableAt}`}
                    >
                      Disponible: {new Date(availableAt).toLocaleDateString('fr-FR')}
                    </Chip>
                  )}
                  {features.map(feature => (
                    <Chip
                      key={`feature-${feature}`}
                      variant="flat" 
                      onClose={() => setFeatures(prev => prev.filter(f => f !== feature))}
                      size="sm"
                      aria-label={`Supprimer le filtre caractéristique: ${feature}`}
                    >
                      Caractéristique: {feature}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Results */}
        {viewMode === 'map' ? (
          <Card className="h-96">
            <CardBody className="flex items-center justify-center">
              <div className="text-center text-default-500">
                <MapIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">Vue Carte</h3>
                <p>La carte interactive sera affichée ici</p>
              </div>
            </CardBody>
          </Card>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <CardBody className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
          }>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 text-foreground">
            <CardBody>
              <div className="text-gray-500 mb-4">
                <MagnifyingGlassIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">Aucun bien trouvé</h3>
                <p>Essayez d'ajuster vos critères de recherche pour trouver plus de résultats.</p>
              </div>
              <Button onClick={clearAllFilters}>
                Effacer Tous les Filtres
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Load More */}
        {properties.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="bordered" size="lg" className="px-8">
              Charger Plus de Biens
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}