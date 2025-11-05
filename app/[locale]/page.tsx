import { getTranslations } from 'next-intl/server';
import KittenCard from '@/components/KittenCard';
import { Metadata } from 'next';

export const revalidate = 3600;

type Kitten = {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  images: string[];
  available: boolean;
};

async function getKittens(): Promise<Kitten[]> {
  try {
    // В development използваме localhost, в production - твоя домейн
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/kittens`, {
      cache: 'no-store', // За development
      // cache: 'force-cache', // За production
    });

    if (!res.ok) {
      throw new Error('Failed to fetch kittens');
    }

    return res.json();
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

export default async function HomePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = await getTranslations('home');
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

      {kittens.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kittens.map((kitten) => (
            <KittenCard key={kitten.id} kitten={kitten} />
          ))}
        </section>
      ) : (
        <p className="text-center text-gray-500">
          {locale === 'bg' ? 'Няма налични котета в момента' : 'No kittens available at the moment'}
        </p>
      )}
    </main>
  );
}