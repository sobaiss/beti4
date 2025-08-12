'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save,
  Eye,
  EyeOff,
  Shield,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Informations personnelles
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Confidentialité
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Connexion et sécurité
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Section */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {messages.personal && (
                  <Alert className="mb-4 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {messages.personal}
                    </AlertDescription>
                  </Alert>
                )}
                
                {errors.personal && (
                  <Alert className="mb-4 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {errors.personal}
                    </AlertDescription>
                  </Alert>
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
                      >
                        <Camera className="w-3 h-3" />
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="avatar">URL de l'avatar</Label>
                      <Input
                        id="avatar"
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        value={personalInfo.avatar}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, avatar: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Marketing Consent */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptMarketing"
                      checked={personalInfo.acceptMarketing}
                      onCheckedChange={(checked) => 
                        setPersonalInfo(prev => ({ ...prev, acceptMarketing: checked as boolean }))
                      }
                    />
                    <Label htmlFor="acceptMarketing" className="text-sm">
                      J'accepte de recevoir des communications marketing et des mises à jour
                    </Label>
                  </div>

                  <Button type="submit" disabled={saving} className="bg-blue-900 hover:bg-blue-800">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings Section */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Préférences de confidentialité
                </CardTitle>
              </CardHeader>
              <CardContent>
                {messages.privacy && (
                  <Alert className="mb-4 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {messages.privacy}
                    </AlertDescription>
                  </Alert>
                )}
                
                {errors.privacy && (
                  <Alert className="mb-4 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {errors.privacy}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handlePrivacySettingsSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Préférences de contact</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="acceptEmailContact"
                          checked={privacySettings.acceptEmailContact}
                          onCheckedChange={(checked) => 
                            setPrivacySettings(prev => ({ ...prev, acceptEmailContact: checked as boolean }))
                          }
                        />
                        <Label htmlFor="acceptEmailContact" className="text-sm">
                          Accepter d'être contacté par email
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="acceptPhoneContact"
                          checked={privacySettings.acceptPhoneContact}
                          onCheckedChange={(checked) => 
                            setPrivacySettings(prev => ({ ...prev, acceptPhoneContact: checked as boolean }))
                          }
                        />
                        <Label htmlFor="acceptPhoneContact" className="text-sm">
                          Accepter d'être contacté par téléphone
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Visibilité des informations</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="displayEmail"
                          checked={privacySettings.displayEmail}
                          onCheckedChange={(checked) => 
                            setPrivacySettings(prev => ({ ...prev, displayEmail: checked as boolean }))
                          }
                        />
                        <Label htmlFor="displayEmail" className="text-sm">
                          Afficher mon email sur mes annonces
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="displayPhone"
                          checked={privacySettings.displayPhone}
                          onCheckedChange={(checked) => 
                            setPrivacySettings(prev => ({ ...prev, displayPhone: checked as boolean }))
                          }
                        />
                        <Label htmlFor="displayPhone" className="text-sm">
                          Afficher mon téléphone sur mes annonces
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={saving} className="bg-blue-900 hover:bg-blue-800">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Enregistrement...' : 'Enregistrer les préférences'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Section */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Changer le mot de passe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {messages.security && (
                    <Alert className="mb-4 border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {messages.security}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {errors.security && (
                    <Alert className="mb-4 border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {errors.security}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? 'text' : 'password'}
                          value={securityInfo.currentPassword}
                          onChange={(e) => setSecurityInfo(prev => ({ ...prev, currentPassword: e.target.value }))}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? 'text' : 'password'}
                          value={securityInfo.newPassword}
                          onChange={(e) => setSecurityInfo(prev => ({ ...prev, newPassword: e.target.value }))}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={securityInfo.confirmPassword}
                          onChange={(e) => setSecurityInfo(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" disabled={saving} className="bg-blue-900 hover:bg-blue-800">
                      {saving ? 'Modification...' : 'Changer le mot de passe'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Change Email */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Changer l'adresse email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentEmail">Adresse email actuelle</Label>
                      <Input
                        id="currentEmail"
                        type="email"
                        value={personalInfo.email}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="newEmail">Nouvelle adresse email</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={securityInfo.newEmail}
                        onChange={(e) => setSecurityInfo(prev => ({ ...prev, newEmail: e.target.value }))}
                        placeholder="nouvelle@email.com"
                      />
                    </div>

                    <Button 
                      onClick={handleEmailChange} 
                      disabled={saving || !securityInfo.newEmail}
                      className="bg-blue-900 hover:bg-blue-800"
                    >
                      {saving ? 'Envoi...' : 'Envoyer la demande de changement'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Delete Account */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="w-5 h-5" />
                    Supprimer le compte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Attention :</strong> Cette action est irréversible. Toutes vos données, 
                        y compris vos annonces, seront définitivement supprimées.
                      </AlertDescription>
                    </Alert>

                    <Button 
                      onClick={handleDeleteAccount}
                      disabled={saving}
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {saving ? 'Suppression...' : 'Supprimer définitivement mon compte'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}