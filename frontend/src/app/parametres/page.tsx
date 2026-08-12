'use client';
import { useState } from 'react';
import { Settings, Users, Building2, Layers, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ParametresPage() {
  const [tab, setTab] = useState('general');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ParamÃ¨tres</h1>
        <p className="text-sm text-gray-500 mt-1">Configuration du systÃ¨me</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-1">
          {[
            { key: 'general', label: 'GÃ©nÃ©ral', icon: Settings },
            { key: 'users', label: 'Utilisateurs', icon: Users },
            { key: 'business-units', label: 'Business Units', icon: Building2 },
            { key: 'consolidation', label: 'ModÃ¨les de consolidation', icon: Layers },
            { key: 'workflow', label: 'Workflow paiements', icon: Shield },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={cn('flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                tab === key ? 'bg-primary-50 text-primary' : 'text-gray-500 hover:bg-surface-50')}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 glass-card p-6">
          {tab === 'general' && (
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900">Configuration gÃ©nÃ©rale</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du groupe</label>
                  <input type="text" className="input-field" defaultValue="Groupe Industriel Alpha" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Devise par dÃ©faut</label>
                  <select className="input-field"><option>DZD</option><option>EUR</option><option>USD</option></select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gestion des excÃ©dents</label>
                  <select className="input-field"><option>DÃ©sactivÃ©e</option><option>ActivÃ©e</option></select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horizon temporel par dÃ©faut</label>
                  <select className="input-field"><option>Jour</option><option>Semaine</option><option>Mois</option></select>
                </div>
              </div>
              <button className="btn-primary">Sauvegarder</button>
            </div>
          )}
          {tab === 'users' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Gestion des utilisateurs</h3>
              <p className="text-sm text-gray-500">Ajoutez et gÃ©rez les utilisateurs, rÃ´les et permissions.</p>
              <button className="btn-primary mt-4">Ajouter un utilisateur</button>
            </div>
          )}
          {tab === 'business-units' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Business Units</h3>
              <p className="text-sm text-gray-500">GÃ©rez les entitÃ©s et projets du groupe.</p>
              <button className="btn-primary mt-4">Ajouter une BU</button>
            </div>
          )}
          {tab === 'consolidation' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">ModÃ¨les de consolidation</h3>
              <p className="text-sm text-gray-500">DÃ©finissez des modÃ¨les de consolidation par banque, agence, BU pour des vues personnalisÃ©es.</p>
              <button className="btn-primary mt-4">CrÃ©er un modÃ¨le</button>
            </div>
          )}
          {tab === 'workflow' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Configuration du workflow</h3>
              <p className="text-sm text-gray-500">DÃ©finissez les niveaux de validation des paiements et les seuils.</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-700 w-40">Niveaux de validation</label>
                  <select className="input-field w-20"><option>1</option><option>2</option><option>3</option></select>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-700 w-40">Seuil niveau 2</label>
                  <input type="number" className="input-field w-40" defaultValue="1000000" />
                  <span className="text-sm text-gray-400">DZD</span>
                </div>
              </div>
              <button className="btn-primary mt-4">Sauvegarder</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
