import { useEffect, useState, type ComponentType } from 'react';
import { motion } from 'motion/react';
import { SectionHead } from '../ui/SectionHead';
import { Bingo } from '../games/Bingo';
import { EduSimulator } from '../games/EduSimulator';
import { SofaCourt } from '../games/SofaCourt';
import { Derroche } from '../games/Derroche';
import { BmwCounter } from '../games/BmwCounter';
import { Predictions } from '../games/Predictions';
import { ShoeCourt } from '../games/ShoeCourt';
import { Missions } from '../games/Missions';

const tabs: { id: string; label: string; ministry: string; Component: ComponentType }[] = [
  { id: 'bingo', label: 'Bingo', ministry: 'Ministerio de Azar Controlado', Component: Bingo },
  { id: 'edu', label: 'Ideas de Edu', ministry: 'Oposición Permanente', Component: EduSimulator },
  { id: 'sofa', label: 'Tribunal del Sofá', ministry: 'Ministerio de Vivienda Precaria', Component: SofaCourt },
  { id: 'derroche', label: 'Derroche', ministry: 'Ministerio del Derroche vs. Hacienda', Component: Derroche },
  { id: 'bmw', label: 'Porra BMW', ministry: 'Hacienda · Unidad de Motor', Component: BmwCounter },
  { id: 'porra', label: 'Predicciones', ministry: 'Ministerio de Apuestas Sin Dinero', Component: Predictions },
  { id: 'calzado', label: 'Calzado', ministry: 'Tribunal Superior del Calzado', Component: () => <ShoeCourt /> },
  { id: 'misiones', label: 'Misiones', ministry: 'Servicio de Inteligencia', Component: Missions },
];

export function Games() {
  const [active, setActive] = useState('bingo');
  const tab = tabs.find((t) => t.id === active)!;

  useEffect(() => {
    const onGame = (e: Event) => setActive((e as CustomEvent<string>).detail);
    window.addEventListener('pd26:game', onGame);
    return () => window.removeEventListener('pd26:game', onGame);
  }, []);

  return (
    <section id="ministerios" className="grain bg-ink px-4 py-20 text-paper sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          dark
          number="07"
          kicker="Juegos PANCREAS · Ocho ministerios lúdicos"
          title={
            <>
              Ministerios <span className="text-gold">lúdicos</span>
            </>
          }
          intro="Todo funciona de verdad y se guarda en tu móvil. Nada se comparte entre dispositivos salvo que se diga lo contrario."
        />

        <div role="tablist" aria-label="Juegos" className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={`min-h-12 border-2 px-3 py-2 text-left font-display text-xl font-black uppercase leading-none transition-colors ${
                active === t.id ? 'border-gold bg-gold text-ink' : 'border-paper/25 hover:border-paper'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-10" role="tabpanel" id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`}>
          <p className="kicker text-gold">{tab.ministry}</p>
          <motion.div key={tab.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-4">
            <tab.Component />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
