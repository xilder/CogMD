-- =================================================================
-- Module 1: User and Progress Module
-- Manages users, their learning progress, and session history.
-- =================================================================

-- Table: "user"
-- Stores public profile information, linked to Supabase's private auth table.
CREATE TABLE "user" (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE,
    full_name text,
    avatar_url text,
    plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
    xp_points integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE "user" IS 'Stores public user profile information and app-specific data like plan and points.';
COMMENT ON COLUMN "user".id IS 'Links directly to the auth.users table in Supabase.';
COMMENT ON COLUMN "user".plan IS 'For future monetization, controlling access to premium features.';
COMMENT ON COLUMN "user".xp_points IS 'For gamification features like leaderboards.';


-- =================================================================
-- Module 2: Core Content Module
-- Contains the questions, options, and their categorization.
-- =================================================================

-- Table: "tags"
-- A single, flexible table for all categorization (specialties, topics, etc.).
CREATE TABLE tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    type text NOT NULL CHECK (type IN ('SPECIALTY', 'TOPIC', 'RELATED_TERM')),
    created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE tags IS 'A unified table for categorizing questions (e.g., specialties, topics).';
COMMENT ON COLUMN tags.type IS 'Defines the category of the tag, crucial for filtering in the UI.';


-- Table: "questions"
-- Stores the core question data with rich metadata for analytics.
CREATE TABLE questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text text NOT NULL,
    explanation text NOT NULL,
    created_by_user_id uuid REFERENCES "user"(id) ON DELETE SET NULL,
    status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'flagged')),
    difficulty text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    times_answered integer NOT NULL DEFAULT 0,
    times_correct integer NOT NULL DEFAULT 0,
    avg_time_to_answer_ms integer,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

COMMENT ON TABLE questions IS 'Stores the core question content and community-driven analytics.';
COMMENT ON COLUMN questions.status IS 'Manages the content lifecycle (draft, published, flagged for review).';
COMMENT ON COLUMN questions.times_answered IS 'Powers dynamic, community-based difficulty calculation.';
COMMENT ON COLUMN questions.avg_time_to_answer_ms IS 'Advanced metric to identify complex or poorly worded questions.';


-- Table: "options"
-- Stores the multiple-choice options for each question.
CREATE TABLE options (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text text NOT NULL,
    is_correct boolean NOT NULL DEFAULT FALSE
);

COMMENT ON TABLE options IS 'Stores the answer choices for each question.';
COMMENT ON COLUMN options.question_id IS 'Ensures options are deleted if their parent question is deleted.';


-- Table: "question_tags" (Join Table)
-- Creates the many-to-many relationship between questions and tags.
CREATE TABLE question_tags (
    question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, tag_id)
);

COMMENT ON TABLE question_tags IS 'Links questions to multiple tags (specialties, topics, etc.).';


-- =================================================================
-- Module 3: User Interaction and SRS Module
-- The heart of the app, tracking learning and session data.
-- =================================================================

-- Table: "user_question_progress"
-- The core of the Spaced Repetition System.
CREATE TABLE user_question_progress (
    user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'learning', 'graduated', 'lapsed')),
    ease_factor numeric NOT NULL DEFAULT 2.5,
    current_interval integer NOT NULL DEFAULT 0,
    repetitions integer NOT NULL DEFAULT 0,
    next_review_at timestamptz NOT NULL,
    last_reviewed_at timestamptz,
    PRIMARY KEY (user_id, question_id)
);

COMMENT ON TABLE user_question_progress IS 'The core SRS engine, tracking each user''s progress on each question.';
COMMENT ON COLUMN user_question_progress.next_review_at IS 'The most important column for scheduling reviews.';


-- Table: "user_quiz_sessions"
-- Logs every study session a user starts.
CREATE TABLE user_quiz_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    session_type text NOT NULL CHECK (session_type IN ('review', 'new_learning', 'custom_practice')),
    started_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz
);

COMMENT ON TABLE user_quiz_sessions IS 'A log of every study session a user initiates, for tracking study habits.';
COMMENT ON COLUMN user_quiz_sessions.session_type IS 'Records the user''s intent for the study session.';


