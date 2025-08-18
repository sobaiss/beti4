'use client';

import Link from 'next/link';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  ArrowLeftIcon,
  CheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { 
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip
} from '@heroui/react';
import Header from '@/components/Header';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-900 hover:text-blue-800 mb-6 transition-colors">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Rejoignez Beti
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choisissez le type de compte qui correspond à vos besoins et commencez à publier vos annonces immobilières
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Particulier Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            
            <CardHeader className="text-center pt-8 pb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <UserIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Particulier</h2>
              <p className="text-gray-600">
                Vendez ou louez votre bien immobilier en toute simplicité
              </p>
            </CardHeader>

            <CardBody className="pt-0 pb-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Publication d'annonces gratuite</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Gestion simple de vos biens</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Contact direct avec les acheteurs</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Outils de promotion intégrés</span>
                </div>
              </div>

              <div className="text-center mb-6">
                <Chip color="success" variant="flat" size="sm">
                  Recommandé pour les propriétaires
                </Chip>
              </div>

              <Link href="/auth/register/particulier" className="block">
                <Button 
                  color="primary" 
                  size="lg" 
                  className="w-full font-semibold"
                  startContent={<UserIcon className="w-5 h-5" />}
                >
                  Créer un Compte Particulier
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Agence Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            
            <CardHeader className="text-center pt-8 pb-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <BuildingOfficeIcon className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Agence Immobilière</h2>
              <p className="text-gray-600">
                Solution professionnelle pour les agents et agences immobilières
              </p>
            </CardHeader>

            <CardBody className="pt-0 pb-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Annonces illimitées</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Gestion multi-utilisateurs</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Outils de gestion avancés</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Statistiques détaillées</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <StarIcon className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                  <span>Badge "Professionnel Vérifié"</span>
                </div>
              </div>

              <div className="text-center mb-6">
                <Chip color="secondary" variant="flat" size="sm">
                  Pour les professionnels
                </Chip>
              </div>

              <Link href="/auth/register/agence" className="block">
                <Button 
                  color="secondary" 
                  size="lg" 
                  className="w-full font-semibold"
                  startContent={<BuildingOfficeIcon className="w-5 h-5" />}
                >
                  Créer un Compte Agence
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Beti ?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Publication Rapide</h4>
                <p className="text-sm text-gray-600">Créez et publiez vos annonces en quelques minutes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Large Audience</h4>
                <p className="text-sm text-gray-600">Touchez des milliers d'acheteurs potentiels</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Sécurisé</h4>
                <p className="text-sm text-gray-600">Plateforme sécurisée et données protégées</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link href="/auth/signin" className="text-blue-900 hover:text-blue-800 font-medium transition-colors">
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}