-- Supabase / PostgreSQL schema for Cloudfund Next.js

create table if not exists users (
  id bigint generated always as identity primary key,
  name text not null,
  email text unique not null,
  phone text,
  password_hash text not null,
  balance numeric(12,2) default 0.00 not null,
  status text default 'active' not null,
  package_id bigint,
  created_at timestamp with time zone default now() not null
);

create table if not exists admins (
  id bigint generated always as identity primary key,
  name text not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamp with time zone default now() not null
);

create table if not exists packages (
  id bigint generated always as identity primary key,
  name text not null,
  amount numeric(12,2) not null,
  monthly_return integer not null,
  max_trade integer not null,
  support_level text not null,
  created_at timestamp with time zone default now() not null
);

create table if not exists transactions (
  id bigint generated always as identity primary key,
  user_id bigint references users(id) on delete cascade,
  type text not null,
  amount numeric(12,2) not null,
  status text default 'pending' not null,
  created_at timestamp with time zone default now() not null
);

create table if not exists loans (
  id bigint generated always as identity primary key,
  user_id bigint references users(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  phone text,
  net_income numeric(12,2),
  amount numeric(12,2) not null,
  tenure integer not null,
  status text default 'pending' not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone
);

insert into packages (name, amount, monthly_return, max_trade, support_level) values
('Starter', 100, 8, 1, 'Basic'),
('Standard', 500, 12, 3, 'Priority'),
('Premium', 1500, 18, 5, 'Dedicated')
on conflict do nothing;
