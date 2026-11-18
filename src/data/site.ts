import { content } from './content';

export const SITE_URL = 'https://www.wheel.tours';

/** Canale di vendita Bokun del sito attuale (bookingChannelUUID nel widget). */
export const BOKUN_CHANNEL = '5c778941-1e90-4790-89a5-33b150d9e153';
export const bokunCalendarUrl = (experienceId: string, lang: 'en' | 'it') =>
  `https://widgets.bokun.io/online-sales/${BOKUN_CHANNEL}/experience-calendar/${experienceId}?lang=${lang === 'it' ? 'it' : 'en'}`;

/** Dati societari. La P.IVA non compare sul sito attuale: DA FAR CONFERMARE AL CLIENTE. */
export const COMPANY = {
  name: content.legal.company, // "Lion and lion Srl", dai Terms attuali
  vat: '', // vuoto = non mostrata
};

export const ADDRESS = 'Via Cavour 138, 00184 Roma';
/** Sostituisce il vecchio link g.page/alba-voice-tours, che oggi apre una ricerca Google. */
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Wheel Tours, ' + ADDRESS)}`;
export const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS + ' (Italy)')}&t=m&z=15&output=embed&iwloc=near`;

export type TourSlug = 'rome-highlights-golf-cart-tour' | 'catacombs-appian-way-golf-cart-tour' | 'rome-in-a-day-pizza-gelato';

/**
 * Foto per pagina tour. Sul sito attuale ogni tour ha una sola foto: le gallerie usano le altre foto
 * reali della libreria media del cliente (assegnazione nostra, da far confermare).
 */
export const TOUR_MEDIA: Record<TourSlug, { cover: string; gallery: string[]; short: { en: string; it: string } }> = {
  'rome-highlights-golf-cart-tour': {
    cover: 'gc-city-t',
    gallery: ['gc-city-t', 'unnamed-1-scaled-e1666344965191', 'img-3693-copy-t', 'unnamed-scaled', 'img-3681-copy-t', 'b2'],
    short: { en: 'Highlights', it: 'Highlights' },
  },
  'catacombs-appian-way-golf-cart-tour': {
    cover: 'gc-catacombs',
    gallery: ['gc-catacombs', 'img-3688-copy-t', '72334955-134541127920035-8028238653065003008-n', 'whatsapp-image-2022-06-26-at-9-34-37-pm'],
    short: { en: 'Catacombs & Appian Way', it: 'Catacombe e Appia' },
  },
  'rome-in-a-day-pizza-gelato': {
    cover: 'da14f7b6-2997-4f6c-95e3-6915c3030066',
    gallery: ['da14f7b6-2997-4f6c-95e3-6915c3030066', '669a4e24accd4b93b96e4e4986e88358-5823553535856459615-121-lg-', 'whatsapp-image-2022-06-26-at-9-35-02-pm', 'b2'],
    short: { en: 'Rome in a Day', it: 'Roma in un giorno' },
  },
};

/** Le 8 tappe dei raggi della ruota nell'hero: sono fermate reali del tour Highlights (testo del sito). */
export const HERO_STOPS = ['Colosseum', 'Rione Monti', 'Trevi Fountain', 'Spanish Steps', 'Pantheon', 'Piazza Navona', "Castel Sant'Angelo", 'Trastevere'];
export const HERO_STOPS_IT = ['Colosseo', 'Rione Monti', 'Fontana di Trevi', 'Piazza di Spagna', 'Pantheon', 'Piazza Navona', "Castel Sant'Angelo", 'Trastevere'];

/**
 * Fermate del tour Highlights (dal testo del sito, nello stesso ordine) con coordinate reali,
 * usate solo per la mappa schematica. "Attraction stops may vary by order".
 */
export const HIGHLIGHT_STOPS: { en: string; it: string; lon: number; lat: number }[] = [
  { en: 'Rione Monti', it: 'Rione Monti', lon: 12.4925, lat: 41.8951 },
  { en: 'Trevi Fountain', it: 'Fontana di Trevi', lon: 12.4833, lat: 41.9009 },
  { en: 'Spanish Steps', it: 'Piazza di Spagna', lon: 12.4828, lat: 41.906 },
  { en: 'Piazza Navona', it: 'Piazza Navona', lon: 12.4731, lat: 41.8992 },
  { en: 'Pantheon', it: 'Pantheon', lon: 12.4768, lat: 41.8986 },
  { en: 'Minerva Square', it: 'Piazza della Minerva', lon: 12.4779, lat: 41.8978 },
  { en: "Castel Sant'Angelo", it: "Castel Sant'Angelo", lon: 12.4663, lat: 41.9031 },
  { en: 'Vatican', it: 'Vaticano', lon: 12.4572, lat: 41.9022 },
  { en: 'Trastevere', it: 'Trastevere', lon: 12.4695, lat: 41.8889 },
  { en: 'Colosseum', it: 'Colosseo', lon: 12.4922, lat: 41.8902 },
];
export const BASE_POINT = { lon: 12.4937, lat: 41.8957 }; // Via Cavour 138

/** Corso del Tevere nel centro (punti approssimati), solo per disegnare la mappa schematica. */
export const TIBER: [number, number][] = [
  [12.4706, 41.9165], [12.4712, 41.9105], [12.4668, 41.9062], [12.4655, 41.9028], [12.469, 41.8995],
  [12.4712, 41.8968], [12.4745, 41.8935], [12.4773, 41.8906], [12.4778, 41.8872], [12.4752, 41.8836], [12.4728, 41.8792],
];

/** Fermate del tour Catacombe e Via Appia, nell'ordine del testo del sito. */
export const APPIAN_STOPS: { en: string; it: string; inside?: 'catacombs' | 'basilica' }[] = [
  { en: 'Colosseum', it: 'Colosseo' },
  { en: 'Terme di Caracalla', it: 'Terme di Caracalla' },
  { en: 'Church of Domine Quo Vadis', it: 'Chiesa del Domine Quo Vadis' },
  { en: 'Catacombs of Saint Sebastian', it: 'Catacombe di San Sebastiano', inside: 'catacombs' },
  { en: 'Basilica of Saint Sebastian ad Catacumbas', it: 'Basilica di San Sebastiano fuori le mura', inside: 'basilica' },
  { en: 'Circus of Maxentius', it: 'Circo di Massenzio' },
  { en: 'Appian Way', it: 'Via Appia Antica' },
  { en: 'Pyramid of Caius Cestius', it: 'Piramide Cestia' },
  { en: 'Circus Maximus', it: 'Circo Massimo' },
  { en: 'Bocca della Verità', it: 'Bocca della Verità' },
  { en: 'Theatre of Marcellus', it: 'Teatro di Marcello' },
];
