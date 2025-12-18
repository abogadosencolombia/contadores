


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "core";


ALTER SCHEMA "core" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "core"."aml_risk_level_enum" AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);


ALTER TYPE "core"."aml_risk_level_enum" OWNER TO "postgres";


CREATE TYPE "core"."estado_hallazgo_enum" AS ENUM (
    'DETECTADO',
    'EN_REVISION',
    'VALIDADO_FRAUDE',
    'FALSO_POSITIVO',
    'CORREGIDO'
);


ALTER TYPE "core"."estado_hallazgo_enum" OWNER TO "postgres";


CREATE TYPE "core"."kyc_status_enum" AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE "core"."kyc_status_enum" OWNER TO "postgres";


CREATE TYPE "core"."tipo_arco_enum" AS ENUM (
    'ACCESO',
    'RECTIFICACION',
    'CANCELACION',
    'OPOSICION'
);


ALTER TYPE "core"."tipo_arco_enum" OWNER TO "postgres";


CREATE TYPE "core"."tipo_documento_enum" AS ENUM (
    'CC',
    'NIT',
    'CE',
    'PAS'
);


ALTER TYPE "core"."tipo_documento_enum" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "core"."accionistas" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "nombre_completo" character varying(255) NOT NULL,
    "tipo_documento" "core"."tipo_documento_enum" NOT NULL,
    "numero_documento" character varying(50) NOT NULL,
    "email" character varying(255) NOT NULL,
    "numero_acciones" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "fecha_ingreso" "date" DEFAULT CURRENT_DATE
);


ALTER TABLE "core"."accionistas" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."accionistas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."accionistas_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."accionistas_id_seq" OWNED BY "core"."accionistas"."id";



CREATE TABLE IF NOT EXISTS "core"."activos_fijos" (
    "id" integer NOT NULL,
    "tenant_id" character varying NOT NULL,
    "nombre" character varying NOT NULL,
    "fecha_adquisicion" "date" NOT NULL,
    "costo_adquisicion" numeric NOT NULL,
    "vida_util_meses" integer DEFAULT 36,
    "estado" character varying DEFAULT 'activo'::character varying
);


ALTER TABLE "core"."activos_fijos" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."activos_fijos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."activos_fijos_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."activos_fijos_id_seq" OWNED BY "core"."activos_fijos"."id";



CREATE TABLE IF NOT EXISTS "core"."ai_governance_decisions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "model_name" character varying(100) NOT NULL,
    "decision_type" character varying(50) NOT NULL,
    "risk_score" numeric(5,2),
    "input_variables" "jsonb" NOT NULL,
    "explanation" "text",
    "is_vetoed" boolean DEFAULT false,
    "user_id" integer
);


ALTER TABLE "core"."ai_governance_decisions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "core"."ai_incidents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "decision_id" "uuid",
    "reported_at" timestamp with time zone DEFAULT "now"(),
    "description" "text" NOT NULL,
    "criticality" character varying(20),
    "status" character varying(20) DEFAULT 'ABIERTO'::character varying,
    "resolution_notes" "text",
    CONSTRAINT "ai_incidents_criticality_check" CHECK ((("criticality")::"text" = ANY (ARRAY[('BAJA'::character varying)::"text", ('MEDIA'::character varying)::"text", ('ALTA'::character varying)::"text", ('CRITICA'::character varying)::"text"]))),
    CONSTRAINT "ai_incidents_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('ABIERTO'::character varying)::"text", ('EN_REVISION'::character varying)::"text", ('RESUELTO'::character varying)::"text"])))
);


ALTER TABLE "core"."ai_incidents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "core"."aml_log" (
    "id" integer NOT NULL,
    "inversionista_id" integer,
    "tipo_operacion" character varying(50),
    "monto" numeric(14,2),
    "pais_origen" character varying(50),
    "riesgo" character varying(10),
    "fecha" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "core"."aml_log" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."aml_log_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."aml_log_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."aml_log_id_seq" OWNED BY "core"."aml_log"."id";



CREATE TABLE IF NOT EXISTS "core"."aml_risk_assessments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" integer NOT NULL,
    "risk_score" integer,
    "risk_level" "core"."aml_risk_level_enum" NOT NULL,
    "ai_analysis_summary" "text",
    "ros_report_draft" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "aml_risk_assessments_risk_score_check" CHECK ((("risk_score" >= 0) AND ("risk_score" <= 100)))
);


ALTER TABLE "core"."aml_risk_assessments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "core"."auditoria_etica" (
    "id" integer NOT NULL,
    "decision_id" "uuid",
    "tipo_evento" character varying(50),
    "descripcion" "text",
    "severidad" character varying(10),
    "accion_tomada" "text",
    "fecha" timestamp without time zone DEFAULT "now"(),
    "cerrado" boolean DEFAULT false,
    "firmado_por" character varying(120),
    CONSTRAINT "auditoria_etica_severidad_check" CHECK ((("severidad")::"text" = ANY (ARRAY[('baja'::character varying)::"text", ('media'::character varying)::"text", ('alta'::character varying)::"text", ('crtica'::character varying)::"text"])))
);


ALTER TABLE "core"."auditoria_etica" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."auditoria_etica_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."auditoria_etica_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."auditoria_etica_id_seq" OWNED BY "core"."auditoria_etica"."id";



CREATE TABLE IF NOT EXISTS "core"."auditoria_explicabilidad" (
    "id" integer NOT NULL,
    "modelo" character varying(60),
    "version" character varying(10),
    "decision" "text",
    "justificacion_algoritmica" "text",
    "variables_clave" "text",
    "score_explicabilidad" numeric(3,2),
    "fecha" timestamp without time zone DEFAULT "now"(),
    "revisado_por" character varying(120),
    "trace_id" "uuid"
);


ALTER TABLE "core"."auditoria_explicabilidad" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."auditoria_explicabilidad_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."auditoria_explicabilidad_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."auditoria_explicabilidad_id_seq" OWNED BY "core"."auditoria_explicabilidad"."id";



CREATE TABLE IF NOT EXISTS "core"."auditoria_pagos_log" (
    "id" integer NOT NULL,
    "orden_pago_id" integer NOT NULL,
    "user_id" integer,
    "accion" character varying(50) NOT NULL,
    "detalles" "text",
    "hash_evidencia" "text",
    "fecha" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "core"."auditoria_pagos_log" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."auditoria_pagos_log_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."auditoria_pagos_log_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."auditoria_pagos_log_id_seq" OWNED BY "core"."auditoria_pagos_log"."id";



CREATE TABLE IF NOT EXISTS "core"."balances_financieros" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "tipo_empresa" character varying(50) NOT NULL,
    "normativa" character varying(10) NOT NULL,
    "periodo_fecha" "date" NOT NULL,
    "datos_balance" "jsonb" NOT NULL,
    "hash_sha256" "text" NOT NULL,
    "estado_firma" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "firmado_por_contador_id" integer,
    "firma_digital_hash" "text",
    "fecha_generacion" timestamp without time zone DEFAULT "now"(),
    "fecha_firma" timestamp without time zone
);


ALTER TABLE "core"."balances_financieros" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."balances_financieros_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."balances_financieros_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."balances_financieros_id_seq" OWNED BY "core"."balances_financieros"."id";



CREATE TABLE IF NOT EXISTS "core"."canal_etico_casos" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "caso_uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "creado_por_user_id" integer,
    "titulo" character varying(255) NOT NULL,
    "descripcion_irregularidad" "text" NOT NULL,
    "tipo_irregularidad" character varying(50) NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT "now"(),
    "estado" character varying(20) DEFAULT 'abierto'::character varying NOT NULL,
    "documento_legal_id" integer,
    "archivos_evidencia" "jsonb",
    CONSTRAINT "canal_etico_casos_tipo_irregularidad_check" CHECK ((("tipo_irregularidad")::"text" = ANY (ARRAY[('fraude'::character varying)::"text", ('acoso'::character varying)::"text", ('conflicto_interes'::character varying)::"text", ('soborno'::character varying)::"text", ('otro'::character varying)::"text"])))
);


ALTER TABLE "core"."canal_etico_casos" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."canal_etico_casos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."canal_etico_casos_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."canal_etico_casos_id_seq" OWNED BY "core"."canal_etico_casos"."id";



