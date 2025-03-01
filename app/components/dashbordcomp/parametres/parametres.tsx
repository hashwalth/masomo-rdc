import React, { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  LockClosedIcon,
  SwatchIcon,
  ChevronRightIcon,
  CheckIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { getAuth, updatePassword } from 'firebase/auth';
// Importer les composants refactorés
import SectionHeader from './subcomponents/SectionHeader';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

type Theme = {
  name: string;
  value: string;
};

type FormData = {
  email: string;
  username: string;
  theme: Theme;
  twoFactor: boolean;
  password: string;
  newPassword: string;
};

type Section = {
  id: string;
  icon: React.ReactNode;
  label: string;
};

export default function Parametres() {
  // Récupérer l'utilisateur Firebase connecté
  const auth = getAuth();
  const user = auth.currentUser;
  // Initialiser Firestore
  const db = getFirestore();
  
  // Initialisation du formData en fonction de l'utilisateur connecté
  const [formData, setFormData] = useState<FormData>({
    email: user?.email || 'user@example.com',
    username: user?.displayName || 'Nom d’utilisateur',
    theme: { name: 'Violet', value: '#645CF6FF' },
    twoFactor: false,
    password: '',
    newPassword: '',
  });

  // Récupérer les données depuis la collection "users"
  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({
            ...prev,
            email: data.email || prev.email,
            username: data.username || prev.username,
            theme: data.theme || prev.theme,
            twoFactor: data.twoFactor || prev.twoFactor,
          }));
        }
      }
    }
    fetchUserData();
  }, [user, db]);
  
  const [status, setStatus] = useState<{ 
    loading: boolean; 
    error: string | null; 
    success: boolean 
  }>({ 
    loading: false, 
    error: null, 
    success: false 
  });
  
  const [dirty, setDirty] = useState(false);

  // On conserve la navigation mais on désactive les modifications sur toutes les sections sauf "confidentialite"
  const sections: Section[] = [
    { id: 'compte', icon: <UserCircleIcon className="h-5 w-5" />, label: 'Compte' },
    { id: 'confidentialite', icon: <LockClosedIcon className="h-5 w-5" />, label: 'Sécurité' },
  ];

  useEffect(() => {
    if (status.success) {
      const timer = setTimeout(() => setStatus(s => ({ ...s, success: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [status.success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });
    
    try {
      if (user && formData.newPassword) {
        // Seul le changement de mot de passe est autorisé
        await updatePassword(user, formData.newPassword);
      }
      
      // Simulation d'un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus({ loading: false, error: null, success: true });
      // Réinitialiser les champs de mot de passe
      setFormData(prev => ({ ...prev, password: '', newPassword: '' }));
      setDirty(false);
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, error: 'Échec de la sauvegarde', success: false });
    }
  };

  const handleCancel = () => {
    // Réinitialiser uniquement les champs relatifs au mot de passe
    setFormData(prev => ({ ...prev, password: '', newPassword: '' }));
    setDirty(false);
  };

  const [activeSection, setActiveSectionState] = useState<string>('compte');

  function setActiveSection(id: string): void {
    setActiveSectionState(id);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Paramètres du compte</h1>
          {status.success && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              <CheckCircleIcon className="h-5 w-5" />
              <span className="text-sm">Modifications sauvegardées !</span>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <nav className="w-full md:w-64 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-white shadow-sm border border-gray-200 text-blue-600'
                    : 'hover:bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  {section.icon}
                  <span className="text-sm font-medium">{section.label}</span>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </button>
            ))}
          </nav>

          <main className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-8">
              {activeSection === 'compte' && (
                <>
                  <SectionHeader
                    title="Informations personnelles"
                    icon={<UserCircleIcon className="h-6 w-6" />}
                    description="Vos informations ne peuvent pas être modifiées"
                  />
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse email
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                        <input
                          name="email"
                          value={formData.email}
                          disabled
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom d'utilisateur
                      </label>
                      <input
                        name="username"
                        value={formData.username}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        placeholder="Nom d'utilisateur"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'confidentialite' && (
                <>
                  <SectionHeader
                    title="Changer le mot de passe"
                    icon={<ShieldCheckIcon className="h-6 w-6" />}
                    description="Seul le mot de passe peut être modifié"
                  />
                  <div className="space-y-6">
                    <div className="border-t pt-6">
                      <div className="space-y-4">
                        <input
                          type="password"
                          placeholder="Mot de passe actuel"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          value={formData.password}
                          onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value });
                            setDirty(true);
                          }}
                        />
                        <input
                          type="password"
                          placeholder="Nouveau mot de passe"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          value={formData.newPassword}
                          onChange={(e) => {
                            setFormData({ ...formData, newPassword: e.target.value });
                            setDirty(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {(dirty || status.error) && (
                <div className="border-t pt-6 space-y-4">
                  {status.error && (
                    <div className="text-red-600 bg-red-50 p-3 rounded-lg flex gap-2 items-center">
                      <ShieldCheckIcon className="h-5 w-5" />
                      {status.error}
                    </div>
                  )}
                  
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={status.loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      {status.loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sauvegarde...
                        </>
                      ) : (
                        'Sauvegarder'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
