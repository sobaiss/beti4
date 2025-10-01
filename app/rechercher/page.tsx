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
  ChevronDownIcon,
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Slider, 
  Card, 
  CardBody, 
  Chip, 
  Checkbox,
  ButtonGroup
} from '@heroui/react';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/property';
import { getProperties } from '@/lib/actions/property';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '');
  const [propertyTypes, setPropertyTypes] = useState<string[]>(searchParams.get('propertyTypes')?.split(',') || []);
  const [transactionType, setTransactionType] = useState(searchParams.get('transactionType') || 'all');
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [areaRange, setAreaRange] = useState([0, 300]);
  const [bedrooms, setBedrooms] = useState<string>(searchParams.get('bedrooms') || '');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProperties, setTotalProperties] = useState(0);

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
  }, [searchParams]);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const filters = {
          location: searchQuery !== '' ? searchQuery : undefined,
          propertyTypes: propertyTypes.length > 0 ? propertyTypes.join(',') : undefined,
          transactionType: transactionType !== 'all' ? transactionType : undefined,
          // priceRange: (priceMin && priceMax) ? [parseInt(priceMin), parseInt(priceMax)] as [number, number] : undefined,
          // areaRange: (areaMin && areaMax) ? [parseInt(areaMin), parseInt(areaMax)] as [number, number] : undefined,
          // bedrooms: bedrooms
        }

        const response = await getProperties(filters);

        setProperties(response?.properties || []);
        setTotalProperties(response?.pagination.total || 0);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchQuery, propertyTypes, transactionType, priceRange, areaRange, bedrooms, sortBy]);

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
    setTransactionType('all');
    setPriceRange([0, 2000000]);
    setAreaRange([0, 300]);
    setBedrooms('');
  };

  const activeFiltersCount = [
    searchQuery,
    propertyTypes.length > 0,
    transactionType !== 'all',
    priceRange[0] > 0 || priceRange[1] < 2000000,
    areaRange[0] > 0 || areaRange[1] < 300,
    bedrooms !== undefined
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
              <Input
                placeholder="Localisation, ville, code postal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<MapPinIcon className="w-4 h-4 text-default-400" />}
                className="flex-1"
              />
              <Select
                selectedKeys={[transactionType]}
                onSelectionChange={(keys) => setTransactionType(Array.from(keys)[0] as string)}
                className="w-32"
              >
                <SelectItem key="all">Tous</SelectItem>
                <SelectItem key="achat">Acheter</SelectItem>
                <SelectItem key="location">Louer</SelectItem>
              </Select>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="bordered"
              onClick={() => setShowFilters(!showFilters)}
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
                    <SelectItem key="">Toutes</SelectItem>
                    <SelectItem key="1">1+</SelectItem>
                    <SelectItem key="2">2+</SelectItem>
                    <SelectItem key="3">3+</SelectItem>
                    <SelectItem key="4">4+</SelectItem>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-content4">
                <Button variant="light" onClick={clearAllFilters} startContent={<XMarkIcon className="w-4 h-4" />}>
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
                  {totalProperties} biens trouvés
                  {searchQuery && ` dans "${searchQuery}"`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select 
                  selectedKeys={[sortBy]}
                  onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
                  className="w-48"
                >
                  <SelectItem key="relevance">Plus Pertinent</SelectItem>
                  <SelectItem key="price-asc">Prix: Croissant</SelectItem>
                  <SelectItem key="price-desc">Prix: Décroissant</SelectItem>
                  <SelectItem key="area-desc">Surface: Plus Grande</SelectItem>
                  <SelectItem key="newest">Plus Récent</SelectItem>
                </Select>

                <ButtonGroup>
                  <Button
                    variant={viewMode === 'grid' ? 'solid' : 'bordered'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    isIconOnly
                  >
                    <Squares2X2Icon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'solid' : 'bordered'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    isIconOnly
                  >
                    <ListBulletIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'solid' : 'bordered'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    isIconOnly
                  >
                    <MapIcon className="w-4 h-4" />
                  </Button>
                </ButtonGroup>
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
                    >
                      Localisation: {searchQuery}
                    </Chip>
                  )}
                  {transactionType !== 'all' && (
                    <Chip 
                      variant="flat" 
                      onClose={() => setTransactionType('all')}
                      size="sm"
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
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                    </Chip>
                  ))}
                  {bedrooms !== '' && (
                    <Chip 
                      variant="flat" 
                      onClose={() => setBedrooms('')}
                      size="sm"
                    >
                      {bedrooms}+ chambres
                    </Chip>
                  )}
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