CREATE TABLE IF NOT EXISTS "core"."canal_etico_respuestas" (
    "id" integer NOT NULL,
    "caso_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "mensaje" "text" NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT "now"(),
    "visibilidad" character varying(10) DEFAULT 'publico'::character varying NOT NULL,
    CONSTRAINT "canal_etico_respuestas_visibilidad_check" CHECK ((("visibilidad")::"text" = ANY (ARRAY[('publico'::character varying)::"text", ('privado'::character varying)::"text"])))
);


ALTER TABLE "core"."canal_etico_respuestas" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."canal_etico_respuestas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."canal_etico_respuestas_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."canal_etico_respuestas_id_seq" OWNED BY "core"."canal_etico_respuestas"."id";



CREATE TABLE IF NOT EXISTS "core"."cap_table" (
    "id" integer NOT NULL,
    "inversionista_id" integer,
    "token_id" "uuid",
    "porcentaje" numeric(6,3),
    "fecha" timestamp without time zone DEFAULT "now"(),
    "lockup_hasta" "date",
    "calificado" boolean DEFAULT false,
    "cantidad" numeric(18,0) DEFAULT 0
);


ALTER TABLE "core"."cap_table" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."cap_table_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."cap_table_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."cap_table_id_seq" OWNED BY "core"."cap_table"."id";



CREATE TABLE IF NOT EXISTS "core"."certificadosdividendos" (
    "id" integer NOT NULL,
    "accionista_id" integer NOT NULL,
    "ano_fiscal" integer NOT NULL,
    "verification_uuid" "uuid" NOT NULL,
    "file_path" character varying(512) NOT NULL,
    "file_hash_sha256" character varying(64) NOT NULL,
    "fecha_emision" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "core"."certificadosdividendos" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."certificadosdividendos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."certificadosdividendos_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."certificadosdividendos_id_seq" OWNED BY "core"."certificadosdividendos"."id";



CREATE TABLE IF NOT EXISTS "core"."configuracion_dividendos" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "ano_fiscal" integer NOT NULL,
    "valor_accion" numeric(15,2) DEFAULT 0 NOT NULL,
    "porcentaje_dividendo" numeric(5,2) DEFAULT 0 NOT NULL,
    "porcentaje_retencion" numeric(5,2) DEFAULT 0 NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "core"."configuracion_dividendos" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."configuracion_dividendos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."configuracion_dividendos_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."configuracion_dividendos_id_seq" OWNED BY "core"."configuracion_dividendos"."id";



CREATE TABLE IF NOT EXISTS "core"."configuracion_pagos" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "proveedor" character varying(50) DEFAULT 'WOMPI'::character varying,
    "public_key" "text" NOT NULL,
    "private_key_enc" "text" NOT NULL,
    "integrity_secret_enc" "text" NOT NULL,
    "ambiente" character varying(10) DEFAULT 'SANDBOX'::character varying,
    "cuenta_bancaria_id" integer,
    "is_active" boolean DEFAULT true
);


ALTER TABLE "core"."configuracion_pagos" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."configuracion_pagos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."configuracion_pagos_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."configuracion_pagos_id_seq" OWNED BY "core"."configuracion_pagos"."id";



CREATE TABLE IF NOT EXISTS "core"."consent_cookies" (
    "id" integer NOT NULL,
    "tenant" character varying(60),
    "user_id" "uuid",
    "version_politica" character varying(10),
    "categorias" "text",
    "ip" character varying(60),
    "timestamp" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "core"."consent_cookies" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."consent_cookies_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."consent_cookies_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."consent_cookies_id_seq" OWNED BY "core"."consent_cookies"."id";



CREATE TABLE IF NOT EXISTS "core"."consent_log" (
    "id" integer NOT NULL,
    "user_id" integer,
    "ip" character varying(60),
    "fecha" timestamp without time zone DEFAULT "now"(),
    "version" character varying(10) NOT NULL,
    "finalidad" character varying(50) NOT NULL,
    "tenant" character varying(60)
);


ALTER TABLE "core"."consent_log" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."consent_log_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."consent_log_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."consent_log_id_seq" OWNED BY "core"."consent_log"."id";



CREATE TABLE IF NOT EXISTS "core"."cuentas_bancarias" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "nombre_banco" character varying(100) NOT NULL,
    "numero_cuenta_display" character varying(50) NOT NULL,
    "moneda" character varying(3) NOT NULL,
    "descripcion" "text",
    "pasarela_integracion_id" "text",
    "fecha_creacion" timestamp with time zone DEFAULT "now"(),
    "proveedor_externo" character varying(50) DEFAULT 'MOCK'::character varying,
    "credenciales_bancarias_enc" "text"
);


ALTER TABLE "core"."cuentas_bancarias" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."cuentas_bancarias_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."cuentas_bancarias_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."cuentas_bancarias_id_seq" OWNED BY "core"."cuentas_bancarias"."id";



CREATE TABLE IF NOT EXISTS "core"."data_lineage" (
    "id" integer NOT NULL,
    "dataset_id" "uuid",
    "dataset_hash" "text",
    "modelo" character varying(60),
    "version" character varying(20),
    "origen_datos" "text",
    "licencia_datos" "text",
    "fecha" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "core"."data_lineage" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."data_lineage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."data_lineage_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."data_lineage_id_seq" OWNED BY "core"."data_lineage"."id";



CREATE TABLE IF NOT EXISTS "core"."dividendospagados" (
    "id" integer NOT NULL,
    "accionista_id" integer NOT NULL,
    "ano_fiscal" integer NOT NULL,
    "monto_bruto" numeric(15,2) NOT NULL,
    "retencion" numeric(15,2) NOT NULL,
    "monto_neto" numeric(15,2) NOT NULL,
    "fecha_pago" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "core"."dividendospagados" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."dividendospagados_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."dividendospagados_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."dividendospagados_id_seq" OWNED BY "core"."dividendospagados"."id";



CREATE TABLE IF NOT EXISTS "core"."documentos_legales" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "creado_por_user_id" integer,
    "titulo" character varying(255) NOT NULL,
    "descripcion" "text",
    "tipo_documento" character varying(50) NOT NULL,
    "fecha_documento" "date" NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT "now"(),
    "version" integer DEFAULT 1 NOT NULL,
    "documento_padre_id" integer,
    "estado" character varying(20) DEFAULT 'borrador'::character varying NOT NULL,
    "storage_path_original" "text" NOT NULL,
    "hash_sha256_original" "text" NOT NULL,
    "firmado_por_contador_id" integer,
    "fecha_firma_contador" timestamp with time zone,
    "hash_firma_contador" "text",
    "firmado_por_revisor_id" integer,
    "fecha_firma_revisor" timestamp with time zone,
    "hash_firma_revisor" "text",
    "storage_path_firmado" "text",
    CONSTRAINT "documentos_legales_estado_check" CHECK ((("estado")::"text" = ANY (ARRAY[('borrador'::character varying)::"text", ('pendiente_firma'::character varying)::"text", ('finalizado'::character varying)::"text"]))),
    CONSTRAINT "documentos_legales_tipo_documento_check" CHECK ((("tipo_documento")::"text" = ANY (ARRAY[('contrato'::character varying)::"text", ('acta'::character varying)::"text", ('informe_auditoria'::character varying)::"text", ('acta_etica'::character varying)::"text", ('otro'::character varying)::"text"])))
);


ALTER TABLE "core"."documentos_legales" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."documentos_legales_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."documentos_legales_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."documentos_legales_id_seq" OWNED BY "core"."documentos_legales"."id";



CREATE TABLE IF NOT EXISTS "core"."esg_categorias" (
    "id" integer NOT NULL,
    "nombre" character varying(50) NOT NULL,
    "descripcion" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "core"."esg_categorias" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."esg_categorias_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."esg_categorias_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."esg_categorias_id_seq" OWNED BY "core"."esg_categorias"."id";



CREATE TABLE IF NOT EXISTS "core"."esg_metricas" (
    "id" integer NOT NULL,
    "categoria_id" integer,
    "nombre" character varying(100) NOT NULL,
    "unidad_medida" character varying(50),
    "descripcion" "text",
    "activo" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "core"."esg_metricas" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."esg_metricas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."esg_metricas_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."esg_metricas_id_seq" OWNED BY "core"."esg_metricas"."id";



CREATE TABLE IF NOT EXISTS "core"."esg_registros" (
    "id" integer NOT NULL,
    "metrica_id" integer,
    "usuario_id" "uuid",
    "valor" numeric(15,2) NOT NULL,
    "periodo_fecha" "date" NOT NULL,
    "evidencia_url" "text",
    "observaciones" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "core"."esg_registros" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."esg_registros_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."esg_registros_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."esg_registros_id_seq" OWNED BY "core"."esg_registros"."id";



CREATE TABLE IF NOT EXISTS "core"."facturas" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "creado_por_user_id" integer,
    "consecutivo" character varying(50) NOT NULL,
    "fecha_emision" timestamp with time zone DEFAULT "now"() NOT NULL,
    "fecha_vencimiento" "date",
    "cliente_documento" character varying(30) NOT NULL,
    "cliente_razon_social" character varying(255) NOT NULL,
    "cliente_email" character varying(255) NOT NULL,
    "moneda" character varying(3) DEFAULT 'COP'::character varying NOT NULL,
    "total_sin_impuestos" numeric(18,2) NOT NULL,
    "total_impuestos" numeric(18,2) NOT NULL,
    "total_con_impuestos" numeric(18,2) NOT NULL,
    "items_json" "jsonb",
    "estado_dian" character varying(30) DEFAULT 'borrador'::character varying NOT NULL,
    "es_habilitacion" boolean DEFAULT true NOT NULL,
    "cufe" character varying(255),
    "qr_data" "text",
    "xml_ubl_generado" "text",
    "dian_xml_respuesta" "text",
    "dian_mensaje_error" "text",
    "cliente_tipo_documento" character varying(10) NOT NULL,
    "estado_pago" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "fecha_pago_efectivo" timestamp with time zone,
    "referencia_pasarela_pago" "text",
    CONSTRAINT "facturas_estado_dian_check" CHECK ((("estado_dian")::"text" = ANY (ARRAY[('borrador'::character varying)::"text", ('generada'::character varying)::"text", ('enviada_dian'::character varying)::"text", ('aprobada'::character varying)::"text", ('aprobada_con_notificacion'::character varying)::"text", ('rechazada'::character varying)::"text"]))),
    CONSTRAINT "facturas_estado_pago_check" CHECK ((("estado_pago")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('pagada'::character varying)::"text", ('vencida'::character varying)::"text", ('anulada'::character varying)::"text"])))
);


ALTER TABLE "core"."facturas" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."facturas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."facturas_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."facturas_id_seq" OWNED BY "core"."facturas"."id";



CREATE TABLE IF NOT EXISTS "core"."inversiones_extranjeras" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "creado_por_user_id" integer,
    "nombre_inversionista_extranjero" character varying(255) NOT NULL,
    "id_inversionista" character varying(100),
    "pais_origen" character varying(3) NOT NULL,
    "fecha_inversion" "date" NOT NULL,
    "monto_inversion" numeric(19,4) NOT NULL,
    "moneda_inversion" character varying(3) NOT NULL,
    "monto_equivalente_cop" numeric(19,4) NOT NULL,
    "estado_reporte" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "chk_estado_reporte" CHECK ((("estado_reporte")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('reportado'::character varying)::"text"])))
);


