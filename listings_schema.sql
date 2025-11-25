-- Create listings table
create table listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text not null,
  price numeric not null,
  currency text default 'EUR',
  category text not null,
  images text[] default array[]::text[],
  location jsonb default '{}'::jsonb,
  status text default 'active' check (status in ('active', 'sold', 'draft')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table listings enable row level security;

-- Policies
create policy "Listings are viewable by everyone." on listings
  for select using (true);

create policy "Users can insert their own listings." on listings
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own listings." on listings
  for update using (auth.uid() = user_id);

create policy "Users can delete their own listings." on listings
  for delete using (auth.uid() = user_id);

-- Storage bucket for listing images
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Listing images are publicly accessible." on storage.objects
  for select using (bucket_id = 'listing-images');

create policy "Authenticated users can upload listing images." on storage.objects
  for insert with check (
    bucket_id = 'listing-images' and
    auth.role() = 'authenticated'
  );

create policy "Users can update their own listing images." on storage.objects
  for update using (
    bucket_id = 'listing-images' and
    auth.uid() = owner
  );

create policy "Users can delete their own listing images." on storage.objects
  for delete using (
    bucket_id = 'listing-images' and
    auth.uid() = owner
  );
