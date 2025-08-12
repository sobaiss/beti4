'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button, Input, Card, CardBody, CardHeader } from '@heroui/react';
import Header from '@/components/Header';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/auth/signin" className="inline-flex items-center text-blue-900 hover:text-blue-800 mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Retour à la connexion
          </Link>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isSubmitted ? 'Vérifiez Votre Email' : 'Réinitialiser Votre Mot de Passe'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isSubmitted 
                ? 'Nous avons envoyé un lien de réinitialisation à votre adresse email'
                : 'Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe'
              }
            </p>
          </CardHeader>

          <CardBody>
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Nous avons envoyé un lien de réinitialisation à :
                  </p>
                  <p className="font-medium text-gray-900">{email}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou réessayez.
                  </p>
                  <Button 
                    variant="bordered" 
                    onClick={() => setIsSubmitted(false)}
                    className="w-full"
                  >
                    Essayer un Autre Email
                  </Button>
                  <Button color="primary" className="w-full">
                    <Link href="/auth/signin">Retour à la Connexion</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Adresse Email</label>
                  <Input
                    type="email"
                    placeholder="Entrez votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    startContent={<EnvelopeIcon className="w-4 h-4 text-gray-400" />}
                    isRequired
                  />
                </div>

                <Button 
                  type="submit" 
                  color="primary"
                  className="w-full"
                  isDisabled={isLoading}
                  isLoading={isLoading}
                >
                  {isLoading ? 'Envoi...' : 'Envoyer le Lien'}
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}