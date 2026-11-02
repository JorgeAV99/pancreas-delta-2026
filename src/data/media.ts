import type { PersonId } from './people';

export type MediaImage = {
  src: string | null;
  srcSet?: string;
  alt: string;
  caption?: string;
  position?: string;
};

const base = import.meta.env.BASE_URL;

const img = (folder: string, id: string, widths: number[]) => ({
  src: `${base}images/${folder}/${id}-${widths[widths.length - 1]}.webp`,
  srcSet: widths.map((w) => `${base}images/${folder}/${id}-${w}.webp ${w}w`).join(', '),
});

const peopleWidths = [480, 900];

export const portraits: Record<PersonId, MediaImage> = {
  patri: { ...img('people', 'patri', peopleWidths), alt: 'Retrato de Patri' },
  froiz: { ...img('people', 'froiz', peopleWidths), alt: 'Retrato de Froiz' },
  milla: { ...img('people', 'milla', peopleWidths), alt: 'Retrato de Milla con una corona de cartón y un vaso en la mano' },
  david: { ...img('people', 'david', peopleWidths), alt: 'Retrato de David' },
  angela: { ...img('people', 'angela', peopleWidths), alt: 'Retrato de Ángela frente a una puesta de sol' },
  edu: { ...img('people', 'edu', peopleWidths), alt: 'Retrato de Edu cargando varias bolsas de patatas fritas' },
  ana: { ...img('people', 'ana', peopleWidths), alt: 'Retrato de Ana' },
  luz: { ...img('people', 'luz', peopleWidths), alt: 'Retrato de Luz en una barandilla frente al mar' },
  jorge: { ...img('people', 'jorge', peopleWidths), alt: 'Retrato de Jorge con camiseta amarilla y verde' },
};

export const house = {
  hero: {
    ...img('house', 'vistas', [720, 1200]),
    alt: 'El Mediterráneo desde la terraza de la casa de L\'Ampolla, con el sol sobre el mar y un espigón',
    caption: 'Vista desde la sede del Gobierno provisional. Distancia al mar: unos 30 metros.',
    position: '50% 38%',
  } satisfies MediaImage,
  sea: {
    ...img('house', 'vistas-mar', [800, 1200]),
    alt: 'Detalle del mar brillando bajo el sol frente a la casa',
    caption: 'El Mediterráneo, objeto de investigación del Ministerio de Gastronomía.',
  } satisfies MediaImage,
  gallery: [
    {
      src: null,
      alt: 'Terraza del Palacio',
      caption: 'Terraza institucional. Fotografía pendiente de desclasificar.',
    },
    {
      src: null,
      alt: 'Salón del Palacio',
      caption: 'Salón y sofá adjudicado. Fotografía pendiente.',
    },
  ] as MediaImage[],
};

export const officialPhoto: MediaImage = {
  src: null,
  alt: 'Fotografía oficial de los nueve integrantes de PANCREAS en la terraza',
  caption: 'Fotografía oficial del Gobierno PANCREAS. Se tomará el viernes 6 durante la ceremonia inaugural.',
};
