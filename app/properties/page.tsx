'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  MapPinIcon, 
  Squares2X2Icon, 
  ListBulletIcon 
} from '@heroicons/react/24/outline';
import { 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Slider, 
  Card, 
  CardBody, 
  CardHeader, 
  ButtonGroup 
} from '@heroui/react';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/property';
import { PropertyService } from '@/lib/services/property';
import { useSearchParams } from 'next/navigation';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '');
  const [propertyTypes, setPropertyTypes] = useState<string[]>(searchParams.get('propertyTypes')?.split(',') || []);
  const [transactionType, setTransactionType] = useState(searchParams.get('transactionType') || 'all');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState('price-asc');
  const [viewMode, setViewMode] = useState('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProperties, setTotalProperties] = useState(0);

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

        const response = await PropertyService.getProperties(filters);

        setProperties(response?.properties || []);
        setTotalProperties(response?.pagination.total || 0);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchQuery, propertyTypes, transactionType, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6 text-foreground">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
                  <h3 className="text-lg font-semibold">Search Filters</h3>
                </div>
              </CardHeader>
              <CardBody className="pt-0 space-y-6">
                <div className="space-y-2"> 
                  <label className="block text-sm font-medium text-default-700">Localisation</label>
                  <Input
                    placeholder="Rechercher une localisation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<MapPinIcon className="w-4 h-4 text-default-400" />}
                  />
                </div>

                <div className="space-y-2"> 
                  <label className="block text-sm font-medium text-default-700">Type de Transaction</label>
                  <Select 
                    selectedKeys={transactionType ? [transactionType] : []}
                    onSelectionChange={(keys) => setTransactionType(Array.from(keys)[0] as string || '')}
                    placeholder="Tous types"
                  >
                    <SelectItem key="all">Tous types</SelectItem>
                    <SelectItem key="achat">Acheter</SelectItem>
                    <SelectItem key="location">Louer</SelectItem>
                  </Select>
                </div>

                <div className="space-y-2"> 
                  <label className="block text-sm font-medium text-default-700">Type de Bien</label>
                  <Select 
                    selectedKeys={propertyTypes ? [propertyTypes] : []}
                    onSelectionChange={(keys) => setPropertyTypes(Array.from(keys) as string[] || [])}
                    placeholder="Tous les biens"
                  >
                    <SelectItem key="all">Tous les biens</SelectItem>
                    <SelectItem key="appartement">Appartement</SelectItem>
                    <SelectItem key="maison">Maison</SelectItem>
                    <SelectItem key="villa">Villa</SelectItem>
                    <SelectItem key="terrain">Terrain</SelectItem>
                    <SelectItem key="bureau_commerce">Bureau/Commerce</SelectItem>
                  </Select>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-default-700">Fourchette de Prix</label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onChange={setPriceRange}
                      maxValue={1000000}
                      minValue={0}
                      step={10000}
                      className="w-full"
                      formatOptions={{style: "currency", currency: "EUR"}}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-default-600">
                    <span>€{priceRange[0].toLocaleString()}</span>
                    <span>€{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header with view controls */} 
            <div className="bg-content1 rounded-lg border border-content4 p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-default-900">
                    Biens ({totalProperties})
                  </h1>
                  <p className="text-default-600">Trouvez votre bien idéal</p>
                </div>

                <div className="flex items-center gap-4">
                  <Select 
                    selectedKeys={[sortBy]}
                    onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
                    className="w-48"
                  >
                    <SelectItem key="price-asc">Prix: Croissant</SelectItem>
                    <SelectItem key="price-desc">Prix: Décroissant</SelectItem>
                    <SelectItem key="area-desc">Surface: Plus Grande</SelectItem>
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
                  </ButtonGroup>
                </div>
              </div>
            </div>

            {/* Properties Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-6'
              }>
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardBody>
                  <div className="text-gray-500 mb-4">
                    <MagnifyingGlassIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2">Aucun bien trouvé</h3>
                    <p>Essayez d'ajuster vos critères de recherche pour trouver plus de résultats.</p>
                  </div>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setPropertyTypes(['all']);
                    setTransactionType('all');
                    setPriceRange([0, 1000000]);
                  }}>
                    Effacer les Filtres
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div> 
    </div>
  );
}