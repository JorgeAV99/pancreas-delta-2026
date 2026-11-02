export type ReservationStatus = 'pendiente' | 'solicitada' | 'confirmada' | 'descartada';

export const statusLabels: Record<ReservationStatus, string> = {
  pendiente: 'Pendiente de confirmar',
  solicitada: 'Solicitada, sin respuesta',
  confirmada: 'Confirmada',
  descartada: 'Descartada · activar plan B',
};

export type Link = { label: string; href: string };

export type Reservation = {
  id: string;
  day: string;
  name: string;
  what: string;
  phone?: string[];
  links: Link[];
  facts: string[];
  unverified?: string[];
};

const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const reservations: Reservation[] = [
  {
    id: 'pollastres-eva',
    day: 'Viernes 6',
    name: 'Pollastres Eva',
    what: 'Pollos asados con patatas para nueve, comida en casa a las 15:15',
    links: [{ label: 'Maps', href: maps("Pollastres Eva L'Ampolla") }],
    facts: ["En L'Ampolla."],
    unverified: ['Disponibilidad y horario de encargo sin verificar: llamar o pasar el jueves por la noche o el viernes temprano.'],
  },
  {
    id: 'kensho',
    day: 'Viernes 6',
    name: 'Kenshô · Kan Kenshô',
    what: 'Visita y cata de sake privada para nueve, 16:30',
    links: [
      { label: 'Web y reservas', href: 'https://www.kenshosake.com/visitas-kensho-delta-del-ebro/' },
      { label: 'Maps', href: maps("Kenshô sake L'Ampolla") },
    ],
    facts: [
      'Visita «Descubrimiento»: 29 € por persona y 1 h 30 min, según su web.',
      'Reserva online desde la propia web.',
      "La bodega está en L'Ampolla.",
    ],
    unverified: [
      'La web no publica visitas privadas para grupos: hay que consultarlo directamente.',
      'Preguntar por opciones sin gluten para Patri en la degustación.',
    ],
  },
  {
    id: 'lotipic',
    day: 'Viernes 6',
    name: 'Lo Típic del Mediterrani',
    what: 'Cena para nueve, 21:00',
    phone: ['977 46 82 92'],
    links: [
      { label: 'Reservar', href: 'https://lotipic.myrestoo.net/es/reservar' },
      { label: 'Web', href: 'https://lotipic.es/' },
      { label: 'Maps', href: maps("Lo Típic del Mediterrani L'Ampolla") },
    ],
    facts: ['Teléfono publicado en su web: 977 46 82 92.', 'Cierra los martes por descanso semanal.', 'Reservas por formulario online.'],
  },
  {
    id: 'monnatura',
    day: 'Sábado 7',
    name: 'MónNatura Delta de l\'Ebre',
    what: 'Visita a las 10:00',
    links: [
      { label: 'Web', href: 'https://www.monnaturadelta.com/es/' },
      { label: 'Maps', href: maps('MónNatura Delta de l\'Ebre Amposta') },
    ],
    facts: ['Carretera del Poblenou a les Salines, s/n. Polígon 78, parcel·la 7, 43870 Amposta.'],
    unverified: ['Horario de noviembre, precio y necesidad de reserva no verificados en su web: consultar antes del sábado.'],
  },
  {
    id: 'casa-nuri',
    day: 'Sábado 7',
    name: 'Casa Nuri',
    what: 'Comida para nueve, 14:00',
    phone: ['977 48 01 28'],
    links: [
      { label: 'Web', href: 'https://restaurantnuri.com/' },
      { label: 'Maps', href: maps('Restaurant Casa Nuri Delta de l\'Ebre') },
    ],
    facts: ['Reservas únicamente por teléfono, según su web.', 'Teléfono publicado: 977 48 01 28.'],
    unverified: ['Dirección exacta no publicada en la portada de su web: confirmarla al reservar.'],
  },
  {
    id: 'fontscaldes',
    day: 'Domingo 8',
    name: 'Masia Fontscaldes',
    what: 'Calçotada para nueve, 12:45–15:15',
    phone: ['977 612 836', '651 360 112'],
    links: [
      { label: 'Web', href: 'https://masiafontscaldes.com/calcotadas/?lang=es' },
      { label: 'Maps', href: maps('Masia Fontscaldes Valls') },
    ],
    facts: [
      'C. Josep Busquets, s/n. 43813 Fontscaldes (Tarragona).',
      'En octubre y noviembre abre viernes, sábados, domingos y festivos, según su web.',
      'Precio de referencia publicado: 44 € + 10 % IVA por persona. No es un precio confirmado para el grupo.',
    ],
    unverified: ['Pendiente de confirmar que haya calçots el 8 de noviembre: la temporada acaba de empezar.'],
  },
  {
    id: 'can-pinana',
    day: 'Lunes 9',
    name: 'Can Piñana',
    what: 'Comida de despedida para nueve, 13:30',
    phone: ['977 46 00 33'],
    links: [
      { label: 'Web', href: 'https://canpinana.com/' },
      { label: 'Maps', href: maps("Can Piñana L'Ampolla") },
    ],
    facts: ["En L'Ampolla.", 'Reservas por teléfono: 977 46 00 33.'],
  },
];

export const reservationById = Object.fromEntries(reservations.map((r) => [r.id, r])) as Record<string, Reservation>;

export const events = [
  {
    name: "L'Embutada · Fiesta del Vino Joven",
    href: 'https://www.tarragonaturisme.cat/es/eventos/lembutada-fiesta-vino-joven-tarragona',
    facts: ['7 y 8 de noviembre de 2026.', 'Plaça del Rei, Tarragona.', 'Vino joven, gastronomía y actividades.'],
    unverified: ['El horario no aparece en la ficha consultada; la franja 17:30–20:00 es el plan del grupo, no un horario oficial.'],
  },
  {
    name: 'Festast · Tortosa',
    href: 'https://tortosafira.cat/festast/',
    facts: ['Del 6 al 8 de noviembre de 2026.', 'Pabellón ferial de Tortosa.', 'Entrada gratuita, según su web.'],
    unverified: ['Horario del viernes no consultado: comprobar si encaja con la mañana en Tortosa.'],
  },
];