-- Join Table: "session_question"
-- Creates a many-to-many relationship between a quiz session and the questions it contains.
CREATE TABLE session_question (
    session_id uuid NOT NULL REFERENCES user_quiz_sessions(id) ON DELETE CASCADE,
    question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    PRIMARY KEY (session_id, question_id)
);

COMMENT ON TABLE session_question IS 'Stores the specific set of questions that belong to a user''s quiz session.';


-- Table: "user_session_answers"
-- A detailed log of every single answer a user gives.
CREATE TABLE user_session_answers (
    id bigserial PRIMARY KEY,
    session_id uuid NOT NULL REFERENCES user_quiz_sessions(id) ON DELETE CASCADE,
    question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id uuid REFERENCES options(id) ON DELETE SET NULL,
    is_correct boolean NOT NULL,
    time_to_answer_ms integer,
    answered_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE user_session_answers IS 'The raw data for all analytics, logging every answer.';
COMMENT ON COLUMN user_session_answers.selected_option_id IS 'Crucial for analyzing common mistakes and distractors.';
COMMENT ON COLUMN user_session_answers.time_to_answer_ms IS 'Advanced metric to differentiate hesitation from mastery.';


-- =================================================================
-- Module 4: Gamification and Community Module
-- Tables to support future features that increase engagement.
-- =================================================================

-- Table: "achievements"
-- A static table defining all possible badges/achievements.
CREATE TABLE achievements (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text NOT NULL,
    icon_url text,
    xp_reward integer NOT NULL DEFAULT 0
);

COMMENT ON TABLE achievements IS 'Defines all possible badges or achievements users can earn.';


-- Table: "user_achievements" (Join Table)
-- Records which achievements each user has earned.
CREATE TABLE user_achievements (
    user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    achievement_id integer NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, achievement_id)
);

COMMENT ON TABLE user_achievements IS 'Tracks which user has earned which achievement and when.';


