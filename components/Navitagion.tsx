'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const locale = useLocale();
  const t = useTranslations('navigation');
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'bg' ? 'en' : 'bg';
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = path;
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <Link href={`/${locale}`} className="hover:text-secondary transition">
              {t('home')}
            </Link>
            <Link href={`/${locale}/kittens`} className="hover:text-secondary transition">
              {t('kittens')}
            </Link>
            <Link href={`/${locale}/about`} className="hover:text-secondary transition">
              {t('about')}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-secondary transition">
              {t('contact')}
            </Link>
          </div>
          
          <button
            onClick={toggleLocale}
            className="px-4 py-2 bg-secondary rounded hover:bg-orange-600 transition"
          >
            {locale === 'bg' ? 'EN' : 'БГ'}
          </button>
        </div>
      </div>
    </nav>
  );
}