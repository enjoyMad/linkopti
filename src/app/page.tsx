'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { User } from '../utils/types'; // Assure-toi que ce chemin est correct

export default function Home() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users') // Ne pas spécifier les types ici
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        setUsers(data || []);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Erreur lors de la récupération des utilisateurs :', error.message);
          setErrorMessage('Impossible de récupérer les utilisateurs. Veuillez réessayer plus tard.');
        } else {
          console.error('Erreur inconnue lors de la récupération des utilisateurs :', error);
          setErrorMessage('Une erreur inattendue est survenue. Veuillez réessayer plus tard.');
        }
      }
    };

    fetchUsers();
  }, []);

  return (
    <main>
      <h1>Bienvenue sur LinkOpti</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {users ? (
        <pre>{JSON.stringify(users, null, 2)}</pre>
      ) : (
        !errorMessage && <p>Chargement des utilisateurs...</p>
      )}
    </main>
  );
}
