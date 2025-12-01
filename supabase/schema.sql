-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Sync with Supabase Auth)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Projects Table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by text -- Display name of creator
);

-- 3. Project Members Table (For Sharing)
create table project_members (
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  role text default 'viewer', -- 'viewer', 'editor', 'admin'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (project_id, user_id)
);

-- 4. Items Table
create table items (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  category text not null, -- 'screen', 'api', 'db', etc.
  title text not null,
  description text,
  status text default 'todo', -- 'todo', 'in-progress', 'done'
  priority text default 'medium', -- 'low', 'medium', 'high'
  tags text[],
  details jsonb default '{}'::jsonb, -- Flexible storage for specific fields (variables, functions, etc.)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies

-- Profiles: Everyone can read profiles (for sharing), Users can update their own
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Projects: Users can view their own projects or projects shared with them
alter table projects enable row level security;
create policy "Users can view own projects" on projects for select using (
  auth.uid() = user_id or 
  exists (select 1 from project_members where project_id = projects.id and user_id = auth.uid())
);
create policy "Users can insert own projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on projects for delete using (auth.uid() = user_id);

-- Project Members: Project owners can manage members
alter table project_members enable row level security;
create policy "Members are viewable by project members" on project_members for select using (
  exists (select 1 from projects where id = project_members.project_id and (user_id = auth.uid() or 
    exists (select 1 from project_members pm where pm.project_id = projects.id and pm.user_id = auth.uid())
  ))
);
create policy "Project owners can insert members" on project_members for insert with check (
  exists (select 1 from projects where id = project_id and user_id = auth.uid())
);
create policy "Project owners can delete members" on project_members for delete using (
  exists (select 1 from projects where id = project_id and user_id = auth.uid())
);

-- Items: Users can view/edit items in projects they have access to
alter table items enable row level security;
create policy "Users can view items in accessible projects" on items for select using (
  exists (select 1 from projects where id = items.project_id and (user_id = auth.uid() or 
    exists (select 1 from project_members where project_id = projects.id and user_id = auth.uid())
  ))
);
create policy "Users can insert items in accessible projects" on items for insert with check (
  exists (select 1 from projects where id = project_id and (user_id = auth.uid() or 
    exists (select 1 from project_members where project_id = projects.id and user_id = auth.uid())
  ))
);
create policy "Users can update items in accessible projects" on items for update using (
  exists (select 1 from projects where id = items.project_id and (user_id = auth.uid() or 
    exists (select 1 from project_members where project_id = projects.id and user_id = auth.uid())
  ))
);
create policy "Users can delete items in accessible projects" on items for delete using (
  exists (select 1 from projects where id = items.project_id and (user_id = auth.uid() or 
    exists (select 1 from project_members where project_id = projects.id and user_id = auth.uid())
  ))
);

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
