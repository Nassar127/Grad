create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";
create extension if not exists btree_gist;

do $$
begin
  if not exists (select from pg_roles where rolname = 'app') then
    create role app login password 'app';
  end if;
end$$;

grant connect on database medilearn to app;

\connect medilearn

grant usage, create on schema public to app;

grant all on all tables in schema public to app;
grant all on all sequences in schema public to app;
alter default privileges in schema public grant all on tables to app;
alter default privileges in schema public grant all on sequences to app;
