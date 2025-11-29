-- Enums
CREATE TYPE core.kyc_status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE core.aml_risk_level_enum AS ENUM ('low', 'medium', 'high', 'critical');

-- Tabla kyc_logs
CREATE TABLE IF NOT EXISTS core.kyc_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id integer NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    document_url text,
    ip_address text,
    geo_location jsonb,
    status core.kyc_status_enum DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now()
);

-- Tabla aml_risk_assessments
CREATE TABLE IF NOT EXISTS core.aml_risk_assessments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id integer NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    risk_score integer CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level core.aml_risk_level_enum NOT NULL,
    ai_analysis_summary text,
    ros_report_draft text,
    created_at timestamp with time zone DEFAULT now()
);

-- Indices para mejorar el rendimiento de las busquedas por usuario
CREATE INDEX IF NOT EXISTS idx_kyc_logs_user_id ON core.kyc_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_aml_risk_assessments_user_id ON core.aml_risk_assessments(user_id);
