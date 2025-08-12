'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  CloudArrowUpIcon, 
  MapPinIcon, 
  HomeIcon, 
  CurrencyEuroIcon, 
  CameraIcon, 
  DocumentTextIcon, 
  CheckIcon, 
} from '@heroicons/react/24/outline';
import { 
  Button, 
  Input, 
  Textarea, 
  Card, 
  CardBody, 
  CardHeader, 
  Select, 
  SelectItem, 
  Checkbox,
} from '@heroui/react';
import Link from 'next/link';
import { City } from '@/types/location';

export default function DeposerUneAnnonceView({cities}: { cities: City[] }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyType, setPropertyType] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    address: '',
    postalCode: '',
    city: '',
    area: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    totalFloors: '',
    yearBuilt: '',
    energyRating: '',
    furnished: false,
    balcony: false,
    terrace: false,
    garden: false,
    parking: false,
    elevator: false,
    cellar: false,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    isAgent: false
  });

  const locations = [
    // N'Djamena neighborhoods
    'Chagoua',
    'Moursal',
    'Farcha',
    'Klemat',
    'Diguel',
    'Kabalaye',
    'Gassi',
    'Ridina',
    'Madjorio',
    'Gardolé',
    'Amriguébé',
    'Walia',
    'Sabangali',
    'Dembé',
    'Goudji',
    // Other areas
    'Centre-ville',
    'Zone industrielle',
    'Zone résidentielle',
    'Quartier administratif',
    'Zone commerciale'
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin?callbackUrl=/deposer-une-annonce');
      return;
    }
  }, [session, status, router]);

  const steps = [
    { id: 1, title: 'Type de bien', icon: HomeIcon },
    { id: 2, title: 'Localisation', icon: MapPinIcon },
    { id: 3, title: 'Caractéristiques', icon: DocumentTextIcon },
    { id: 4, title: 'Prix', icon: CurrencyEuroIcon },
    { id: 5, title: 'Photos', icon: CameraIcon },
    { id: 6, title: 'Contact', icon: CheckIcon }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Convert cities to combobox options
  const cityOptions = cities.map(city => ({
    value: city.name,
    label: city.name
  }));

  const locationOptions = locations.map(location => ({
    value: location,
    label: location
  }));

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div> 
              <h2 className="text-2xl font-bold text-default-900 mb-4">Quel type de bien souhaitez-vous mettre en ligne ?</h2>
              <p className="text-gray-600 mb-6">Sélectionnez le type de transaction et le type de bien</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-base font-medium text-gray-900 mb-4 block">Type de transaction</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTransactionType('achat')}
                    className={`p-6 border-2 rounded-lg text-left transition-all ${
                      transactionType === 'achat' // Changed from border-blue-500 bg-blue-50 to border-primary-500 bg-primary-50
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-lg mb-2">Vendre</div>
                    <div className="text-gray-600">Je souhaite vendre mon bien</div>
                  </button>
                  <button
                    onClick={() => setTransactionType('location')}
                    className={`p-6 border-2 rounded-lg text-left transition-all ${
                      transactionType === 'location' // Changed from border-blue-500 bg-blue-50 to border-primary-500 bg-primary-50
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-lg mb-2">Louer</div>
                    <div className="text-gray-600">Je souhaite louer mon bien</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-base font-medium text-gray-900 mb-4 block">Type de bien</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { value: 'appartement', label: 'Appartement', icon: '🏢' },
                    { value: 'maison', label: 'Maison', icon: '🏠' },
                    { value: 'villa', label: 'Villa', icon: '🏡' },
                    { value: 'terrain', label: 'Terrain', icon: '⛰️' },
                    { value: 'bureau_commerce', label: 'Bureau/Commerce', icon: '🏪' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setPropertyType(type.value)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        propertyType === type.value // Changed from border-blue-500 bg-blue-50 to border-primary-500 bg-primary-50
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div> 
              <h2 className="text-2xl font-bold text-default-900 mb-4">Où se situe votre bien ?</h2>
              <p className="text-gray-600 mb-6">Indiquez l'adresse complète de votre propriété</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
                <Input
                  id="address"
                  placeholder="Numéro et nom de rue"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                  <Input
                    id="postalCode"
                    placeholder="75001"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <Select
                    selectedKeys={formData.city ? [formData.city] : []}
                    onSelectionChange={(keys) => handleInputChange('city', Array.from(keys)[0] as string)}
                    placeholder="Sélectionner une ville..."
                  >
                    {cityOptions.map((city) => (
                      <SelectItem key={city.value}>
                        {city.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quartier / Secteur (optionnel)</label>
                <Select
                  selectedKeys={formData.location ? [formData.location] : []}
                  onSelectionChange={(keys) => handleInputChange('location', Array.from(keys)[0] as string)}
                  placeholder="Sélectionner un quartier..."
                >
                  {locationOptions.map((location) => (
                    <SelectItem key={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div> 
              <h2 className="text-2xl font-bold text-default-900 mb-4">Caractéristiques du bien</h2>
              <p className="text-gray-600 mb-6">Décrivez les principales caractéristiques de votre bien</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Surface (m²)</label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="85"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">Nombre de pièces</label>
                  <Select 
                    selectedKeys={formData.rooms ? [formData.rooms] : []}
                    onSelectionChange={(keys) => handleInputChange('rooms', Array.from(keys)[0] as string)}
                    placeholder="Sélectionner"
                  >
                    <SelectItem key="1">1 pièce</SelectItem>
                    <SelectItem key="2">2 pièces</SelectItem>
                    <SelectItem key="3">3 pièces</SelectItem>
                    <SelectItem key="4">4 pièces</SelectItem>
                    <SelectItem key="5">5 pièces</SelectItem>
                    <SelectItem key="6+">6+ pièces</SelectItem>
                  </Select>
                </div>
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Chambres</label>
                  <Select 
                    selectedKeys={formData.bedrooms ? [formData.bedrooms] : []}
                    onSelectionChange={(keys) => handleInputChange('bedrooms', Array.from(keys)[0] as string)}
                    placeholder="Sélectionner"
                  >
                    <SelectItem key="0">0 chambre</SelectItem>
                    <SelectItem key="1">1 chambre</SelectItem>
                    <SelectItem key="2">2 chambres</SelectItem>
                    <SelectItem key="3">3 chambres</SelectItem>
                    <SelectItem key="4">4 chambres</SelectItem>
                    <SelectItem key="5+">5+ chambres</SelectItem>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">Salles de bain</label>
                  <Select 
                    selectedKeys={formData.bathrooms ? [formData.bathrooms] : []}
                    onSelectionChange={(keys) => handleInputChange('bathrooms', Array.from(keys)[0] as string)}
                    placeholder="Sélectionner"
                  >
                    <SelectItem key="1">1 salle de bain</SelectItem>
                    <SelectItem key="2">2 salles de bain</SelectItem>
                    <SelectItem key="3">3 salles de bain</SelectItem>
                    <SelectItem key="4+">4+ salles de bain</SelectItem>
                  </Select>
                </div>
                <div>
                  <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">Étage</label>
                  <Input
                    id="floor"
                    placeholder="2"
                    value={formData.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-1">Année de construction</label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    placeholder="2010"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-base font-medium text-default-900 mb-4 block">Équipements et caractéristiques</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'furnished', label: 'Meublé' },
                    { key: 'balcony', label: 'Balcon' },
                    { key: 'terrace', label: 'Terrasse' },
                    { key: 'garden', label: 'Jardin' },
                    { key: 'parking', label: 'Parking' },
                    { key: 'elevator', label: 'Ascenseur' },
                    { key: 'cellar', label: 'Cave' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.key}
                        isSelected={formData[item.key as keyof typeof formData] as boolean}
                        onValueChange={(checked) => handleInputChange(item.key, checked)} // Changed from checked to checked
                      >
                        {item.label}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description du bien</label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre bien, ses atouts, son environnement..."
                  minRows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div> 
              <h2 className="text-2xl font-bold text-default-900 mb-4">Quel est le prix de votre bien ?</h2>
              <p className="text-gray-600 mb-6">
                {transactionType === 'achat' 
                  ? 'Indiquez le prix de vente souhaité' 
                  : 'Indiquez le loyer mensuel souhaité'
                }
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="price" className="text-lg font-medium block mb-2">
                  {transactionType === 'achat' ? 'Prix de vente' : 'Loyer mensuel'}
                </label>
                <div className="relative mt-2">
                  <Input
                    id="price"
                    type="number"
                    placeholder={transactionType === 'achat' ? '450000' : '1200'}
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="text-xl py-4 pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    €{transactionType === 'location' ? '/mois' : ''}
                  </div>
                </div>
              </div>

              {transactionType === 'location' && (
                <div className="bg-primary/10 p-4 rounded-lg">
                  <h3 className="font-medium text-primary-900 mb-2">Charges et frais supplémentaires</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox>
                        Charges comprises dans le loyer
                      </Checkbox>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox>
                        Dépôt de garantie demandé
                      </Checkbox>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-content2 p-4 rounded-lg">
                <h3 className="font-medium text-default-900 mb-2">Estimation automatique</h3>
                <p className="text-sm text-default-600">
                  Basée sur les biens similaires dans votre secteur, nous estimons votre bien entre{' '} 
                  <span className="font-medium text-blue-900">
                    {transactionType === 'achat' ? '420 000€ et 480 000€' : '1 100€ et 1 400€/mois'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div> 
              <h2 className="text-2xl font-bold text-default-900 mb-4">Ajoutez des photos de votre bien</h2>
              <p className="text-default-600 mb-6">Les annonces avec photos reçoivent 5 fois plus de contacts</p>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-default-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors text-foreground">
                <CloudArrowUpIcon className="w-12 h-12 text-default-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-default-900 mb-2">Glissez vos photos ici</h3>
                <p className="text-default-600 mb-4">ou cliquez pour sélectionner des fichiers</p>
                <Button variant="bordered">Choisir des photos</Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Conseils pour de belles photos</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Prenez des photos en haute résolution</li>
                  <li>• Privilégiez la lumière naturelle</li>
                  <li>• Montrez toutes les pièces principales</li>
                  <li>• Incluez des vues extérieures si possible</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div> 
              <h2 className="text-2xl font-bold text-default-900 mb-4">Vos informations de contact</h2>
              <p className="text-gray-600 mb-6">Ces informations seront visibles par les personnes intéressées</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  isSelected={formData.isAgent}
                  onValueChange={(checked) => handleInputChange('isAgent', checked)}
                > 
                  Je suis un professionnel de l'immobilier
                </Checkbox>
              </div>

              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <Input
                  id="contactName"
                  placeholder="Jean Dupont"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="jean.dupont@email.com"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                />
              </div>

              <div className="bg-success-50 p-4 rounded-lg">
                <h3 className="font-medium text-success-900 mb-2">Votre annonce est prête !</h3>
                <p className="text-sm text-success-800">
                  Elle sera mise en ligne après validation par notre équipe (sous 24h).
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-blue-900 hover:text-blue-800 mb-4">
          <ArrowLeftIcon className="w-4 h-4 mr-2 text-primary-900" />
          Retour à l'accueil
        </Link>
        <h1 className="text-3xl font-bold text-default-900">Déposer une annonce</h1>
        <p className="text-default-600 mt-2">Vendez ou louez votre bien rapidement et facilement</p>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Progress Steps */}
        <div className="lg:w-80 flex-shrink-0">
          <Card className="sticky top-24">
            <CardHeader className="text-foreground">
              <h3 className="text-lg font-semibold">Étapes</h3>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  
                  return (
                    <div key={step.id} className="flex items-center relative">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0 ${
                        isCompleted // Changed from bg-green-500 border-green-500 to bg-success-500 border-success-500
                          ? 'bg-success-500 border-success-500 text-white' 
                          : isActive // Changed from bg-blue-500 border-blue-500 to bg-primary-500 border-primary-500
                            ? 'bg-primary-500 border-primary-500 text-white' 
                            : 'border-default-300 text-default-400'
                      }`}>
                        {isCompleted ? (
                          <CheckIcon className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="ml-4 flex-1 text-foreground">
                        <div className={`text-sm font-medium ${
                          isActive ? 'text-blue-900' : isCompleted ? 'text-green-700' : 'text-gray-500'
                        }`}>
                          Étape {step.id}
                        </div>
                        <div className={`text-sm ${
                          isActive ? 'text-blue-700' : isCompleted ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </div>
                      </div>
                      {index < steps.length - 1 && ( // Changed from bg-green-500 to bg-success-500
                        <div className={`absolute left-[1.25rem] top-12 w-0.5 h-8 ${ // Changed from bg-gray-300 to bg-default-300
                          isCompleted ? 'bg-success-500' : 'bg-default-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Step Content */}
          <Card className="mb-8 text-foreground">
            <CardBody className="p-8">
              {renderStepContent()}
            </CardBody>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="bordered"
              onClick={prevStep}
              isDisabled={currentStep === 1}
              className="px-8"
            >
              Précédent
            </Button>
            
            {currentStep === steps.length ? (
              <Button color="success" className="px-8">
                Publier l'annonce
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                isDisabled={
                  (currentStep === 1 && (!propertyType || !transactionType)) ||
                  (currentStep === 2 && (!formData.address || !formData.postalCode || !formData.city)) ||
                  (currentStep === 4 && !formData.price) ||
                  (currentStep === 6 && (!formData.contactName || !formData.contactEmail || !formData.contactPhone))
                }
                color="primary"
                className="px-8"
              >
                Suivant
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}