ALTER TABLE "core"."inversiones_extranjeras" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."inversiones_extranjeras_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."inversiones_extranjeras_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."inversiones_extranjeras_id_seq" OWNED BY "core"."inversiones_extranjeras"."id";



CREATE TABLE IF NOT EXISTS "core"."iso_auditorias" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "creado_por_user_id" integer,
    "nombre_auditoria" character varying(255) NOT NULL,
    "tipo_auditoria" character varying(50) NOT NULL,
    "fecha_programada" "date" NOT NULL,
    "fecha_ejecucion" "date",
    "auditor_lider" character varying(150),
    "alcance" "text",
    "estado" character varying(20) DEFAULT 'PLANIFICADA'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "fecha_ejecucion_inicio" "date",
    "fecha_ejecucion_fin" "date",
    "equipo_auditor" "text",
    "objetivos" "text",
    "documento_informe_id" integer
);


ALTER TABLE "core"."iso_auditorias" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."iso_auditorias_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."iso_auditorias_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."iso_auditorias_id_seq" OWNED BY "core"."iso_auditorias"."id";



CREATE TABLE IF NOT EXISTS "core"."iso_controles" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "codigo" character varying(20) NOT NULL,
    "nombre" character varying(255) NOT NULL,
    "descripcion" "text",
    "es_aplicable" boolean DEFAULT true,
    "justificacion_exclusion" "text",
    "estado_implementacion" character varying(50) DEFAULT 'NO_INICIADO'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "categoria" character varying(50),
    "responsable_implementacion_id" integer,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "core"."iso_controles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."iso_controles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."iso_controles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."iso_controles_id_seq" OWNED BY "core"."iso_controles"."id";



CREATE TABLE IF NOT EXISTS "core"."iso_hallazgos" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "auditoria_id" integer,
    "control_iso_id" integer,
    "descripcion" "text" NOT NULL,
    "tipo_hallazgo" character varying(50) NOT NULL,
    "accion_correctiva" "text",
    "responsable_id" integer,
    "fecha_compromiso" "date",
    "estado" character varying(20) DEFAULT 'ABIERTO'::character varying,
    "evidencia_cierre_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "descripcion_hallazgo" "text",
    "analisis_causa_raiz" "text",
    "fecha_cierre" timestamp with time zone,
    "evidencia_cierre" "text"
);


ALTER TABLE "core"."iso_hallazgos" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."iso_hallazgos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."iso_hallazgos_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."iso_hallazgos_id_seq" OWNED BY "core"."iso_hallazgos"."id";



CREATE TABLE IF NOT EXISTS "core"."kyc_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" integer NOT NULL,
    "document_url" "text",
    "ip_address" "text",
    "geo_location" "jsonb",
    "status" "core"."kyc_status_enum" DEFAULT 'pending'::"core"."kyc_status_enum",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "core"."kyc_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "core"."movimientos_caja" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "fecha" timestamp with time zone NOT NULL,
    "tipo_movimiento" character varying(20) NOT NULL,
    "monto" numeric(19,4) NOT NULL,
    "moneda" character varying(3) NOT NULL,
    "descripcion" "text",
    "referencia_factura_id" integer,
    "referencia_orden_pago_id" integer,
    "cuenta_bancaria_id" integer,
    "referencia_pasarela" "text",
    "conciliado" boolean DEFAULT false,
    "fecha_creacion" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "movimientos_caja_tipo_movimiento_check" CHECK ((("tipo_movimiento")::"text" = ANY (ARRAY[('ingreso'::character varying)::"text", ('egreso'::character varying)::"text"])))
);


ALTER TABLE "core"."movimientos_caja" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."movimientos_caja_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."movimientos_caja_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."movimientos_caja_id_seq" OWNED BY "core"."movimientos_caja"."id";



CREATE TABLE IF NOT EXISTS "core"."ordenes_pago" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "creado_por_user_id" integer NOT NULL,
    "proveedor_nit" character varying(30) NOT NULL,
    "proveedor_nombre" character varying(255) NOT NULL,
    "descripcion" "text",
    "monto" numeric(19,4) NOT NULL,
    "moneda" character varying(3) NOT NULL,
    "monto_equivalente_cop" numeric(19,4) NOT NULL,
    "estado" character varying(30) DEFAULT 'pendiente_aprobacion'::character varying NOT NULL,
    "requiere_doble_firma" boolean DEFAULT false NOT NULL,
    "firmado_por_user_id_1" integer,
    "fecha_firma_1" timestamp with time zone,
    "hash_firma_1" "text",
    "firmado_por_user_id_2" integer,
    "fecha_firma_2" timestamp with time zone,
    "hash_firma_2" "text",
    "fecha_creacion" timestamp with time zone DEFAULT "now"(),
    "fecha_vencimiento" "date",
    "estado_pago" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "fecha_pago_efectivo" timestamp with time zone,
    "referencia_pago_externo" "text",
    CONSTRAINT "ordenes_pago_estado_check" CHECK ((("estado")::"text" = ANY (ARRAY[('pendiente_aprobacion'::character varying)::"text", ('pendiente_firma_2'::character varying)::"text", ('aprobado'::character varying)::"text", ('rechazado'::character varying)::"text"]))),
    CONSTRAINT "ordenes_pago_estado_pago_check" CHECK ((("estado_pago")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('pagada'::character varying)::"text", ('vencida'::character varying)::"text"])))
);


