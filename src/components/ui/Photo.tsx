import { useState } from 'react';
import type { MediaImage } from '../../data/media';

type Props = {
  image: MediaImage;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  fallbackLabel?: string;
  minimal?: boolean;
};

export function Photo({ image, sizes = '(min-width: 1024px) 33vw, 50vw', className = '', imgClassName = '', eager, fallbackLabel, minimal }: Props) {
  const [failed, setFailed] = useState(false);
  if ((!image.src || failed) && minimal) {
    return (
      <div role="img" aria-label={image.alt} className={`grid place-items-center bg-ink font-display font-black text-paper ${className}`}>
        {(fallbackLabel ?? image.alt).charAt(0)}
      </div>
    );
  }
  if (!image.src || failed) {
    return (
      <div
        role="img"
        aria-label={`${image.alt} (fotografía pendiente)`}
        className={`relative flex items-center justify-center overflow-hidden bg-paper-2 text-ink/25 ${className}`}
      >
        <div className="stripes absolute inset-0 opacity-40" />
        <div className="relative m-4 border-2 border-dashed border-ink/40 bg-paper px-4 py-3 text-center text-ink">
          <p className="kicker text-terra">Archivo pendiente</p>
          <p className="mt-1 font-serif text-lg italic leading-tight">{fallbackLabel ?? image.alt}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes}
        alt={image.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : undefined}
        onError={() => setFailed(true)}
        style={image.position ? { objectPosition: image.position } : undefined}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
