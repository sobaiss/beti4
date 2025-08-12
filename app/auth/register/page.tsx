'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon, 
  PhoneIcon, 
  BuildingOfficeIcon, 
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import { 
  Button, 
  Input, 
  Card, 
  CardContent, 
  CardHeader, 
  Checkbox, 
  RadioGroup, 
  Radio,
  Divider, 
  Textarea 
} from '@heroui/react';
import Header from '@/components/Header';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('particulier');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyDescription: '',
    agentLicense: '',
    acceptTerms: false,
    acceptMarketing: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto sign in after registration
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push('/');
          router.refresh();
        } else {
          setError('Compte créé mais erreur de connexion. Veuillez vous connecter manuellement.');
        }
      } else {
        setError(data.error || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-900 hover:text-blue-800 mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Créer Votre Compte Beti
            </h1>
            <p className="text-gray-600 mt-2">
              Rejoignez des milliers d'utilisateurs qui trouvent leur bien idéal
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-4">
              <label className="block text-base font-medium text-gray-900">Je suis :</label>
              <RadioGroup value={userType} onValueChange={setUserType} orientation="horizontal" className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                  <Radio value="particulier">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-2 text-blue-900" />
                      Particulier
                    </div>
                  </Radio>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                  <Radio value="professionnel">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="w-4 h-4 mr-2 text-blue-900" />
                      Professionnel
                    </div>
                  </Radio>
                </div>
              </RadioGroup>
            </div>

            <Divider />

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <Input
                    placeholder="Entrez votre prénom"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    isRequired
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <Input
                    placeholder="Entrez votre nom"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    isRequired
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Adresse Email</label>
                <Input
                  type="email"
                  placeholder="Entrez votre email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  startContent={<EnvelopeIcon className="w-4 h-4 text-gray-400" />}
                  isRequired
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Numéro de Téléphone</label>
                <Input
                  type="tel"
                  placeholder="Entrez votre numéro de téléphone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  startContent={<PhoneIcon className="w-4 h-4 text-gray-400" />}
                  isRequired
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mot de Passe</label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Créez un mot de passe"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    startContent={<LockClosedIcon className="w-4 h-4 text-gray-400" />}
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    }
                    isRequired
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Confirmer le Mot de Passe</label>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    startContent={<LockClosedIcon className="w-4 h-4 text-gray-400" />}
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    }
                    isRequired
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
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-sm text-gray-500">ou</span>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}