import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import { useI18n } from '@/lib/i18n';
import { photo, srcSet } from '@/data/content';

const ROAD = ['unnamed-1-scaled-e1666344965191', 'img-3693-copy-t', '669a4e24accd4b93b96e4e4986e88358-5823553535856459615-121-lg-', 'gc-catacombs', 'whatsapp-image-2022-06-26-at-9-34-37-pm', 'b2', 'img-3681-copy-t', '72334955-134541127920035-8028238653065003008-n'];

/** Foto vere dei tour: la sezione si blocca e le foto scorrono in orizzontale (su mobile si scorrono col dito). */
export function PhotoRoad() {
  const { t } = useI18n();
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const photos = ROAD.map(photo);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !wrap.current || !track.current) return;
    // su mobile la striscia si scorre col dito; il blocco in orizzontale solo da 1024px
    const mm = gsap.matchMedia(wrap);
    mm.add('(min-width: 1024px)', () => {
      const dist = () => Math.max(0, track.current!.scrollWidth - window.innerWidth + 32);
      gsap.to(track.current, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={wrap} className="relative overflow-hidden bg-night py-16 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0">
      <div className="container-wt mb-8 flex items-end justify-between gap-6">
        <h2 className="font-display text-4xl uppercase text-white sm:text-5xl">{t.photos.title}</h2>
        <p className="hidden max-w-xs text-right text-sm uppercase tracking-[0.18em] text-mist sm:block">{t.photos.caption}</p>
      </div>
      <div className="max-lg:overflow-x-auto max-lg:[scrollbar-width:none]">
        <div ref={track} className="flex w-max gap-4 px-4 md:px-8 lg:gap-6">
          {photos.map((p, i) => (
            <figure key={p.slug} className={`relative shrink-0 overflow-hidden rounded-3xl ${p.h > p.w ? 'h-[46vh] w-[34vh] lg:h-[58vh] lg:w-[42vh]' : 'h-[46vh] w-[72vw] sm:w-[60vh] lg:h-[58vh] lg:w-[86vh]'} ${i % 2 ? 'lg:translate-y-8' : ''}`}>
              <img src={p.sizes.sm.src} srcSet={srcSet(p)} sizes="(min-width:1024px) 60vw, 80vw" alt="" width={p.sizes.sm.w} height={p.sizes.sm.h} loading="lazy" className="h-full w-full object-cover" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
