'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la connexion
          </Link>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isSubmitted ? 'Vérifiez Votre Email' : 'Réinitialiser Votre Mot de Passe'}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {isSubmitted 
                ? 'Nous avons envoyé un lien de réinitialisation à votre adresse email'
                : 'Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe'
              }
            </p>
          </CardHeader>

          <CardContent>
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
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
                    variant="outline" 
                    onClick={() => setIsSubmitted(false)}
                    className="w-full"
                  >
                    Essayer un Autre Email
                  </Button>
                  <Button asChild className="w-full bg-blue-900 hover:bg-blue-800">
                    <Link href="/auth/signin">Retour à la Connexion</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Entrez votre adresse email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-900 hover:bg-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? 'Envoi...' : 'Envoyer le Lien'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}