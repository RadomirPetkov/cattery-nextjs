import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: { id: string; locale: string };
};

type Kitten = {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  images: string[];
  available: boolean;
};

async function getKitten(id: string): Promise<Kitten | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/kittens/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching kitten:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const kitten = await getKitten(params.id);
  
  if (!kitten) {
    return { title: 'Kitten Not Found' };
  }

  return {
    title: `${kitten.name} - British Shorthair Cattery`,
    description: `${kitten.breed} котенце, родено на ${kitten.birthDate}`,
    openGraph: {
      images: [kitten.images[0]],
    },
  };
}

export default async function KittenDetailPage({ params }: Props) {
  const t = await getTranslations('kittens');
  const kitten = await getKitten(params.id);

  if (!kitten) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative h-96">
          <Image
            src={kitten.images[0]}
            alt={kitten.name}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{kitten.name}</h1>
          <dl className="space-y-2">
            <div>
              <dt className="font-semibold">Порода:</dt>
              <dd>{kitten.breed}</dd>
            </div>
            <div>
              <dt className="font-semibold">Рождена дата:</dt>
              <dd>{kitten.birthDate}</dd>
            </div>
            <div>
              <dt className="font-semibold">Статус:</dt>
              <dd>
                {kitten.available 
                  ? t('available') 
                  : t('reserved')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}