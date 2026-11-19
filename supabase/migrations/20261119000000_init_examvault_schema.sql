-- ====================================================================
-- EXAMVAULT: COMPREHENSIVE POSTGRESQL DATABASE SCHEMA & RLS POLICIES
-- Migration: 20261119000000_init_examvault_schema.sql
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. HELPER FUNCTIONS
-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- 3. CORE ENTITIES
-- ====================================================================

-- 3.1 PROFILES (1-to-1 with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 USER SETTINGS
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    default_reminder_days INTEGER[] NOT NULL DEFAULT ARRAY[30, 15, 7, 3, 1, 0],
    theme TEXT NOT NULL DEFAULT 'dark',
    auto_lock_minutes INTEGER NOT NULL DEFAULT 15,
    push_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    cloud_sync_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.3 EXAMINATIONS (Main recruitment tracking entity)
CREATE TABLE IF NOT EXISTS public.examinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exam_name TEXT NOT NULL,
    recruiting_org TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('UPSC', 'SSC', 'RRB', 'ISRO', 'DRDO', 'GATE', 'State PSC', 'Banking', 'Defence', 'PSU', 'Other')),
    post_name TEXT NOT NULL,
    advertisement_number TEXT,
    recruitment_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    official_notification_url TEXT,
    official_application_url TEXT,
    official_website_url TEXT,
    personal_notes TEXT,
    status TEXT NOT NULL DEFAULT 'interested' CHECK (status IN (
        'interested', 'notification_released', 'application_not_started',
        'application_in_progress', 'payment_pending', 'application_submitted',
        'application_rejected', 'examination_scheduled', 'hall_ticket_available',
        'examination_completed', 'answer_key_pending', 'answer_key_published',
        'result_pending', 'result_published', 'qualified', 'not_qualified',
        'selected', 'not_selected', 'archived'
    )),
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.4 EXAMINATION DATES (Lifecycle events with certainty levels)
CREATE TABLE IF NOT EXISTS public.examination_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES public.examinations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'application_opening', 'application_closing', 'fee_payment_deadline',
        'correction_window', 'city_intimation', 'hall_ticket_release',
        'examination_date', 'answer_key_release', 'response_sheet_release',
        'objection_deadline', 'final_answer_key', 'result_publication',
        'scorecard_availability', 'cutoff_publication'
    )),
    date_value DATE,
    certainty TEXT NOT NULL DEFAULT 'unannounced' CHECK (certainty IN ('confirmed', 'tentative', 'unannounced')),
    session_info TEXT,
    city TEXT,
    centre TEXT,
    download_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.5 APPLICATIONS (Application submission details & payment tracking)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL UNIQUE REFERENCES public.examinations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    application_number TEXT,
    registration_number TEXT,
    submission_date DATE,
    application_status TEXT NOT NULL DEFAULT 'not_started' CHECK (application_status IN (
        'not_started', 'draft', 'submitted', 'rejected', 'payment_pending'
    )),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'completed', 'exempted', 'failed'
    )),
    application_fee NUMERIC(10, 2) DEFAULT 0.00,
    payment_transaction_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.6 CREDENTIALS (Client-side encrypted portal login vault)
CREATE TABLE IF NOT EXISTS public.credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exam_id UUID REFERENCES public.examinations(id) ON DELETE SET NULL,
    organization TEXT NOT NULL,
    portal_name TEXT NOT NULL,
    portal_url TEXT NOT NULL,
    username TEXT NOT NULL,
    encrypted_password TEXT NOT NULL, -- AES-GCM ciphertext (Base64)
    iv TEXT NOT NULL,                 -- Initialization vector (Base64)
    salt TEXT NOT NULL,               -- PBKDF2 salt (Base64)
    registration_number TEXT,
    application_number TEXT,
    registered_email TEXT,
    registered_mobile TEXT,
    encrypted_notes TEXT,             -- Optional recovery notes encrypted
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.7 DOCUMENTS (Document vault metadata referencing private storage)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES public.examinations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN (
        'OFFICIAL_NOTIFICATION', 'APPLICATION_FORM', 'PAYMENT_RECEIPT',
        'APPLICATION_CONFIRMATION', 'HALL_TICKET', 'CITY_INTIMATION',
        'ANSWER_KEY', 'RESPONSE_SHEET', 'OBJECTION_RECEIPT',
        'FINAL_ANSWER_KEY', 'SCORECARD', 'RESULT_PDF', 'CERTIFICATE', 'OTHER'
    )),
    document_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL,
    file_extension TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.8 NOTIFICATIONS (In-app alerts and notifications)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exam_id UUID REFERENCES public.examinations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('admit_card', 'deadline', 'monitoring', 'result', 'system')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.9 REMINDERS (Milestone alerts configuration)
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES public.examinations(id) ON DELETE CASCADE,
    date_id UUID REFERENCES public.examination_dates(id) ON DELETE CASCADE,
    reminder_date DATE NOT NULL,
    days_before INTEGER NOT NULL,
    channel TEXT NOT NULL DEFAULT 'in_app' CHECK (channel IN ('in_app', 'web_push', 'email')),
    is_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.10 EXAM SOURCES (Official website feeds for automated tracking)