ALTER TABLE "core"."ordenes_pago" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."ordenes_pago_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."ordenes_pago_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."ordenes_pago_id_seq" OWNED BY "core"."ordenes_pago"."id";



CREATE TABLE IF NOT EXISTS "core"."postmortems" (
    "id" integer NOT NULL,
    "incidente_id" "uuid",
    "fecha" timestamp without time zone DEFAULT "now"(),
    "impacto" "text",
    "causa_raiz" "text",
    "acciones_correlativas" "text",
    "owner" character varying(120),
    "fecha_cierre" timestamp without time zone
);


ALTER TABLE "core"."postmortems" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."postmortems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."postmortems_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."postmortems_id_seq" OWNED BY "core"."postmortems"."id";



CREATE TABLE IF NOT EXISTS "core"."preferencias_contacto" (
    "id" integer NOT NULL,
    "user_id" integer,
    "tenant_id" character varying(60),
    "canal" character varying(50) NOT NULL,
    "finalidad" character varying(50) NOT NULL,
    "autorizado" boolean DEFAULT false,
    "fecha_actualizacion" timestamp with time zone DEFAULT "now"(),
    "ip_origen" character varying(60)
);


ALTER TABLE "core"."preferencias_contacto" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."preferencias_contacto_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."preferencias_contacto_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."preferencias_contacto_id_seq" OWNED BY "core"."preferencias_contacto"."id";



CREATE TABLE IF NOT EXISTS "core"."presupuestos" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "creado_por_user_id" integer,
    "nombre" character varying(255) NOT NULL,
    "ano_fiscal" integer NOT NULL,
    "mes" integer NOT NULL,
    "categoria" character varying(100) NOT NULL,
    "monto_proyectado" numeric(19,4) NOT NULL,
    "monto_ejecutado" numeric(19,4) DEFAULT 0.0,
    "fecha_creacion" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "presupuestos_mes_check" CHECK ((("mes" >= 1) AND ("mes" <= 12)))
);


ALTER TABLE "core"."presupuestos" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."presupuestos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."presupuestos_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."presupuestos_id_seq" OWNED BY "core"."presupuestos"."id";



CREATE TABLE IF NOT EXISTS "core"."reportes_dcin" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "inversion_id" integer NOT NULL,
    "entidad_regulatoria" character varying(50) DEFAULT 'Banco de la República'::character varying NOT NULL,
    "tipo_reporte" character varying(100) DEFAULT 'DCIN 83'::character varying NOT NULL,
    "periodo_reportado" "date" NOT NULL,
    "fecha_generacion" timestamp with time zone DEFAULT "now"(),
    "generado_por_user_id" integer,
    "estado" character varying(30) DEFAULT 'GENERADO'::character varying NOT NULL,
    "storage_path_reporte" "text" NOT NULL,
    "hash_reporte" "text" NOT NULL,
    "fecha_envio" timestamp with time zone,
    "trace_id_envio" "uuid",
    "respuesta_entidad" "jsonb",
    CONSTRAINT "chk_estado_dcin" CHECK ((("estado")::"text" = ANY (ARRAY[('GENERADO'::character varying)::"text", ('ENVIANDO'::character varying)::"text", ('ENVIADO'::character varying)::"text", ('RECHAZADO'::character varying)::"text"])))
);


ALTER TABLE "core"."reportes_dcin" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."reportes_dcin_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."reportes_dcin_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."reportes_dcin_id_seq" OWNED BY "core"."reportes_dcin"."id";



CREATE TABLE IF NOT EXISTS "core"."reportes_regulatorios" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "balance_financiero_id" integer NOT NULL,
    "entidad_regulatoria" character varying(50) NOT NULL,
    "tipo_reporte" character varying(100) NOT NULL,
    "periodo_reportado" "date" NOT NULL,
    "fecha_generacion" timestamp with time zone DEFAULT "now"(),
    "generado_por_user_id" integer,
    "estado" character varying(30) DEFAULT 'GENERADO'::character varying NOT NULL,
    "storage_path_reporte" "text" NOT NULL,
    "hash_reporte" "text" NOT NULL,
    "fecha_envio" timestamp with time zone,
    "trace_id_envio" "uuid",
    "respuesta_entidad" "jsonb"
);


ALTER TABLE "core"."reportes_regulatorios" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."reportes_regulatorios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."reportes_regulatorios_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."reportes_regulatorios_id_seq" OWNED BY "core"."reportes_regulatorios"."id";



CREATE TABLE IF NOT EXISTS "core"."riesgos" (
    "id" integer NOT NULL,
    "dominio" character varying(50),
    "riesgo" "text",
    "probabilidad" smallint,
    "impacto" smallint,
    "owner" character varying(120),
    "control" "text",
    "estado" character varying(20),
    "fecha" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "riesgos_estado_check" CHECK ((("estado")::"text" = ANY (ARRAY[('abierto'::character varying)::"text", ('mitigando'::character varying)::"text", ('cerrado'::character varying)::"text"]))),
    CONSTRAINT "riesgos_probabilidad_check" CHECK ((("probabilidad" >= 1) AND ("probabilidad" <= 5))),
    CONSTRAINT "riesgos_probabilidad_check1" CHECK ((("probabilidad" >= 1) AND ("probabilidad" <= 5)))
);


ALTER TABLE "core"."riesgos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "core"."riesgos_contables" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "titulo" character varying(255) NOT NULL,
    "descripcion" "text",
    "categoria_niif" character varying(100),
    "nivel_confianza_ia" numeric(5,2),
    "explicacion_ia" "text",
    "estado" "core"."estado_hallazgo_enum" DEFAULT 'DETECTADO'::"core"."estado_hallazgo_enum",
    "datos_relacionados" "jsonb",
    "fecha_deteccion" timestamp with time zone DEFAULT "now"(),
    "validado_por_user_id" integer,
    "comentarios_revisor" "text",
    "fecha_validacion" timestamp with time zone
);


ALTER TABLE "core"."riesgos_contables" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."riesgos_contables_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."riesgos_contables_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."riesgos_contables_id_seq" OWNED BY "core"."riesgos_contables"."id";



CREATE SEQUENCE IF NOT EXISTS "core"."riesgos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."riesgos_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."riesgos_id_seq" OWNED BY "core"."riesgos"."id";



CREATE TABLE IF NOT EXISTS "core"."rnbd_registros" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "numero_radicado" character varying(50),
    "tipo_novedad" character varying(50) DEFAULT 'INSCRIPCION'::character varying,
    "fecha_registro" timestamp with time zone DEFAULT "now"(),
    "fecha_vencimiento" "date" NOT NULL,
    "estado" character varying(20) DEFAULT 'PENDIENTE'::character varying,
    "respuesta_sic" "jsonb",
    "xml_enviado" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "rnbd_estado_check" CHECK ((("estado")::"text" = ANY (ARRAY[('PENDIENTE'::character varying)::"text", ('RADICADO'::character varying)::"text", ('RECHAZADO'::character varying)::"text", ('VENCIDO'::character varying)::"text"]))),
    CONSTRAINT "rnbd_tipo_check" CHECK ((("tipo_novedad")::"text" = ANY (ARRAY[('INSCRIPCION'::character varying)::"text", ('ACTUALIZACION'::character varying)::"text", ('RENOVACION'::character varying)::"text", ('RECLAMO'::character varying)::"text"])))
);


ALTER TABLE "core"."rnbd_registros" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."rnbd_registros_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."rnbd_registros_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."rnbd_registros_id_seq" OWNED BY "core"."rnbd_registros"."id";



CREATE TABLE IF NOT EXISTS "core"."roles" (
    "id" integer NOT NULL,
    "nombre_rol" character varying(50) NOT NULL
);


ALTER TABLE "core"."roles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."roles_id_seq" OWNED BY "core"."roles"."id";



CREATE TABLE IF NOT EXISTS "core"."solicitudes_arco" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60),
    "user_id" integer,
    "email_solicitante" character varying(255) NOT NULL,
    "tipo_solicitud" "core"."tipo_arco_enum" NOT NULL,
    "detalle_solicitud" "text",
    "estado" character varying(20) DEFAULT 'PENDIENTE'::character varying,
    "fecha_solicitud" timestamp with time zone DEFAULT "now"(),
    "fecha_limite_respuesta" "date",
    "fecha_resolucion" timestamp with time zone,
    "evidencia_respuesta" "text",
    "responsable_id" integer,
    CONSTRAINT "solicitudes_arco_estado_check" CHECK ((("estado")::"text" = ANY (ARRAY[('PENDIENTE'::character varying)::"text", ('EN_PROCESO'::character varying)::"text", ('RESUELTO'::character varying)::"text", ('RECHAZADO'::character varying)::"text"])))
);


