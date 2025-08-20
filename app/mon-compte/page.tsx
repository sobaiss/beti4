'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
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
  BellIcon
} from '@heroicons/react/24/outline';
import { 
  Button, 
  Input, 
  Card, 
  CardBody, 
  CardHeader, 
  Checkbox,
  Tabs, 
  Tab,
  Avatar,
  Chip,
} from '@heroui/react';
import Header from '@/components/Header';
import { UserService } from '@/lib/services/user';
import { changeAccountRequest, changePassword, deleteUser, deleteUserAvatar, getUserProfile, updateUserAvatar, updateUserInfos, updateUserSettings } from '@/lib/actions/user';
import { convertFileToBase64 } from '@/lib/files/files';

export default function MonComptePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const emptyErrorMessages = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    currentPassword: '',
    newEmail: ''
  };

  const [selectedTab, setSelectedTab] = useState('personal');
  const [errorMessages, setErrorMessages] = useState(emptyErrorMessages);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    acceptMarketing: false
  });

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [privacySettings, setPrivacySettings] = useState({
    acceptEmailContact: true,
    acceptPhoneContact: true,
    displayEmail: false,
    displayPhone: false
  });

  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: '',
    password: '',
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

  const handleInputPersonalInfoChange = (field: string, value: string | boolean) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
    setErrorMessages(emptyErrorMessages);
  };

  const handleInputSecurityChange = (field: string, value: string | boolean) => {
    setSecurityInfo(prev => ({ ...prev, [field]: value }));
    setErrorMessages(emptyErrorMessages);
  };

  // Handle image file selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, personal: 'Veuillez sélectionner un fichier image valide' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, personal: 'La taille de l\'image ne peut pas dépasser 5MB' }));
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);

    // Clear any previous errors
    setErrors(prev => ({ ...prev, personal: '' }));
  };

  // Convert image to base64 and upload
  const handleImageUpload = async () => {
    if (!imageFile || !session?.user?.id) return;

    setUploadingImage(true);
    setErrors(prev => ({ ...prev, personal: '' }));
    setMessages(prev => ({ ...prev, personal: '' }));

    try {
      const base64File: string = await convertFileToBase64(imageFile);

      try {
        const userData = await updateUserAvatar(session.user.id, base64File);

        setPersonalInfo(prev => ({ ...prev, avatar: userData.avatar || '' }));
        setMessages(prev => ({ ...prev, personal: 'Photo de profil mise à jour avec succès' }));
        setImageFile(null);
        setImagePreview('');
        // Update session
        await update();
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrors(prev => ({ ...prev, personal: 'Erreur lors de l\'upload de l\'image' }));
      } finally {
        setUploadingImage(false);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setErrors(prev => ({ ...prev, personal: 'Erreur lors du traitement de l\'image' }));
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async() => {
    if (!session?.user?.id) return;
    setUploadingImage(true);
    setErrors(prev => ({ ...prev, personal: '' }));
    setMessages(prev => ({ ...prev, personal: '' }));

    try {
      const userData = await deleteUserAvatar(session.user.id);

      setPersonalInfo(prev => ({ ...prev, ...userData }));
      setMessages(prev => ({ ...prev, personal: 'Photo de profil supprimée avec succès' }));
      setImageFile(null);
      setImagePreview('');
      // Update session
      await update();
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors(prev => ({ ...prev, personal: 'Erreur lors de l\'upload de l\'image' }));
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove uploaded image
  const handleRemoveSelectedImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  // Handle personal info update
  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setSaving(true);
    setErrors(prev => ({ ...prev, personal: '' }));
    setMessages(prev => ({ ...prev, personal: '' }));

    try {
      const response = await updateUserInfos(session.user.id, {
        phone: personalInfo.phone,
        lastName: personalInfo.lastName,
        firstName: personalInfo.firstName
      });

      if ('errors' in response) {
        const errors = {
          firstName: response.errors.firstName?.[0] || '',
          lastName: response.errors.lastName?.[0] || '',
          phone: response.errors.phone?.[0] || '',
        }

        setErrorMessages((prev) => ({ ...prev, ...errors }));
        setErrors(prev => ({ ...prev, personal: response.message }));
        return;
      }

      setPersonalInfo(prev => ({ ...prev, ...response }));
      setMessages(prev => ({ ...prev, personal: 'Informations mises à jour avec succès' }));
      // Update session
      await update();
    } catch (error) {
      console.error('Error updating personal info:', error);
      setErrors(prev => ({ ...prev, personal: 'Erreur lors de la mise à jour des informations personnelles' }));
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
      const response = await updateUserSettings(session.user.id, privacySettings);

      if ('errors' in response) {
        //setErrorMessages((prev) => ({ ...prev, ...errors }));
        setErrors(prev => ({ ...prev, privacy: response.message }));
        return;
      }

      setMessages(prev => ({ ...prev, privacy: 'Préférences de confidentialité mises à jour avec succès' }));
      setPrivacySettings(prev => ({ ...prev, ...response.settings }));
      // Update session
      await update();
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      setErrors(prev => ({ ...prev, privacy: 'Erreur lors de la mise à jour des Préférences de confidentialité' }));
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    // if (securityInfo.password !== securityInfo.confirmPassword) {
    //   setErrors(prev => ({ ...prev, security: 'Les nouveaux mots de passe ne correspondent pas' }));
    //   return;
    // }

    setSaving(true);
    setErrors(prev => ({ ...prev, security: '' }));
    setMessages(prev => ({ ...prev, security: '' }));

    try {
      const response = await changePassword(session.user.id, {
        currentPassword: securityInfo.currentPassword,
        password: securityInfo.password,
        confirmPassword: securityInfo.confirmPassword
      });

      if ('errors' in response) {
        console.log('---- Errors:', response.errors);
        setErrorMessages((prev) => ({ ...prev, ...response.errors }));
        setErrors(prev => ({ ...prev, security: response.message ?? '' }));
        return;
      }

      setMessages(prev => ({ ...prev, security: 'Mot de passe modifié avec succès' }));
      setSecurityInfo(prev => ({ ...prev, currentPassword: '', password: '', confirmPassword: '' }));
      await signOut({ callbackUrl: '/' });
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
      const response = await changeAccountRequest(session.user.id, securityInfo.newEmail);

      if ('errors' in response) {
        setErrorMessages((prev) => ({ ...prev, ...response.errors }));
        setErrors(prev => ({ ...prev, security: response.message ?? '' }));
        return;
      }

      setMessages(prev => ({ ...prev, security: 'Votre demande de changement d\'email a été envoyée avec succès' }));
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
      const response = await deleteUser(session.user.id);

      if ('errors' in response) {
        //setErrorMessages((prev) => ({ ...prev, ...errors }));
        setErrors(prev => ({ ...prev, security: response.message ?? 'Erreur lors de la suppression du compte' }));
        return;
      }

      setMessages(prev => ({ ...prev, security: 'Votre compte a été supprimé avec succès' }));
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
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
          fullWidth
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(String(key))}
        >
          <Tab key="personal" title={
            <div className="flex items-center gap-3 px-4 py-2">
              <UserIcon className="w-5 h-5" />
              <span className="font-medium">Profil</span>
            </div>
          }
          >
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
                      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
                        <div className="relative">
                          <Avatar
                            src={imagePreview || personalInfo.avatar}
                            name={`${personalInfo.firstName?.[0]}${personalInfo.lastName?.[0]}`}
                            className="w-24 h-24 text-2xl"
                            isBordered
                            color="primary"
                          />
                          <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 cursor-pointer">
                            <div className="w-10 h-10 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors shadow-lg">
                              <CameraIcon className="w-4 h-4 text-white" />
                            </div>
                          </label>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-default-900 mb-2">Photo de profil</h4>
                          <p className="text-sm text-default-600 mb-4">
                            Téléchargez une photo de profil (JPG, PNG, max 5MB)
                          </p>
                          
                          {imageFile && (
                            <div className="flex items-center gap-3 mb-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-primary-900">{imageFile.name}</p>
                                <p className="text-xs text-primary-600">
                                  {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <Button
                                size="sm"
                                color="primary"
                                onClick={handleImageUpload}
                                isLoading={uploadingImage}
                                isDisabled={uploadingImage}
                              >
                                {uploadingImage ? 'Upload...' : 'Télécharger'}
                              </Button>
                              <Button
                                size="sm"
                                variant="light"
                                color="danger"
                                onClick={handleRemoveSelectedImage}
                                isDisabled={uploadingImage}
                                isIconOnly
                              >
                                ×
                              </Button>
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <label htmlFor="avatar-upload">
                              <Button
                                as="span"
                                variant="bordered"
                                size="sm"
                                startContent={<CameraIcon className="w-4 h-4" />}
                                className="cursor-pointer"
                              >
                                Choisir une photo
                              </Button>
                            </label>
                            
                            {personalInfo.avatar && (
                              <Button
                                size="sm"
                                variant="light"
                                color="danger"
                                onClick={handleImageDelete}
                                startContent={<TrashIcon className="w-4 h-4" />}
                                isDisabled={uploadingImage}
                                isLoading={uploadingImage}
                              >
                                Supprimer
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-default-700 mb-2">Prénom</label>
                      <Input
                        value={personalInfo.firstName}
                        onChange={(e) => handleInputPersonalInfoChange('firstName', e.target.value)}
                        size="lg"
                        variant="bordered"
                        radius="lg"
                        startContent={<UserIcon className="w-4 h-4 text-default-400" />}
                        errorMessage={errorMessages.firstName}
                        isInvalid={errorMessages.firstName !== ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-default-700 mb-2">Nom</label>
                      <Input
                        value={personalInfo.lastName}
                        onChange={(e) => handleInputPersonalInfoChange('lastName', e.target.value)}
                        size="lg"
                        variant="bordered"
                        radius="lg"
                        startContent={<UserIcon className="w-4 h-4 text-default-400" />}
                        errorMessage={errorMessages.lastName}
                        isInvalid={errorMessages.lastName !== ''}
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
                        startContent={<EnvelopeIcon className="w-4 h-4 text-default-400" />}
                        size="lg"
                        variant="bordered"
                        radius="lg"
                        isReadOnly
                        isDisabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-default-700 mb-2">Téléphone *</label>
                      <Input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) => handleInputPersonalInfoChange('phone', e.target.value)}
                        startContent={<PhoneIcon className="w-4 h-4 text-default-400" />}
                        size="lg"
                        variant="bordered"
                        radius="lg"
                        errorMessage={errorMessages.phone}
                        isInvalid={errorMessages.phone !== ''}
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
                            onValueChange={(checked) => handleInputPersonalInfoChange('acceptMarketing', checked as boolean)}
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
                    </CardBody>
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
                        onChange={(e) => handleInputSecurityChange('currentPassword', e.target.value)}
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
                        errorMessage={errorMessages.currentPassword}
                        isInvalid={errorMessages.currentPassword !== ''}
                      />
                      
                      <Input
                        type={showPasswords.new ? 'text' : 'password'}
                        label="Nouveau mot de passe"
                        value={securityInfo.password}
                        onChange={(e) => handleInputSecurityChange('password', e.target.value)}
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
                        errorMessage={errorMessages.password}
                        isInvalid={errorMessages.password !== ''}
                      />
                      
                      <Input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        label="Confirmer le nouveau mot de passe"
                        value={securityInfo.confirmPassword}
                        onChange={(e) => handleInputSecurityChange('confirmPassword', e.target.value)}
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
                        errorMessage={errorMessages.confirmPassword}
                        isInvalid={errorMessages.confirmPassword !== ''}
                      />
                      
                      <Button 
                        type="submit" 
                        color="primary"
                        size="lg"
                        radius="full"
                        className="w-full font-semibold"
                        isDisabled={saving || !securityInfo.currentPassword || !securityInfo.password || !securityInfo.confirmPassword}
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
                        onChange={(e) => handleInputSecurityChange('newEmail', e.target.value)}
                        startContent={<EnvelopeIcon className="w-4 h-4 text-default-400" />}
                        size="lg"
                        variant="bordered"
                        radius="lg"
                        errorMessage={errorMessages.newEmail}
                        isInvalid={errorMessages.newEmail !== ''}
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
                        isLoading={saving}
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