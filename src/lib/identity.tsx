import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PersonId } from '../data/people';
import { useStored } from './storage';
import { IdentityPicker } from '../components/ui/IdentityPicker';

type Api = { me: PersonId | null; setMe: (id: PersonId | null) => void; ask: () => void };

const Ctx = createContext<Api | null>(null);

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useStored<PersonId | null>('identity', null);
  const [open, setOpen] = useState(false);
  return (
    <Ctx.Provider value={{ me, setMe, ask: () => setOpen(true) }}>
      {children}
      <IdentityPicker
        open={open}
        current={me}
        onClose={() => setOpen(false)}
        onPick={(id) => {
          setMe(id);
          setOpen(false);
        }}
      />
    </Ctx.Provider>
  );
}

export function useIdentity() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('IdentityProvider missing');
  return ctx;
}
