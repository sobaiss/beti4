'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/property';

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [transactionType, setTransactionType] = useState('');
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
        const params = new URLSearchParams();
        
        if (searchQuery) params.append('location', searchQuery);
        if (propertyType && propertyType !== 'all') params.append('propertyTypes', propertyType.toUpperCase());
        if (transactionType && transactionType !== 'all') params.append('transactionType', transactionType.toUpperCase());
        if (priceRange[0] > 0) params.append('priceMin', priceRange[0].toString());
        if (priceRange[1] < 1000000) params.append('priceMax', priceRange[1].toString());
        
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
  }, [searchQuery, propertyType, transactionType, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Localisation</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher une localisation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de Transaction</label>
                  <Select value={transactionType} onValueChange={setTransactionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="achat">Acheter</SelectItem>
                      <SelectItem value="location">Louer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de Bien</label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les biens" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les biens</SelectItem>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="maison">Maison</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="bureau_commerce">Bureau/Commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Fourchette de Prix</label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000000}
                      min={0}
                      step={10000}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>€{priceRange[0].toLocaleString()}</span>
                    <span>€{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header with view controls */}
            <div className="bg-white rounded-lg border p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Biens ({totalProperties})
                  </h1>
                  <p className="text-gray-600">Trouvez votre bien idéal</p>
                </div>

                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Prix: Croissant</SelectItem>
                      <SelectItem value="price-desc">Prix: Décroissant</SelectItem>
                      <SelectItem value="area-desc">Surface: Plus Grande</SelectItem>
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
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
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
                <CardContent>
                  <div className="text-gray-500 mb-4">
                    <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2">Aucun bien trouvé</h3>
                    <p>Essayez d'ajuster vos critères de recherche pour trouver plus de résultats.</p>
                  </div>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setPropertyType('all');
                    setTransactionType('all');
                    setPriceRange([0, 1000000]);
                  }}>
                    Effacer les Filtres
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}