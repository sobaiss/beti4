'use client';

import { useState } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  MagnifyingGlassPlusIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { Button, Modal, ModalContent, ModalBody } from '@heroui/react';
import Image from 'next/image';
import { Property, PropertyImage } from '@/types/property';
import { CURRENCY } from '@/lib/config';

interface PropertyImageGalleryProps {
  property: Property;
  images: PropertyImage[];
  className?: string;
}

export default function PropertyImageGallery({ 
  property, 
  images, 
  className = "" 
}: PropertyImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Ensure we have images to display
  const propertyImages = images && images.length > 0 
    ? images 
    : [{
        id: 'placeholder',
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        alt: `${property.title} - Vue principale`,
        order: 0,
        createdAt: new Date(),
        propertyId: property.id
      }];

  const currentImage = propertyImages[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === propertyImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? propertyImages.length - 1 : prev - 1
    );
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Generate SEO-friendly alt text
  const generateAltText = (image: PropertyImage, index: number) => {
    const imageTypes = ['vue-principale', 'salon', 'cuisine', 'chambre', 'salle-de-bain', 'exterieur'];
    const imageType = imageTypes[index] || 'vue-interieure';
    
    return image.alt || `${property.title} - ${imageType} - ${property.location}`;
  };

  // Generate structured data for the main image
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": propertyImages[0]?.url,
    "description": `${property.title} - ${property.location}`,
    "name": property.title,
    "caption": `${property.propertyType} à ${property.location} - ${property.price}${CURRENCY}`
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className={`relative ${className}`}>
        {/* Main Image */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
          <Image
            src={currentImage.url}
            alt={generateAltText(currentImage, currentImageIndex)}
            title={`${property.title} - Image ${currentImageIndex + 1} sur ${propertyImages.length}`}
            width={800}
            height={500}
            priority
            className="cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={openLightbox}
          />
          
          {/* Navigation Arrows */}
          {propertyImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full min-w-12 h-12"
                isIconOnly
                aria-label="Image précédente"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full min-w-12 h-12"
                isIconOnly
                aria-label="Image suivante"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Fullscreen Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={openLightbox}
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white rounded-full min-w-12 h-12"
            isIconOnly
            aria-label="Voir en plein écran"
          >
            <MagnifyingGlassPlusIcon className="w-4 h-4" />
          </Button>

          {/* Image Counter */}
          {propertyImages.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {propertyImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {propertyImages.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {propertyImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  index === currentImageIndex 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label={`Voir l'image ${index + 1}`}
              >
                <Image
                  src={image.url}
                  alt={generateAltText(image, index)}
                  width={80}
                  height={64}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Modal 
        isOpen={isLightboxOpen} 
        onOpenChange={setIsLightboxOpen}
        size="full"
        classNames={{
          base: "bg-black/95",
          backdrop: "bg-black/80",
          closeButton: "hidden"
        }}
      >
        <ModalContent className="bg-transparent shadow-none">
          <ModalBody className="p-0">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="light"
              size="lg"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full min-w-12 h-12"
              isIconOnly
              aria-label="Fermer"
            >
              <XMarkIcon className="w-6 h-6" />
            </Button>

            {/* Main Lightbox Image */}
            <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
              <Image
                src={currentImage.url}
                alt={generateAltText(currentImage, currentImageIndex)}
                title={`${property.title} - Vue agrandie`}
                width={1200}
                height={800}
                fill
                className="object-contain"
              />
            </div>

            {/* Lightbox Navigation */}
            {propertyImages.length > 1 && (
              <>
                <Button
                  variant="light"
                  size="lg"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full min-w-16 h-16"
                  isIconOnly
                  aria-label="Image précédente"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </Button>
                <Button
                  variant="light"
                  size="lg"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full min-w-16 h-16"
                  isIconOnly
                  aria-label="Image suivante"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Lightbox Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {propertyImages.length}
            </div>
          </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}