-- Table: "content_reports"
-- Allows users to flag questions with issues.
CREATE TABLE content_reports (
    id bigserial PRIMARY KEY,
    question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    reported_by_user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    report_reason text NOT NULL CHECK (report_reason IN ('typo', 'incorrect_info', 'unclear', 'other')),
    comments text,
    status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
    created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE content_reports IS 'Enables community-driven content quality control.';
COMMENT ON COLUMN content_reports.status IS 'For admin workflow to track and resolve reported issues.';




-- This function fetches new questions for a user, with an optional filter by tag (e.g., specialty).
-- It returns a set of JSON objects, each representing a full question with its options.
CREATE OR REPLACE FUNCTION get_new_questions_for_user(
    p_user_id uuid,
    p_limit integer,
    p_tag_id uuid DEFAULT NULL -- This parameter is optional. If NULL, questions are pulled from any tag.
)
RETURNS SETOF json AS $$
BEGIN
    -- This query uses a conditional WHERE clause to handle both cases efficiently.
    RETURN QUERY
    SELECT
        -- Constructs the main JSON object for each question.
        json_build_object(
            'id', q.id,
            'question_text', q.question_text,
            -- This subquery builds the nested array of options for each question.
            'options', (
                SELECT json_agg(
                    json_build_object(
                        'id', o.id,
                        'option_text', o.option_text
                        -- Note: 'is_correct' is intentionally omitted here to encourage
                        -- active recall on the frontend. The correct answer is revealed later.
                    )
                )
                FROM options AS o
                WHERE o.question_id = q.id
            )
        )
    FROM
        questions AS q
    WHERE
        -- This is the crucial part: Filter out questions the user has already seen.
        NOT EXISTS (
            SELECT 1
            FROM user_question_progress AS uqp
            WHERE uqp.question_id = q.id AND uqp.user_id = p_user_id
        )
    AND
        -- This conditional clause applies the tag filter only if p_tag_id is provided.
        (p_tag_id IS NULL OR q.id IN (SELECT qt.question_id FROM question_tags qt WHERE qt.tag_id = p_tag_id))
    ORDER BY
        random() -- Shuffle the results to provide variety.
    LIMIT
        p_limit; -- Only return the number of questions requested.
END;
$$ LANGUAGE plpgsql;




-- This function now intelligently fetches due review questions with optional filters.
CREATE OR REPLACE FUNCTION get_due_review_questions(
    p_user_id uuid,
    p_limit integer, -- Optional: The maximum number of questions to return.
    p_tag_id uuid DEFAULT NULL -- Optional: The tag (e.g., specialty) to filter by.
)
RETURNS SETOF json AS $$
BEGIN
    RETURN QUERY
    SELECT
        -- The JSON object construction remains the same.
        json_build_object(
            'id', q.id,
            'question_text', q.question_text,
            'options', (
                SELECT json_agg(
                    json_build_object('id', o.id, 'option_text', o.option_text)
                )
                FROM options AS o
                WHERE o.question_id = q.id
            )
        )
    FROM
        questions AS q
    JOIN
        user_question_progress AS uqp ON q.id = uqp.question_id
    WHERE
        uqp.user_id = p_user_id
    AND
        uqp.next_review_at <= now() -- The core logic: find all cards scheduled for now or in the past.
    AND
        -- This is the new conditional logic:
        -- If p_tag_id is NULL, this condition is ignored.
        -- If p_tag_id is provided, it filters for questions with that tag.
        (p_tag_id IS NULL OR q.id IN (SELECT qt.question_id FROM question_tags qt WHERE qt.tag_id = p_tag_id))
    ORDER BY
        uqp.next_review_at ASC -- Prioritize the most overdue questions first.
    LIMIT
        p_limit;
END;
$$ LANGUAGE plpgsql;




-- This function processes a user's answer submission in a single atomic transaction.
-- It now includes logic to dynamically update the question's difficulty based on community performance.
CREATE OR REPLACE FUNCTION process_answer_submission(
    p_user_id uuid,
    p_session_id uuid,
    p_question_id uuid,
    p_selected_option_id uuid,
    p_performance_rating text,
    p_time_to_answer_ms integer
)
RETURNS json AS $$ -- It will return a single JSON object with all feedback.
DECLARE
    -- Variables to store feedback data for the final response.
    v_is_correct boolean;
    v_correct_option_id uuid;
    v_explanation text;

    -- Variables for the SRS calculation.
    v_current_repetitions integer;
    v_current_ease_factor numeric;
    v_current_interval integer;
    v_new_repetitions integer;
    v_new_ease_factor numeric;
    v_new_interval integer;
    v_next_review_at timestamptz;

    -- A variable to hold the entire updated progress record.
    v_updated_progress_record user_question_progress;
BEGIN
    -- Step 1: Determine if the selected answer was correct.
    SELECT o.is_correct INTO v_is_correct
    FROM options AS o
    WHERE o.id = p_selected_option_id;

    -- Step 2: Log the specific answer for this session.
    INSERT INTO user_session_answers (session_id, question_id, selected_option_id, is_correct, time_to_answer_ms, answered_at)
    VALUES (p_session_id, p_question_id, p_selected_option_id, v_is_correct, p_time_to_answer_ms, now());

    -- Step 3: Update the global statistics and difficulty for the question.
    UPDATE questions
    SET
        -- Update the running average for time to answer.
        avg_time_to_answer_ms = CASE
            WHEN avg_time_to_answer_ms IS NULL THEN p_time_to_answer_ms
            ELSE ((avg_time_to_answer_ms * (times_answered)) + p_time_to_answer_ms) / (times_answered + 1)
        END,

        times_answered = times_answered + 1,
        times_correct = times_correct + (CASE WHEN v_is_correct THEN 1 ELSE 0 END),
        
        -- ** NEW LOGIC: Dynamically update the difficulty **
        difficulty = CASE
            -- Only start adjusting difficulty after 20 answers to ensure statistical significance.
            WHEN (times_answered + 1) < 20 THEN difficulty -- Keep the current difficulty
            
            -- If the new correct ratio is high (>= 85%), the question is 'easy'.
            WHEN (times_correct + (CASE WHEN v_is_correct THEN 1 ELSE 0 END))::numeric / (times_answered + 1) >= 0.85 THEN 'easy'
            
            -- If the new correct ratio is low (<= 50%), the question is 'hard'.
            WHEN (times_correct + (CASE WHEN v_is_correct THEN 1 ELSE 0 END))::numeric / (times_answered + 1) <= 0.50 THEN 'hard'
            
            -- Otherwise, it's 'medium'.
            ELSE 'medium'
        END
    WHERE id = p_question_id
    RETURNING explanation INTO v_explanation; -- Also retrieve the explanation for the final response.

    -- Step 4: Fetch the user's current SRS progress for this question.
    SELECT repetitions, ease_factor, current_interval
    INTO v_current_repetitions, v_current_ease_factor, v_current_interval
    FROM user_question_progress
    WHERE user_id = p_user_id AND question_id = p_question_id;

    -- If no record exists, initialize with default values for the first review.
    IF NOT FOUND THEN
        v_current_repetitions := 0;
        v_current_ease_factor := 2.5;
        v_current_interval := 0;
    END IF;

    -- Step 5: Calculate new SRS values based on the user's performance rating (SM-2 logic).
    IF p_performance_rating = 'forgot' THEN
        v_new_repetitions := 0;
        v_new_interval := 1;
        v_new_ease_factor := GREATEST(1.3, v_current_ease_factor - 0.2);
    ELSE -- This handles 'good' or 'easy' ratings.
        v_new_repetitions := v_current_repetitions + 1;
        IF v_new_repetitions = 1 THEN
            v_new_interval := 1;
        ELSIF v_new_repetitions = 2 THEN
            v_new_interval := 6;
        ELSE
            v_new_interval := round(v_current_interval * v_current_ease_factor);
        END IF;

        IF p_performance_rating = 'easy' THEN
            v_new_ease_factor := v_current_ease_factor + 0.15;
        ELSE
            v_new_ease_factor := v_current_ease_factor;
        END IF;
    END IF;

    -- Calculate the next review date based on the new interval.
    v_next_review_at := now() + (v_new_interval * interval '1 day');

    -- Step 6: "Upsert" the user's progress record and capture the updated row.
    INSERT INTO user_question_progress (
        user_id, question_id, repetitions, ease_factor, current_interval, next_review_at, last_reviewed_at, status
    )
    VALUES (
        p_user_id, p_question_id, v_new_repetitions, v_new_ease_factor, v_new_interval, v_next_review_at, now(), 'learning'
    )
    ON CONFLICT (user_id, question_id) DO UPDATE
    SET
        repetitions = v_new_repetitions,
        ease_factor = v_new_ease_factor,
        current_interval = v_new_interval,
        next_review_at = v_next_review_at,
        last_reviewed_at = now(),
        status = 'learning'
    RETURNING * INTO v_updated_progress_record;

    -- Step 7: Fetch the actual correct option ID to return to the frontend.
    SELECT o.id INTO v_correct_option_id
    FROM options AS o
    WHERE o.question_id = p_question_id AND o.is_correct = TRUE
    LIMIT 1;

    -- Step 8: Construct and return the complete response object as a single JSON.
    RETURN json_build_object(
        'is_correct', v_is_correct,
        'correct_option_id', v_correct_option_id,
        'explanation', v_explanation,
        'new_progress', row_to_json(v_updated_progress_record)
    );

END;
$$ LANGUAGE plpgsql;


-- This function finds all questions in a given session that the user has not yet answered.
-- It returns a set of full JSON objects for each unanswered question.
CREATE OR REPLACE FUNCTION get_unanswered_questions_for_session(
    p_session_id uuid,
    p_user_id uuid
)
RETURNS SETOF json AS $$
BEGIN
    RETURN QUERY
    SELECT
        -- Constructs the main JSON object for each question.
        json_build_object(
            'id', q.id,
            'question_text', q.question_text,
            -- This subquery builds the nested array of options for each question.
            'options', (
                SELECT json_agg(
                    json_build_object(
                        'id', o.id,
                        'option_text', o.option_text
                    )
                )
                FROM options AS o
                WHERE o.question_id = q.id
            )
        )
    FROM
        questions AS q
    -- Find questions that are part of the specified session.
    JOIN
        session_question AS sq ON q.id = sq.question_id
    WHERE
        sq.session_id = p_session_id
    AND
        -- Crucially, filter out questions that already have an answer in this session.
        NOT EXISTS (
            SELECT 1
            FROM user_session_answers AS usa
            WHERE
                usa.session_id = p_session_id
            AND
                usa.question_id = q.id
        );
END;
$$ LANGUAGE plpgsql;