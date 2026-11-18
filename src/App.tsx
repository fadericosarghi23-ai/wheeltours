import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { BookingDialog } from '@/components/booking/Booking';
import { IntroLogo } from '@/components/brand/IntroLogo';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { ScrollTrigger, scrollToTop } from '@/lib/motion';
import { useI18n } from '@/lib/i18n';
import Home from '@/pages/Home';

const Tours = lazy(() => import('@/pages/Tours'));
const Tour = lazy(() => import('@/pages/Tour'));
const VisitUs = lazy(() => import('@/pages/VisitUs'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Cookies = lazy(() => import('@/pages/Cookies'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const PAGES = [
  { path: '', el: <Home /> },
  { path: 'tours', el: <Tours /> },
  { path: 'tours/:slug', el: <Tour /> },
  { path: 'visit-us', el: <VisitUs /> },
  { path: 'terms', el: <Terms /> },
  { path: 'privacy', el: <Privacy /> },
  { path: 'cookies', el: <Cookies /> },
];

export default function App() {
  const location = useLocation();
  const { t } = useI18n();

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  return (
    <>
      <SmoothScroll />
      <a href="#content" className="sr-only z-[100] rounded bg-yellow p-3 text-night focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        {t.nav.skip}
      </a>
      <Navbar />
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          scrollToTop();
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }}
      >
        <PageTransition key={location.pathname}>
          <main id="content">
            <Suspense fallback={<div className="min-h-screen" />}>
              <Routes location={location}>
                {PAGES.map((p) => (
                  <Route key={p.path} path={'/' + p.path} element={p.el} />
                ))}
                {PAGES.map((p) => (
                  <Route key={'it' + p.path} path={'/it' + (p.path ? '/' + p.path : '')} element={p.el} />
                ))}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </PageTransition>
      </AnimatePresence>
      <BookingDialog />
      <FloatingWhatsApp />
      <IntroLogo />
    </>
  );
}
