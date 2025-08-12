'use client';

import { useEffect } from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Home,
  Calendar,
  Phone,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PropertyImageGallery from '@/components/PropertyImageGallery';
import { Property } from '@/types/property';


export default function PropertyDetailsView({property}: { property: Property }) {
  // Track property view on component mount
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch(`/api/properties/${property.id}/view`, {
          method: 'POST'
        })
      } catch (error) {
        console.error('Error tracking property view:', error)
      }
    }

    trackView()
  }, [property.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Images and Details (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enhanced Image Gallery */}
          <PropertyImageGallery 
            property={property} 
            images={property.images || []} 
            className="w-full"
          />

          {/* Property Header */}
          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      {property.title}
                    </h1>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-lg">{property.location}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-900 mb-2">
                      {formatPrice(property.price)}
                      {property.transactionType === 'location' && 
                        <span className="text-xl text-gray-500">/mois</span>}
                    </div>
                    <Badge variant={property.transactionType === 'achat' ? 'default' : 'secondary'} 
                           className="bg-blue-900 text-white text-sm px-3 py-1">
                      {property.transactionType === 'achat' ? 'À Vendre' : 'À Louer'}
                    </Badge>
                  </div>
                </div>

                {/* Key Features Bar */}
                <div className="flex flex-wrap gap-8 py-4 px-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Square className="w-5 h-5 mr-2 text-blue-900" />
                    <span className="font-semibold text-lg">{property.area || 0}m²</span>
                  </div>
                  <div className="flex items-center">
                    <Bed className="w-5 h-5 mr-2 text-blue-900" />
                    <span className="font-semibold text-lg">{property.bedrooms} chambres</span>
                  </div>
                  {property.bathrooms && (
                    <div className="flex items-center">
                      <Bath className="w-5 h-5 mr-2 text-blue-900" />
                      <span className="font-semibold text-lg">{property.bathrooms} salles de bain</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Home className="w-5 h-5 mr-2 text-blue-900" />
                    <span className="font-semibold text-lg capitalize">{property.type.toLowerCase()}</span>
                  </div>
                  {property.yearBuilt && (
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-900" />
                      <span className="font-semibold text-lg">{property.yearBuilt}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details Sections */}
          <div className="space-y-8">
            {/* Description */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Détails du bien</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Surface habitable</span>
                      <span className="font-semibold">{property.area || 0}m²</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Nombre de chambres</span>
                      <span className="font-semibold">{property.bedrooms}</span>
                    </div>
                    {property.bathrooms && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Salles de bain</span>
                        <span className="font-semibold">{property.bathrooms}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Type de bien</span>
                      <span className="font-semibold capitalize">{property.type.toLowerCase()}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {property.yearBuilt && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Année de construction</span>
                        <span className="font-semibold">{property.yearBuilt}</span>
                      </div>
                    )}
                    {property.floor && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Étage</span>
                        <span className="font-semibold">{property.floor}</span>
                      </div>
                    )}
                    {property.energyRating && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Classe énergétique</span>
                        <span className="font-semibold">{property.energyRating}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Transaction</span>
                      <span className="font-semibold">
                        {property.transactionType === 'achat' ? 'Vente' : 'Location'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Équipements et services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((propertyAmenity, index) => (
                      <div key={index} className="flex items-center text-gray-700 py-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium">{propertyAmenity.amenity?.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Localisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <div>
                      <div className="font-semibold">{property.location}</div>
                      {property.address && (
                        <div className="text-gray-600">{property.address}</div>
                      )}
                      {(property.postalCode || property.city) && (
                        <div className="text-gray-600">
                          {property.postalCode} {property.city}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Carte interactive bientôt disponible</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Sidebar (1 column) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Agent */}
          <Card className="border shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Contacter l'Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">
                      {property.owner?.firstName?.[0]}{property.owner?.lastName?.[0]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">
                    {property.owner?.firstName} {property.owner?.lastName}
                  </h3>
                  <p className="text-gray-600">
                    {property.owner?.userType === 'professionnel' ? 'Agent Immobilier' : 'Particulier'}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Input placeholder="Votre nom" />
                  <Input placeholder="Votre email" type="email" />
                  <Input placeholder="Votre téléphone" type="tel" />
                  <Textarea 
                    placeholder="Je suis intéressé(e) par ce bien. Merci de me contacter pour plus d'informations."
                    rows={4}
                  />
                </div>

                <Button className="w-full bg-blue-900 hover:bg-blue-800">
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un Message
                </Button>

                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler l'Agent
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Visit */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Programmer une Visite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="date" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'heure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full bg-amber-500 hover:bg-amber-600">
                <Calendar className="w-4 h-4 mr-2" />
                Réserver une Visite
              </Button>
            </CardContent>
          </Card>

          {/* Property Stats */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Référence</span>
                <span className="font-medium">#{property.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Publié le</span>
                <span className="font-medium">
                  {new Date(property.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Vues</span>
                <span className="font-medium">{property.views || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Favoris</span>
                <span className="font-medium">{property._count?.favorites || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}