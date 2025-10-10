'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  PhoneIcon, 
  ArrowLeftIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { 
  Button, 
  Input, 
  Card,
  CardBody,
  Checkbox, 
  Textarea,
  Progress
} from '@heroui/react';
import Header from '@/components/Header';
import { createAgency } from '@/lib/actions/agency';
import { createAgencySchema } from '@/lib/validations/agency';
import { z } from 'zod';
import { UserTypeEnum } from '@/types/user';
import AutocompleteLocation from '@/ui/components/AutocompleteLocation';
import { Location } from '@/types/location';
import { getCachedLocations } from '@/lib/utils/location-cache';
import { getLocationHierarchy } from '@/lib/utils/location-filter';

export default function RegisterAgencyPage() {
  const emptyErrorMessages = {
    // Agency errors
    agencyName: '',
    agencyDescription: '',
    agencyAddress: '',
    agencyLocation: '',
    agencyCity: '',
    agencyZipCode: '',
    agencyPhone: '',
    agencyEmail: '',
    agencyWebsite: '',
    // User errors
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    city: '',
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState(emptyErrorMessages);
  const [cityMap, setCityMap] = useState<Location[]>([]);
  const router = useRouter();
  
  const [agencyData, setAgencyData] = useState({
    name: '',
    description: '',
    address: '',
    location: '',
    city: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
  });

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptMarketing: false,
    userType: UserTypeEnum.professionnel,
    location: '',
    city: '',
  });

  useEffect(() => {
    (async () => {
      const locations = await getCachedLocations();
      const cities = locations.filter(location => location.divisionLevel >= 3);
      setCityMap(cities);

    })();
  }, []);

  const handleAgencyInputChange = (field: string, value: string) => {
    setAgencyData(prev => ({ ...prev, [field]: value }));
    setErrorMessages(emptyErrorMessages);
  };

  const handleUserInputChange = (field: string, value: string | boolean) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    setErrorMessages(emptyErrorMessages);
  };


  const handleLocationInputChange = (field: string, value: string | boolean) => {
    console.log(`Field changed: ${field}, New value: ${value}`);
    setAgencyData(prev => ({ ...prev, city: '', location: '' }));

    getLocationHierarchy(value as string).then(hierarchy => {
      if (!hierarchy) {
        return;
      }

      setAgencyData(prev => ({
        ...prev,
        location: value as string,
        city: hierarchy.city?.displayName || '',
        zipCode: hierarchy.selected?.zip || '',
      }));

      setUserData(prev => ({
        ...prev,
        location: value as string,
        city: hierarchy.city?.displayName || '',
      }));

      setErrorMessages(emptyErrorMessages);
    });
  };

  const nextStep = () => {
    // Validate agency data before moving to step 2
    if (currentStep === 1) {
      const validatedFields = createAgencySchema.safeParse(agencyData);
      console.log('Agency validation result:', validatedFields.success);
    
      if (!validatedFields.success) {
        console.log('Agency validation errors:', z.flattenError(validatedFields.error).fieldErrors);

        const errors = { ...emptyErrorMessages };
        for (const [field, messages] of Object.entries(z.flattenError(validatedFields.error).fieldErrors)) {
          if (Array.isArray(messages)) {
            errors[field as keyof typeof emptyErrorMessages] = messages[0];
          }
        }

        setError('Veuillez corriger les erreurs ci-dessous.');

        return;
      }
    }

    console.log('Moving to step 2 with agency data:', agencyData);
    setCurrentStep(2);
    setError('');
  };

  const prevStep = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      nextStep();
      return;
    }

    setIsLoading(true);
    setError('');
    setErrorMessages(emptyErrorMessages);

    try {
      // First create the agency
      const agencyResponse = await createAgency({agency: agencyData, user: userData});

      if ('errors' in agencyResponse) {
        console.log('Agency creation errors:', agencyResponse.errors);

        const errors = { ...emptyErrorMessages };
        for (const [field, messages] of Object.entries(agencyResponse.errors)) {
          if (Array.isArray(messages)) {
            errors[field as keyof typeof emptyErrorMessages] = messages[0];
          }
        }

        setErrorMessages(errors);
        setError(agencyResponse.message);
        return;
      }

      // Redirect to sign in page with success message
      router.push('/auth/signin?message=Agence et compte créés avec succès');
      router.refresh();

    } catch (error) {
      console.error('Registration error:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <BuildingOfficeIcon className="w-10 h-10 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-default-900 mb-3">Informations de l'Agence</h2>
            <p className="text-lg text-default-600 max-w-md mx-auto">Créez le profil de votre agence immobilière et rejoignez notre réseau de professionnels</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-default-700">Nom de l'agence *</label>
              <Input
                placeholder="Nom de votre agence"
                value={agencyData.name}
                onChange={(e) => handleAgencyInputChange('name', e.target.value)}
                startContent={<BuildingOfficeIcon className="w-4 h-4 text-default-400" />}
                isRequired
                size="lg"
                variant="bordered"
                radius="lg"
                isClearable
                onClear={() => handleAgencyInputChange('name', '')}
                errorMessage={errorMessages.agencyName}
                isInvalid={errorMessages.agencyName !== ''}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-default-700">Description</label>
              <Textarea
                placeholder="Décrivez votre agence, vos services, votre expertise..."
                value={agencyData.description}
                onChange={(e) => handleAgencyInputChange('description', e.target.value)}
                minRows={3}
                size="lg"
                variant="bordered"
                radius="lg"
                errorMessage={errorMessages.agencyDescription}
                isInvalid={errorMessages.agencyDescription !== ''}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-default-700">Localisation</label>
              <AutocompleteLocation
                isRequired={true}
                allowsCustomValue={false}
                locations={cityMap}
                selectedLocation={agencyData.location}
                setSelectedLocation={(value) => handleLocationInputChange('location', value)}
                label=""
                placeholder="Rechercher une ville, un quartier, un arrondissement..."
                errorMessage={errorMessages.agencyLocation}
                isInvalid={errorMessages.agencyLocation !== ''}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-default-700">Adresse</label>
              <Input
                placeholder="Adresse complète de l'agence"
                value={agencyData.address}
                onChange={(e) => handleAgencyInputChange('address', e.target.value)}
                startContent={<MapPinIcon className="w-4 h-4 text-default-400" />}
                size="lg"
                variant="bordered"
                radius="lg"
                isClearable
                onClear={() => handleAgencyInputChange('address', '')}
                errorMessage={errorMessages.agencyAddress}
                isInvalid={errorMessages.agencyAddress !== ''}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-default-700">Ville</label>
                <Input
                  isDisabled
                  placeholder="Ville"
                  value={agencyData.city}
                  onChange={(e) => handleAgencyInputChange('city', e.target.value)}
                  isRequired
                  size="lg"
                  variant="bordered"
                  radius="lg"
                  onClear={() => handleAgencyInputChange('city', '')}
                  errorMessage={errorMessages.agencyCity}
                  isInvalid={errorMessages.agencyCity !== ''}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-default-700">Code postal</label>
                <Input
                  isDisabled
                  placeholder="Code postal"
                  value={agencyData.zipCode}
                  onChange={(e) => handleAgencyInputChange('zipCode', e.target.value)}
                  size="lg"
                  variant="bordered"
                  radius="lg"
                  onClear={() => handleAgencyInputChange('zipCode', '')}
                  errorMessage={errorMessages.agencyZipCode}
                  isInvalid={errorMessages.agencyZipCode !== ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-default-700">Téléphone *</label>
                <Input
                  type="tel"
                  placeholder="Téléphone de l'agence"
                  value={agencyData.phone}
                  onChange={(e) => handleAgencyInputChange('phone', e.target.value)}
                  startContent={<PhoneIcon className="w-4 h-4 text-default-400" />}
                  isRequired
                  size="lg"
                  variant="bordered"
                  radius="lg"
                  isClearable
                  onClear={() => handleAgencyInputChange('phone', '')}
                  errorMessage={errorMessages.agencyPhone}
                  isInvalid={errorMessages.agencyPhone !== ''}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-default-700">Email *</label>
                <Input
                  type="email"
                  placeholder="Email de l'agence"
                  value={agencyData.email}
                  onChange={(e) => handleAgencyInputChange('email', e.target.value)}
                  startContent={<EnvelopeIcon className="w-4 h-4 text-default-400" />}
                  isRequired
                  size="lg"
                  variant="bordered"
                  radius="lg"
                  isClearable
                  onClear={() => handleAgencyInputChange('email', '')}
                  errorMessage={errorMessages.agencyEmail}
                  isInvalid={errorMessages.agencyEmail !== ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-default-700">Site web</label>
              <Input
                type="url"
                placeholder="https://www.votre-agence.com"
                value={agencyData.website}
                onChange={(e) => handleAgencyInputChange('website', e.target.value)}
                startContent={<GlobeAltIcon className="w-4 h-4 text-default-400" />}
                size="lg"
                variant="bordered"
                radius="lg"
                isClearable
                onClear={() => handleAgencyInputChange('website', '')}
                errorMessage={errorMessages.agencyWebsite}
                isInvalid={errorMessages.agencyWebsite !== ''}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <UserIcon className="w-10 h-10 text-secondary-600" />
          </div>
          <h2 className="text-3xl font-bold text-default-900 mb-3">Votre compte principal</h2>
          <p className="text-lg text-default-600 max-w-md mx-auto">Créez votre compte personnel pour gérer l'agence et ses annonces</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-default-700">Prénom *</label>
              <Input
                placeholder="Votre prénom"
                value={userData.firstName}
                onChange={(e) => handleUserInputChange('firstName', e.target.value)}
                isRequired
                size="lg"
                variant="bordered"
                radius="lg"
                isClearable
                onClear={() => handleUserInputChange('firstName', '')}
                errorMessage={errorMessages.firstName}
                isInvalid={errorMessages.firstName !== ''}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-default-700">Nom *</label>
              <Input
                placeholder="Votre nom"
                value={userData.lastName}
                onChange={(e) => handleUserInputChange('lastName', e.target.value)}
                isRequired
                size="lg"
                variant="bordered"
                radius="lg"
                isClearable
                onClear={() => handleUserInputChange('lastName', '')}
                errorMessage={errorMessages.lastName}
                isInvalid={errorMessages.lastName !== ''}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-default-700">Email *</label>
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={userData.email}
              onChange={(e) => handleUserInputChange('email', e.target.value)}
              startContent={<EnvelopeIcon className="w-4 h-4 text-default-400" />}
              isRequired
              size="lg"
              variant="bordered"
              radius="lg"
              isClearable
              onClear={() => handleUserInputChange('email', '')}
              errorMessage={errorMessages.email}
              isInvalid={errorMessages.email !== ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-default-700">Téléphone *</label>
            <Input
              type="tel"
              placeholder="Votre numéro de téléphone"
              value={userData.phone}
              onChange={(e) => handleUserInputChange('phone', e.target.value)}
              startContent={<PhoneIcon className="w-4 h-4 text-default-400" />}
              isRequired
              size="lg"
              variant="bordered"
              radius="lg"
              //isClearable
              //onClear={() => handleUserInputChange('phone', '')}
              errorMessage={errorMessages.phone}
              isInvalid={errorMessages.phone !== ''}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-default-700">Mot de passe *</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Créez un mot de passe"
                value={userData.password}
                onChange={(e) => handleUserInputChange('password', e.target.value)}
                startContent={<LockClosedIcon className="w-4 h-4 text-default-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-default-400 hover:text-default-600"
                  >
                    {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                }
                isRequired
                size="lg"
                variant="bordered"
                radius="lg"
                //isClearable
                //onClear={() => handleUserInputChange('password', '')}
                errorMessage={errorMessages.password}
                isInvalid={errorMessages.password !== ''}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-default-700">Confirmer le mot de passe *</label>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirmez votre mot de passe"
                value={userData.confirmPassword}
                onChange={(e) => handleUserInputChange('confirmPassword', e.target.value)}
                startContent={<LockClosedIcon className="w-4 h-4 text-default-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-default-400 hover:text-default-600"
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                }
                isRequired
                size="lg"
                variant="bordered"
                radius="lg"
                isClearable
                onClear={() => handleUserInputChange('confirmPassword', '')}
                errorMessage={errorMessages.confirmPassword}
                isInvalid={errorMessages.confirmPassword !== ''}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                isSelected={userData.acceptTerms}
                onValueChange={(checked) => handleUserInputChange('acceptTerms', checked as boolean)}
                isRequired
                size="lg"
              >
                J'accepte les{' '}
                <Link href="/terms" className="text-blue-900 hover:text-blue-800">
                  Conditions d'Utilisation
                </Link>{' '}
                et la{' '}
                <Link href="/privacy" className="text-blue-900 hover:text-blue-800">
                  Politique de Confidentialité
                </Link>
              </Checkbox>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                isSelected={userData.acceptMarketing}
                onValueChange={(checked) => handleUserInputChange('acceptMarketing', checked as boolean)}
                size="lg"
              >
                Je souhaite recevoir des communications marketing et des mises à jour
              </Checkbox>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/auth/register" className="inline-flex items-center text-blue-900 hover:text-blue-800 mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Retour au choix du type de compte
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-default-900 mb-3">
              Créer Votre Agence Immobilière
            </h1>
          <p className="text-xl text-default-600 max-w-2xl mx-auto mb-8">
              Rejoignez notre plateforme en tant que professionnel
            </p>
        </div>

        {/* Progress Bar - Outside Card */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <Progress 
              value={(currentStep / 2) * 100} 
              className="w-full mb-4"
              color="primary"
              size="lg"
              radius="full"
            />
            <div className="flex justify-between text-sm font-medium">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-primary-600' : 'text-default-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  currentStep >= 1 ? 'bg-primary-100 text-primary-600' : 'bg-default-100 text-default-400'
                }`}>
                  1
                </div>
                Agence
              </div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-primary-600' : 'text-default-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  currentStep >= 2 ? 'bg-primary-100 text-primary-600' : 'bg-default-100 text-default-400'
                }`}>
                  2
                </div>
                Administrateur
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/95">
          <CardBody className="p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-lg">
                  {error}
                </div>
              )}

              {renderStepContent()}

              <div className="flex justify-between pt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="bordered"
                    onClick={prevStep}
                    isDisabled={isLoading}
                    size="lg"
                    radius="full"
                    className="px-8"
                  >
                    Précédent
                  </Button>
                )}
                
                <Button 
                  type="submit" 
                  color="primary"
                  size="lg"
                  radius="full"
                  className={`px-8 font-semibold ${currentStep === 1 ? 'w-full' : 'ml-auto'}`}
                  isDisabled={
                    isLoading || 
                    (currentStep === 1 && (!agencyData.name || !agencyData.email || !agencyData.phone)) ||
                    (currentStep === 2 && (!userData.acceptTerms || !userData.firstName || !userData.lastName || !userData.email || !userData.phone || !userData.password || !userData.confirmPassword))
                  }
                  isLoading={isLoading}
                >
                  {isLoading 
                    ? 'Création en cours...' 
                    : currentStep === 1 
                      ? 'Suivant' 
                      : 'Créer l\'Agence et le Compte'
                  }
                </Button>
              </div>
            </form>

            <div className="text-center pt-6">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{' '}
                <Link href="/auth/signin" className="text-blue-900 hover:text-blue-800 font-medium">
                  Connectez-vous ici
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}