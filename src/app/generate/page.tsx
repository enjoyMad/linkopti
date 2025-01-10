// src/app/generate/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

// Définir le type pour les campagnes passées
type Campaign = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
};

export default function GenerateUTM() {
  const [form, setForm] = useState({
    url: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
  });

  const [generatedLink, setGeneratedLink] = useState('');
  const [pastCampaigns, setPastCampaigns] = useState<Campaign[]>([]); // Type des campagnes passées


  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Fonction pour générer l'URL UTM
  const generateUTM = () => {
    const { url, utm_source, utm_medium, utm_campaign, utm_term, utm_content } = form;
    const params = new URLSearchParams();

    if (utm_source) params.append('utm_source', utm_source);
    if (utm_medium) params.append('utm_medium', utm_medium);
    if (utm_campaign) params.append('utm_campaign', utm_campaign);
    if (utm_term) params.append('utm_term', utm_term);
    if (utm_content) params.append('utm_content', utm_content);

    const utmUrl = `${url}?${params.toString()}`;
    setGeneratedLink(utmUrl);
  };

  // Fonction pour sauvegarder le lien UTM dans Supabase
  const saveUTM = async () => {
    // TODO: Remplacer 'project_id_example' par l'ID du projet actuel
    const projectId = 'project_id_example'; // À remplacer dynamiquement selon l'utilisateur/projet

    const { data, error } = await supabase.from('utm_links').insert([
      {
        project_id: projectId,
        url: form.url,
        utm_source: form.utm_source,
        utm_medium: form.utm_medium,
        utm_campaign: form.utm_campaign,
        utm_term: form.utm_term,
        utm_content: form.utm_content,
        short_url: '', // À remplir après l'intégration du raccourcisseur de liens
      },
    ]);

    if (error) {
      console.error('Erreur lors de la sauvegarde du lien UTM :', error);
      alert('Erreur lors de la sauvegarde du lien. Veuillez réessayer.');
    } else {
      console.log('Lien UTM sauvegardé :', data);
      alert('Lien UTM sauvegardé avec succès !');
      // Réinitialiser le formulaire si nécessaire
    }
  };

  // Fonction pour récupérer les campagnes passées
  useEffect(() => {
    const fetchPastCampaigns = async () => {
      const { data, error } = await supabase
        .from('utm_links')
        .select('utm_source, utm_medium, utm_campaign')
        .limit(5)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des campagnes passées :', error);
      } else {
        setPastCampaigns(data);
      }
    };

    fetchPastCampaigns();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Générateur de liens UTM</h1>
      <div className="space-y-4">
        <input
          type="text"
          name="url"
          placeholder="URL de base"
          value={form.url}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="utm_source"
          placeholder="utm_source"
          value={form.utm_source}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="utm_medium"
          placeholder="utm_medium"
          value={form.utm_medium}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="utm_campaign"
          placeholder="utm_campaign"
          value={form.utm_campaign}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="utm_term"
          placeholder="utm_term"
          value={form.utm_term}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="utm_content"
          placeholder="utm_content"
          value={form.utm_content}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={generateUTM}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Générer le lien UTM
        </button>
        {generatedLink && (
          <div>
            <p className="font-semibold">Lien UTM généré :</p>
            <a href={generatedLink} className="text-blue-600" target="_blank" rel="noopener noreferrer">
              {generatedLink}
            </a>
            <button
              onClick={saveUTM}
              className="mt-2 bg-gray-500 text-white p-2 rounded"
            >
              Sauvegarder le lien
            </button>
          </div>
        )}
        {pastCampaigns.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">Suggestions basées sur vos campagnes passées :</p>
            <ul>
              {pastCampaigns.map((campaign, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-blue-500"
                  onClick={() => {
                    setForm({
                      ...form,
                      utm_source: campaign.utm_source || '',
                      utm_medium: campaign.utm_medium || '',
                      utm_campaign: campaign.utm_campaign || '',
                    });
                  }}
                >
                  {campaign.utm_campaign} - {campaign.utm_source} / {campaign.utm_medium}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