ALTER TABLE "core"."solicitudes_arco" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."solicitudes_arco_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."solicitudes_arco_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."solicitudes_arco_id_seq" OWNED BY "core"."solicitudes_arco"."id";



CREATE TABLE IF NOT EXISTS "core"."tenants" (
    "id" integer NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "nombre_empresa" character varying(255) NOT NULL,
    "subdominio" character varying(100),
    "fecha_creacion" timestamp without time zone DEFAULT "now"(),
    "codigo_invitacion" character varying(50)
);


ALTER TABLE "core"."tenants" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."tenants_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."tenants_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."tenants_id_seq" OWNED BY "core"."tenants"."id";



CREATE TABLE IF NOT EXISTS "core"."tokenizacion_legal" (
    "id" integer NOT NULL,
    "token_id" "uuid",
    "inversionista_id" integer,
    "porcentaje" numeric(5,2),
    "valor_inicial" numeric(14,2),
    "hash_firma" "text",
    "registro_cambiario" boolean DEFAULT false,
    "fecha" timestamp without time zone DEFAULT "now"(),
    "tipo_red" character varying(20) DEFAULT 'OFF_CHAIN'::character varying,
    "estado_blockchain" character varying(20) DEFAULT 'PENDIENTE'::character varying,
    "tx_hash" "text",
    "block_number" integer,
    "contract_address" "text",
    "token_standard" character varying(20) DEFAULT 'ERC-1400'::character varying,
    "documento_legal_id" integer,
    "cantidad" numeric(18,0) DEFAULT 0,
    CONSTRAINT "tokenizacion_legal_estado_blockchain_check" CHECK ((("estado_blockchain")::"text" = ANY (ARRAY[('PENDIENTE'::character varying)::"text", ('MINADO'::character varying)::"text", ('FALLIDO'::character varying)::"text", ('CONFIRMADO'::character varying)::"text"]))),
    CONSTRAINT "tokenizacion_legal_tipo_red_check" CHECK ((("tipo_red")::"text" = ANY (ARRAY[('HYPERLEDGER'::character varying)::"text", ('ERC1400'::character varying)::"text", ('OFF_CHAIN'::character varying)::"text"])))
);


ALTER TABLE "core"."tokenizacion_legal" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."tokenizacion_legal_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."tokenizacion_legal_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."tokenizacion_legal_id_seq" OWNED BY "core"."tokenizacion_legal"."id";



CREATE TABLE IF NOT EXISTS "core"."transacciones_bancarias_externas" (
    "id" integer NOT NULL,
    "cuenta_bancaria_id" integer NOT NULL,
    "pasarela_id_transaccion" "text" NOT NULL,
    "fecha" timestamp with time zone NOT NULL,
    "descripcion_original" "text" NOT NULL,
    "monto" numeric(19,4) NOT NULL,
    "conciliado" boolean DEFAULT false,
    "movimiento_caja_id" integer
);


ALTER TABLE "core"."transacciones_bancarias_externas" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."transacciones_bancarias_externas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."transacciones_bancarias_externas_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."transacciones_bancarias_externas_id_seq" OWNED BY "core"."transacciones_bancarias_externas"."id";



CREATE TABLE IF NOT EXISTS "core"."user_roles" (
    "user_id" integer NOT NULL,
    "role_id" integer NOT NULL
);


ALTER TABLE "core"."user_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "core"."users" (
    "id" integer NOT NULL,
    "email" character varying(255) NOT NULL,
    "password_hash" "text" NOT NULL,
    "tenant_id" character varying(60) NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "kyc_status" character varying(20) DEFAULT NULL::character varying,
    "mfa_enabled" boolean DEFAULT false,
    "full_name" character varying(255)
);


ALTER TABLE "core"."users" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "core"."users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "core"."users_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "core"."users_id_seq" OWNED BY "core"."users"."id";



CREATE TABLE IF NOT EXISTS "public"."test" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."test" OWNER TO "postgres";


ALTER TABLE "public"."test" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."test_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "core"."accionistas" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."accionistas_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."activos_fijos" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."activos_fijos_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."aml_log" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."aml_log_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."auditoria_etica" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."auditoria_etica_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."auditoria_explicabilidad" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."auditoria_explicabilidad_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."auditoria_pagos_log" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."auditoria_pagos_log_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."balances_financieros" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."balances_financieros_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."canal_etico_casos" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."canal_etico_casos_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."canal_etico_respuestas" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."canal_etico_respuestas_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."cap_table" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."cap_table_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."certificadosdividendos" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."certificadosdividendos_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."configuracion_dividendos" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."configuracion_dividendos_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."configuracion_pagos" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."configuracion_pagos_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."consent_cookies" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."consent_cookies_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."consent_log" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."consent_log_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."cuentas_bancarias" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."cuentas_bancarias_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."data_lineage" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."data_lineage_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."dividendospagados" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."dividendospagados_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."documentos_legales" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."documentos_legales_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."esg_categorias" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."esg_categorias_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."esg_metricas" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."esg_metricas_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."esg_registros" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."esg_registros_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."facturas" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."facturas_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."inversiones_extranjeras" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."inversiones_extranjeras_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."iso_auditorias" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."iso_auditorias_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."iso_controles" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."iso_controles_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."iso_hallazgos" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."iso_hallazgos_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."movimientos_caja" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."movimientos_caja_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."ordenes_pago" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."ordenes_pago_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."postmortems" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."postmortems_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."preferencias_contacto" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."preferencias_contacto_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."presupuestos" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."presupuestos_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."reportes_dcin" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."reportes_dcin_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."reportes_regulatorios" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."reportes_regulatorios_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."riesgos" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."riesgos_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."riesgos_contables" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."riesgos_contables_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."rnbd_registros" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."rnbd_registros_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."roles_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."solicitudes_arco" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."solicitudes_arco_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."tenants" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."tenants_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."tokenizacion_legal" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."tokenizacion_legal_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."transacciones_bancarias_externas" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."transacciones_bancarias_externas_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."users" ALTER COLUMN "id" SET DEFAULT "nextval"('"core"."users_id_seq"'::"regclass");



ALTER TABLE ONLY "core"."accionistas"
    ADD CONSTRAINT "accionistas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."accionistas"
    ADD CONSTRAINT "accionistas_tenant_id_numero_documento_key" UNIQUE ("tenant_id", "numero_documento");



ALTER TABLE ONLY "core"."activos_fijos"
    ADD CONSTRAINT "activos_fijos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."ai_governance_decisions"
    ADD CONSTRAINT "ai_governance_decisions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."ai_incidents"
    ADD CONSTRAINT "ai_incidents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."aml_log"
    ADD CONSTRAINT "aml_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."aml_risk_assessments"
    ADD CONSTRAINT "aml_risk_assessments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."auditoria_etica"
    ADD CONSTRAINT "auditoria_etica_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."auditoria_explicabilidad"
    ADD CONSTRAINT "auditoria_explicabilidad_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."auditoria_pagos_log"
    ADD CONSTRAINT "auditoria_pagos_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."balances_financieros"
    ADD CONSTRAINT "balances_financieros_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."canal_etico_casos"
    ADD CONSTRAINT "canal_etico_casos_caso_uuid_key" UNIQUE ("caso_uuid");



ALTER TABLE ONLY "core"."canal_etico_casos"
    ADD CONSTRAINT "canal_etico_casos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."canal_etico_respuestas"
    ADD CONSTRAINT "canal_etico_respuestas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."cap_table"
    ADD CONSTRAINT "cap_table_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."certificadosdividendos"
    ADD CONSTRAINT "certificadosdividendos_accionista_id_ano_fiscal_key" UNIQUE ("accionista_id", "ano_fiscal");



ALTER TABLE ONLY "core"."certificadosdividendos"
    ADD CONSTRAINT "certificadosdividendos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."certificadosdividendos"
    ADD CONSTRAINT "certificadosdividendos_verification_uuid_key" UNIQUE ("verification_uuid");



