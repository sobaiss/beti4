'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search,
  MapPin,
  SlidersHorizontal, 
  Grid, 
  List,
  Map,
  ChevronDown,
  X,
  Home,
  Building,
  Building2,
  Mountain,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/property';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '');
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [transactionType, setTransactionType] = useState(searchParams.get('type') || 'all');
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [areaRange, setAreaRange] = useState([0, 300]);
  const [bedrooms, setBedrooms] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProperties, setTotalProperties] = useState(0);

  // Initialize filters from URL params
  useEffect(() => {
    const types = searchParams.get('propertyTypes');
    if (types) {
      setPropertyTypes(types.split(','));
    }
  }, [searchParams]);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        if (searchQuery) params.append('location', searchQuery);
        if (propertyTypes.length > 0) params.append('propertyTypes', propertyTypes.join(','));
        if (transactionType && transactionType !== 'all') params.append('transactionType', transactionType.toUpperCase());
        if (priceRange[0] > 0) params.append('priceMin', priceRange[0].toString());
        if (priceRange[1] < 2000000) params.append('priceMax', priceRange[1].toString());
        if (areaRange[0] > 0) params.append('areaMin', areaRange[0].toString());
        if (areaRange[1] < 300) params.append('areaMax', areaRange[1].toString());
        if (bedrooms !== 'all') params.append('bedrooms', bedrooms);
        
        // Sort parameters
        const sortField = sortBy === 'price-asc' || sortBy === 'price-desc' ? 'price' :
                         sortBy === 'area-desc' ? 'area' : 'createdAt';
        const sortDirection = sortBy === 'price-desc' || sortBy === 'area-desc' ? 'desc' : 'asc';
        params.append('sortField', sortField);
        params.append('sortDirection', sortDirection);
        
        const response = await fetch(`/api/properties?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProperties(data.properties);
          setTotalProperties(data.pagination.total);
        }
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
    setBedrooms('all');
  };

  const activeFiltersCount = [
    searchQuery,
    propertyTypes.length > 0,
    transactionType !== 'all',
    priceRange[0] > 0 || priceRange[1] < 2000000,
    areaRange[0] > 0 || areaRange[1] < 300,
    bedrooms !== 'all'
  ].filter(Boolean).length;

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'appartement': return <Building className="w-4 h-4" />;
      case 'maison': return <Home className="w-4 h-4" />;
      case 'villa': return <Building2 className="w-4 h-4" />;
      case 'terrain': return <Mountain className="w-4 h-4" />;
      case 'bureau_commerce': return <ShoppingBag className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Bar */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Localisation, ville, code postal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="achat">Acheter</SelectItem>
                  <SelectItem value="location">Louer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
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
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.value}
                          checked={propertyTypes.includes(type.value)}
                          onCheckedChange={(checked) => 
                            handlePropertyTypeChange(type.value, checked as boolean)
                          }
                        />
                        <label htmlFor={type.value} className="text-sm flex items-center gap-2">
                          {getPropertyTypeIcon(type.value)}
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Fourchette de Prix</label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={2000000}
                      min={0}
                      step={10000}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
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
                      onValueChange={setAreaRange}
                      max={300}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{areaRange[0]}m²</span>
                    <span>{areaRange[1]}m²</span>
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Chambres</label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <Button variant="ghost" onClick={clearAllFilters} className="text-gray-600">
                  <X className="w-4 h-4 mr-2" />
                  Effacer tous les filtres
                </Button>
                <div className="text-sm text-gray-600">
                  {totalProperties} biens trouvés
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Résultats de Recherche
              </h1>
              <p className="text-gray-600">
                {totalProperties} biens trouvés
                {searchQuery && ` dans "${searchQuery}"`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Plus Pertinent</SelectItem>
                  <SelectItem value="price-asc">Prix: Croissant</SelectItem>
                  <SelectItem value="price-desc">Prix: Décroissant</SelectItem>
                  <SelectItem value="area-desc">Surface: Plus Grande</SelectItem>
                  <SelectItem value="newest">Plus Récent</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="rounded-l-none"
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Localisation: {searchQuery}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSearchQuery('')}
                    />
                  </Badge>
                )}
                {transactionType !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {transactionType === 'achat' ? 'À Vendre' : 'À Louer'}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setTransactionType('all')}
                    />
                  </Badge>
                )}
                {propertyTypes.map(type => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handlePropertyTypeChange(type, false)}
                    />
                  </Badge>
                ))}
                {bedrooms !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {bedrooms}+ chambres
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setBedrooms('all')}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {viewMode === 'map' ? (
          <Card className="h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Map className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">Vue Carte</h3>
              <p>La carte interactive sera affichée ici</p>
            </div>
          </Card>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
          }>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">Aucun bien trouvé</h3>
                <p>Essayez d'ajuster vos critères de recherche pour trouver plus de résultats.</p>
              </div>
              <Button onClick={clearAllFilters}>
                Effacer Tous les Filtres
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {properties.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8">
              Charger Plus de Biens
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}