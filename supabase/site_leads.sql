create table if not exists public.site_leads (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  nome        text not null check (char_length(nome) between 1 and 120),
  empresa     text not null check (char_length(empresa) between 1 and 160),
  porte       text check (char_length(porte) <= 40),
  area        text check (char_length(area) <= 80),
  pagina      text check (char_length(pagina) <= 300)
);

comment on table public.site_leads is
  'SITE Lynus Tech: leads do formulário de contato. Não é usado pelo app fitness.';

alter table public.site_leads enable row level security;

-- Visitante do site: só pode inserir estas colunas.
revoke all on public.site_leads from anon, authenticated;
grant insert (nome, empresa, porte, area, pagina) on public.site_leads to anon;

drop policy if exists "site: visitante só insere" on public.site_leads;
create policy "site: visitante só insere"
  on public.site_leads for insert to anon
  with check (true);
