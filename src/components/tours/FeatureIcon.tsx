import { Baby, Clock, Droplets, IceCreamCone, Languages, RotateCcw, Ticket, Users, CarFront } from 'lucide-react';
import type { FeatureKind } from '@/data/tours';

const MAP = {
  time: Clock,
  group: Users,
  cart: CarFront,
  comfort: Droplets,
  food: IceCreamCone,
  ticket: Ticket,
  child: Baby,
  language: Languages,
  cancel: RotateCcw,
} satisfies Record<FeatureKind, unknown>;

export function FeatureIcon({ kind, className }: { kind: FeatureKind; className?: string }) {
  const Icon = MAP[kind];
  return <Icon className={className} aria-hidden />;
}
