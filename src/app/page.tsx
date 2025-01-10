import { supabase } from '../utils/supabaseClient';

export default async function Home() {
  const { data: users } = await supabase.from('users').select('*');

  return (
    <main>
      <h1>Bienvenue sur LinkOpti</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </main>
  );
}
