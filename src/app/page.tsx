'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

// Définir un type correspondant à la table 'users' dans Supabase
type User = {
  id: string;
  email: string;
  name?: string; // Ajoute d'autres colonnes selon ta table 'users'
  created_at?: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[] | null>(null); // Utilisation du type 'User[] | null'
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from<User>('users') // Utilisation d'un seul type ici
        .select('*');

      if (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        setError('Impossible de récupérer les utilisateurs. Veuillez réessayer plus tard.');
      } else {
        setUsers(data || []); // Si data est null, on initialise avec un tableau vide
      }
    };

    fetchUsers();
  }, []);

  return (
    <main>
      <h1>Bienvenue sur LinkOpti</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {users ? (
        <pre>{JSON.stringify(users, null, 2)}</pre>
      ) : (
        !error && <p>Chargement des utilisateurs...</p>
      )}
    </main>
  );
}
