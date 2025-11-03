'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

type Kitten = {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  images: string[];
  available: boolean;
};

type Props = {
  kitten: Kitten;
};

export default function KittenCard({ kitten }: Props) {
  const locale = useLocale();
  
  return (
    <Link 
      href={`/${locale}/kittens/${kitten.id}`}
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative h-64 w-full">
        <Image
          src={kitten.images[0] || '/placeholder-kitten.jpg'}
          alt={kitten.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {kitten.available && (
          <span className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Available
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{kitten.name}</h3>
        <p className="text-gray-600">{kitten.breed}</p>
        <p className="text-sm text-gray-500 mt-1">
          Born: {new Date(kitten.birthDate).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB')}
        </p>
      </div>
    </Link>
  );
}