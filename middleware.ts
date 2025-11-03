import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['bg', 'en'],
  defaultLocale: 'bg',
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  // Matcher игнорира api routes, static files, и _next
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};