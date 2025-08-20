'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  PhoneIcon, 
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import { 
  Button, 
  Input, 
  Card,
  CardBody,
  Checkbox, 
  Divider,
} from '@heroui/react';
import Header from '@/components/Header';
import { UserService } from '@/lib/services/user';

export default function RegisterPage() {
  const emptyErrorMessages = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState(emptyErrorMessages);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agentLicense: '',
    acceptTerms: false,
    acceptMarketing: false,
    userType: 'particulier'
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessages(emptyErrorMessages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Handle submit');
    e.preventDefault();

    setIsLoading(true);
    setError('');
    setErrorMessages(emptyErrorMessages);

    try {
      const response = await UserService.createUser({
          ...formData,
      });

      if ('errors' in response) {
        const errors = {
          firstName: response.errors.firstName?.[0] || '',
          lastName: response.errors.lastName?.[0] || '',
          email: response.errors.email?.[0] || '',
          phone: response.errors.phone?.[0] || '',
          password: response.errors.password?.[0] || '',
          confirmPassword: response.errors.confirmPassword?.[0] || '',
        }

        setErrorMessages(errors);
        setError(response.message);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erreur lors de la création du compte');
        return;
      }

      router.push('/auth/signin');
      router.refresh();

      //   // Auto sign in after registration
      //   const result = await signIn('credentials', {
      //     email: formData.email,
      //     password: formData.password,
      //     redirect: false,
      //   });

      //   if (result?.ok) {
      //     router.push('/');
      //     router.refresh();
      //   } else {
      //     setError('Compte créé mais erreur de connexion. Veuillez vous connecter manuellement.');
      //   }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-900 hover:text-blue-800 mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-default-900 mb-3">
              Créer Votre Compte Beti
            </h1>
          <p className="text-xl text-default-600 max-w-2xl mx-auto mb-8">
              Rejoignez des milliers d'utilisateurs qui trouvent leur bien idéal
            </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardBody className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-md">
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-default-700">Prénom</label>
                  <Input
                    placeholder="Entrez votre prénom"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    isClearable
                    onClear={() => handleInputChange('firstName', '')}
                    errorMessage={errorMessages.firstName}
                    isInvalid={errorMessages.firstName !== ''}
                  />
                </div>
                <div className="space-y-2"> 
                  <label className="block text-sm font-medium text-default-700">Nom</label>
                  <Input
                    placeholder="Entrez votre nom"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    isClearable
                    onClear={() => handleInputChange('lastName', '')}
                    errorMessage={errorMessages.lastName}
                    isInvalid={errorMessages.lastName !== ''}
                  />
                </div>
              </div>

              <div className="space-y-2"> 
                <label className="block text-sm font-medium text-default-700">Adresse Email *</label>
                <Input
                  type="email"
                  placeholder="Entrez votre email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  startContent={<EnvelopeIcon className="w-4 h-4 text-default-400" />}
                  isRequired
                  isClearable
                  onClear={() => handleInputChange('email', '')}
                  errorMessage={errorMessages.email}
                  isInvalid={errorMessages.email !== '' }
                />

              </div>

              <div className="space-y-2"> 
                <label className="block text-sm font-medium text-default-700">Numéro de Téléphone *</label>
                <Input
                  type="tel"
                  placeholder="Entrez votre numéro de téléphone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  startContent={<PhoneIcon className="w-4 h-4 text-default-400" />}
                  isRequired
                  isClearable
                  onClear={() => handleInputChange('phone', '')}
                  errorMessage={errorMessages.phone}
                  isInvalid={errorMessages.phone !== ''}
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-default-700">Mot de Passe *</label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Créez un mot de passe"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    startContent={<LockClosedIcon className="w-4 h-4 text-default-400" />}

                    isRequired
                    isClearable
                    onClear={() => handleInputChange('password', '')}
                    errorMessage={errorMessages.password}
                    isInvalid={errorMessages.password !== ''}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-default-700">Confirmer le Mot de Passe *</label>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    startContent={<LockClosedIcon className="w-4 h-4 text-default-400" />}

                    isRequired
                    isClearable
                    onClear={() => handleInputChange('confirmPassword', '')}
                    errorMessage={errorMessages.confirmPassword}
                    isInvalid={errorMessages.confirmPassword !== ''}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    isSelected={formData.acceptTerms}
                    onValueChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                    isRequired
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
                    isSelected={formData.acceptMarketing}
                    onValueChange={(checked) => handleInputChange('acceptMarketing', checked as boolean)}
                  > 
                    Je souhaite recevoir des communications marketing et des mises à jour de biens
                  </Checkbox>
                </div>
              </div>

              <Button 
                type="submit" 
                color="primary"
                className="w-full"
                isDisabled={isLoading || !formData.acceptTerms}
                isLoading={isLoading}
              >
                {isLoading ? 'Création du Compte...' : 'Créer un Compte'}
              </Button>
            </form>

            <div className="relative">
              <Divider />
              <div className="absolute inset-0 flex items-center justify-center text-default-500">
                <span className="bg-background px-2 text-sm">ou</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="bordered" 
                className="w-full"
                onClick={() => signIn('google', { callbackUrl: '/' })}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                S'inscrire avec Google
              </Button>
              
              <Button 
                variant="bordered" 
                className="w-full"
                onClick={() => signIn('facebook', { callbackUrl: '/' })}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                S'inscrire avec Facebook
              </Button>
            </div>

            <div className="text-center">
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