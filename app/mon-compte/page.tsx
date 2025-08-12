'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CameraIcon, 
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { 
  Button, 
  Input, 
  Textarea, 
  Card, 
  CardBody, 
  CardHeader, 
  Checkbox, 
  Divider, 
  Tabs, 
  Tab
} from '@heroui/react';
import Header from '@/components/Header';

export default function MonComptePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    acceptMarketing: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    acceptEmailContact: true,
    acceptPhoneContact: true,
    displayEmail: false,
    displayPhone: false
  });

  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newEmail: ''
  });

  // UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [messages, setMessages] = useState({
    personal: '',
    privacy: '',
    security: ''
  });
  const [errors, setErrors] = useState({
    personal: '',
    privacy: '',
    security: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        
        // Load user info
        const userResponse = await fetch(`/api/users/${session.user.id}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setPersonalInfo({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            avatar: userData.avatar || '',
            acceptMarketing: userData.acceptMarketing || false
          });
        }

        // Load user settings
        const settingsResponse = await fetch(`/api/users/${session.user.id}/settings`);
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setPrivacySettings({
            acceptEmailContact: settingsData.acceptEmailContact ?? true,
            acceptPhoneContact: settingsData.acceptPhoneContact ?? true,
            displayEmail: settingsData.displayEmail ?? false,
            displayPhone: settingsData.displayPhone ?? false
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setErrors(prev => ({ ...prev, personal: 'Erreur lors du chargement des données' }));
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [session?.user?.id]);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        
        // Load user info
        const userResponse = await fetch(`/api/users/${session.user.id}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setPersonalInfo({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            avatar: userData.avatar || '',
            acceptMarketing: userData.acceptMarketing || false
          });
        }

        // Load user settings
        const settingsResponse = await fetch(`/api/users/${session.user.id}/settings`);
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setPrivacySettings({
            acceptEmailContact: settingsData.acceptEmailContact ?? true,
            acceptPhoneContact: settingsData.acceptPhoneContact ?? true,
            displayEmail: settingsData.displayEmail ?? false,
            displayPhone: settingsData.displayPhone ?? false
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setErrors(prev => ({ ...prev, personal: 'Erreur lors du chargement des données' }));
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [session?.user?.id]);

  // Handle personal info update
  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setSaving(true);
    setErrors(prev => ({ ...prev, personal: '' }));
    setMessages(prev => ({ ...prev, personal: '' }));

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personalInfo)
      });

      if (response.ok) {
        setMessages(prev => ({ ...prev, personal: 'Informations mises à jour avec succès' }));
        // Update session
        await update();
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, personal: errorData.error || 'Erreur lors de la mise à jour' }));
      }
    } catch (error) {
      console.error('Error updating personal info:', error);
      setErrors(prev => ({ ...prev, personal: 'Erreur lors de la mise à jour' }));
    } finally {
      setSaving(false);
    }
  };

  // Handle privacy settings update
  const handlePrivacySettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setSaving(true);
    setErrors(prev => ({ ...prev, privacy: '' }));
    setMessages(prev => ({ ...prev, privacy: '' }));

    try {
      const response = await fetch(`/api/users/${session.user.id}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privacySettings)
      });

      if (response.ok) {
        setMessages(prev => ({ ...prev, privacy: 'Préférences mises à jour avec succès' }));
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, privacy: errorData.error || 'Erreur lors de la mise à jour' }));
      }
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      setErrors(prev => ({ ...prev, privacy: 'Erreur lors de la mise à jour' }));
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    if (securityInfo.newPassword !== securityInfo.confirmPassword) {
      setErrors(prev => ({ ...prev, security: 'Les nouveaux mots de passe ne correspondent pas' }));
      return;
    }

    if (securityInfo.newPassword.length < 6) {
      setErrors(prev => ({ ...prev, security: 'Le nouveau mot de passe doit contenir au moins 6 caractères' }));
      return;
    }

    setSaving(true);
    setErrors(prev => ({ ...prev, security: '' }));
    setMessages(prev => ({ ...prev, security: '' }));

    try {
      const response = await fetch(`/api/users/${session.user.id}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: securityInfo.currentPassword,
          newPassword: securityInfo.newPassword
        })
      });

      if (response.ok) {
        setMessages(prev => ({ ...prev, security: 'Mot de passe modifié avec succès' }));
        setSecurityInfo(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, security: errorData.error || 'Erreur lors du changement de mot de passe' }));
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setErrors(prev => ({ ...prev, security: 'Erreur lors du changement de mot de passe' }));
    } finally {
      setSaving(false);
    }
  };

  // Handle email change
  const handleEmailChange = async () => {
    if (!session?.user?.id || !securityInfo.newEmail) return;

    setSaving(true);
    setErrors(prev => ({ ...prev, security: '' }));
    setMessages(prev => ({ ...prev, security: '' }));

    try {
      const response = await fetch(`/api/users/${session.user.id}/change-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail: securityInfo.newEmail })
      });

      if (response.ok) {
        setMessages(prev => ({ ...prev, security: 'Un email de confirmation a été envoyé à votre nouvelle adresse' }));
        setSecurityInfo(prev => ({ ...prev, newEmail: '' }));
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, security: errorData.error || 'Erreur lors du changement d\'email' }));
      }
    } catch (error) {
      console.error('Error changing email:', error);
      setErrors(prev => ({ ...prev, security: 'Erreur lors du changement d\'email' }));
    } finally {
      setSaving(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!session?.user?.id) return;
    
    const confirmed = confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera toutes vos données, y compris vos annonces.'
    );
    
    if (!confirmed) return;

    setSaving(true);
    
    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Votre compte a été supprimé avec succès');
        router.push('/');
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, security: errorData.error || 'Erreur lors de la suppression du compte' }));
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setErrors(prev => ({ ...prev, security: 'Erreur lors de la suppression du compte' }));
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Compte</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <Tabs aria-label="Account settings" className="space-y-6">
          <div className="flex space-x-1 border-b">
            <Tab key="personal" title={
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>Informations personnelles</span>
              </div>
            }>
            </Tab>
            <Tab key="privacy" title={
              <div className="flex items-center gap-2">
                <EyeIcon className="w-4 h-4" />
                <span>Confidentialité</span>
              </div>
            }>
            </Tab>
            <Tab key="security" title={
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Connexion et sécurité</span>
              </div>
            }>
            </Tab>
          </div>

          {/* Personal Information Section */}
          <div key="personal">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Informations personnelles</h3>
                </div>
              </CardHeader>
              <CardBody>
                {messages.personal && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-800">{messages.personal}</span>
                    </div>
                  </div>
                )}
                
                {errors.personal && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-600 mr-2" />
                      <span className="text-red-800">{errors.personal}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                        {personalInfo.avatar ? (
                          <img 
                            src={personalInfo.avatar} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-900 font-bold text-xl">
                            {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
                        isIconOnly
                      >
                        <CameraIcon className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'avatar</label>
                      <Input
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        value={personalInfo.avatar}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, avatar: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                      <Input
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        isRequired
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <Input
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        isRequired
                      />
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <Input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                        startContent={<EnvelopeIcon className="w-4 h-4 text-gray-400" />}
                        isRequired
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <Input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                        startContent={<PhoneIcon className="w-4 h-4 text-gray-400" />}
                      />
                    </div>
                  </div>

                  {/* Marketing Consent */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      isSelected={personalInfo.acceptMarketing}
                      onValueChange={(checked) => 
                        setPersonalInfo(prev => ({ ...prev, acceptMarketing: checked as boolean }))
                      }
                    >
                      J'accepte de recevoir des communications marketing et des mises à jour
                    </Checkbox>
                  </div>

                  <Button 
                    type="submit" 
                    isDisabled={saving} 
                    color="primary"
                    startContent={!saving && <CheckCircleIcon className="w-4 h-4" />}
                    isLoading={saving}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  );
}