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
  DatePicker,
  RadioGroup,
  Radio,
} from '@heroui/react';
import Link from 'next/link';
import Image from 'next/image';
import { Location, LocationHierarchy } from '@/types/location';
import { getCachedLocations } from '@/lib/utils/location-cache';
import { convertFileToBase64 } from '@/lib/files/files';
import { createProperty } from '@/lib/actions/property';
import { generatePropertyReference } from '@/lib/utils/property-reference';
import AutocompleteLocation from '@/ui/components/AutocompleteLocation';
import { getLocationHierarchy } from '@/lib/utils/location-filter';
import { set } from 'zod';
import { Amenity } from '@/types/property';
import { getCachedAmenities } from '@/lib/utils/amenity-cache';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { CURRENCY, rateTypesConfig } from '@/lib/config';

export default function DeposerUneAnnonceView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyType, setPropertyType] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [cityMap, setCityMap] = useState<Location[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<{ file: File, previewUrl: string }[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [locationHierarchy, setLocationHierarchy] = useState<LocationHierarchy | null>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [amenitiesGroup, setAmenitiesGroup] = useState<Record<string, Amenity[]>>({});
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    rate: 'unique',
    availableAt: '',
    location: '',
    address: '',
    zipCode: '',
    borough: '',
    neighborhood: '',
    department: '',
    city: '',
    region: '',
    area: '',
    landArea: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    totalFloors: '',
    yearBuilt: '',
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
        contactFirstName: session.user.firstName || prev.contactFirstName,
        contactLastName: session.user.lastName || prev.contactLastName,
        contactEmail: session.user.email || prev.contactEmail,
        contactPhone: session.user.phone || prev.contactPhone
      }));
    }
  }, [session, status, router]);

    // Track property view on component mount
  useEffect(() => {
    (async () => {
      const locations = await getCachedLocations();
      const cities = locations.filter(location => location.divisionLevel >= 3);
      setCityMap(cities);

      const amenitiesData = await getCachedAmenities();
      setAmenities(amenitiesData);
      const amenitiesByGroup = amenitiesData.reduce((acc: Record<string, Amenity[]>, amenity) => {
        if (!acc[amenity.category]) {
          acc[amenity.category] = [];
        }
        acc[amenity.category].push({ id: amenity.id, name: amenity.name, category: amenity.category });
        return acc;
      }, {});
      setAmenitiesGroup(amenitiesByGroup);
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
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        type: propertyType as any,
        zipCode: formData.zipCode,
        transactionType: transactionType as any,
        status: 'brouillon' as any
      });

      // Prepare property data
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        rate: formData.rate as any,
        availableAt: formData.availableAt ? new Date(formData.availableAt) : undefined,
        location: formData.location,
        address: formData.address,
        zipCode: formData.zipCode,
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
        amenities: selectedAmenities.map(amenityId => ({ amenityId, amenityCount: 1 }))
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

  const handleLocationInputChange = (field: string, value: string | boolean) => {
    console.log(`Field changed: ${field}, New value: ${value}`);
    getLocationHierarchy(value as string).then(hierarchy => {
      setLocationHierarchy(hierarchy);
      if (!hierarchy) {
        return;
      }

      console.log('Location hierarchy:', hierarchy);

      setFormData(prev => ({
        ...prev,
        region: hierarchy.region?.displayName || '',
        department: hierarchy.department?.displayName || '',
        city: hierarchy.city?.displayName || '',
        borough: hierarchy.borough?.displayName || '',
        neighborhood: hierarchy.neighborhood?.displayName || '',
        zipCode: hierarchy.selected?.zip || '',
        location: value as string
      }));
    });
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <HomeIcon className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-default-900 mb-4">Quel type de bien souhaitez-vous mettre en ligne ?</h2>
              <p className="text-lg text-default-600 leading-relaxed">Sélectionnez le type de transaction et le type de bien pour commencer votre annonce</p>
            </div>

            <div className="space-y-10">
              {/* Transaction Type Section */}
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-default-900 mb-2">Type de transaction</h3>
                  <p className="text-default-600">Choisissez si vous souhaitez vendre ou louer votre bien</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <Button
                    onPress={() => setTransactionType('achat')}
                    size="lg"
                    radius="lg"
                    variant={transactionType === 'achat'
                      ? 'solid'
                      : 'faded'
                    }
                    color={transactionType === 'achat'
                      ? 'primary'
                      : 'default'
                    }
                    className={`h-auto p-6 transition-all duration-300 ${
                      transactionType === 'achat' 
                        ? 'shadow-lg scale-105 border-2 border-primary-300' 
                        : 'hover:shadow-md hover:scale-102 border border-default-200'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <CurrencyEuroIcon className="w-6 h-6 text-orange-600" />
                      </div>
                      <span className="font-bold text-xl block mb-2">Vendre</span>
                      <span className="text-sm opacity-90 font-medium">Je souhaite vendre mon bien</span>
                    </div>
                  </Button>
                  <Button
                    onPress={() => setTransactionType('location')}
                    size="lg"
                    radius="lg"
                    variant={transactionType === 'location'
                      ? 'solid'
                      : 'faded'
                    }
                    color={transactionType === 'location'
                      ? 'primary'
                      : 'default'
                    }
                    className={`h-auto p-6 transition-all duration-300 ${
                      transactionType === 'location' 
                        ? 'shadow-lg scale-105 border-2 border-primary-300' 
                        : 'hover:shadow-md hover:scale-102 border border-default-200'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <HomeIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="font-bold text-xl block mb-2">Louer</span>
                      <span className="text-sm opacity-90 font-medium">Je souhaite louer mon bien</span>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Property Type Section */}
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-default-900 mb-2">Type de bien</h3>
                  <p className="text-default-600">Sélectionnez la catégorie qui correspond à votre propriété</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {[
                    { value: 'terrain', label: 'Terrain', icon: <MapPinIcon className="w-8 h-8" />, color: 'from-green-100 to-green-200', iconColor: 'text-green-600' },
                    { value: 'maison', label: 'Maison', icon: <HomeIcon className="w-8 h-8" />, color: 'from-blue-100 to-blue-200', iconColor: 'text-blue-600' },
                    { value: 'villa', label: 'Villa', icon: <BuildingOffice2Icon className="w-8 h-8" />, color: 'from-purple-100 to-purple-200', iconColor: 'text-purple-600' },
                    { value: 'appartement', label: 'Appartement', icon: <HomeModernIcon className="w-8 h-8" />, color: 'from-indigo-100 to-indigo-200', iconColor: 'text-indigo-600' },
                    { value: 'terrain_agricole', label: 'Terrain Agricole', icon: <PhotoIcon className="w-8 h-8" />, color: 'from-yellow-100 to-yellow-200', iconColor: 'text-yellow-600' },
                    { value: 'immeuble', label: 'Immeuble', icon: <BuildingOfficeIcon className="w-8 h-8" />, color: 'from-gray-100 to-gray-200', iconColor: 'text-gray-600' },
                    { value: 'bureau_commerce', label: 'Bureaux & Commerces', icon: <BriefcaseIcon className="w-8 h-8" />, color: 'from-orange-100 to-orange-200', iconColor: 'text-orange-600' }
                  ].map((type) => (
                    <Card
                      key={type.value}
                      isPressable
                      onPress={() => setPropertyType(type.value)}
                      className={`transition-all duration-300 cursor-pointer ${
                        propertyType === type.value 
                          ? 'scale-105 shadow-lg border-2 border-primary-300 bg-gradient-to-br from-primary-50 to-primary-100' 
                          : 'hover:scale-102 hover:shadow-md border border-default-200 bg-white hover:bg-default-50'
                      }`}
                    >
                      <CardBody className="p-6 text-center">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-sm`}>
                          <div className={type.iconColor}>{type.icon}</div>
                        </div>
                        <div className="font-semibold text-sm text-default-900 leading-tight">{type.label}</div>
                        {propertyType === type.value && (
                          <div className="mt-2">
                            <CheckIcon className="w-5 h-5 text-primary-600 mx-auto" />
                          </div>
                        )}
                      </CardBody>
                    </Card>
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
              <div className="space-y-4">
                <div>
                  <AutocompleteLocation
                    allowsCustomValue={false}
                    locations={cityMap}
                    selectedLocation={formData.location}
                    setSelectedLocation={(value) => handleLocationInputChange('location', value)}
                    label="Localisation *"
                    placeholder="Rechercher une ville, un quartier, un arrondissement..."
                  />
                </div>

                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-default-700 mb-2">Région</label>
                  <Input
                    isDisabled
                    id="region"
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-default-700 mb-2">Département</label>
                  <Input
                    isDisabled
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                  />
                </div>

                <div>
                  <label htmlFor="borough" className="block text-sm font-medium text-default-700 mb-2">Arrondissement</label>
                  <Input
                    isDisabled={!!locationHierarchy?.borough}
                    id="borough"
                    value={formData.borough}
                    onChange={(e) => handleInputChange('borough', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                  />
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-default-700 mb-2">Code postal</label>
                  <Input
                    isDisabled
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-default-700 mb-2">Ville *</label>
                  <Input
                    isDisabled
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                  />
                </div>

                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-default-700 mb-2">Quartier</label>
                  <Input
                    isDisabled={!!locationHierarchy?.neighborhood}
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-default-700 mb-2">Adresse / indications (optionnelle)</label>
                <Input
                  id="address"
                  placeholder="Près rond-point, à côté de..."
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  size="lg"
                  variant="bordered"
                  radius="lg"
                />
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
              <div>
                <label htmlFor="title" className="text-sm font-medium text-default-700 mb-2">Titre de l'annonce *</label>
                <Input
                  id="title"
                  placeholder="Ex: Bel appartement lumineux avec balcon"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  size="lg"
                  variant="bordered"
                  radius="lg"
                  isRequired
                />
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium text-default-700 mb-2">Description du bien *</label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre bien, ses atouts, son environnement..."
                  minRows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  size="lg"
                  variant="bordered"
                  radius="lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="floor" className="text-sm font-medium text-default-700 mb-2">Étage</label>
                  <Input
                    id="floor"
                    type="number"
                    value={formData.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                    min={0}
                  />
                </div>
                <div>
                  <label htmlFor="yearBuilt" className="text-sm font-medium text-default-700 mb-2">Année de construction</label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                    min={1900}
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="area" className="text-sm font-medium text-default-700 mb-2">Surface (m²)</label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                    min={0}
                    endContent={<span className="text-default-400">m²</span>}
                  />
                </div>
                <div>
                  <label htmlFor="landArea" className="text-sm font-medium text-default-700 mb-2">Surface du terrain (m²)</label>
                  <Input
                    id="landArea"
                    type="number"
                    value={formData.landArea}
                    onChange={(e) => handleInputChange('landArea', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                    min={0}
                    endContent={<span className="text-default-400">m²</span>}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="rooms" className="text-sm font-medium text-default-700 mb-2">Nombre de pièces</label>
                  <Input
                    id="rooms"
                    type="number"
                    value={formData.rooms}
                    onChange={(e) => handleInputChange('rooms', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                    min={0}
                    startContent={<HomeIcon className="w-4 h-4 text-default-400" />}
                  />
                </div>
                <div>
                  <label htmlFor="bedrooms" className="text-sm font-medium text-default-700 mb-2">Nombre de chambres</label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                    min={0}
                    startContent={<BuildingOfficeIcon className="w-4 h-4 text-default-400" />}
                  />
                </div>
                <div>
                  <label htmlFor="bathrooms" className="text-sm font-medium text-default-700 mb-2">Nombre de salles de bain</label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    size="lg"
                    variant="bordered"
                    radius="lg"
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-default-900 flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-primary-600" />
                  Caractéristiques
                </h4>
                <Card className="p-4 bg-content1">
                  <CardBody className="p-0">
                    <div className="space-y-6">
                      {Object.keys(amenitiesGroup).map((category) => (
                        <div key={category} className="space-y-3">
                          <h5 className="text-base font-semibold text-default-800 flex items-center gap-2">
                            <GlobeAltIcon className="w-4 h-4 text-success-600" />
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {amenitiesGroup[category].map((amenity) => (
                              <div key={amenity.id} className="flex items-center space-x-2 p-2 rounded-lg hover:border-default-300 transition-colors">
                                <Checkbox
                                  size="sm"
                                  isSelected={selectedAmenities.includes(amenity.id)}
                                  onValueChange={(checked) => {
                                    if (checked) {
                                      setSelectedAmenities(prev => [...prev, amenity.id]);
                                    } else {
                                      setSelectedAmenities(prev => prev.filter(id => id !== amenity.id));
                                    }
                                  }}
                                >
                                  <span className="text-sm font-medium">{amenity.name}</span>
                                </Checkbox>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label htmlFor="price" className="text-lg font-medium block mb-2">
                    {transactionType === 'achat' ? 'Prix de vente' : 'Loyer'}
                  </label>
                  <div className="relative mt-2">
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      size="lg"
                      variant="bordered"
                      radius="lg"
                      classNames={{
                        input: "text-xl font-semibold"
                      }}
                      min={0}
                      endContent={<span className="text-default-400">{CURRENCY}</span>}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label htmlFor="rate" className="text-lg font-medium block mb-2">
                    Période
                  </label>
                  <Select
                    id="rate"
                    selectedKeys={formData.rate ? [formData.rate] : [transactionType === 'achat' ? 'unique' : 'mois']}
                    onSelectionChange={(keys) => handleInputChange('rate', Array.from(keys)[0] as string)}
                    placeholder="Sélectionner"
                    label=""
                    labelPlacement="outside"
                    size="lg"
                    variant="bordered"
                    radius="lg"
                    aria-label='Sélectionner la période'
                  >
                    {transactionType === 'location' ? (
                      <>
                        {rateTypesConfig.map((rate) => (
                          <SelectItem key={rate.value}>{rate.label}</SelectItem>
                        ))}
                      </>
                    ) : (
                      <>
                        <SelectItem key="unique">Unique</SelectItem>
                      </>
                    )}
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <label htmlFor="availableAt" className="text-lg font-medium block mb-2">
                  Disponible à partir de
                </label>
                <DatePicker
                  id="availableAt"
                  onChange={(date) => handleInputChange('availableAt', date ? date.toString().split('T')[0] : '')}
                  variant="bordered"
                  size="lg"
                  radius="lg"
                  label=""
                  labelPlacement="outside"
                  showMonthAndYearPickers
                  aria-label='Sélectionner une date de disponibilité'
                />
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
              <RadioGroup
                value={formData.useUserContact ? 'user' : 'new'}
                onValueChange={(value) => handleInputChange('useUserContact', value === 'user')}
                label="Informations de contact"
                className="mb-6"
              >
                <Radio value="user" size="lg">
                  Utiliser mes informations de contact
                </Radio>
                <Radio value="new" size="lg">
                  Utiliser un nouveau contact
                </Radio>
              </RadioGroup>

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
        {/* Sidebar - Enhanced Progress Steps */}
        <div className="lg:w-80 xl:w-96 flex-shrink-0">
          <Card className="sticky top-24 bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-xl">
            <CardHeader className="text-foreground pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DocumentTextIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-default-900">Progression</h3>
                  <p className="text-sm text-default-600">Étape {currentStep} sur {steps.length}</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-medium text-default-600 mb-2">
                  <span>Progression</span>
                  <span>{Math.round((currentStep / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-default-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  
                  return (
                    <div key={step.id} className="relative">
                      <div className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 shadow-sm' 
                          : isCompleted 
                            ? 'bg-gradient-to-r from-success-50 to-success-100 border border-success-200' 
                            : 'hover:bg-default-50 border border-transparent'
                      }`}>
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg' 
                            : isActive 
                              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg' 
                              : 'bg-default-100 text-default-400 border border-default-200'
                        }`}>
                          {isCompleted ? (
                            <CheckIcon className="w-6 h-6" />
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className={`text-sm font-semibold transition-colors ${
                            isActive ? 'text-primary-900' : isCompleted ? 'text-success-700' : 'text-default-500'
                          }`}>
                            Étape {step.id}
                          </div>
                          <div className={`text-sm font-medium transition-colors ${
                            isActive ? 'text-primary-700' : isCompleted ? 'text-success-600' : 'text-default-400'
                          }`}>
                            {step.title}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`ml-9 w-0.5 h-4 transition-colors duration-300 ${
                          isCompleted ? 'bg-gradient-to-b from-success-400 to-success-300' : 'bg-default-200'
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
                  (currentStep === 3 && (!formData.title || !formData.description)) ||
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