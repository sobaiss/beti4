import { 
  MapPinIcon, 
  HomeIcon, 
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { Button, Input, Textarea, Select, SelectItem, Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import PropertyImageGallery from '@/components/PropertyImageGallery';
import { Property } from '@/types/property';


export default function PropertyDetailsView({property}: { property: Property }) {
  // Track property view on component mount

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
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
          <Card className="border shadow-sm text-foreground">
            <CardBody className="p-6">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-default-900 mb-3">
                      {property.title}
                    </h1>
                    
                    <div className="flex items-center text-default-600 mb-4">
                      <MapPinIcon className="w-5 h-5 mr-2" />
                      <span className="text-lg">{property.location}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-900 mb-2">
                      {formatPrice(property.price)}
                      {property.transactionType === 'location' &&
                        <span className="text-xl text-gray-500">/mois</span>}
                    </div>
                    <Chip color={property.transactionType === 'achat' ? 'primary' : 'secondary'} 
                          variant="solid" size="sm">
                      {property.transactionType === 'achat' ? 'À Vendre' : 'À Louer'}
                    </Chip>
                  </div>
                </div>

                {/* Key Features Bar */}
                <div className="flex flex-wrap gap-8 py-4 px-6 bg-content2 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-2 border-2 border-primary-900"></div>
                    <span className="font-semibold text-lg">{property.area || 0}m²</span>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-2 text-primary-900" />
                    <span className="font-semibold text-lg">{property.bedrooms} chambres</span>
                  </div>
                  {property.bathrooms && (
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="w-5 h-5 mr-2 text-primary-900" />
                      <span className="font-semibold text-lg">{property.bathrooms} salles de bain</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <HomeIcon className="w-5 h-5 mr-2 text-primary-900" />
                    <span className="font-semibold text-lg capitalize">{property.type.toLowerCase()}</span>
                  </div>
                  {property.yearBuilt && (
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2 text-primary-900" />
                      <span className="font-semibold text-lg">{property.yearBuilt}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Property Details Sections */}
          <div className="space-y-8">
            {/* Description */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <h3 className="text-xl font-semibold">Description</h3>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-default-700 leading-relaxed text-lg">
                  {property.description}
                </p>
              </CardBody>
            </Card>

            {/* Property Details */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <h3 className="text-xl font-semibold">Détails du bien</h3>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-content3">
                      <span className="text-default-600">Surface habitable</span>
                      <span className="font-semibold">{property.area || 0}m²</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-content3">
                      <span className="text-default-600">Nombre de chambres</span>
                      <span className="font-semibold">{property.bedrooms}</span>
                    </div>
                    {property.bathrooms && (
                      <div className="flex justify-between py-2 border-b border-content3">
                        <span className="text-default-600">Salles de bain</span>
                        <span className="font-semibold">{property.bathrooms}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-content3">
                      <span className="text-default-600">Type de bien</span>
                      <span className="font-semibold capitalize">{property.type.toLowerCase()}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {property.yearBuilt && (
                      <div className="flex justify-between py-2 border-b border-content3">
                        <span className="text-default-600">Année de construction</span>
                        <span className="font-semibold">{property.yearBuilt}</span>
                      </div>
                    )}
                    {property.floor && (
                      <div className="flex justify-between py-2 border-b border-content3">
                        <span className="text-default-600">Étage</span>
                        <span className="font-semibold">{property.floor}</span>
                      </div>
                    )}
                    {property.energyRating && (
                      <div className="flex justify-between py-2 border-b border-content3">
                        <span className="text-default-600">Classe énergétique</span>
                        <span className="font-semibold">{property.energyRating}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-content3">
                      <span className="text-default-600">Transaction</span>
                      <span className="font-semibold">
                        {property.transactionType === 'achat' ? 'Vente' : 'Location'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <h3 className="text-xl font-semibold">Équipements et services</h3>
                </CardHeader>
                <CardBody className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((propertyAmenity, index) => (
                      <div key={index} className="flex items-center text-default-700 py-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium">{propertyAmenity.amenity?.name}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Location */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <h3 className="text-xl font-semibold">Localisation</h3>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center text-default-700">
                    <div>
                      <div className="font-semibold">{property.location}</div>
                      {property.address && (
                        <div className="text-gray-600">{property.address}</div>
                      )}
                      {(property.zipCode || property.city) && (
                        <div className="text-gray-600">
                          {property.zipCode} {property.city}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-500">
                    <MapPinIcon className="w-12 h-12 mx-auto mb-2 text-default-500" />
                    <p>Carte interactive bientôt disponible</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Contact Sidebar (1 column) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Agent */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 text-foreground">
              <h3 className="text-lg font-semibold">Contacter l'Agent</h3>
            </CardHeader>
            <CardBody className="pt-0 space-y-4">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">
                      {property.owner?.firstName?.[0]}{property.owner?.lastName?.[0]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">
                    {property.owner?.firstName} {property.owner?.lastName}
                  </h3>
                  <p className="text-default-600">
                    {property.owner?.userType === 'professionnel' ? 'Agent Immobilier' : 'Particulier'}
                  </p>
                </div>

                <Divider />

                <div className="space-y-3">
                  <Input placeholder="Votre nom" />
                  <Input placeholder="Votre email" type="email" />
                  <Input placeholder="Votre téléphone" type="tel" />
                  <Textarea 
                    placeholder="Je suis intéressé(e) par ce bien. Merci de me contacter pour plus d'informations."
                    minRows={4}
                  />
                </div>

                <Button color="primary" className="w-full">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  Envoyer un Message
                </Button>

                <Button variant="bordered" className="w-full">
                  <PhoneIcon className="w-4 h-4 mr-2 text-foreground" />
                  Appeler l'Agent
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Property Stats */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 text-foreground">
              <h3 className="text-lg font-semibold">Informations</h3>
            </CardHeader>
            <CardBody className="pt-0 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-default-600">Référence</span>
                <span className="font-medium">#{property.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-default-600">Publié le</span>
                <span className="font-medium">
                  {new Date(property.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-default-600">Vues</span>
                <span className="font-medium">{property.views || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-default-600">Favoris</span>
                <span className="font-medium">{property._count?.favorites || 0}</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}