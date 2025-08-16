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
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import { Button, Input, Card, CardBody, CardHeader, Checkbox, Divider } from '@heroui/react';
import Header from '@/components/Header';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect');
      } else if (result?.ok) {
        // Redirect to home page
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-900 hover:text-blue-800 mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Se Connecter à Beti
              </h1>
              <p className="text-gray-600 mt-2">
                Accédez à votre compte pour gérer vos biens et recherches
              </p>
            </div>
          </CardHeader>

          <CardBody className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <Input
                type="email"
                label="Adresse Email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<EnvelopeIcon className="w-4 h-4 text-gray-400" />}
                isRequired
              />

              <Input
                type={showPassword ? 'text' : 'password'}
                label="Mot de Passe"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex items-center justify-between">
                <Checkbox
                  isSelected={rememberMe}
                  onValueChange={setRememberMe}
                  size="sm"
                >
                  Se souvenir de moi
                </Checkbox>
                <Link href="/auth/forgot-password" className="text-sm text-blue-900 hover:text-blue-800">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button 
                type="submit" 
                color="primary"
                className="w-full"
                isLoading={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se Connecter'}
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
                isDisabled={isLoading}
                startContent={
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                }
              >
                {isLoading ? 'Connexion...' : 'Continuer avec Google'}
              </Button>
              
              <Button 
                variant="bordered"
                className="w-full"
                onClick={() => signIn('facebook', { callbackUrl: '/' })}
                isDisabled={isLoading}
                startContent={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                }
              >
                {isLoading ? 'Connexion...' : 'Continuer avec Facebook'}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Vous n'avez pas de compte ?{' '}
                <Link href="/auth/register" className="text-blue-900 hover:text-blue-800 font-medium">
                  Inscrivez-vous ici
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}