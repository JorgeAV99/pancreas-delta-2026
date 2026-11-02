import type { PersonId } from './people';
import type { Link } from './reservations';

export type Flag = 'gluten' | 'conductores' | 'opcional' | 'calzado' | 'fauna' | 'tiempo' | 'teletrabajo';

export type ItineraryEvent = {
  time: string;
  title: string;
  place?: string;
  text: string;
  reservation?: string;
  flags?: Flag[];
  links?: Link[];
  people?: PersonId[];
  bullets?: string[];
  note?: string;
  anchor?: string;
};

export type Episode = {
  id: string;
  number: string;
  weekday: string;
  date: string;
  code: string;
  title: string;
  subtitle?: string;
  narrative: string;
  color: string;
  cast: PersonId[];
  events: ItineraryEvent[];
  challenge?: { title: string; items: string[]; note: string };
  gags?: string[];
  note?: string;
};

const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const flagLabels: Record<Flag, string> = {
  gluten: 'Sin gluten: consultar',
  conductores: 'Conductores: 0,0',
  opcional: 'Opcional',
  calzado: 'Calzado cerrado',
  fauna: 'Respetar la fauna',
  tiempo: 'Según meteorología',
  teletrabajo: 'Teletrabajo',
};

export const episodes: Episode[] = [
  {
    id: 'ep1',
    number: '01',
    weekday: 'Jueves',
    date: '5 nov',
    code: 'OPERACIÓN DESEMBARCO',
    title: 'Operación Desembarco',
    narrative:
      'Nueve personas parten de Madrid. Una ya está reclamando una cama. Otra ha propuesto cambiar el recorrido. Y Jorge está considerando una parada gastronómica que requiere financiación extraordinaria.',
    color: '#0E4552',
    cast: ['froiz', 'david', 'jorge', 'edu'],
    events: [
      {
        time: '17:00',
        title: 'Salida desde Madrid',
        text: 'Tarde y noche de carretera. Froiz protesta porque cada kilómetro lo aleja de Vigo. Edu propone una ruta alternativa optimizada por IA. Jorge empieza a estudiar el consumo del BMW.',
        people: ['froiz', 'edu', 'jorge'],
      },
      {
        time: 'En ruta',
        title: 'Cena durante el trayecto',
        text: 'Parada técnica para cenar. David intenta limitar el gasto a un menú razonable; Jorge busca la estrella Michelin más cercana a la autovía.',
        flags: ['gluten'],
        people: ['david', 'jorge'],
      },
      {
        time: 'Tarde',
        title: "Llegada a L'Ampolla",
        text: 'Hora de llegada sin determinar: depende del tráfico, de las paradas y de cuántas veces se mencione el consumo del coche.',
      },
      {
        time: 'Al llegar',
        title: 'Instalación en el Palacio Presidencial',
        text: 'Reparto de habitaciones según la doctrina vigente: cuatro parejas, cuatro camas, un sofá. Milla presenta su primera reclamación. A dormir.',
        people: ['milla'],
      },
    ],
  },
  {
    id: 'ep2',
    number: '02',
    weekday: 'Viernes',
    date: '6 nov',
    code: 'GOLPE DE ESTADO CON SAKE',
    title: 'Golpe de Estado con sake',
    narrative: 'Tres personas sin reuniones. Seis secuestradas por el capitalismo. Una misión: conseguir comida para nueve.',
    color: '#C2532B',
    cast: ['milla', 'luz', 'jorge'],
    events: [
      {
        time: '09:30',
        title: 'Operación Desempleados',
        place: 'Tortosa',
        text: 'Teletrabajan todos menos Milla, Luz y Jorge, que salen hacia Tortosa con una misión de abastecimiento.',
        flags: ['teletrabajo'],
        people: ['milla', 'luz', 'jorge'],
        bullets: [
          'Paseo por el casco histórico.',
          'Mercado Municipal.',
          'Vermut.',
          'Festast, si el horario encaja (6–8 nov, pabellón ferial, entrada gratuita). Jorge, preocupado por la gratuidad.',
          "Regreso a L'Ampolla y compra para la casa.",
        ],
        links: [
          { label: 'Festast', href: 'https://tortosafira.cat/festast/' },
          { label: 'Mercat de Tortosa', href: maps('Mercat Municipal de Tortosa') },
        ],
      },
      {
        time: '15:15',
        title: 'Pollastre con patatas',
        place: 'En casa',
        text: 'Comida conjunta en el Palacio con pollos de Pollastres Eva. El Ministro de Gastronomía emitirá dictamen.',
        reservation: 'pollastres-eva',
        flags: ['gluten'],
        people: ['froiz'],
      },
      {
        time: '16:30',
        title: 'Cata de sake en Kan Kenshô',
        place: "L'Ampolla",
        text: 'Elaboración de sake y fermentados del Delta. Froiz descubre que producen sake junto al Mediterráneo. Edu propone una startup de fermentación autónoma. David pregunta si había una alternativa gratuita.',
        reservation: 'kensho',
        flags: ['gluten', 'conductores'],
        people: ['froiz', 'edu', 'david'],
        note: 'Plan B si no hay visita privada para nueve: reservar dos plazas de la visita «Descubrimiento» abierta si encajan, o sustituirla por vermut en el paseo marítimo y adelantar la ceremonia en la terraza. No hay disponibilidad confirmada.',
      },
      {
        time: '18:30',
        title: 'Ceremonia Inaugural PANCREAS Delta',
        place: 'Terraza del Palacio',
        text: 'Brindis, proclamación de Jorge, nombramiento de Patri, ciudadanía para Ana, adjudicación del sofá, Constitución, Bingo, porra del BMW y fotografía oficial.',
        anchor: 'ceremonia',
      },
      {
        time: '21:00',
        title: 'Cena en Lo Típic del Mediterrani',
        place: "L'Ampolla",
        text: 'Primera cena institucional. Jorge mira la carta por la derecha; David, por la izquierda.',
        reservation: 'lotipic',
        flags: ['gluten'],
        people: ['jorge', 'david'],
      },
      {
        time: '23:00',
        title: "Copas por L'Ampolla",
        text: 'Plan opcional. Local sin fijar: se decidirá sobre la marcha, previsiblemente por Jorge.',
        flags: ['opcional'],
      },
    ],
  },
  {
    id: 'ep3',
    number: '03',
    weekday: 'Sábado',
    date: '7 nov',
    code: 'OPERACIÓN FLAMENCO',
    title: 'Operación Flamenco',
    subtitle: 'Territorio hostil para Froiz',
    narrative:
      'Un día entero en el Delta del Ebro. Arrozales, lagunas, flamencos y kilómetros de territorio no gallego. Sin barco: el grupo lo ha descartado.',
    color: '#1E4A36',
    cast: ['patri', 'froiz', 'edu', 'david', 'jorge', 'angela'],
    events: [
      { time: '09:15', title: "Salida de L'Ampolla", text: 'Puntualidad exigida por Patri y registrada en Strava.', people: ['patri'] },
      {
        time: '10:00',
        title: 'MónNatura Delta de l\'Ebre',
        place: 'Amposta',
        text: 'Centro de naturaleza junto a las salinas. Edu propone visión artificial para contar flamencos.',
        reservation: 'monnatura',
        flags: ['fauna'],
        people: ['edu'],
      },
      {
        time: '11:30',
        title: 'Miradores de la Tancada',
        text: 'Laguna y aves. David calcula cuánto cuesta observar cada ejemplar.',
        flags: ['fauna', 'calzado'],
        links: [{ label: 'Maps', href: maps('Mirador de la Tancada Delta de l\'Ebre') }],
        people: ['david'],
      },
      {
        time: '12:00',
        title: 'Playa del Trabucador',
        text: 'La lengua de arena entre el mar y la bahía. Froiz soporta la playa en noviembre como acto de servicio.',
        flags: ['tiempo', 'calzado'],
        links: [{ label: 'Maps', href: maps('Platja del Trabucador') }],
        people: ['froiz'],
      },
      {
        time: '14:00',
        title: 'Comida en Casa Nuri',
        text: 'Arroces del Delta bajo auditoría gallega. Jorge propone pedir de todo. David propone pedir de algo.',
        reservation: 'casa-nuri',
        flags: ['gluten'],
        people: ['froiz', 'jorge', 'david'],
      },
      {
        time: '16:15',
        title: 'Garxal y mirador del Zigurat',
        text: 'Última ronda de observación. Si el día va cargado, se recorta aquí.',
        flags: ['fauna', 'calzado'],
        links: [
          { label: 'Garxal', href: maps('Garxal Delta de l\'Ebre') },
          { label: 'Zigurat', href: maps('Mirador del Zigurat Delta de l\'Ebre') },
        ],
      },
      { time: '≈ 18:00', title: "Regreso a L'Ampolla", text: 'Patri cierra la actividad en Strava. Froiz se seca las lágrimas de nostalgia atlántica.' },
      {
        time: '20:30',
        title: 'Cena en casa',
        place: 'Palacio',
        text: 'Picoteo, vino, copas y música. Terraza si el tiempo acompaña.',
        flags: ['gluten'],
      },
      { time: '22:00', title: 'Juegos PANCREAS', text: 'Quiz, bingo y misiones secretas.', anchor: 'ministerios' },
      {
        time: '23:30',
        title: 'I Gala de los Premios Delta',
        text: 'Votaciones, discursos y estatuillas imaginarias. El gran evento del viaje.',
        anchor: 'premios',
      },
    ],
    challenge: {
      title: 'Desafío fotográfico del Delta',
      items: [
        'Mejor fotografía de un flamenco.',
        'Mejor fotografía de paisaje.',
        'Fotografía grupal más absurda.',
        'Recreación de una portada de disco.',
      ],
      note: 'Por equipos. Sin acercarse a la fauna, sin salir de los caminos y sin alterar las zonas protegidas.',
    },
    gags: [
      'Patri registra toda la excursión en Strava.',
      'Froiz soporta un día entero rodeado de territorio no gallego.',
      'Edu propone visión artificial para contar flamencos.',
      'David calcula cuánto cuesta observar cada ave.',
      'Jorge propone contratar un servicio premium de observación de flamencos.',
      'Ángela afronta el dilema: ¿manoletinas o Air Force para los humedales? El Ministerio de Sanidad recomienda una tercera vía: calzado cerrado con agarre.',
    ],
    note: 'Horarios orientativos y trayectos por verificar en Maps. Si el recorrido va cargado: prioridad para MónNatura, Trabucador y Casa Nuri; se reducen miradores.',
  },
  {
    id: 'ep4',
    number: '04',
    weekday: 'Domingo',
    date: '8 nov',
    code: 'LOS CALÇOTS DE LA DISCORDIA',
    title: 'Los calçots de la discordia',
    narrative:
      'Jorge ha encontrado un evento donde gastar dinero en muchas copas pequeñas. David ha solicitado una auditoría. Ángela está decidiendo si el vino joven exige manoletinas o Air Force.',
    color: '#6B1C28',
    cast: ['jorge', 'david', 'angela'],
    events: [
      { time: 'Mañana', title: "Salida hacia l'Alt Camp", text: 'Rumbo a la comarca de Valls con margen para llegar a las 12:45. Hora exacta por decidir.' },
      {
        time: '12:45',
        title: 'Calçotada en Masia Fontscaldes',
        place: 'Fontscaldes, Valls',
        text: 'Menú tradicional de calçots, salsa y carne hasta las 15:15. Si no hay calçots el día 8, se busca restaurante alternativo en la zona, sin reserva hecha todavía.',
        reservation: 'fontscaldes',
        flags: ['gluten', 'conductores'],
      },
      {
        time: '16:15',
        title: 'Tarragona',
        text: 'Part Alta, entorno de la catedral, casco histórico, Balcó del Mediterrani y vistas exteriores del anfiteatro romano. Sin visitas interiores a monumentos cerrados.',
        links: [
          { label: 'Balcó del Mediterrani', href: maps('Balcó del Mediterrani Tarragona') },
          { label: 'Catedral', href: maps('Catedral de Tarragona') },
        ],
      },
      {
        time: '17:30',
        title: "L'Embutada",
        place: 'Plaça del Rei, Tarragona',
        text: 'Fiesta del vino joven (7 y 8 de noviembre de 2026). Vino, gastronomía y ambiente local, con desafío fotográfico por el casco histórico. Plan hasta las 20:00.',
        flags: ['conductores'],
        links: [{ label: 'Ficha oficial', href: 'https://www.tarragonaturisme.cat/es/eventos/lembutada-fiesta-vino-joven-tarragona' }],
      },
      { time: '≈ 20:00', title: "Regreso a L'Ampolla", text: 'Con conductores que no hayan bebido. Ni calçotada ni Embutada para quien conduce.', flags: ['conductores'] },
    ],
    challenge: {
      title: 'Desafío fotográfico en la Part Alta',
      items: ['Foto con la catedral sin que salga ningún turista.', 'Recreación de una escena romana con vasos de vino joven.', 'La mejor foto del Balcó del Mediterrani.'],
      note: 'Sin escalar muros ni monumentos.',
    },
  },
  {
    id: 'ep5',
    number: '05',
    weekday: 'Lunes',
    date: '9 nov',
    code: 'EL ÚLTIMO ARROZ',
    title: 'El último arroz',
    narrative:
      'Milla abandona el sofá. Froiz recupera la esperanza de volver a Vigo. David repasa los gastos. Ángela guarda sus manoletinas. Jorge asegura que el próximo viaje lo organizará otra persona y ya está mirando restaurantes.',
    color: '#B07A2A',
    cast: ['milla', 'froiz', 'david', 'angela', 'jorge'],
    events: [
      { time: '09:30', title: 'Desayuno y equipaje', text: 'Maletas, café y repaso de objetos olvidados.' },
      {
        time: '10:00',
        title: 'Ruta costera hacia Cala Maria y Cap Roig',
        text: "Desde L'Ampolla por la costa. La distancia se ajusta al tiempo disponible y a la meteorología.",
        flags: ['tiempo', 'calzado'],
        links: [{ label: 'Cap Roig', href: maps("Cap Roig L'Ampolla") }],
      },
      { time: '12:30', title: 'Recogida y revisión de la casa', text: 'El Palacio se devuelve mejor de lo que estaba. Los yayos lo merecen.' },
      {
        time: '13:30',
        title: 'Comida en Can Piñana',
        place: "L'Ampolla",
        text: 'El último arroz. Auditoría final de Froiz; auditoría final de David; propuesta final de Jorge.',
        reservation: 'can-pinana',
        flags: ['gluten'],
      },
      { time: '≈ 15:30', title: 'Salida hacia Madrid', text: 'Fin del Estado de Excepción. La democracia sigue sin restablecerse.' },
    ],
  },
];
