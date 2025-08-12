'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { Button, Input, Select, SelectItem, Card, CardBody } from '@heroui/react';
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
    <div className="min-h-screen bg-background">
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
          <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardBody className="p-6 text-foreground">
              <div className="flex flex-col lg:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-default-700">Localisation</label>
                  <Input
                    placeholder="Ville, adresse ou code postal"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<MapPinIcon className="w-5 h-5 text-default-400" />}
                    size="lg"
                    variant="bordered"
                    radius="full"
                    
                    classNames={{
                      input: "text-base",
                      inputWrapper: "h-12"
                    }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-default-700">Transaction</label>
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-default-700">Type</label>
                    <Select 
                      selectedKeys={propertyType ? [propertyType] : []}
                      onSelectionChange={(keys) => setPropertyType(Array.from(keys)[0] as string || '')}
                      placeholder="Tous types"
                      className="w-full sm:w-40"
                      size="lg"
                      variant="bordered"
                      radius="full"
                    >
                      <SelectItem key="">Tous types</SelectItem>
                      <SelectItem key="appartement">Appartement</SelectItem>
                      <SelectItem key="maison">Maison</SelectItem>
                      <SelectItem key="villa">Villa</SelectItem>
                      <SelectItem key="terrain">Terrain</SelectItem>
                      <SelectItem key="bureau_commerce">Bureau/Commerce</SelectItem>
                    </Select>
                  </div>
                </div>

                <Button size="lg" color="warning" className="h-12 px-8 font-semibold" radius="full">
                  <Link href="/search" className="flex items-center">
                    <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
                    Rechercher
                  </Link>
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Biens en Vedette
            </h2>
            <p className="text-xl text-default-600 max-w-2xl mx-auto">
              Sélection de biens immobiliers les plus attractifs actuellement disponibles
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="bordered" size="lg" className="px-8">
              <Link href="/properties">
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
            <Button size="lg" color="warning" className="px-8">
              <Link href="/properties">Commencer la Recherche</Link>
            </Button>
            <Button variant="bordered" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900 px-8">
              <Link href="/contact">Obtenir de l'Aide</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}