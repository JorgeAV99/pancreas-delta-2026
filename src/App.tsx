import { IdentityProvider } from './lib/identity';
import { Nav } from './components/sections/Nav';
import { Hero, Marquee } from './components/sections/Hero';
import { Decree } from './components/sections/Decree';
import { Cast } from './components/sections/Cast';
import { Origins } from './components/sections/Origins';
import { Palace } from './components/sections/Palace';
import { Itinerary } from './components/sections/Itinerary';
import { Ceremony } from './components/sections/Ceremony';
import { Games } from './components/sections/Games';
import { Awards } from './components/sections/Awards';
import { Annex } from './components/sections/Annex';
import { Epilogue } from './components/sections/Epilogue';
import { AIEmergency, GaliciaMode } from './components/sections/Overlays';

export default function App() {
  return (
    <IdentityProvider>
      <a href="#decreto" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2">
        Saltar al contenido
      </a>
      <Nav />
      <main>
        <Hero />
        <Marquee
          className="bg-terra text-paper"
          items={['Organiza Patri', 'Gobierna Jorge', 'Hospeda Luz', 'Cuestiona Edu', 'Fiscaliza David', 'Audita Froiz', 'Comunica Ángela', 'Debuta Ana', 'Milla duerme en el sofá']}
        />
        <Decree />
        <Cast />
        <Origins />
        <Palace />
        <Itinerary />
        <Ceremony />
        <Games />
        <Awards />
        <Annex />
        <Epilogue />
      </main>
      <GaliciaMode />
      <AIEmergency />
    </IdentityProvider>
  );
}
