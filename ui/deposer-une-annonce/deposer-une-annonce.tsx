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
  BuildingOffice2Icon,
  HomeModernIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  PhotoIcon, 
  XMarkIcon,
  ExclamationTriangleIcon
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
  Autocomplete,
  AutocompleteItem,
} from '@heroui/react';
import Link from 'next/link';
import Image from 'next/image';
import { City } from '@/types/location';
import { getCities } from '@/lib/actions/location';
import { convertFileToBase64 } from '@/lib/files/files';
import { createProperty } from '@/lib/actions/property';
import { generatePropertyReference } from '@/lib/utils/property-reference';

export default function DeposerUneAnnonceView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyType, setPropertyType] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [cityMap, setCityMap] = useState<City[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<{ file: File, previewUrl: string }[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    useUserContact: true
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
    if (formData.useUserContact) {
      setFormData(prev => ({
        ...prev,
        contactFirstName: session.user.firstName || '',
        contactLastName: session.user.lastName || '',
        contactEmail: session.user.email || '',
        contactPhone: session.user.phone || ''
      }));
    }
  }, [session, status, router]);

    // Track property view on component mount
  useEffect(() => {
    (async () => {
      const cities = await getCities();
      setCityMap(cities);
    })();
  }, []);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newErrors: string[] = [];
    const validFiles: File[] = [];
    const newPreviews: { file: File, previewUrl: string }[] = [];

    // Check if adding new files would exceed the limit
    if (selectedFiles.length + files.length > 4) {
      newErrors.push('Vous ne pouvez ajouter que 4 images maximum');
      setImageErrors(newErrors);
      return;
    }

    files.forEach((file) => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        newErrors.push(`${file.name}: Seuls les fichiers image sont acceptés`);
        return;
      }

      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        newErrors.push(`${file.name}: La taille ne peut pas dépasser 5MB`);
        return;
      }

      // Check if file already exists
      if (selectedFiles.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
        newErrors.push(`${file.name}: Ce fichier a déjà été ajouté`);
        return;
      }

      validFiles.push(file);
      newPreviews.push({
        file,
        previewUrl: URL.createObjectURL(file)
      });
    });

    if (newErrors.length > 0) {
      setImageErrors(newErrors);
    } else {
      setImageErrors([]);
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }

    // Reset the input value to allow selecting the same file again if needed
    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const previewToRemove = imagePreviews[index];
    
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(previewToRemove.previewUrl);
    
    // Remove from both arrays
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    // Clear any related errors
    setImageErrors([]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Convert images to base64
      const images = await Promise.all(
        selectedFiles.map(async (file, index) => {
          const base64 = await convertFileToBase64(file);
          return {
            url: base64,
            alt: `${formData.title || 'Propriété'} - Image ${index + 1}`,
            order: index
          };
        })
      );

      // Generate property reference
      const reference = await generatePropertyReference({
        type: propertyType as any,
        postalCode: formData.postalCode
      });

      // Prepare property data
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        type: propertyType as any,
        transactionType: transactionType as any,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        area: parseFloat(formData.area),
        floor: formData.floor ? parseInt(formData.floor) : undefined,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
        reference,
        images: images.length > 0 ? images : undefined,
        amenities: [
          ...(formData.furnished ? [{ amenityId: 'furnished', amenityCount: 1 }] : []),
          ...(formData.balcony ? [{ amenityId: 'balcony', amenityCount: 1 }] : []),
          ...(formData.terrace ? [{ amenityId: 'terrace', amenityCount: 1 }] : []),
          ...(formData.garden ? [{ amenityId: 'garden', amenityCount: 1 }] : []),
          ...(formData.parking ? [{ amenityId: 'parking', amenityCount: 1 }] : []),
          ...(formData.elevator ? [{ amenityId: 'elevator', amenityCount: 1 }] : []),
          ...(formData.cellar ? [{ amenityId: 'cellar', amenityCount: 1 }] : []),
        ]
      };

      const response = await createProperty(propertyData);

      if ('errors' in response) {
        setSubmitError(response.message || 'Erreur lors de la création de l\'annonce');
      } else {
        setSubmitSuccess(true);
        // Redirect to the new property page after a short delay
        setTimeout(() => {
          router.push(`/property/${response.id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating property:', error);
      setSubmitError('Erreur lors de la création de l\'annonce. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Type de bien', icon: HomeIcon },
    { id: 2, title: 'Localisation', icon: MapPinIcon },
    { id: 3, title: 'Caractéristiques', icon: DocumentTextIcon },
    { id: 4, title: 'Prix', icon: CurrencyEuroIcon },
    { id: 5, title: 'Photos', icon: CameraIcon },
    { id: 6, title: 'Contact', icon: CheckIcon }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    console.log(`Field changed: ${field}, New value: ${value}`);
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
              <p className="text-default-600 mb-6">Sélectionnez le type de transaction et le type de bien</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-base font-medium text-default-900 mb-4 block">Type de transaction</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                  <Button
                    onPress={() => setTransactionType('achat')}
                    size="lg"
                    radius="full"
                    variant={transactionType === 'achat'
                      ? 'solid'
                      : 'faded'
                    }
                    color={transactionType === 'achat'
                      ? 'primary'
                      : 'default'
                    }
                  >
                    <div className="text-center py-4">
                      <span className="font-semibold text-lg block mb-2">Vendre</span>
                      <span className="text-sm opacity-80">Je souhaite vendre mon bien</span>
                    </div>
                  </Button>
                  <Button
                    onPress={() => setTransactionType('location')}
                    size="lg"
                    radius="full"
                    variant={transactionType === 'location'
                      ? 'solid'
                      : 'faded'
                    }
                    color={transactionType === 'location'
                      ? 'primary'
                      : 'default'
                    }
                  >
                    <div className="text-center py-4">
                      <span className="font-semibold text-lg block mb-2">Louer</span>
                      <span className="text-sm opacity-80">Je souhaite louer mon bien</span>
                    </div>
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-base font-medium text-default-900 mb-4 block">Type de bien</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {[
                    { value: 'terrain', label: 'Terrain', icon: <MapPinIcon /> },
                    { value: 'maison', label: 'Maison', icon: <HomeIcon /> },
                    { value: 'villa', label: 'Villa', icon: <BuildingOffice2Icon /> },
                    { value: 'appartement', label: 'Appartement', icon: <HomeModernIcon /> },
                    { value: 'terrain_agricole', label: 'Terrain Agricole', icon: <PhotoIcon /> },
                    { value: 'immeuble', label: 'Immeuble', icon: <BuildingOfficeIcon /> },
                    { value: 'bureau_commerce', label: 'Bureaux & Commerces', icon: <BriefcaseIcon /> }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setPropertyType(type.value)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        propertyType === type.value // Changed from border-blue-500 bg-blue-50 to border-primary-500 bg-primary-50
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-default-200 hover:border-default-300'
                      }`}
                    >
                      <div className="mb-3 flex justify-center text-default-600">{type.icon}</div>
                      <div className="font-medium text-sm">{type.label}</div>
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
              <p className="text-default-600 mb-6">Indiquez l'adresse complète de votre propriété</p>
            </div>

            <div className="space-y-6 max-w-4xl">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-default-700 mb-2">Adresse complète</label>
                <Input
                  id="address"
                  placeholder="Numéro et nom de rue"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  size="lg"
                  variant="bordered"
                  radius="lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-foreground">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-default-700 mb-2">Code postal</label>
                  <Input
                    id="postalCode"
                    placeholder="75001"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-default-700 mb-2">Ville *</label>
                  <Autocomplete
                    allowsCustomValue
                    className="w-full"
                    defaultItems={cityMap}
                    defaultSelectedKey=""
                    placeholder="Ville"
                    startContent={<MapPinIcon className="w-5 h-5 text-default-400" />}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    isClearable
                    onSelectionChange={(item) => handleInputChange('city', item ? item.toString() : '')}
                    >
                    {(locationItem) => <AutocompleteItem key={locationItem.sk}>{locationItem.name}</AutocompleteItem>}
                </Autocomplete>
                </div>
                <div>
                  <label className="block text-sm font-medium text-default-700 mb-2">Quartier / Secteur</label>
                  <Select
                    selectedKeys={formData.location ? [formData.location] : []}
                    onSelectionChange={(keys) => handleInputChange('location', Array.from(keys)[0] as string)}
                    placeholder="Sélectionner un quartier..."
                    size="lg"
                    variant="bordered"
                    radius="lg"
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div> 
              <h2 className="text-2xl font-bold text-default-900 mb-4">Caractéristiques du bien</h2>
              <p className="text-default-600 mb-6">Décrivez les principales caractéristiques de votre bien</p>
            </div>

            <div className="space-y-8 max-w-5xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div>
                  <Input
                    id="area"
                    label="Surface (m²)"
                    labelPlacement="outside"
                    type="number"
                    placeholder="85"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                  />
                </div>
                <div>
                  <Select 
                    selectedKeys={formData.rooms ? [formData.rooms] : []}
                    onSelectionChange={(keys) => handleInputChange('rooms', Array.from(keys)[0] as string)}
                    placeholder="Sélectionner"
                    label="Nombre de pièces"
                    labelPlacement="outside"
                    size="lg"
                    variant="bordered"
                    radius="lg"
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
                  <Select 
                    selectedKeys={formData.bedrooms ? [formData.bedrooms] : []}
                    onSelectionChange={(keys) => handleInputChange('bedrooms', Array.from(keys)[0] as string)}
                    placeholder="Sélectionner"
                    label="Chambres"
                    labelPlacement="outside"
                    size="lg"
                    variant="bordered"
                    radius="lg"
                  >
                    <SelectItem key="0">0 chambre</SelectItem>
                    <SelectItem key="1">1 chambre</SelectItem>
                    <SelectItem key="2">2 chambres</SelectItem>
                    <SelectItem key="3">3 chambres</SelectItem>
                    <SelectItem key="4">4 chambres</SelectItem>
                    <SelectItem key="5+">5+ chambres</SelectItem>
                  </Select>
                </div>
                <div>
                  <Select 
                    selectedKeys={formData.bathrooms ? [formData.bathrooms] : []}
                    onSelectionChange={(keys) => handleInputChange('bathrooms', Array.from(keys)[0] as string)}
                    placeholder="Sélectionner"
                    label="Salles de bain"
                    labelPlacement="outside"
                    size="lg"
                    variant="bordered"
                    radius="lg"
                  >
                    <SelectItem key="1">1 salle de bain</SelectItem>
                    <SelectItem key="2">2 salles de bain</SelectItem>
                    <SelectItem key="3">3 salles de bain</SelectItem>
                    <SelectItem key="4+">4+ salles de bain</SelectItem>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Input
                    id="floor"
                    label="Étage"
                    labelPlacement="outside"
                    placeholder="2"
                    value={formData.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                  />
                </div>
                <div>
                  <Input
                    id="yearBuilt"
                    label="Année de construction"
                    labelPlacement="outside"
                    type="number"
                    placeholder="2010"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-base font-medium text-default-900 mb-4 block">Équipements et caractéristiques</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {[
                    { key: 'furnished', label: 'Meublé' },
                    { key: 'balcony', label: 'Balcon' },
                    { key: 'terrace', label: 'Terrasse' },
                    { key: 'garden', label: 'Jardin' },
                    { key: 'parking', label: 'Parking' },
                    { key: 'elevator', label: 'Ascenseur' },
                    { key: 'cellar', label: 'Cave' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center space-x-2 p-3 border border-default-200 rounded-lg hover:border-default-300 transition-colors">
                      <Checkbox
                        id={item.key}
                        isSelected={formData[item.key as keyof typeof formData] as boolean}
                        onValueChange={(checked) => handleInputChange(item.key, checked)} // Changed from checked to checked
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Textarea
                  id="description"
                  label="Description du bien"
                  labelPlacement="outside"
                  placeholder="Décrivez votre bien, ses atouts, son environnement..."
                  minRows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  size="lg"
                  variant="bordered"
                  radius="lg"
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
              <p className="text-default-600 mb-6">
                {transactionType === 'achat' 
                  ? 'Indiquez le prix de vente souhaité' 
                  : 'Indiquez le loyer mensuel souhaité'
                }
              </p>
            </div>

            <div className="space-y-6 max-w-2xl">
              <div className="space-y-4">
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
                    size="lg"
                    variant="bordered"
                    radius="lg"
                    classNames={{
                      input: "text-xl font-semibold"
                    }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-default-500 font-medium text-lg">
                    €{transactionType === 'location' ? '/mois' : ''}
                  </div>
                </div>
              </div>

              {transactionType === 'location' && (
                <div className="bg-primary-50 p-6 rounded-xl border border-primary-200">
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

              <div className="bg-content2 p-6 rounded-xl border border-content3">
                <h3 className="font-medium text-default-900 mb-2">Estimation automatique</h3>
                <p className="text-sm text-default-600">
                  Basée sur les biens similaires dans votre secteur, nous estimons votre bien entre{' '} 
                  <span className="font-medium text-primary-900">
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

            <div className="space-y-6">
              {/* Error Messages */}
              {imageErrors.length > 0 && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="w-5 h-5 text-danger-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-danger-800 mb-2">Erreurs de téléchargement :</h4>
                      <ul className="text-sm text-danger-700 space-y-1">
                        {imageErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-default-300 rounded-xl p-8 lg:p-12 text-center hover:border-primary-400 transition-colors text-foreground">
                <CloudArrowUpIcon className="w-12 h-12 text-default-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-default-900 mb-2">
                  {selectedFiles.length === 0 ? 'Ajoutez vos photos' : `${selectedFiles.length}/4 photos ajoutées`}
                </h3>
                <p className="text-default-600 mb-4">
                  Glissez vos photos ici ou cliquez pour sélectionner des fichiers
                </p>
                <p className="text-sm text-default-500 mb-4">
                  Maximum 4 images • 5MB par image • Formats acceptés: JPG, PNG, WebP
                </p>
                
                <input
                  type="file"
                  id="property-images"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={selectedFiles.length >= 4}
                />
                <label htmlFor="property-images">
                  <Button 
                    as="span" 
                    variant="bordered" 
                    isDisabled={selectedFiles.length >= 4}
                    className="cursor-pointer"
                  >
                    <CameraIcon className="w-4 h-4 mr-2" />
                    {selectedFiles.length >= 4 ? 'Limite atteinte' : 'Choisir des photos'}
                  </Button>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-default-900">Photos sélectionnées</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-default-200 hover:border-primary-300 transition-colors">
                          <Image
                            src={preview.previewUrl}
                            alt={`Preview ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-danger-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-600"
                          title="Supprimer cette image"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {index === 0 ? 'Principal' : `Image ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-default-600">
                    La première image sera utilisée comme photo principale de votre annonce.
                  </p>
                </div>
              )}

              {/* Tips */}
              <div className="bg-primary-50 p-6 rounded-xl border border-primary-200">
                <h3 className="font-medium text-primary-900 mb-2">Conseils pour de belles photos</h3>
                <ul className="text-sm text-primary-800 space-y-1">
                  <li>• Prenez des photos en haute résolution et bien éclairées</li>
                  <li>• Privilégiez la lumière naturelle pour un rendu optimal</li>
                  <li>• Montrez les pièces principales et les atouts du bien</li>
                  <li>• Incluez des vues extérieures si possible (façade, jardin, balcon)</li>
                  <li>• Évitez les photos floues ou mal cadrées</li>
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
              <p className="text-default-600 mb-6">Ces informations seront visibles par les personnes intéressées</p>
            </div>

            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  isSelected={formData.useUserContact}
                  onValueChange={(checked) => handleInputChange('useUserContact', checked)}
                > 
                  Utiliser mes informations de contact
                </Checkbox>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    id="contactFirstName"
                    label="Prénom"
                    labelPlacement="outside"
                    placeholder="Prénom"
                    size="lg"
                    variant="bordered"
                    radius="lg"
                    value={formData.contactFirstName}
                    onChange={(e) => handleInputChange('contactFirstName', e.target.value)}
                    isDisabled={formData.useUserContact}
                  />
                </div>
                <div>
                  <Input
                    id="contactLastName"
                    label="Nom"
                    labelPlacement="outside"
                    placeholder="Nom"
                    size="lg"
                    variant="bordered"
                    radius="lg"
                    value={formData.contactLastName}
                    onChange={(e) => handleInputChange('contactLastName', e.target.value)}
                    isDisabled={formData.useUserContact}
                  />
                </div>
              </div>

              <div>
                <Input
                  id="contactEmail"
                  label="Adresse email"
                  labelPlacement="outside"
                  variant="bordered"
                  radius="lg"
                  size="lg"
                  type="email"
                  placeholder="Email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  isDisabled={formData.useUserContact}
                />
              </div>

              <div>
                <Input
                  id="contactPhone"
                  label="Numéro de téléphone"
                  labelPlacement="outside"
                  variant="bordered"
                  radius="lg"
                  size="lg"
                  type="tel"
                  placeholder="66000000"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  isDisabled={formData.useUserContact}
                />
              </div>

              <div className="bg-success-50 p-6 rounded-xl border border-success-200">
                <h3 className="font-medium text-success-900 mb-2">Votre annonce est prête !</h3>
                <p className="text-sm text-success-800">
                  Elle sera mise en ligne après validation par notre équipe (sous 24h).
                </p>
              </div>

              {/* Submit Status Messages */}
              {submitError && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="w-5 h-5 text-danger-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-danger-800 mb-1">Erreur</h4>
                      <p className="text-sm text-danger-700">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              {submitSuccess && (
                <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-success-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-success-800 mb-1">Succès !</h4>
                      <p className="text-sm text-success-700">
                        Votre annonce a été créée avec succès. Redirection en cours...
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="lg:w-72 xl:w-80 flex-shrink-0">
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
          <Card className="mb-8 text-foreground max-w-none">
            <CardBody className="p-6 lg:p-8 xl:p-10">
              {renderStepContent()}
            </CardBody>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="bordered"
              onClick={prevStep}
              isDisabled={currentStep === 1}
              className="px-8 py-3"
              size="lg"
              radius="lg"
            >
              Précédent
            </Button>
            
            {currentStep === steps.length ? (
              <Button color="success" className="px-8">
                <Button 
                  color="success" 
                  className="px-8 py-3"
                  size="lg"
                  radius="lg"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting || submitSuccess}
                >
                  {isSubmitting ? 'Publication en cours...' : submitSuccess ? 'Annonce publiée !' : 'Publier l\'annonce'}
                </Button>
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                isDisabled={
                  (currentStep === 1 && (!propertyType || !transactionType)) ||
                  (currentStep === 2 && (!formData.city)) ||
                  (currentStep === 3 && (!formData.area || !formData.description)) ||
                  (currentStep === 4 && !formData.price) ||
                  (currentStep === 6 && (!formData.contactFirstName || !formData.contactEmail || !formData.contactPhone))
                }
                color="primary"
                className="px-8 py-3"
                size="lg"
                radius="lg"
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