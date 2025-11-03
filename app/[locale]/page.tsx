import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useTranslations } from 'next-intl';
import KittenCard from '@/components/KittenCard';
import { Metadata } from 'next';

// SSR с кеширане
export const revalidate = 3600; // Revalidate на всеки час

type Kitten = {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  images: string[];
  available: boolean;
};

async function getKittens(): Promise<Kitten[]> {
  'use server';
  
  try {
    const admin = await import('firebase-admin');
    
    // Server-side Firebase Admin инициализация
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    const snapshot = await admin.firestore().collection('kittens')
      .where('available', '==', true)
      .limit(6)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Kitten));
  } catch (error) {
    console.error('Error fetching kittens:', error);
    return [];
  }
}

export async function generateMetadata({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
  return {
    title: locale === 'bg' 
      ? 'British Shorthair Котарня - Начало' 
      : 'British Shorthair Cattery - Home',
    description: locale === 'bg'
      ? 'Елитни British Shorthair котета с превъзходна родословна'
      : 'Elite British Shorthair kittens with excellent pedigree',
  };
}

export default async function HomePage() {
  const t = useTranslations('home');
  const kittens = await getKittens();

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600">
          {t('subtitle')}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kittens.map((kitten) => (
          <KittenCard key={kitten.id} kitten={kitten} />
        ))}
      </section>
    </main>
  );
}