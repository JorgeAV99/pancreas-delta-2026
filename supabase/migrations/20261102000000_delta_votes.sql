create table if not exists public.delta_votes (
  category text not null check (category in (
    'amenaza', 'victima', 'inspector', 'despilfarro', 'frase', 'austeridad',
    'revelacion', 'aportacion', 'excel', 'contradiccion', 'vestuario'
  )),
  voter_id uuid not null,
  nominee text not null check (nominee in (
    'patri', 'froiz', 'milla', 'david', 'angela', 'edu', 'ana', 'luz', 'jorge'
  )),
  updated_at timestamptz not null default now(),
  primary key (category, voter_id)
);

alter table public.delta_votes enable row level security;

revoke all on public.delta_votes from anon, authenticated;

create or replace function public.cast_delta_vote(p_category text, p_nominee text, p_voter uuid)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.delta_votes (category, voter_id, nominee, updated_at)
  values (p_category, p_voter, p_nominee, now())
  on conflict (category, voter_id)
  do update set nominee = excluded.nominee, updated_at = now();
$$;

create or replace function public.delta_vote_totals()
returns table (category text, nominee text, votes bigint)
language sql
stable
security definer
set search_path = public
as $$
  select category, nominee, count(*) as votes
  from public.delta_votes
  group by category, nominee;
$$;

revoke all on function public.cast_delta_vote(text, text, uuid) from public;
revoke all on function public.delta_vote_totals() from public;
grant execute on function public.cast_delta_vote(text, text, uuid) to anon, authenticated;
grant execute on function public.delta_vote_totals() to anon, authenticated;
