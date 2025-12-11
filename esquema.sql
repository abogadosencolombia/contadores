-- Table riesgos_contables
CREATE TABLE IF NOT EXISTS "core"."riesgos_contables" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "titulo" character varying(255) NOT NULL,
    "descripcion" text,
    "categoria_niif" character varying(255),
    "nivel_confianza_ia" numeric(5,2),
    "explicacion_ia" text,
    "estado" character varying(50),
    "datos_relacionados" jsonb,
    "fecha_deteccion" timestamp with time zone DEFAULT now(),
    "validado_por_user_id" integer,
    "comentarios_revisor" text,
    "fecha_validacion" timestamp with time zone,
    CONSTRAINT "riesgos_contables_pkey" PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS "core"."riesgos_contables_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "core"."riesgos_contables_id_seq" OWNED BY "core"."riesgos_contables"."id";
ALTER TABLE ONLY "core"."riesgos_contables" ALTER COLUMN "id" SET DEFAULT nextval('"core"."riesgos_contables_id_seq"'::regclass);

ALTER TABLE "core"."riesgos_contables" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated to select riesgos_contables" ON "core"."riesgos_contables"
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service_role full access to riesgos_contables" ON "core"."riesgos_contables"
    TO service_role USING (true) WITH CHECK (true);

-- Adding foreign key for validado_por_user_id
ALTER TABLE ONLY "core"."riesgos_contables"
    ADD CONSTRAINT "riesgos_contables_validado_por_user_id_fkey" FOREIGN KEY ("validado_por_user_id") REFERENCES "core"."users"("id") ON DELETE SET NULL;
ALTER TABLE ONLY "core"."riesgos_contables"
    ADD CONSTRAINT "riesgos_contables_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");

GRANT ALL ON TABLE "core"."riesgos_contables" TO "service_role";
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "core"."riesgos_contables" TO "authenticated";
GRANT ALL ON SEQUENCE "core"."riesgos_contables_id_seq" TO "service_role";
GRANT USAGE, SELECT ON SEQUENCE "core"."riesgos_contables_id_seq" TO "authenticated";