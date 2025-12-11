-- Enable RLS on the table
ALTER TABLE "core"."riesgos_contables" ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view risks
CREATE POLICY "Allow authenticated to select riesgos_contables" ON "core"."riesgos_contables"
    FOR SELECT TO authenticated USING (true);

-- Allow authenticated users (e.g., Revisor Fiscal) to update risks
CREATE POLICY "Allow authenticated to update riesgos_contables" ON "core"."riesgos_contables"
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Allow service_role full access
CREATE POLICY "Allow service_role full access to riesgos_contables" ON "core"."riesgos_contables"
    TO service_role USING (true) WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA "core" TO "authenticated";
GRANT USAGE ON SCHEMA "core" TO "anon";

GRANT SELECT, UPDATE ON TABLE "core"."riesgos_contables" TO "authenticated";
GRANT ALL ON TABLE "core"."riesgos_contables" TO "service_role";

-- Grant usage on sequence
GRANT USAGE, SELECT ON SEQUENCE "core"."riesgos_contables_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "core"."riesgos_contables_id_seq" TO "service_role";