CREATE TABLE IF NOT EXISTS public.exam_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name TEXT NOT NULL,
    category TEXT NOT NULL,
    official_url TEXT NOT NULL,
    notification_feed_url TEXT,
    check_frequency_minutes INTEGER NOT NULL DEFAULT 360,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.11 MONITORING LOGS (Website change detection logs)
CREATE TABLE IF NOT EXISTS public.monitoring_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES public.exam_sources(id) ON DELETE SET NULL,
    exam_id UUID REFERENCES public.examinations(id) ON DELETE SET NULL,
    detected_change_type TEXT NOT NULL,
    previous_value TEXT,
    updated_value TEXT,
    verification_status TEXT NOT NULL DEFAULT 'pending_user_confirmation' CHECK (
        verification_status IN ('pending_user_confirmation', 'verified', 'rejected')
    ),
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.12 EXAMINATION RESULTS (Scores, cutoff, percentile, selection status)
CREATE TABLE IF NOT EXISTS public.examination_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL UNIQUE REFERENCES public.examinations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exam_score NUMERIC(7, 2),
    total_marks NUMERIC(7, 2),
    percentile NUMERIC(6, 3),
    all_india_rank INTEGER,
    category_rank INTEGER,
    cutoff_marks NUMERIC(7, 2),
    selection_status TEXT NOT NULL DEFAULT 'pending' CHECK (
        selection_status IN ('pending', 'qualified', 'not_qualified', 'selected', 'not_selected')
    ),
    scorecard_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    declared_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict isolation: users can ONLY query and manipulate their own data
-- ====================================================================

-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examination_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examination_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_logs ENABLE ROW LEVEL SECURITY;

-- 4.1 Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4.2 User Settings Policies
CREATE POLICY "Users can manage their own settings"
    ON public.user_settings FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4.3 Examinations Policies
CREATE POLICY "Users can manage their own examinations"
    ON public.examinations FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4.4 Examination Dates Policies
CREATE POLICY "Users can manage their own examination dates"
    ON public.examination_dates FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4.5 Applications Policies
CREATE POLICY "Users can manage their own applications"
    ON public.applications FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4.6 Credentials Policies
CREATE POLICY "Users can manage their own credentials"
    ON public.credentials FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4.7 Documents Policies
CREATE POLICY "Users can manage their own documents"
    ON public.documents FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4.8 Notifications Policies
CREATE POLICY "Users can manage their own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4.9 Reminders Policies
CREATE POLICY "Users can manage their own reminders"
    ON public.reminders FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4.10 Examination Results Policies
CREATE POLICY "Users can manage their own examination results"
    ON public.examination_results FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4.11 Exam Sources Policies (Public read for active sources)
CREATE POLICY "Anyone can view active official sources"
    ON public.exam_sources FOR SELECT
    USING (is_active = TRUE);

-- 4.12 Monitoring Logs Policies (Users can view logs tied to their exams)
CREATE POLICY "Users can view monitoring logs for their exams"
    ON public.monitoring_logs FOR SELECT
    USING (
        exam_id IS NULL OR 
        EXISTS (SELECT 1 FROM public.examinations WHERE id = monitoring_logs.exam_id AND user_id = auth.uid())
    );

-- ====================================================================
-- 5. PERFORMANCE INDEXES
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_examinations_user_status ON public.examinations(user_id, status);
CREATE INDEX IF NOT EXISTS idx_examinations_user_created ON public.examinations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_examination_dates_exam_id ON public.examination_dates(exam_id);
CREATE INDEX IF NOT EXISTS idx_examination_dates_date ON public.examination_dates(date_value);
CREATE INDEX IF NOT EXISTS idx_applications_exam_id ON public.applications(exam_id);
CREATE INDEX IF NOT EXISTS idx_credentials_user ON public.credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_exam_category ON public.documents(exam_id, category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reminders_trigger ON public.reminders(reminder_date, is_triggered);

-- ====================================================================
-- 6. AUTOMATED TRIGGERS
-- ====================================================================

CREATE TRIGGER set_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_user_settings_timestamp BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_examinations_timestamp BEFORE UPDATE ON public.examinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_examination_dates_timestamp BEFORE UPDATE ON public.examination_dates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_applications_timestamp BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_credentials_timestamp BEFORE UPDATE ON public.credentials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_documents_timestamp BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_results_timestamp BEFORE UPDATE ON public.examination_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Automatically create profile and settings on user sign up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));

    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute when a user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
