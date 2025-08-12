'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  TrendingUpIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/property';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [transactionType, setTransactionType] = useState('achat');
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await fetch('/api/properties/featured');
        if (response.ok) {
          const properties = await response.json();
          setFeaturedProperties(properties);
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Trouvez Votre
              <span className="block text-amber-400">Bien Idéal</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Découvrez des milliers de biens immobiliers partout au Tchad
            </p>
          </div>    

          {/* Search Bar */}
          <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Localisation</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Ville, adresse ou code postal"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Transaction</label>
                    <Select value={transactionType} onValueChange={setTransactionType}>
                      <SelectTrigger className="h-12 w-full sm:w-32">
                        <SelectValue placeholder="Transaction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="achat">Acheter</SelectItem>
                        <SelectItem value="location">Louer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger className="h-12 w-full sm:w-40">
                        <SelectValue placeholder="Tous types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous types</SelectItem>
                        <SelectItem value="appartement">Appartement</SelectItem>
                        <SelectItem value="maison">Maison</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="terrain">Terrain</SelectItem>
                        <SelectItem value="bureau_commerce">Bureau/Commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button size="lg" className="h-12 px-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                  <Link href="/search" className="flex items-center">
                    <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
                    Rechercher
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Biens en Vedette
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sélection de biens immobiliers les plus attractifs actuellement disponibles
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8">
              <Link href="/properties" className="flex items-center">
                Voir Tous les Biens
                
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Trouver Votre Prochain Logement ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Rejoignez des milliers de clients satisfaits qui ont trouvé leur bien idéal avec nous
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 px-8">
              <Link href="/properties">Commencer la Recherche</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900 px-8">
              <Link href="/contact">Obtenir de l'Aide</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}