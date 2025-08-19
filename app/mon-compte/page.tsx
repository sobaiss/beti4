'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CameraIcon, 
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LockClosedIcon,
  Cog6ToothIcon,
  HeartIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { 
  Button, 
  Input, 
  Card, 
  CardBody, 
  CardHeader, 
  Checkbox, 
  Divider, 
  Tabs, 
  Tab,
  Avatar,
  Chip,
  Progress
} from '@heroui/react';
import Header from '@/components/Header';
import { UserService } from '@/lib/services/user';
import { getUserProfile } from '@/lib/actions/user';

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
        const user = await getUserProfile();
        if (user) {
          setPersonalInfo({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            avatar: user.avatar || '',
            acceptMarketing: user.acceptMarketing || false
          });

          setPrivacySettings({
            acceptEmailContact: user.settings?.acceptEmailContact ?? true,
            acceptPhoneContact: user.settings?.acceptPhoneContact ?? true,
            displayEmail: user.settings?.displayEmail ?? false,
            displayPhone: user.settings?.displayPhone ?? false
          });

          return;
        }

        throw new Error('Failed to load user profile');
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
      const response = await UserService.updateUserInfos(session.user.id, personalInfo);

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
      const response = await UserService.updateUserSettings(session.user.id, privacySettings);

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
      const response = await UserService.updateUserPassword(session.user.id, {
        currentPassword: securityInfo.currentPassword,
        newPassword: securityInfo.newPassword
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
      const response = await UserService.updateUserEmail(session.user.id, securityInfo.newEmail);

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
      const response = await UserService.deleteUser(session.user.id);

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
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <Avatar
              src={personalInfo.avatar}
              name={`${personalInfo.firstName?.[0]}${personalInfo.lastName?.[0]}`}
              className="w-24 h-24 text-2xl"
              isBordered
              color="primary"
            />
            <div className="absolute -bottom-2 -right-2">
              <Chip color="success" variant="solid" size="sm">
                {session?.user?.status === 'valide' ? 'Vérifié' : 'En attente'}
              </Chip>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-default-900 mb-3">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-xl text-default-600 mb-2">{personalInfo.email}</p>
          <p className="text-default-500">
            Membre depuis {new Date(session?.user?.createdAt || '').toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long' 
            })}
          </p>
        </div>

        <Tabs 
          aria-label="Account settings" 
          className="space-y-8"
          variant="underlined"
          color="primary"
          size="lg"
        >
          <Tab key="personal" title={
            <div className="flex items-center gap-3 px-4 py-2">
              <UserIcon className="w-5 h-5" />
              <span className="font-medium">Profil</span>
            </div>
          }>
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-foreground pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-default-900">Informations personnelles</h3>
                    <p className="text-default-600">Gérez vos informations de profil</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                {messages.personal && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-success-50 to-success-100 border border-success-200 rounded-xl">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-success-600 mr-3" />
                      <span className="text-success-800 font-medium">{messages.personal}</span>
                    </div>
                  </div>
                )}
                
                {errors.personal && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-danger-50 to-danger-100 border border-danger-200 rounded-xl">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-danger-600 mr-3" />
                      <span className="text-danger-800 font-medium">{errors.personal}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handlePersonalInfoSubmit} className="space-y-8">
                  {/* Avatar Section */}
                  <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200">
                    <CardBody className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <Avatar
                            src={personalInfo.avatar}
                            name={`${personalInfo.firstName?.[0]}${personalInfo.lastName?.[0]}`}
                            className="w-24 h-24 text-2xl"
                            isBordered
                            color="primary"
                          />
                          <Button
                            type="button"
                            size="sm"
                            color="primary"
                            className="absolute -bottom-2 -right-2 rounded-full min-w-10 h-10"
                            isIconOnly
                          >
                            <CameraIcon className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-default-900 mb-2">Photo de profil</h4>
                          <Input
                            type="url"
                            placeholder="https://example.com/avatar.jpg"
                            value={personalInfo.avatar}
                            onChange={(e) => setPersonalInfo(prev => ({ ...prev, avatar: e.target.value }))}
                            size="lg"
                            variant="bordered"
                            radius="lg"
                            startContent={<CameraIcon className="w-4 h-4 text-default-400" />}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-default-700 mb-2">Prénom *</label>
                      <Input
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        size="lg"
                        variant="bordered"
                        radius="lg"
                        isRequired
                        startContent={<UserIcon className="w-4 h-4 text-default-400" />}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-default-700 mb-2">Nom *</label>
                      <Input
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        size="lg"
                        variant="bordered"
                        radius="lg"
                        isRequired
                        startContent={<UserIcon className="w-4 h-4 text-default-400" />}
                      />
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-default-700 mb-2">Email *</label>
                      <Input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                        startContent={<EnvelopeIcon className="w-4 h-4 text-default-400" />}
                        size="lg"
                        variant="bordered"
                        radius="lg"
                        isRequired
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-default-700 mb-2">Téléphone</label>
                      <Input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                        startContent={<PhoneIcon className="w-4 h-4 text-default-400" />}
                        size="lg"
                        variant="bordered"
                        radius="lg"
                      />
                    </div>
                  </div>

                  {/* Marketing Consent */}
                  <Card className="bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200">
                    <CardBody className="p-6">
                      <div className="flex items-start space-x-4">
                        <BellIcon className="w-6 h-6 text-warning-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-default-900 mb-2">Préférences de communication</h4>
                          <Checkbox
                            isSelected={personalInfo.acceptMarketing}
                            onValueChange={(checked) => 
                              setPersonalInfo(prev => ({ ...prev, acceptMarketing: checked as boolean }))
                            }
                            size="lg"
                          >
                            <span className="text-default-700">J'accepte de recevoir des communications marketing et des mises à jour</span>
                          </Checkbox>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Button 
                    type="submit" 
                    isDisabled={saving} 
                    color="primary"
                    size="lg"
                    radius="full"
                    className="w-full font-semibold"
                    startContent={!saving && <CheckCircleIcon className="w-4 h-4" />}
                    isLoading={saving}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </Tab>
          
          <Tab key="privacy" title={
            <div className="flex items-center gap-2">
              <EyeIcon className="w-5 h-5" />
              <span className="font-medium">Confidentialité</span>
            </div>
          }>
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-foreground pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl flex items-center justify-center">
                    <EyeIcon className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-default-900">Confidentialité</h3>
                    <p className="text-default-600">Contrôlez vos préférences de confidentialité</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                {messages.privacy && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-success-50 to-success-100 border border-success-200 rounded-xl">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-success-600 mr-3" />
                      <span className="text-success-800 font-medium">{messages.privacy}</span>
                    </div>
                  </div>
                )}
                
                {errors.privacy && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-danger-50 to-danger-100 border border-danger-200 rounded-xl">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-danger-600 mr-3" />
                      <span className="text-danger-800 font-medium">{errors.privacy}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handlePrivacySettingsSubmit} className="space-y-8">
                  <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200">
                    <CardBody className="p-6">
                      <div className="flex items-start space-x-4 mb-6">
                        <EnvelopeIcon className="w-6 h-6 text-primary-600 mt-1" />
                        <div>
                          <h4 className="text-lg font-semibold text-default-900 mb-2">Préférences de contact</h4>
                          <p className="text-default-600 text-sm">Choisissez comment vous souhaitez être contacté</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Checkbox
                          isSelected={privacySettings.acceptEmailContact}
                          onValueChange={(checked) => 
                            setPrivacySettings(prev => ({ ...prev, acceptEmailContact: checked as boolean }))
                          }
                          size="lg"
                        >
                          <span className="text-default-700">Accepter d'être contacté par email</span>
                        </Checkbox>
                        <Checkbox
                          isSelected={privacySettings.acceptPhoneContact}
                          onValueChange={(checked) => 
                            setPrivacySettings(prev => ({ ...prev, acceptPhoneContact: checked as boolean }))
                          }
                          size="lg"
                        >
                          <span className="text-default-700">Accepter d'être contacté par téléphone</span>
                        </Checkbox>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-r from-secondary-50 to-secondary-100 border border-secondary-200">
                    <CardBody className="p-6">
                      <div className="flex items-start space-x-4 mb-6">
                        <EyeIcon className="w-6 h-6 text-secondary-600 mt-1" />
                        <div>
                          <h4 className="text-lg font-semibold text-default-900 mb-2">Visibilité des informations</h4>
                          <p className="text-default-600 text-sm">Contrôlez quelles informations sont visibles publiquement</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Checkbox
                          isSelected={privacySettings.displayEmail}
                          onValueChange={(checked) => 
                            setPrivacySettings(prev => ({ ...prev, displayEmail: checked as boolean }))
                          }
                          size="lg"
                        >
                          <span className="text-default-700">Afficher mon email sur mes annonces</span>
                        </Checkbox>
                        <Checkbox
                          isSelected={privacySettings.displayPhone}
                          onValueChange={(checked) => 
                            setPrivacySettings(prev => ({ ...prev, displayPhone: checked as boolean }))
                          }
                          size="lg"
                        >
                          <span className="text-default-700">Afficher mon téléphone sur mes annonces</span>
                        </Checkbox>
                      </div>
                    </div>
                  </Card>

                  <Button 
                    type="submit" 
                    isDisabled={saving} 
                    color="primary"
                    size="lg"
                    radius="full"
                    className="w-full font-semibold"
                    startContent={!saving && <CheckCircleIcon className="w-4 h-4" />}
                    isLoading={saving}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer les préférences'}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </Tab>
          
          <Tab key="security" title={
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span className="font-medium">Sécurité</span>
            </div>
          }>
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-foreground pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-xl flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-default-900">Sécurité</h3>
                    <p className="text-default-600">Gérez la sécurité de votre compte</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0 space-y-8">
                {messages.security && (
                  <div className="p-4 bg-gradient-to-r from-success-50 to-success-100 border border-success-200 rounded-xl">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-success-600 mr-3" />
                      <span className="text-success-800 font-medium">{messages.security}</span>
                    </div>
                  </div>
                )}
                
                {errors.security && (
                  <div className="p-4 bg-gradient-to-r from-danger-50 to-danger-100 border border-danger-200 rounded-xl">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-danger-600 mr-3" />
                      <span className="text-danger-800 font-medium">{errors.security}</span>
                    </div>
                  </div>
                )}

                {/* Change Password Section */}
                <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <LockClosedIcon className="w-6 h-6 text-primary-600" />
                      <div>
                        <h4 className="text-lg font-semibold text-default-900">Changer le mot de passe</h4>
                        <p className="text-default-600 text-sm">Mettez à jour votre mot de passe pour sécuriser votre compte</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <Input
                        type={showPasswords.current ? 'text' : 'password'}
                        label="Mot de passe actuel"
                        value={securityInfo.currentPassword}
                        onChange={(e) => setSecurityInfo(prev => ({ ...prev, currentPassword: e.target.value }))}
                        startContent={<LockClosedIcon className="w-4 h-4 text-default-400" />}
                        size="lg"
                        variant="bordered"
                        radius="lg"
                        endContent={
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                            className="text-default-400 hover:text-default-600 transition-colors"
                          >
                            {showPasswords.current ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </button>
                        }
                      />
                      
                      <Input
                        type={showPasswords.new ? 'text' : 'password'}
                        label="Nouveau mot de passe"
                        value={securityInfo.newPassword}
                        onChange={(e) => setSecurityInfo(prev => ({ ...prev, newPassword: e.target.value }))}
                        startContent={<LockClosedIcon className="w-4 h-4 text-default-400" />}
                        size="lg"
                        variant="bordered"
                        radius="lg"
                        endContent={
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                            className="text-default-400 hover:text-default-600 transition-colors"
                          >
                            {showPasswords.new ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </button>
                        }
                      />
                      
                      <Input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        label="Confirmer le nouveau mot de passe"
                        value={securityInfo.confirmPassword}
                        onChange={(e) => setSecurityInfo(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        startContent={<LockClosedIcon className="w-4 h-4 text-default-400" />}
                        size="lg"
                        variant="bordered"
                        radius="lg"
                        endContent={
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                            className="text-default-400 hover:text-default-600 transition-colors"
                          >
                            {showPasswords.confirm ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </button>
                        }
                      />
                      
                      <Button 
                        type="submit" 
                        color="primary"
                        size="lg"
                        radius="full"
                        className="w-full font-semibold"
                        isDisabled={saving || !securityInfo.currentPassword || !securityInfo.newPassword || !securityInfo.confirmPassword}
                        isLoading={saving}
                      >
                        {saving ? 'Modification...' : 'Changer le mot de passe'}
                      </Button>
                    </form>
                  </CardBody>
                </Card>

                {/* Change Email Section */}
                <Card className="bg-gradient-to-r from-secondary-50 to-secondary-100 border border-secondary-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <EnvelopeIcon className="w-6 h-6 text-secondary-600" />
                      <div>
                        <h4 className="text-lg font-semibold text-default-900">Changer l'adresse email</h4>
                        <p className="text-default-600 text-sm">Mettez à jour votre adresse email de connexion</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <div className="space-y-6">
                      <Input
                        type="email"
                        label="Nouvelle adresse email"
                        value={securityInfo.newEmail}
                        onChange={(e) => setSecurityInfo(prev => ({ ...prev, newEmail: e.target.value }))}
                        startContent={<EnvelopeIcon className="w-4 h-4 text-default-400" />}
                        size="lg"
                        variant="bordered"
                        radius="lg"
                      />
                      
                      <Button 
                        onClick={handleEmailChange}
                        color="secondary"
                        size="lg"
                        radius="full"
                        className="w-full font-semibold"
                        isDisabled={saving || !securityInfo.newEmail}
                        isLoading={saving}
                      >
                        {saving ? 'Envoi...' : 'Envoyer email de confirmation'}
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                {/* Delete Account Section */}
                <Card className="bg-gradient-to-r from-danger-50 to-danger-100 border border-danger-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-danger-200 rounded-xl flex items-center justify-center">
                        <ExclamationTriangleIcon className="w-6 h-6 text-danger-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-danger-700">Zone dangereuse</h4>
                        <p className="text-danger-600 text-sm">Actions irréversibles sur votre compte</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <div className="space-y-6">
                      <div className="p-4 bg-danger-100 rounded-lg border border-danger-200">
                        <p className="text-sm text-danger-800 font-medium">
                          ⚠️ Attention : Cette action est irréversible
                        </p>
                        <p className="text-sm text-danger-700 mt-2">
                          La suppression de votre compte entraînera la perte définitive de toutes vos données, 
                          y compris vos annonces, favoris et historique.
                        </p>
                      </div>
                      <p className="text-sm text-default-700">
                        La suppression de votre compte est irréversible. Toutes vos données, y compris vos annonces, seront définitivement supprimées.
                      </p>
                      
                      <Button 
                        onClick={handleDeleteAccount}
                        color="danger"
                        size="lg"
                        radius="full"
                        className="w-full font-semibold"
                        startContent={<TrashIcon className="w-4 h-4" />}
                        isDisabled={saving}
                      >
                        Supprimer mon compte
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}