-- FLASHCARD SYSTEM
-- Categories are created automatically when plans are created
-- Cards are generated from lessons and can be manually created
-- Supports spaced repetition learning

create table if not exists public.flashcard_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  goal_id uuid references public.learning_goals(id) on delete cascade,
  name text not null,
  description text,
  color text default '#6366f1', -- hex color for UI
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, goal_id) -- one category per goal per user
);

create index if not exists flashcard_categories_user_idx 
  on public.flashcard_categories (user_id);

create index if not exists flashcard_categories_goal_idx 
  on public.flashcard_categories (goal_id);

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid not null references public.flashcard_categories(id) on delete cascade,
  goal_id uuid references public.learning_goals(id) on delete cascade,
  lesson_day_index int, -- which day lesson this came from (nullable for manual cards)
  
  -- Card content
  front text not null,
  back text not null,
  
  -- Spaced repetition data
  difficulty text default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  mastery_score real default 0.0 check (mastery_score >= 0 and mastery_score <= 100),
  review_count int default 0,
  last_reviewed_at timestamptz,
  next_review_at timestamptz default now(), -- due now by default
  
  -- Spaced repetition intervals (in days)
  current_interval real default 1.0,
  ease_factor real default 2.5, -- SM-2 algorithm ease factor
  
  -- Metadata
  source text default 'manual' check (source in ('manual', 'lesson', 'generated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists flashcards_user_idx 
  on public.flashcards (user_id);

create index if not exists flashcards_category_idx 
  on public.flashcards (category_id);

create index if not exists flashcards_goal_idx 
  on public.flashcards (goal_id);

create index if not exists flashcards_review_due_idx 
  on public.flashcards (user_id, next_review_at);

create index if not exists flashcards_lesson_day_idx 
  on public.flashcards (goal_id, lesson_day_index);

-- Review history for analytics
create table if not exists public.flashcard_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  flashcard_id uuid not null references public.flashcards(id) on delete cascade,
  
  -- Review data
  difficulty_rating text not null check (difficulty_rating in ('easy', 'medium', 'hard')),
  response_time_ms int, -- how long to answer
  was_correct boolean default true,
  
  -- Spaced repetition update
  old_interval real,
  new_interval real,
  old_ease_factor real,
  new_ease_factor real,
  
  reviewed_at timestamptz not null default now()
);

create index if not exists flashcard_reviews_user_idx 
  on public.flashcard_reviews (user_id);

create index if not exists flashcard_reviews_card_idx 
  on public.flashcard_reviews (flashcard_id);

create index if not exists flashcard_reviews_date_idx 
  on public.flashcard_reviews (user_id, reviewed_at);

-- RLS Policies
alter table public.flashcard_categories enable row level security;
alter table public.flashcards enable row level security;
alter table public.flashcard_reviews enable row level security;

-- Users can only access their own flashcard data
create policy "Users can manage their own flashcard categories"
  on public.flashcard_categories for all
  using (auth.uid() = user_id);

create policy "Users can manage their own flashcards"
  on public.flashcards for all
  using (auth.uid() = user_id);

create policy "Users can manage their own flashcard reviews"
  on public.flashcard_reviews for all
  using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_flashcard_categories_updated_at
  before update on public.flashcard_categories
  for each row execute function update_updated_at_column();

create trigger update_flashcards_updated_at
  before update on public.flashcards
  for each row execute function update_updated_at_column();
