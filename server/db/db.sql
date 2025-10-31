-- 1. Create the Questions table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text TEXT NOT NULL,
    explanation TEXT,
    answer TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create the Options table linked to Questions
CREATE TABLE options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_char CHAR(1) NOT NULL,
    option_text TEXT NOT NULL
);

-- 3. Create a Specialties table for unique specialties
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- 4. Create a junction table to link Questions and Specialties (Many-to-Many)
CREATE TABLE question_specialties (
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    specialty_id INTEGER NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, specialty_id)
);

-- 5. Create a Related Terms table for unique terms
CREATE TABLE related_terms (
    id SERIAL PRIMARY KEY,
    term TEXT UNIQUE NOT NULL
);

-- 6. Create a junction table to link Questions and Related Terms (Many-to-Many)
CREATE TABLE question_related_terms (
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    term_id INTEGER NOT NULL REFERENCES related_terms(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, term_id)
);