ALTER TABLE ONLY "core"."configuracion_dividendos"
    ADD CONSTRAINT "configuracion_dividendos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."configuracion_dividendos"
    ADD CONSTRAINT "configuracion_dividendos_tenant_id_ano_fiscal_key" UNIQUE ("tenant_id", "ano_fiscal");



ALTER TABLE ONLY "core"."configuracion_pagos"
    ADD CONSTRAINT "configuracion_pagos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."configuracion_pagos"
    ADD CONSTRAINT "configuracion_pagos_tenant_id_proveedor_key" UNIQUE ("tenant_id", "proveedor");



ALTER TABLE ONLY "core"."consent_cookies"
    ADD CONSTRAINT "consent_cookies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."consent_log"
    ADD CONSTRAINT "consent_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."cuentas_bancarias"
    ADD CONSTRAINT "cuentas_bancarias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."data_lineage"
    ADD CONSTRAINT "data_lineage_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."dividendospagados"
    ADD CONSTRAINT "dividendospagados_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."documentos_legales"
    ADD CONSTRAINT "documentos_legales_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."esg_categorias"
    ADD CONSTRAINT "esg_categorias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."esg_metricas"
    ADD CONSTRAINT "esg_metricas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."esg_registros"
    ADD CONSTRAINT "esg_registros_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."facturas"
    ADD CONSTRAINT "facturas_cufe_key" UNIQUE ("cufe");



ALTER TABLE ONLY "core"."facturas"
    ADD CONSTRAINT "facturas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."facturas"
    ADD CONSTRAINT "facturas_tenant_consecutivo_key" UNIQUE ("tenant_id", "consecutivo");



ALTER TABLE ONLY "core"."inversiones_extranjeras"
    ADD CONSTRAINT "inversiones_extranjeras_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."iso_auditorias"
    ADD CONSTRAINT "iso_auditorias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."iso_controles"
    ADD CONSTRAINT "iso_controles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."iso_hallazgos"
    ADD CONSTRAINT "iso_hallazgos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."kyc_logs"
    ADD CONSTRAINT "kyc_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."movimientos_caja"
    ADD CONSTRAINT "movimientos_caja_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."ordenes_pago"
    ADD CONSTRAINT "ordenes_pago_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."postmortems"
    ADD CONSTRAINT "postmortems_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."preferencias_contacto"
    ADD CONSTRAINT "preferencias_contacto_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."preferencias_contacto"
    ADD CONSTRAINT "preferencias_contacto_user_id_canal_finalidad_key" UNIQUE ("user_id", "canal", "finalidad");



ALTER TABLE ONLY "core"."presupuestos"
    ADD CONSTRAINT "presupuestos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."presupuestos"
    ADD CONSTRAINT "presupuestos_tenant_id_ano_fiscal_mes_categoria_key" UNIQUE ("tenant_id", "ano_fiscal", "mes", "categoria");



ALTER TABLE ONLY "core"."reportes_dcin"
    ADD CONSTRAINT "reportes_dcin_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."reportes_regulatorios"
    ADD CONSTRAINT "reportes_regulatorios_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."riesgos_contables"
    ADD CONSTRAINT "riesgos_contables_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."riesgos"
    ADD CONSTRAINT "riesgos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."rnbd_registros"
    ADD CONSTRAINT "rnbd_registros_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."roles"
    ADD CONSTRAINT "roles_nombre_rol_key" UNIQUE ("nombre_rol");



ALTER TABLE ONLY "core"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."solicitudes_arco"
    ADD CONSTRAINT "solicitudes_arco_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."tenants"
    ADD CONSTRAINT "tenants_codigo_invitacion_key" UNIQUE ("codigo_invitacion");



ALTER TABLE ONLY "core"."tenants"
    ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."tenants"
    ADD CONSTRAINT "tenants_subdominio_key" UNIQUE ("subdominio");



ALTER TABLE ONLY "core"."tenants"
    ADD CONSTRAINT "tenants_tenant_id_key" UNIQUE ("tenant_id");



ALTER TABLE ONLY "core"."tokenizacion_legal"
    ADD CONSTRAINT "tokenizacion_legal_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."tokenizacion_legal"
    ADD CONSTRAINT "tokenizacion_legal_token_id_key" UNIQUE ("token_id");



ALTER TABLE ONLY "core"."transacciones_bancarias_externas"
    ADD CONSTRAINT "transacciones_bancarias_externas_pasarela_id_transaccion_key" UNIQUE ("pasarela_id_transaccion");



ALTER TABLE ONLY "core"."transacciones_bancarias_externas"
    ADD CONSTRAINT "transacciones_bancarias_externas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "core"."iso_controles"
    ADD CONSTRAINT "unique_control_tenant" UNIQUE ("tenant_id", "codigo");



ALTER TABLE ONLY "core"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_id");



ALTER TABLE ONLY "core"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "core"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."test"
    ADD CONSTRAINT "test_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_accionistas_tenant" ON "core"."accionistas" USING "btree" ("tenant_id");



CREATE INDEX "idx_ai_decisions_date" ON "core"."ai_governance_decisions" USING "btree" ("created_at");



CREATE INDEX "idx_ai_decisions_tenant" ON "core"."ai_governance_decisions" USING "btree" ("tenant_id");



CREATE INDEX "idx_ai_incidents_tenant" ON "core"."ai_incidents" USING "btree" ("tenant_id");



CREATE INDEX "idx_aml_risk_assessments_user_id" ON "core"."aml_risk_assessments" USING "btree" ("user_id");



CREATE INDEX "idx_auditoria_pagos_log_orden_id" ON "core"."auditoria_pagos_log" USING "btree" ("orden_pago_id");



CREATE INDEX "idx_balances_tenant_periodo" ON "core"."balances_financieros" USING "btree" ("tenant_id", "periodo_fecha" DESC);



CREATE INDEX "idx_canal_etico_respuestas_caso" ON "core"."canal_etico_respuestas" USING "btree" ("caso_id");



CREATE INDEX "idx_canal_etico_tenant_estado" ON "core"."canal_etico_casos" USING "btree" ("tenant_id", "estado");



CREATE INDEX "idx_certificados_uuid" ON "core"."certificadosdividendos" USING "btree" ("verification_uuid");



CREATE INDEX "idx_dividendos_accionista_ano" ON "core"."dividendospagados" USING "btree" ("accionista_id", "ano_fiscal");



CREATE INDEX "idx_documentos_estado" ON "core"."documentos_legales" USING "btree" ("estado");



CREATE INDEX "idx_documentos_tenant_tipo" ON "core"."documentos_legales" USING "btree" ("tenant_id", "tipo_documento");



CREATE INDEX "idx_inversiones_tenant_estado" ON "core"."inversiones_extranjeras" USING "btree" ("tenant_id", "estado_reporte");



CREATE INDEX "idx_iso_auditorias_tenant" ON "core"."iso_auditorias" USING "btree" ("tenant_id");



CREATE INDEX "idx_iso_controles_tenant" ON "core"."iso_controles" USING "btree" ("tenant_id");



CREATE INDEX "idx_iso_hallazgos_auditoria" ON "core"."iso_hallazgos" USING "btree" ("auditoria_id");



CREATE INDEX "idx_kyc_logs_user_id" ON "core"."kyc_logs" USING "btree" ("user_id");



CREATE INDEX "idx_movimientos_caja_factura_id" ON "core"."movimientos_caja" USING "btree" ("referencia_factura_id");



CREATE INDEX "idx_movimientos_caja_orden_pago_id" ON "core"."movimientos_caja" USING "btree" ("referencia_orden_pago_id");



CREATE INDEX "idx_movimientos_caja_tenant_fecha" ON "core"."movimientos_caja" USING "btree" ("tenant_id", "fecha" DESC);



CREATE INDEX "idx_ordenes_pago_tenant_estado" ON "core"."ordenes_pago" USING "btree" ("tenant_id", "estado");



CREATE INDEX "idx_reportes_dcin_inversion_id" ON "core"."reportes_dcin" USING "btree" ("inversion_id");



CREATE INDEX "idx_reportes_dcin_tenant_estado" ON "core"."reportes_dcin" USING "btree" ("tenant_id", "estado");



CREATE INDEX "idx_reportes_reg_entidad_periodo" ON "core"."reportes_regulatorios" USING "btree" ("entidad_regulatoria", "periodo_reportado");



CREATE INDEX "idx_reportes_reg_tenant_estado" ON "core"."reportes_regulatorios" USING "btree" ("tenant_id", "estado");



