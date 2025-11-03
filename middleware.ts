import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['bg', 'en'],
  defaultLocale: 'bg',
  localePrefix: 'as-needed'
});

export const config = {
  matcher: ['/', '/(bg|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};