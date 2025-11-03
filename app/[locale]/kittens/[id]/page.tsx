import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Metadata } from 'next';

type Props = {
  params: { id: string; locale: string };
};

async function getKitten(id: string) {
  'use server';
  
  try {
    const admin = await import('firebase-admin');
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    const doc = await admin.firestore().collection('kittens').doc(id).get();
    
    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() };
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
  const t = useTranslations('kittens');
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