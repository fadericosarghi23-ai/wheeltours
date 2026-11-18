import type { TourSlug } from '../site';

/**
 * Traduzione italiana dei tour, scritta da noi a partire dal testo inglese del sito attuale.
 * DA FAR CONFERMARE AL CLIENTE. Stessa struttura e stesso ordine delle voci dell'originale.
 */
export const TOURS_IT: Record<TourSlug, { title: string; description: string[]; features: string[]; price: string }> = {
  'rome-highlights-golf-cart-tour': {
    title: 'Tour guidato delle meraviglie di Roma in golf cart con gelato',
    description: [
      "Scopri Roma in golf cart. Abbiamo sette partenze al giorno per mostrarti alcune delle meraviglie più famose della città: Rione Monti, Fontana di Trevi, Piazza di Spagna, Piazza Navona, Pantheon, Piazza della Minerva, Castel Sant'Angelo, Vaticano, Trastevere, Colosseo e altro ancora (l'ordine delle tappe può variare).",
    ],
    features: [
      '3 ore con un autista guida esperto',
      'Gruppo semi privato fino a 14 persone',
      '7 persone per golf cart',
      "Bottiglia d'acqua e auricolari per il tuo comfort",
      'Gelato',
      'Bambini da 0 a 6 anni: sconto di €9 (per legge i bambini non possono stare in braccio). Seggiolino fornito.',
      'Solo in lingua inglese',
      'Cancellazione gratuita fino a 24 ore prima',
    ],
    price: 'da €99 a persona',
  },
  'catacombs-appian-way-golf-cart-tour': {
    title: 'Tour in piccoli gruppi di catacombe e Via Appia in golf cart',
    description: [
      "Fai un salto nel passato lungo la leggendaria Via Appia, con le nostre guide esperte e tre partenze al giorno. Vedrai: Colosseo, Terme di Caracalla, Chiesa del Domine Quo Vadis, Catacombe di San Sebastiano (visita interna di 40 minuti), Basilica di San Sebastiano fuori le mura (visita interna), Circo di Massenzio, Via Appia Antica, Piramide Cestia, Circo Massimo, Bocca della Verità, Teatro di Marcello e altro ancora.",
    ],
    features: [
      '3 ore con una guida esperta',
      'Gruppo semi privato fino a 14 persone',
      '7 persone per golf cart',
      "Bottiglia d'acqua e auricolari per il tuo comfort",
      'Biglietti di ingresso alle Catacombe inclusi',
      'Bambini da 0 a 6 anni: sconto di €9 (per legge i bambini non possono stare in braccio). Seggiolino fornito.',
      'Solo in lingua inglese',
      'Cancellazione gratuita fino a 24 ore prima',
    ],
    price: 'da €99 a persona',
  },
  'rome-in-a-day-pizza-gelato': {
    title: 'Roma in un giorno in golf cart con pizza 🍕 e gelato 🍧',
    description: [
      'Lasciati portare in giro per la città comodamente seduto: 3 ore di tour per vedere tutti i luoghi più belli. Partenze ogni giorno alle 11:00 e alle 19:00 dalla nostra sede in Via Cavour 138, con una guida a tua disposizione. Il tour ideale per chi ha poco tempo.',
    ],
    features: [
      '3 ore con un autista guida esperto',
      'Gruppo semi privato fino a 14 persone',
      "Bottiglia d'acqua e auricolari per il tuo comfort",
      'Pizza e gelato',
      'Bambini da 0 a 6 anni: sconto di €9 (per legge i bambini non possono stare in braccio). Seggiolino fornito.',
      'Solo in lingua inglese',
      'Cancellazione gratuita fino a 24 ore prima',
    ],
    price: 'da €500 a persona',
  },
};
