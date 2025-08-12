'use client';

import { HeartIcon, MapPinIcon, HomeIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Card, CardBody, Button, Chip } from '@heroui/react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get the first image or use a placeholder
  const firstImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : { 
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg', 
        alt: `${property.title} - Vue principale - ${property.location}`,
        id: 'placeholder',
        order: 0,
        createdAt: new Date(),
        propertyId: property.id
      };

  // Generate SEO-friendly alt text
  const altText = firstImage.alt || `${property.title} - ${property.location} - ${property.transactionType === 'achat' ? 'À vendre' : 'À louer'}`;
  
  return (
    <Card className="group overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <Image
            src={firstImage.url}
            alt={altText}
            title={`${property.title} - ${property.location}`}
            width={400}
            height={300}
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="absolute top-4 left-4">
          <Chip 
            color={property.transactionType === 'achat' ? 'primary' : 'secondary'}
            variant="solid"
            size="sm"
          >
            {property.transactionType === 'achat' ? 'À Vendre' : 'À Louer'}
          </Chip>
        </div>
        
        <Button
          variant="light"
          size="sm"
          isIconOnly
          className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full"
        >
          <HeartIcon className="w-4 h-4 text-gray-600" />
        </Button>

        {property.featured && (
          <div className="absolute bottom-4 left-4">
            <Chip color="warning" variant="solid" size="sm">
              En Vedette
            </Chip>
          </div>
        )}
      </div>

      <CardBody className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-900">
              {formatPrice(property.price)}
              {property.transactionType === 'location' && <span className="text-sm text-gray-500">/month</span>}
            </span>
          </div>

          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 leading-tight">
            {property.title}
          </h3>

          <div className="flex items-center text-gray-600 text-sm">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
              {property.bathrooms && (
                <div className="flex items-center">
                  <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              <div className="flex items-center">
                <div className="w-4 h-4 mr-1 border border-gray-400"></div>
                <span>{property.area || 0}m²</span>
              </div>
            </div>
          </div>

          <div className="flex items-center text-xs text-gray-500">
            <HomeIcon className="w-3 h-3 mr-1" />
            <span className="capitalize">{property.type.toLowerCase()}</span>
          </div>

          <Button color="primary" className="w-full mt-4">
            <Link href={`/property/${property.id}`}>Voir les Détails</Link>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}