CREATE INDEX "idx_rnbd_vencimiento" ON "core"."rnbd_registros" USING "btree" ("estado", "fecha_vencimiento");



CREATE INDEX "idx_transacciones_externas_cuenta_id" ON "core"."transacciones_bancarias_externas" USING "btree" ("cuenta_bancaria_id");



ALTER TABLE ONLY "core"."accionistas"
    ADD CONSTRAINT "accionistas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "core"."activos_fijos"
    ADD CONSTRAINT "activos_fijos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."ai_governance_decisions"
    ADD CONSTRAINT "ai_governance_decisions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "core"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "core"."ai_incidents"
    ADD CONSTRAINT "ai_incidents_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "core"."ai_governance_decisions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "core"."aml_risk_assessments"
    ADD CONSTRAINT "aml_risk_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "core"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "core"."auditoria_pagos_log"
    ADD CONSTRAINT "auditoria_pagos_log_orden_pago_id_fkey" FOREIGN KEY ("orden_pago_id") REFERENCES "core"."ordenes_pago"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "core"."auditoria_pagos_log"
    ADD CONSTRAINT "auditoria_pagos_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."balances_financieros"
    ADD CONSTRAINT "balances_financieros_firmado_por_contador_id_fkey" FOREIGN KEY ("firmado_por_contador_id") REFERENCES "core"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "core"."canal_etico_casos"
    ADD CONSTRAINT "canal_etico_casos_creado_por_user_id_fkey" FOREIGN KEY ("creado_por_user_id") REFERENCES "core"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "core"."canal_etico_casos"
    ADD CONSTRAINT "canal_etico_casos_documento_legal_id_fkey" FOREIGN KEY ("documento_legal_id") REFERENCES "core"."documentos_legales"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "core"."canal_etico_casos"
    ADD CONSTRAINT "canal_etico_casos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."canal_etico_respuestas"
    ADD CONSTRAINT "canal_etico_respuestas_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "core"."canal_etico_casos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "core"."canal_etico_respuestas"
    ADD CONSTRAINT "canal_etico_respuestas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."certificadosdividendos"
    ADD CONSTRAINT "certificadosdividendos_accionista_id_fkey" FOREIGN KEY ("accionista_id") REFERENCES "core"."accionistas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "core"."configuracion_pagos"
    ADD CONSTRAINT "configuracion_pagos_cuenta_bancaria_id_fkey" FOREIGN KEY ("cuenta_bancaria_id") REFERENCES "core"."cuentas_bancarias"("id");



ALTER TABLE ONLY "core"."configuracion_pagos"
    ADD CONSTRAINT "configuracion_pagos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."consent_log"
    ADD CONSTRAINT "consent_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "core"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "core"."cuentas_bancarias"
    ADD CONSTRAINT "cuentas_bancarias_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."dividendospagados"
    ADD CONSTRAINT "dividendospagados_accionista_id_fkey" FOREIGN KEY ("accionista_id") REFERENCES "core"."accionistas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "core"."documentos_legales"
    ADD CONSTRAINT "documentos_legales_creado_por_user_id_fkey" FOREIGN KEY ("creado_por_user_id") REFERENCES "core"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "core"."documentos_legales"
    ADD CONSTRAINT "documentos_legales_documento_padre_id_fkey" FOREIGN KEY ("documento_padre_id") REFERENCES "core"."documentos_legales"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "core"."documentos_legales"
    ADD CONSTRAINT "documentos_legales_firmado_por_contador_id_fkey" FOREIGN KEY ("firmado_por_contador_id") REFERENCES "core"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "core"."documentos_legales"
    ADD CONSTRAINT "documentos_legales_firmado_por_revisor_id_fkey" FOREIGN KEY ("firmado_por_revisor_id") REFERENCES "core"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "core"."documentos_legales"
    ADD CONSTRAINT "documentos_legales_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."esg_metricas"
    ADD CONSTRAINT "esg_metricas_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "core"."esg_categorias"("id");



ALTER TABLE ONLY "core"."esg_registros"
    ADD CONSTRAINT "esg_registros_metrica_id_fkey" FOREIGN KEY ("metrica_id") REFERENCES "core"."esg_metricas"("id");



ALTER TABLE ONLY "core"."facturas"
    ADD CONSTRAINT "facturas_creado_por_user_id_fkey" FOREIGN KEY ("creado_por_user_id") REFERENCES "core"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "core"."facturas"
    ADD CONSTRAINT "facturas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."users"
    ADD CONSTRAINT "fk_tenant" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."inversiones_extranjeras"
    ADD CONSTRAINT "inversiones_extranjeras_creado_por_user_id_fkey" FOREIGN KEY ("creado_por_user_id") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."inversiones_extranjeras"
    ADD CONSTRAINT "inversiones_extranjeras_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."iso_auditorias"
    ADD CONSTRAINT "iso_auditorias_creado_por_user_id_fkey" FOREIGN KEY ("creado_por_user_id") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."iso_auditorias"
    ADD CONSTRAINT "iso_auditorias_documento_informe_id_fkey" FOREIGN KEY ("documento_informe_id") REFERENCES "core"."documentos_legales"("id");



ALTER TABLE ONLY "core"."iso_controles"
    ADD CONSTRAINT "iso_controles_responsable_implementacion_id_fkey" FOREIGN KEY ("responsable_implementacion_id") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."iso_hallazgos"
    ADD CONSTRAINT "iso_hallazgos_auditoria_id_fkey" FOREIGN KEY ("auditoria_id") REFERENCES "core"."iso_auditorias"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "core"."iso_hallazgos"
    ADD CONSTRAINT "iso_hallazgos_control_iso_id_fkey" FOREIGN KEY ("control_iso_id") REFERENCES "core"."iso_controles"("id");



ALTER TABLE ONLY "core"."iso_hallazgos"
    ADD CONSTRAINT "iso_hallazgos_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."kyc_logs"
    ADD CONSTRAINT "kyc_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "core"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "core"."movimientos_caja"
    ADD CONSTRAINT "movimientos_caja_cuenta_bancaria_id_fkey" FOREIGN KEY ("cuenta_bancaria_id") REFERENCES "core"."cuentas_bancarias"("id");



ALTER TABLE ONLY "core"."movimientos_caja"
    ADD CONSTRAINT "movimientos_caja_referencia_factura_id_fkey" FOREIGN KEY ("referencia_factura_id") REFERENCES "core"."facturas"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "core"."movimientos_caja"
    ADD CONSTRAINT "movimientos_caja_referencia_orden_pago_id_fkey" FOREIGN KEY ("referencia_orden_pago_id") REFERENCES "core"."ordenes_pago"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "core"."movimientos_caja"
    ADD CONSTRAINT "movimientos_caja_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."ordenes_pago"
    ADD CONSTRAINT "ordenes_pago_creado_por_user_id_fkey" FOREIGN KEY ("creado_por_user_id") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."ordenes_pago"
    ADD CONSTRAINT "ordenes_pago_firmado_por_user_id_1_fkey" FOREIGN KEY ("firmado_por_user_id_1") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."ordenes_pago"
    ADD CONSTRAINT "ordenes_pago_firmado_por_user_id_2_fkey" FOREIGN KEY ("firmado_por_user_id_2") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."ordenes_pago"
    ADD CONSTRAINT "ordenes_pago_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."preferencias_contacto"
    ADD CONSTRAINT "preferencias_contacto_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."preferencias_contacto"
    ADD CONSTRAINT "preferencias_contacto_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "core"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "core"."presupuestos"
    ADD CONSTRAINT "presupuestos_creado_por_user_id_fkey" FOREIGN KEY ("creado_por_user_id") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."presupuestos"
    ADD CONSTRAINT "presupuestos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."reportes_dcin"
    ADD CONSTRAINT "reportes_dcin_generado_por_user_id_fkey" FOREIGN KEY ("generado_por_user_id") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."reportes_dcin"
    ADD CONSTRAINT "reportes_dcin_inversion_id_fkey" FOREIGN KEY ("inversion_id") REFERENCES "core"."inversiones_extranjeras"("id");



ALTER TABLE ONLY "core"."reportes_dcin"
    ADD CONSTRAINT "reportes_dcin_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."reportes_regulatorios"
    ADD CONSTRAINT "reportes_regulatorios_balance_financiero_id_fkey" FOREIGN KEY ("balance_financiero_id") REFERENCES "core"."balances_financieros"("id");



