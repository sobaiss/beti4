'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon, 
  PencilIcon, 
  EyeIcon, 
  TrashIcon, 
  EllipsisVerticalIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { 
  Button, 
  Card, 
  CardBody, 
  Chip, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem 
} from '@heroui/react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { Property } from '@/types/property';
import { deleteUserProperty, getProperties } from '@/lib/actions/property';

export default function MesAnnoncesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  // Fetch user's properties
  useEffect(() => {
    const fetchUserProperties = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await getProperties({ owner: session.user.id });

        if ('errors' in response) {
          setError('Erreur lors du chargement de vos annonces');
        }

        setProperties(response.properties || []);
      } catch (error) {
        console.error('Error fetching user properties:', error);
        setError('Erreur lors du chargement de vos annonces');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, [session?.user?.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'disponible': { label: 'Disponible', color: 'success' as const },
      'brouillon': { label: 'Brouillon', color: 'default' as const },
      'vendu': { label: 'Vendu', color: 'danger' as const },
      'loue': { label: 'Loué', color: 'warning' as const },
      'desactive': { label: 'Désactivé', color: 'default' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.disponible;
    
    return (
      <Chip color={config.color} variant="solid" size="sm">
        {config.label}
      </Chip>
    );
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!session?.user?.id) {
      // @todo add modal
      return;
    }
    // @todo add modal
    // if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    try {
      const response = await deleteUserProperty(propertyId, session.user.id);

      if (response.ok) {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
      } else {
        alert('Erreur lors de la suppression de l\'annonce');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Erreur lors de la suppression de l\'annonce');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md">
                  <div className="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-default-900 mb-2">Mes Annonces</h1>
            <p className="text-default-600">
              Gérez vos {properties.length} annonce{properties.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-blue-900 hover:bg-blue-800">
            <Link href="/deposer-une-annonce">
              <PlusIcon className="w-4 h-4 mr-2" />
              Nouvelle Annonce
            </Link>
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-danger-200 bg-danger-50">
            <CardBody className="p-4">
              <p className="text-red-600">{error}</p>
            </CardBody>
          </Card>
        )}

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <Card className="text-center py-12">
            <CardBody>
              <div className="text-gray-500 mb-4">
                <HomeIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">Aucune annonce</h3>
                <p>Vous n'avez pas encore créé d'annonce.</p>
              </div>
              <Button color="primary">
                <Link href="/deposer-une-annonce">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Créer ma première annonce
                </Link>
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const firstImage = property.images && property.images.length > 0 
                ? property.images[0] 
                : { 
                    url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg', 
                    alt: `${property.title} - Vue principale`,
                    id: 'placeholder',
                    order: 0,
                    createdAt: new Date(),
                    propertyId: property.id
                  };

              return (
                <Card key={property.id} className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all">
                  <div className="relative">
                    <div className="aspect-[4/3] overflow-hidden">
                      <Image
                        src={firstImage.url}
                        alt={firstImage.alt || `${property.title} - ${property.location}`}
                        width={400}
                        height={300}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      {getStatusBadge(property.status)}
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-4 right-4">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            variant="light"
                            size="sm"
                            className="bg-white/90 hover:bg-white rounded-full p-2"
                            isIconOnly
                          >
                            <EllipsisVerticalIcon className="w-4 h-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem key="view">
                            <Link href={`/annonce/${property.id}`} className="flex items-center w-full">
                              <EyeIcon className="w-4 h-4 mr-2" />
                              Voir l'annonce
                            </Link>
                          </DropdownItem>
                          <DropdownItem key="edit">
                            <Link href={`/edit-property/${property.id}`} className="flex items-center w-full">
                              <PencilIcon className="w-4 h-4 mr-2" />
                              Modifier
                            </Link>
                          </DropdownItem>
                          <DropdownItem 
                            key="delete"
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-danger"
                          >
                            <div className="flex items-center">
                              <TrashIcon className="w-4 h-4 mr-2" />
                              Supprimer
                            </div>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>

                    {/* Transaction Type Badge */}
                    <div className="absolute bottom-4 left-4">
                      <Chip color={property.transactionType === 'achat' ? 'primary' : 'secondary'} 
                            variant="solid" size="sm">
                        {property.transactionType === 'achat' ? 'À Vendre' : 'À Louer'}
                      </Chip>
                    </div>
                  </div>

                  <CardBody className="p-6">
                    <div className="space-y-3 text-foreground">
                      {/* Price */}
                      <div className="text-2xl font-bold text-blue-900">
                        {formatPrice(property.price)}
                        {property.transactionType === 'location' && 
                          <span className="text-sm text-gray-500">/mois</span>}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-lg text-default-900 line-clamp-2 leading-tight">
                        {property.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center text-default-600 text-sm">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        <span className="truncate">{property.location}</span>
                      </div>

                      {/* Property Details */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-1 border border-gray-400"></div>
                            <span>{property.area}m²</span>
                          </div>
                          <div className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-1" />
                            <span>{property.bedrooms}</span>
                          </div>
                          {property.bathrooms && (
                            <div className="flex items-center">
                              <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                              <span>{property.bathrooms}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Creation Date and Views */}
                      <div className="flex items-center justify-between text-xs text-default-500 pt-2 border-t border-content4">
                        <div className="flex items-center">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          <span>Créé le {formatDate(property.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <EyeIcon className="w-3 h-3 mr-1" />
                          <span>{property.views || 0} vues</span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="bordered" size="sm" className="flex-1">
                          <Link href={`/annonce/${property.id}`}>
                            <EyeIcon className="w-4 h-4 mr-1" />
                            Voir
                          </Link>
                        </Button>
                        <Button variant="bordered" size="sm" className="flex-1">
                          <Link href={`/edit-property/${property.id}`}>
                            <PencilIcon className="w-4 h-4 mr-1" />
                            Modifier
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}