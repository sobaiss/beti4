'use client'

import { Button } from '@heroui/react';
import Link from 'next/link';
import Header from '@/components/Header';
import HomeSearchBarHome from '@/ui/search/home-search-bar';
import PropertyList from '@/ui/property/property-list';
import { Suspense, useEffect, useState } from 'react';
import Loading from '@/components/ui/loading';
import { getLocations } from '@/lib/actions/location';
import { City } from '@/types/location';
import { getFeaturedProperties } from '@/lib/actions/property';
import { PaginatedProperty } from '@/types/property';
import { PropertiesListSkeleton } from '@/ui/property/skeletons';

export default function Home() {
  const [locations, setLocations] = useState<City[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);

  const [featuredProperties, setFeaturedProperties] = useState<PaginatedProperty>({
    properties: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 6,
      pages: 0
    }
  });

  // Track property view on component mount
  useEffect(() => {
      getFeaturedProperties(6).then(response => {
        if (response) {
          setFeaturedProperties(response);
        }
      }).catch(error => {
        console.error('Error fetching featured properties:', error);
      }).finally(() => {
        setIsLoadingProperties(false);
      });

      getLocations().then(response => {
        if (response) {
          setLocations(response);
        }
      }).catch(error => {
        console.error('Error fetching locations:', error);
      });

  }, [])

  

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
          <Suspense fallback={<Loading />}>
            <HomeSearchBarHome locations={locations} />
          </Suspense>
        </div>
      </section>

      {/* Featured Properties */}
      {isLoadingProperties && <PropertiesListSkeleton />}
      {!isLoadingProperties && <PropertyList featuredProperties={featuredProperties} />}

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