ALTER TABLE ONLY "core"."reportes_regulatorios"
    ADD CONSTRAINT "reportes_regulatorios_generado_por_user_id_fkey" FOREIGN KEY ("generado_por_user_id") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."reportes_regulatorios"
    ADD CONSTRAINT "reportes_regulatorios_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."riesgos_contables"
    ADD CONSTRAINT "riesgos_contables_validado_por_user_id_fkey" FOREIGN KEY ("validado_por_user_id") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."rnbd_registros"
    ADD CONSTRAINT "rnbd_registros_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."solicitudes_arco"
    ADD CONSTRAINT "solicitudes_arco_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."solicitudes_arco"
    ADD CONSTRAINT "solicitudes_arco_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("tenant_id");



ALTER TABLE ONLY "core"."solicitudes_arco"
    ADD CONSTRAINT "solicitudes_arco_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "core"."users"("id");



ALTER TABLE ONLY "core"."tokenizacion_legal"
    ADD CONSTRAINT "tokenizacion_legal_documento_fkey" FOREIGN KEY ("documento_legal_id") REFERENCES "core"."documentos_legales"("id");



ALTER TABLE ONLY "core"."transacciones_bancarias_externas"
    ADD CONSTRAINT "transacciones_bancarias_externas_cuenta_bancaria_id_fkey" FOREIGN KEY ("cuenta_bancaria_id") REFERENCES "core"."cuentas_bancarias"("id");



ALTER TABLE ONLY "core"."transacciones_bancarias_externas"
    ADD CONSTRAINT "transacciones_bancarias_externas_movimiento_caja_id_fkey" FOREIGN KEY ("movimiento_caja_id") REFERENCES "core"."movimientos_caja"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "core"."user_roles"
    ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "core"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "core"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "core"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow authenticated to select riesgos_contables" ON "core"."riesgos_contables" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated to update riesgos_contables" ON "core"."riesgos_contables" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow service_role full access to riesgos_contables" ON "core"."riesgos_contables" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Backend Access AML" ON "core"."aml_risk_assessments" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Backend Access KYC" ON "core"."kyc_logs" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Backend Access Riesgos Contables" ON "core"."riesgos_contables" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Backend Access Users" ON "core"."users" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Users can view own KYC logs" ON "core"."kyc_logs" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT (("auth"."uid"())::"text")::integer AS "uid")));



CREATE POLICY "Users view/update Riesgos Contables" ON "core"."riesgos_contables" TO "authenticated" USING ((("tenant_id")::"text" = ( SELECT ((("auth"."jwt"() ->> 'app_metadata'::"text"))::"jsonb" ->> 'tenant_id'::"text"))));



ALTER TABLE "core"."accionistas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."activos_fijos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."ai_governance_decisions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."ai_incidents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."aml_log" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."aml_risk_assessments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."auditoria_etica" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."auditoria_explicabilidad" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."auditoria_pagos_log" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."balances_financieros" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."canal_etico_casos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."canal_etico_respuestas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."cap_table" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."certificadosdividendos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."configuracion_dividendos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."configuracion_pagos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."consent_cookies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."consent_log" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."cuentas_bancarias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."data_lineage" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."dividendospagados" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."documentos_legales" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."esg_categorias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."esg_metricas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."esg_registros" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."facturas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."inversiones_extranjeras" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."iso_auditorias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."iso_controles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."iso_hallazgos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."kyc_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."movimientos_caja" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."ordenes_pago" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."postmortems" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."preferencias_contacto" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."presupuestos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."reportes_dcin" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."reportes_regulatorios" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."riesgos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."riesgos_contables" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."rnbd_registros" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."solicitudes_arco" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."tenants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."tokenizacion_legal" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."transacciones_bancarias_externas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."user_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "core"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."test" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "core" TO "service_role";
GRANT USAGE ON SCHEMA "core" TO "anon";
GRANT USAGE ON SCHEMA "core" TO "authenticated";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


































































































































































GRANT ALL ON TABLE "core"."accionistas" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."accionistas" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."accionistas_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."activos_fijos" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."activos_fijos" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."activos_fijos_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."ai_governance_decisions" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."ai_governance_decisions" TO "authenticated";



GRANT ALL ON TABLE "core"."ai_incidents" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."ai_incidents" TO "authenticated";



GRANT ALL ON TABLE "core"."aml_log" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."aml_log" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."aml_log_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."aml_risk_assessments" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."aml_risk_assessments" TO "authenticated";



GRANT ALL ON TABLE "core"."auditoria_etica" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."auditoria_etica" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."auditoria_etica_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."auditoria_explicabilidad" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."auditoria_explicabilidad" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."auditoria_explicabilidad_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."auditoria_pagos_log" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."auditoria_pagos_log" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."auditoria_pagos_log_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."balances_financieros" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."balances_financieros" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."balances_financieros_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."canal_etico_casos" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."canal_etico_casos" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."canal_etico_casos_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."canal_etico_respuestas" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."canal_etico_respuestas" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."canal_etico_respuestas_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."cap_table" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."cap_table" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."cap_table_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."certificadosdividendos" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."certificadosdividendos" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."certificadosdividendos_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."configuracion_dividendos" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."configuracion_dividendos" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."configuracion_dividendos_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."configuracion_pagos" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."configuracion_pagos" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."configuracion_pagos_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."consent_cookies" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."consent_cookies" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."consent_cookies_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."consent_log" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."consent_log" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."consent_log_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."cuentas_bancarias" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."cuentas_bancarias" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."cuentas_bancarias_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."data_lineage" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."data_lineage" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."data_lineage_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."dividendospagados" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."dividendospagados" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."dividendospagados_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."documentos_legales" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."documentos_legales" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."documentos_legales_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."esg_categorias" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."esg_categorias" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."esg_categorias_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."esg_metricas" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."esg_metricas" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."esg_metricas_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."esg_registros" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."esg_registros" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."esg_registros_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."facturas" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."facturas" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."facturas_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."inversiones_extranjeras" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."inversiones_extranjeras" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."inversiones_extranjeras_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."iso_auditorias" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."iso_auditorias" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."iso_auditorias_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."iso_controles" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."iso_controles" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."iso_controles_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."iso_hallazgos" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."iso_hallazgos" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."iso_hallazgos_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."kyc_logs" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."kyc_logs" TO "authenticated";



GRANT ALL ON TABLE "core"."movimientos_caja" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."movimientos_caja" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."movimientos_caja_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."ordenes_pago" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."ordenes_pago" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."ordenes_pago_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."postmortems" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."postmortems" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."postmortems_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."preferencias_contacto" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."preferencias_contacto" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."preferencias_contacto_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."presupuestos" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."presupuestos" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."presupuestos_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."reportes_dcin" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."reportes_dcin" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."reportes_dcin_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."reportes_regulatorios" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."reportes_regulatorios" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."reportes_regulatorios_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."riesgos" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."riesgos" TO "authenticated";



GRANT ALL ON TABLE "core"."riesgos_contables" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "core"."riesgos_contables" TO "authenticated";
GRANT SELECT ON TABLE "core"."riesgos_contables" TO "anon";



GRANT ALL ON SEQUENCE "core"."riesgos_contables_id_seq" TO "service_role";
GRANT ALL ON SEQUENCE "core"."riesgos_contables_id_seq" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."riesgos_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."rnbd_registros" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."rnbd_registros" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."rnbd_registros_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."roles" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."roles" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."solicitudes_arco" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."solicitudes_arco" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."solicitudes_arco_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."tenants" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."tenants" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."tenants_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."tokenizacion_legal" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."tokenizacion_legal" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."tokenizacion_legal_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."transacciones_bancarias_externas" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."transacciones_bancarias_externas" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."transacciones_bancarias_externas_id_seq" TO "service_role";



GRANT ALL ON TABLE "core"."user_roles" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."user_roles" TO "authenticated";



GRANT ALL ON TABLE "core"."users" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "core"."users" TO "authenticated";



GRANT ALL ON SEQUENCE "core"."users_id_seq" TO "service_role";









GRANT ALL ON TABLE "public"."test" TO "anon";
GRANT ALL ON TABLE "public"."test" TO "authenticated";
GRANT ALL ON TABLE "public"."test" TO "service_role";



GRANT ALL ON SEQUENCE "public"."test_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."test_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."test_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "core" GRANT ALL ON SEQUENCES TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "core" GRANT ALL ON TABLES TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































