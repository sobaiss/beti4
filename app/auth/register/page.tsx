'use client';

import Link from 'next/link';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  ArrowLeftIcon, 
  CameraIcon
} from '@heroicons/react/24/outline';
import { 
  Card,
  CardBody,
  CardHeader,
  RadioGroup, 
  Radio,
  Divider,
  Button,
} from '@heroui/react';
import Header from '@/components/Header';

export default function RegisterPage() {

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

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-6">
            <h1 className="text-2xl font-bold text-default-900">
              Créer Votre Compte Beti
            </h1>
            <p className="text-default-600 mt-2">
              Rejoignez des milliers d'utilisateurs qui trouvent leur bien idéal
            </p>
          </CardHeader>

          <CardBody className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-4">
              <label className="block text-base font-medium text-default-900">Je suis :</label>
              <div className="flex gap-4 items-center">
                <Link href="/auth/register/particulier">
                  <Button color="primary" radius="full" size="lg" endContent={<CameraIcon />}>
                    Particulier
                  </Button>
                </Link>
                <Link href="/auth/register/professionnel">
                  <Button color="secondary" radius="full" size="lg" startContent={<UserIcon />} variant="bordered">
                    Professionnel
                  </Button>
                </Link>
              </div>
            </div>

            <Divider />

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