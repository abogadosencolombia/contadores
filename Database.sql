--
-- PostgreSQL database dump
--

\restrict DeQe3htlKbpqT8WFLPwmH1dOXhk5nfESzFvaE0wASluBERkaMPGg2uy4jgFjjEf

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-21 07:48:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 24577)
-- Name: core; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA core;


ALTER SCHEMA core OWNER TO postgres;

--
-- TOC entry 1020 (class 1247 OID 82080)
-- Name: tipo_arco_enum; Type: TYPE; Schema: core; Owner: postgres
--

CREATE TYPE core.tipo_arco_enum AS ENUM (
    'ACCESO',
    'RECTIFICACION',
    'CANCELACION',
    'OPOSICION'
);


ALTER TYPE core.tipo_arco_enum OWNER TO postgres;

--
-- TOC entry 984 (class 1247 OID 49391)
-- Name: tipo_documento_enum; Type: TYPE; Schema: core; Owner: postgres
--

CREATE TYPE core.tipo_documento_enum AS ENUM (
    'CC',
    'NIT',
    'CE',
    'PAS'
);


ALTER TYPE core.tipo_documento_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 263 (class 1259 OID 49400)
-- Name: accionistas; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.accionistas (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    nombre_completo character varying(255) NOT NULL,
    tipo_documento core.tipo_documento_enum NOT NULL,
    numero_documento character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    numero_acciones integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.accionistas OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 49399)
-- Name: accionistas_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.accionistas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.accionistas_id_seq OWNER TO postgres;

--
-- TOC entry 5432 (class 0 OID 0)
-- Dependencies: 262
-- Name: accionistas_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.accionistas_id_seq OWNED BY core.accionistas.id;


--
-- TOC entry 226 (class 1259 OID 24617)
-- Name: aml_log; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.aml_log (
    id integer NOT NULL,
    inversionista_id integer,
    tipo_operacion character varying(50),
    monto numeric(14,2),
    pais_origen character varying(50),
    riesgo character varying(10),
    fecha timestamp without time zone DEFAULT now()
);


ALTER TABLE core.aml_log OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24616)
-- Name: aml_log_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.aml_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.aml_log_id_seq OWNER TO postgres;

--
-- TOC entry 5433 (class 0 OID 0)
-- Dependencies: 225
-- Name: aml_log_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.aml_log_id_seq OWNED BY core.aml_log.id;


--
-- TOC entry 222 (class 1259 OID 24590)
-- Name: auditoria_etica; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.auditoria_etica (
    id integer NOT NULL,
    decision_id uuid,
    tipo_evento character varying(50),
    descripcion text,
    severidad character varying(10),
    accion_tomada text,
    fecha timestamp without time zone DEFAULT now(),
    cerrado boolean DEFAULT false,
    firmado_por character varying(120),
    CONSTRAINT auditoria_etica_severidad_check CHECK (((severidad)::text = ANY ((ARRAY['baja'::character varying, 'media'::character varying, 'alta'::character varying, 'crtica'::character varying])::text[])))
);


ALTER TABLE core.auditoria_etica OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24589)
-- Name: auditoria_etica_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.auditoria_etica_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.auditoria_etica_id_seq OWNER TO postgres;

--
-- TOC entry 5434 (class 0 OID 0)
-- Dependencies: 221
-- Name: auditoria_etica_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.auditoria_etica_id_seq OWNED BY core.auditoria_etica.id;


--
-- TOC entry 220 (class 1259 OID 24579)
-- Name: auditoria_explicabilidad; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.auditoria_explicabilidad (
    id integer NOT NULL,
    modelo character varying(60),
    version character varying(10),
    decision text,
    justificacion_algoritmica text,
    variables_clave text,
    score_explicabilidad numeric(3,2),
    fecha timestamp without time zone DEFAULT now(),
    revisado_por character varying(120),
    trace_id uuid
);


ALTER TABLE core.auditoria_explicabilidad OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24578)
-- Name: auditoria_explicabilidad_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.auditoria_explicabilidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.auditoria_explicabilidad_id_seq OWNER TO postgres;

--
-- TOC entry 5435 (class 0 OID 0)
-- Dependencies: 219
-- Name: auditoria_explicabilidad_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.auditoria_explicabilidad_id_seq OWNED BY core.auditoria_explicabilidad.id;


--
-- TOC entry 257 (class 1259 OID 41110)
-- Name: auditoria_pagos_log; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.auditoria_pagos_log (
    id integer NOT NULL,
    orden_pago_id integer NOT NULL,
    user_id integer,
    accion character varying(50) NOT NULL,
    detalles text,
    hash_evidencia text,
    fecha timestamp with time zone DEFAULT now()
);


ALTER TABLE core.auditoria_pagos_log OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 41119)
-- Name: auditoria_pagos_log_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.auditoria_pagos_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.auditoria_pagos_log_id_seq OWNER TO postgres;

--
-- TOC entry 5436 (class 0 OID 0)
-- Dependencies: 258
-- Name: auditoria_pagos_log_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.auditoria_pagos_log_id_seq OWNED BY core.auditoria_pagos_log.id;


--
-- TOC entry 242 (class 1259 OID 24756)
-- Name: balances_financieros; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.balances_financieros (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    tipo_empresa character varying(50) NOT NULL,
    normativa character varying(10) NOT NULL,
    periodo_fecha date NOT NULL,
    datos_balance jsonb NOT NULL,
    hash_sha256 text NOT NULL,
    estado_firma character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    firmado_por_contador_id integer,
    firma_digital_hash text,
    fecha_generacion timestamp without time zone DEFAULT now(),
    fecha_firma timestamp without time zone
);


ALTER TABLE core.balances_financieros OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 24755)
-- Name: balances_financieros_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.balances_financieros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.balances_financieros_id_seq OWNER TO postgres;

--
-- TOC entry 5437 (class 0 OID 0)
-- Dependencies: 241
-- Name: balances_financieros_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.balances_financieros_id_seq OWNED BY core.balances_financieros.id;


--
-- TOC entry 250 (class 1259 OID 24962)
-- Name: canal_etico_casos; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.canal_etico_casos (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    caso_uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    creado_por_user_id integer,
    titulo character varying(255) NOT NULL,
    descripcion_irregularidad text NOT NULL,
    tipo_irregularidad character varying(50) NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT now(),
    estado character varying(20) DEFAULT 'abierto'::character varying NOT NULL,
    documento_legal_id integer,
    archivos_evidencia jsonb,
    CONSTRAINT canal_etico_casos_tipo_irregularidad_check CHECK (((tipo_irregularidad)::text = ANY ((ARRAY['fraude'::character varying, 'acoso'::character varying, 'conflicto_interes'::character varying, 'soborno'::character varying, 'otro'::character varying])::text[])))
);


ALTER TABLE core.canal_etico_casos OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 24961)
-- Name: canal_etico_casos_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.canal_etico_casos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.canal_etico_casos_id_seq OWNER TO postgres;

--
-- TOC entry 5438 (class 0 OID 0)
-- Dependencies: 249
-- Name: canal_etico_casos_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.canal_etico_casos_id_seq OWNED BY core.canal_etico_casos.id;


--
-- TOC entry 252 (class 1259 OID 24999)
-- Name: canal_etico_respuestas; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.canal_etico_respuestas (
    id integer NOT NULL,
    caso_id integer NOT NULL,
    user_id integer NOT NULL,
    mensaje text NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT now(),
    visibilidad character varying(10) DEFAULT 'publico'::character varying NOT NULL,
    CONSTRAINT canal_etico_respuestas_visibilidad_check CHECK (((visibilidad)::text = ANY ((ARRAY['publico'::character varying, 'privado'::character varying])::text[])))
);


ALTER TABLE core.canal_etico_respuestas OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 24998)
-- Name: canal_etico_respuestas_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.canal_etico_respuestas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.canal_etico_respuestas_id_seq OWNER TO postgres;

--
-- TOC entry 5439 (class 0 OID 0)
-- Dependencies: 251
-- Name: canal_etico_respuestas_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.canal_etico_respuestas_id_seq OWNED BY core.canal_etico_respuestas.id;


--
-- TOC entry 228 (class 1259 OID 24626)
-- Name: cap_table; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.cap_table (
    id integer NOT NULL,
    inversionista_id integer,
    token_id uuid,
    porcentaje numeric(6,3),
    fecha timestamp without time zone DEFAULT now(),
    lockup_hasta date,
    calificado boolean DEFAULT false,
    cantidad numeric(18,0) DEFAULT 0
);


ALTER TABLE core.cap_table OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24625)
-- Name: cap_table_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.cap_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.cap_table_id_seq OWNER TO postgres;

--
-- TOC entry 5440 (class 0 OID 0)
-- Dependencies: 227
-- Name: cap_table_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.cap_table_id_seq OWNED BY core.cap_table.id;


--
-- TOC entry 267 (class 1259 OID 49444)
-- Name: certificadosdividendos; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.certificadosdividendos (
    id integer NOT NULL,
    accionista_id integer NOT NULL,
    ano_fiscal integer NOT NULL,
    verification_uuid uuid NOT NULL,
    file_path character varying(512) NOT NULL,
    file_hash_sha256 character varying(64) NOT NULL,
    fecha_emision timestamp with time zone DEFAULT now()
);


ALTER TABLE core.certificadosdividendos OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 49443)
-- Name: certificadosdividendos_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.certificadosdividendos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.certificadosdividendos_id_seq OWNER TO postgres;

--
-- TOC entry 5441 (class 0 OID 0)
-- Dependencies: 266
-- Name: certificadosdividendos_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.certificadosdividendos_id_seq OWNED BY core.certificadosdividendos.id;


--
-- TOC entry 281 (class 1259 OID 73835)
-- Name: configuracion_pagos; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.configuracion_pagos (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    proveedor character varying(50) DEFAULT 'WOMPI'::character varying,
    public_key text NOT NULL,
    private_key_enc text NOT NULL,
    integrity_secret_enc text NOT NULL,
    ambiente character varying(10) DEFAULT 'SANDBOX'::character varying,
    cuenta_bancaria_id integer,
    is_active boolean DEFAULT true
);


ALTER TABLE core.configuracion_pagos OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 73834)
-- Name: configuracion_pagos_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.configuracion_pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.configuracion_pagos_id_seq OWNER TO postgres;

--
-- TOC entry 5442 (class 0 OID 0)
-- Dependencies: 280
-- Name: configuracion_pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.configuracion_pagos_id_seq OWNED BY core.configuracion_pagos.id;


--
-- TOC entry 236 (class 1259 OID 24672)
-- Name: consent_cookies; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.consent_cookies (
    id integer NOT NULL,
    tenant character varying(60),
    user_id uuid,
    version_politica character varying(10),
    categorias text,
    ip character varying(60),
    "timestamp" timestamp without time zone DEFAULT now()
);


ALTER TABLE core.consent_cookies OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 24671)
-- Name: consent_cookies_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.consent_cookies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.consent_cookies_id_seq OWNER TO postgres;

--
-- TOC entry 5443 (class 0 OID 0)
-- Dependencies: 235
-- Name: consent_cookies_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.consent_cookies_id_seq OWNED BY core.consent_cookies.id;


--
-- TOC entry 240 (class 1259 OID 24701)
-- Name: consent_log; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.consent_log (
    id integer NOT NULL,
    user_id integer,
    ip character varying(60),
    fecha timestamp without time zone DEFAULT now(),
    version character varying(10) NOT NULL,
    finalidad character varying(50) NOT NULL,
    tenant character varying(60)
);


ALTER TABLE core.consent_log OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 24700)
-- Name: consent_log_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.consent_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.consent_log_id_seq OWNER TO postgres;

--
-- TOC entry 5444 (class 0 OID 0)
-- Dependencies: 239
-- Name: consent_log_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.consent_log_id_seq OWNED BY core.consent_log.id;


--
-- TOC entry 275 (class 1259 OID 65680)
-- Name: cuentas_bancarias; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.cuentas_bancarias (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    nombre_banco character varying(100) NOT NULL,
    numero_cuenta_display character varying(50) NOT NULL,
    moneda character varying(3) NOT NULL,
    descripcion text,
    pasarela_integracion_id text,
    fecha_creacion timestamp with time zone DEFAULT now()
);


ALTER TABLE core.cuentas_bancarias OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 65679)
-- Name: cuentas_bancarias_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.cuentas_bancarias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.cuentas_bancarias_id_seq OWNER TO postgres;

--
-- TOC entry 5445 (class 0 OID 0)
-- Dependencies: 274
-- Name: cuentas_bancarias_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.cuentas_bancarias_id_seq OWNED BY core.cuentas_bancarias.id;


--
-- TOC entry 234 (class 1259 OID 24661)
-- Name: data_lineage; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.data_lineage (
    id integer NOT NULL,
    dataset_id uuid,
    dataset_hash text,
    modelo character varying(60),
    version character varying(20),
    origen_datos text,
    licencia_datos text,
    fecha timestamp without time zone DEFAULT now()
);


ALTER TABLE core.data_lineage OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 24660)
-- Name: data_lineage_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.data_lineage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.data_lineage_id_seq OWNER TO postgres;

--
-- TOC entry 5446 (class 0 OID 0)
-- Dependencies: 233
-- Name: data_lineage_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.data_lineage_id_seq OWNED BY core.data_lineage.id;


--
-- TOC entry 265 (class 1259 OID 49424)
-- Name: dividendospagados; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.dividendospagados (
    id integer NOT NULL,
    accionista_id integer NOT NULL,
    ano_fiscal integer NOT NULL,
    monto_bruto numeric(15,2) NOT NULL,
    retencion numeric(15,2) NOT NULL,
    monto_neto numeric(15,2) NOT NULL,
    fecha_pago date NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.dividendospagados OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 49423)
-- Name: dividendospagados_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.dividendospagados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.dividendospagados_id_seq OWNER TO postgres;

--
-- TOC entry 5447 (class 0 OID 0)
-- Dependencies: 264
-- Name: dividendospagados_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.dividendospagados_id_seq OWNED BY core.dividendospagados.id;


--
-- TOC entry 248 (class 1259 OID 24845)
-- Name: documentos_legales; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.documentos_legales (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    creado_por_user_id integer,
    titulo character varying(255) NOT NULL,
    descripcion text,
    tipo_documento character varying(50) NOT NULL,
    fecha_documento date NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT now(),
    version integer DEFAULT 1 NOT NULL,
    documento_padre_id integer,
    estado character varying(20) DEFAULT 'borrador'::character varying NOT NULL,
    storage_path_original text NOT NULL,
    hash_sha256_original text NOT NULL,
    firmado_por_contador_id integer,
    fecha_firma_contador timestamp with time zone,
    hash_firma_contador text,
    firmado_por_revisor_id integer,
    fecha_firma_revisor timestamp with time zone,
    hash_firma_revisor text,
    storage_path_firmado text,
    CONSTRAINT documentos_legales_estado_check CHECK (((estado)::text = ANY ((ARRAY['borrador'::character varying, 'pendiente_firma'::character varying, 'finalizado'::character varying])::text[]))),
    CONSTRAINT documentos_legales_tipo_documento_check CHECK (((tipo_documento)::text = ANY ((ARRAY['contrato'::character varying, 'acta'::character varying, 'informe_auditoria'::character varying, 'acta_etica'::character varying, 'otro'::character varying])::text[])))
);


ALTER TABLE core.documentos_legales OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 24844)
-- Name: documentos_legales_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.documentos_legales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.documentos_legales_id_seq OWNER TO postgres;

--
-- TOC entry 5448 (class 0 OID 0)
-- Dependencies: 247
-- Name: documentos_legales_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.documentos_legales_id_seq OWNED BY core.documentos_legales.id;


--
-- TOC entry 245 (class 1259 OID 24802)
-- Name: facturas; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.facturas (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    creado_por_user_id integer,
    consecutivo character varying(50) NOT NULL,
    fecha_emision timestamp with time zone DEFAULT now() NOT NULL,
    fecha_vencimiento date,
    cliente_documento character varying(30) CONSTRAINT facturas_cliente_nit_not_null NOT NULL,
    cliente_razon_social character varying(255) NOT NULL,
    cliente_email character varying(255) NOT NULL,
    moneda character varying(3) DEFAULT 'COP'::character varying NOT NULL,
    total_sin_impuestos numeric(18,2) NOT NULL,
    total_impuestos numeric(18,2) NOT NULL,
    total_con_impuestos numeric(18,2) NOT NULL,
    items_json jsonb,
    estado_dian character varying(30) DEFAULT 'borrador'::character varying NOT NULL,
    es_habilitacion boolean DEFAULT true NOT NULL,
    cufe character varying(255),
    qr_data text,
    xml_ubl_generado text,
    dian_xml_respuesta text,
    dian_mensaje_error text,
    cliente_tipo_documento character varying(10) NOT NULL,
    estado_pago character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    fecha_pago_efectivo timestamp with time zone,
    referencia_pasarela_pago text,
    CONSTRAINT facturas_estado_dian_check CHECK (((estado_dian)::text = ANY (ARRAY[('borrador'::character varying)::text, ('generada'::character varying)::text, ('enviada_dian'::character varying)::text, ('aprobada'::character varying)::text, ('aprobada_con_notificacion'::character varying)::text, ('rechazada'::character varying)::text]))),
    CONSTRAINT facturas_estado_pago_check CHECK (((estado_pago)::text = ANY ((ARRAY['pendiente'::character varying, 'pagada'::character varying, 'vencida'::character varying, 'anulada'::character varying])::text[])))
);


ALTER TABLE core.facturas OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 24825)
-- Name: facturas_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.facturas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.facturas_id_seq OWNER TO postgres;

--
-- TOC entry 5449 (class 0 OID 0)
-- Dependencies: 246
-- Name: facturas_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.facturas_id_seq OWNED BY core.facturas.id;


--
-- TOC entry 269 (class 1259 OID 57457)
-- Name: inversiones_extranjeras; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.inversiones_extranjeras (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    creado_por_user_id integer,
    nombre_inversionista_extranjero character varying(255) CONSTRAINT inversiones_extranjeras_nombre_inversionista_extranjer_not_null NOT NULL,
    id_inversionista character varying(100),
    pais_origen character varying(3) NOT NULL,
    fecha_inversion date NOT NULL,
    monto_inversion numeric(19,4) NOT NULL,
    moneda_inversion character varying(3) NOT NULL,
    monto_equivalente_cop numeric(19,4) NOT NULL,
    estado_reporte character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_estado_reporte CHECK (((estado_reporte)::text = ANY ((ARRAY['pendiente'::character varying, 'reportado'::character varying])::text[])))
);


ALTER TABLE core.inversiones_extranjeras OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 57456)
-- Name: inversiones_extranjeras_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.inversiones_extranjeras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.inversiones_extranjeras_id_seq OWNER TO postgres;

--
-- TOC entry 5450 (class 0 OID 0)
-- Dependencies: 268
-- Name: inversiones_extranjeras_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.inversiones_extranjeras_id_seq OWNED BY core.inversiones_extranjeras.id;


--
-- TOC entry 277 (class 1259 OID 65700)
-- Name: movimientos_caja; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.movimientos_caja (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    fecha timestamp with time zone NOT NULL,
    tipo_movimiento character varying(20) NOT NULL,
    monto numeric(19,4) NOT NULL,
    moneda character varying(3) NOT NULL,
    descripcion text,
    referencia_factura_id integer,
    referencia_orden_pago_id integer,
    cuenta_bancaria_id integer,
    referencia_pasarela text,
    conciliado boolean DEFAULT false,
    fecha_creacion timestamp with time zone DEFAULT now(),
    CONSTRAINT movimientos_caja_tipo_movimiento_check CHECK (((tipo_movimiento)::text = ANY ((ARRAY['ingreso'::character varying, 'egreso'::character varying])::text[])))
);


ALTER TABLE core.movimientos_caja OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 65699)
-- Name: movimientos_caja_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.movimientos_caja_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.movimientos_caja_id_seq OWNER TO postgres;

--
-- TOC entry 5451 (class 0 OID 0)
-- Dependencies: 276
-- Name: movimientos_caja_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.movimientos_caja_id_seq OWNED BY core.movimientos_caja.id;


--
-- TOC entry 255 (class 1259 OID 41066)
-- Name: ordenes_pago; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.ordenes_pago (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    creado_por_user_id integer NOT NULL,
    proveedor_nit character varying(30) NOT NULL,
    proveedor_nombre character varying(255) NOT NULL,
    descripcion text,
    monto numeric(19,4) NOT NULL,
    moneda character varying(3) NOT NULL,
    monto_equivalente_cop numeric(19,4) NOT NULL,
    estado character varying(30) DEFAULT 'pendiente_aprobacion'::character varying NOT NULL,
    requiere_doble_firma boolean DEFAULT false NOT NULL,
    firmado_por_user_id_1 integer,
    fecha_firma_1 timestamp with time zone,
    hash_firma_1 text,
    firmado_por_user_id_2 integer,
    fecha_firma_2 timestamp with time zone,
    hash_firma_2 text,
    fecha_creacion timestamp with time zone DEFAULT now(),
    fecha_vencimiento date,
    estado_pago character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    fecha_pago_efectivo timestamp with time zone,
    referencia_pago_externo text,
    CONSTRAINT ordenes_pago_estado_check CHECK (((estado)::text = ANY (ARRAY[('pendiente_aprobacion'::character varying)::text, ('pendiente_firma_2'::character varying)::text, ('aprobado'::character varying)::text, ('rechazado'::character varying)::text]))),
    CONSTRAINT ordenes_pago_estado_pago_check CHECK (((estado_pago)::text = ANY ((ARRAY['pendiente'::character varying, 'pagada'::character varying, 'vencida'::character varying])::text[])))
);


ALTER TABLE core.ordenes_pago OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 41085)
-- Name: ordenes_pago_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.ordenes_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.ordenes_pago_id_seq OWNER TO postgres;

--
-- TOC entry 5452 (class 0 OID 0)
-- Dependencies: 256
-- Name: ordenes_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.ordenes_pago_id_seq OWNED BY core.ordenes_pago.id;


--
-- TOC entry 232 (class 1259 OID 24650)
-- Name: postmortems; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.postmortems (
    id integer NOT NULL,
    incidente_id uuid,
    fecha timestamp without time zone DEFAULT now(),
    impacto text,
    causa_raiz text,
    acciones_correlativas text,
    owner character varying(120),
    fecha_cierre timestamp without time zone
);


ALTER TABLE core.postmortems OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 24649)
-- Name: postmortems_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.postmortems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.postmortems_id_seq OWNER TO postgres;

--
-- TOC entry 5453 (class 0 OID 0)
-- Dependencies: 231
-- Name: postmortems_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.postmortems_id_seq OWNED BY core.postmortems.id;


--
-- TOC entry 283 (class 1259 OID 82056)
-- Name: preferencias_contacto; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.preferencias_contacto (
    id integer NOT NULL,
    user_id integer,
    tenant_id character varying(60),
    canal character varying(50) NOT NULL,
    finalidad character varying(50) NOT NULL,
    autorizado boolean DEFAULT false,
    fecha_actualizacion timestamp with time zone DEFAULT now(),
    ip_origen character varying(60)
);


ALTER TABLE core.preferencias_contacto OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 82055)
-- Name: preferencias_contacto_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.preferencias_contacto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.preferencias_contacto_id_seq OWNER TO postgres;

--
-- TOC entry 5454 (class 0 OID 0)
-- Dependencies: 282
-- Name: preferencias_contacto_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.preferencias_contacto_id_seq OWNED BY core.preferencias_contacto.id;


--
-- TOC entry 273 (class 1259 OID 65651)
-- Name: presupuestos; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.presupuestos (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    creado_por_user_id integer,
    nombre character varying(255) NOT NULL,
    ano_fiscal integer NOT NULL,
    mes integer NOT NULL,
    categoria character varying(100) NOT NULL,
    monto_proyectado numeric(19,4) NOT NULL,
    monto_ejecutado numeric(19,4) DEFAULT 0.0,
    fecha_creacion timestamp with time zone DEFAULT now(),
    CONSTRAINT presupuestos_mes_check CHECK (((mes >= 1) AND (mes <= 12)))
);


ALTER TABLE core.presupuestos OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 65650)
-- Name: presupuestos_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.presupuestos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.presupuestos_id_seq OWNER TO postgres;

--
-- TOC entry 5455 (class 0 OID 0)
-- Dependencies: 272
-- Name: presupuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.presupuestos_id_seq OWNED BY core.presupuestos.id;


--
-- TOC entry 271 (class 1259 OID 57487)
-- Name: reportes_dcin; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.reportes_dcin (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    inversion_id integer NOT NULL,
    entidad_regulatoria character varying(50) DEFAULT 'Banco de la República'::character varying NOT NULL,
    tipo_reporte character varying(100) DEFAULT 'DCIN 83'::character varying NOT NULL,
    periodo_reportado date NOT NULL,
    fecha_generacion timestamp with time zone DEFAULT now(),
    generado_por_user_id integer,
    estado character varying(30) DEFAULT 'GENERADO'::character varying NOT NULL,
    storage_path_reporte text NOT NULL,
    hash_reporte text NOT NULL,
    fecha_envio timestamp with time zone,
    trace_id_envio uuid,
    respuesta_entidad jsonb,
    CONSTRAINT chk_estado_dcin CHECK (((estado)::text = ANY ((ARRAY['GENERADO'::character varying, 'ENVIANDO'::character varying, 'ENVIADO'::character varying, 'RECHAZADO'::character varying])::text[])))
);


ALTER TABLE core.reportes_dcin OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 57486)
-- Name: reportes_dcin_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.reportes_dcin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.reportes_dcin_id_seq OWNER TO postgres;

--
-- TOC entry 5456 (class 0 OID 0)
-- Dependencies: 270
-- Name: reportes_dcin_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.reportes_dcin_id_seq OWNED BY core.reportes_dcin.id;


--
-- TOC entry 254 (class 1259 OID 32875)
-- Name: reportes_regulatorios; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.reportes_regulatorios (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    balance_financiero_id integer NOT NULL,
    entidad_regulatoria character varying(50) NOT NULL,
    tipo_reporte character varying(100) NOT NULL,
    periodo_reportado date NOT NULL,
    fecha_generacion timestamp with time zone DEFAULT now(),
    generado_por_user_id integer,
    estado character varying(30) DEFAULT 'GENERADO'::character varying NOT NULL,
    storage_path_reporte text NOT NULL,
    hash_reporte text NOT NULL,
    fecha_envio timestamp with time zone,
    trace_id_envio uuid,
    respuesta_entidad jsonb
);


ALTER TABLE core.reportes_regulatorios OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 32874)
-- Name: reportes_regulatorios_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.reportes_regulatorios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.reportes_regulatorios_id_seq OWNER TO postgres;

--
-- TOC entry 5457 (class 0 OID 0)
-- Dependencies: 253
-- Name: reportes_regulatorios_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.reportes_regulatorios_id_seq OWNED BY core.reportes_regulatorios.id;


--
-- TOC entry 230 (class 1259 OID 24636)
-- Name: riesgos; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.riesgos (
    id integer NOT NULL,
    dominio character varying(50),
    riesgo text,
    probabilidad smallint,
    impacto smallint,
    owner character varying(120),
    control text,
    estado character varying(20),
    fecha timestamp without time zone DEFAULT now(),
    CONSTRAINT riesgos_estado_check CHECK (((estado)::text = ANY ((ARRAY['abierto'::character varying, 'mitigando'::character varying, 'cerrado'::character varying])::text[]))),
    CONSTRAINT riesgos_probabilidad_check CHECK (((probabilidad >= 1) AND (probabilidad <= 5))),
    CONSTRAINT riesgos_probabilidad_check1 CHECK (((probabilidad >= 1) AND (probabilidad <= 5)))
);


ALTER TABLE core.riesgos OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 24635)
-- Name: riesgos_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.riesgos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.riesgos_id_seq OWNER TO postgres;

--
-- TOC entry 5458 (class 0 OID 0)
-- Dependencies: 229
-- Name: riesgos_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.riesgos_id_seq OWNED BY core.riesgos.id;


--
-- TOC entry 260 (class 1259 OID 49259)
-- Name: roles; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.roles (
    id integer NOT NULL,
    nombre_rol character varying(50) NOT NULL
);


ALTER TABLE core.roles OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 49258)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5459 (class 0 OID 0)
-- Dependencies: 259
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.roles_id_seq OWNED BY core.roles.id;


--
-- TOC entry 285 (class 1259 OID 82090)
-- Name: solicitudes_arco; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.solicitudes_arco (
    id integer NOT NULL,
    tenant_id character varying(60),
    user_id integer,
    email_solicitante character varying(255) NOT NULL,
    tipo_solicitud core.tipo_arco_enum NOT NULL,
    detalle_solicitud text,
    estado character varying(20) DEFAULT 'PENDIENTE'::character varying,
    fecha_solicitud timestamp with time zone DEFAULT now(),
    fecha_limite_respuesta date,
    fecha_resolucion timestamp with time zone,
    evidencia_respuesta text,
    responsable_id integer,
    CONSTRAINT solicitudes_arco_estado_check CHECK (((estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'EN_PROCESO'::character varying, 'RESUELTO'::character varying, 'RECHAZADO'::character varying])::text[])))
);


ALTER TABLE core.solicitudes_arco OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 82089)
-- Name: solicitudes_arco_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.solicitudes_arco_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.solicitudes_arco_id_seq OWNER TO postgres;

--
-- TOC entry 5460 (class 0 OID 0)
-- Dependencies: 284
-- Name: solicitudes_arco_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.solicitudes_arco_id_seq OWNED BY core.solicitudes_arco.id;


--
-- TOC entry 244 (class 1259 OID 24781)
-- Name: tenants; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.tenants (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    nombre_empresa character varying(255) NOT NULL,
    subdominio character varying(100),
    fecha_creacion timestamp without time zone DEFAULT now(),
    codigo_invitacion character varying(50)
);


ALTER TABLE core.tenants OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 24780)
-- Name: tenants_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.tenants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.tenants_id_seq OWNER TO postgres;

--
-- TOC entry 5461 (class 0 OID 0)
-- Dependencies: 243
-- Name: tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.tenants_id_seq OWNED BY core.tenants.id;


--
-- TOC entry 224 (class 1259 OID 24603)
-- Name: tokenizacion_legal; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.tokenizacion_legal (
    id integer NOT NULL,
    token_id uuid,
    inversionista_id integer,
    porcentaje numeric(5,2),
    valor_inicial numeric(14,2),
    hash_firma text,
    registro_cambiario boolean DEFAULT false,
    fecha timestamp without time zone DEFAULT now(),
    tipo_red character varying(20) DEFAULT 'OFF_CHAIN'::character varying,
    estado_blockchain character varying(20) DEFAULT 'PENDIENTE'::character varying,
    tx_hash text,
    block_number integer,
    contract_address text,
    token_standard character varying(20) DEFAULT 'ERC-1400'::character varying,
    documento_legal_id integer,
    cantidad numeric(18,0) DEFAULT 0,
    CONSTRAINT tokenizacion_legal_estado_blockchain_check CHECK (((estado_blockchain)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'MINADO'::character varying, 'FALLIDO'::character varying, 'CONFIRMADO'::character varying])::text[]))),
    CONSTRAINT tokenizacion_legal_tipo_red_check CHECK (((tipo_red)::text = ANY ((ARRAY['HYPERLEDGER'::character varying, 'ERC1400'::character varying, 'OFF_CHAIN'::character varying])::text[])))
);


ALTER TABLE core.tokenizacion_legal OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24602)
-- Name: tokenizacion_legal_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.tokenizacion_legal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.tokenizacion_legal_id_seq OWNER TO postgres;

--
-- TOC entry 5462 (class 0 OID 0)
-- Dependencies: 223
-- Name: tokenizacion_legal_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.tokenizacion_legal_id_seq OWNED BY core.tokenizacion_legal.id;


--
-- TOC entry 279 (class 1259 OID 65738)
-- Name: transacciones_bancarias_externas; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.transacciones_bancarias_externas (
    id integer NOT NULL,
    cuenta_bancaria_id integer NOT NULL,
    pasarela_id_transaccion text CONSTRAINT transacciones_bancarias_extern_pasarela_id_transaccion_not_null NOT NULL,
    fecha timestamp with time zone NOT NULL,
    descripcion_original text NOT NULL,
    monto numeric(19,4) NOT NULL,
    conciliado boolean DEFAULT false,
    movimiento_caja_id integer
);


ALTER TABLE core.transacciones_bancarias_externas OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 65737)
-- Name: transacciones_bancarias_externas_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.transacciones_bancarias_externas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.transacciones_bancarias_externas_id_seq OWNER TO postgres;

--
-- TOC entry 5463 (class 0 OID 0)
-- Dependencies: 278
-- Name: transacciones_bancarias_externas_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.transacciones_bancarias_externas_id_seq OWNED BY core.transacciones_bancarias_externas.id;


--
-- TOC entry 261 (class 1259 OID 49269)
-- Name: user_roles; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.user_roles (
    user_id integer NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE core.user_roles OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 24683)
-- Name: users; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    tenant_id character varying(60) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    kyc_status character varying(20) DEFAULT 'pendiente'::character varying,
    mfa_enabled boolean DEFAULT false,
    full_name character varying(255)
);


ALTER TABLE core.users OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 24682)
-- Name: users_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.users_id_seq OWNER TO postgres;

--
-- TOC entry 5464 (class 0 OID 0)
-- Dependencies: 237
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.users_id_seq OWNED BY core.users.id;


--
-- TOC entry 4990 (class 2604 OID 49403)
-- Name: accionistas id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.accionistas ALTER COLUMN id SET DEFAULT nextval('core.accionistas_id_seq'::regclass);


--
-- TOC entry 4937 (class 2604 OID 24620)
-- Name: aml_log id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.aml_log ALTER COLUMN id SET DEFAULT nextval('core.aml_log_id_seq'::regclass);


--
-- TOC entry 4927 (class 2604 OID 24593)
-- Name: auditoria_etica id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.auditoria_etica ALTER COLUMN id SET DEFAULT nextval('core.auditoria_etica_id_seq'::regclass);


--
-- TOC entry 4925 (class 2604 OID 24582)
-- Name: auditoria_explicabilidad id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.auditoria_explicabilidad ALTER COLUMN id SET DEFAULT nextval('core.auditoria_explicabilidad_id_seq'::regclass);


--
-- TOC entry 4987 (class 2604 OID 41120)
-- Name: auditoria_pagos_log id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.auditoria_pagos_log ALTER COLUMN id SET DEFAULT nextval('core.auditoria_pagos_log_id_seq'::regclass);


--
-- TOC entry 4957 (class 2604 OID 24759)
-- Name: balances_financieros id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.balances_financieros ALTER COLUMN id SET DEFAULT nextval('core.balances_financieros_id_seq'::regclass);


--
-- TOC entry 4972 (class 2604 OID 24965)
-- Name: canal_etico_casos id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.canal_etico_casos ALTER COLUMN id SET DEFAULT nextval('core.canal_etico_casos_id_seq'::regclass);


--
-- TOC entry 4976 (class 2604 OID 25002)
-- Name: canal_etico_respuestas id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.canal_etico_respuestas ALTER COLUMN id SET DEFAULT nextval('core.canal_etico_respuestas_id_seq'::regclass);


--
-- TOC entry 4939 (class 2604 OID 24629)
-- Name: cap_table id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.cap_table ALTER COLUMN id SET DEFAULT nextval('core.cap_table_id_seq'::regclass);


--
-- TOC entry 4994 (class 2604 OID 49447)
-- Name: certificadosdividendos id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.certificadosdividendos ALTER COLUMN id SET DEFAULT nextval('core.certificadosdividendos_id_seq'::regclass);


--
-- TOC entry 5014 (class 2604 OID 73838)
-- Name: configuracion_pagos id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.configuracion_pagos ALTER COLUMN id SET DEFAULT nextval('core.configuracion_pagos_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 24675)
-- Name: consent_cookies id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.consent_cookies ALTER COLUMN id SET DEFAULT nextval('core.consent_cookies_id_seq'::regclass);


--
-- TOC entry 4955 (class 2604 OID 24704)
-- Name: consent_log id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.consent_log ALTER COLUMN id SET DEFAULT nextval('core.consent_log_id_seq'::regclass);


--
-- TOC entry 5007 (class 2604 OID 65683)
-- Name: cuentas_bancarias id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.cuentas_bancarias ALTER COLUMN id SET DEFAULT nextval('core.cuentas_bancarias_id_seq'::regclass);


--
-- TOC entry 4947 (class 2604 OID 24664)
-- Name: data_lineage id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.data_lineage ALTER COLUMN id SET DEFAULT nextval('core.data_lineage_id_seq'::regclass);


--
-- TOC entry 4992 (class 2604 OID 49427)
-- Name: dividendospagados id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dividendospagados ALTER COLUMN id SET DEFAULT nextval('core.dividendospagados_id_seq'::regclass);


--
-- TOC entry 4968 (class 2604 OID 24848)
-- Name: documentos_legales id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales ALTER COLUMN id SET DEFAULT nextval('core.documentos_legales_id_seq'::regclass);


--
-- TOC entry 4962 (class 2604 OID 24826)
-- Name: facturas id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.facturas ALTER COLUMN id SET DEFAULT nextval('core.facturas_id_seq'::regclass);


--
-- TOC entry 4996 (class 2604 OID 57460)
-- Name: inversiones_extranjeras id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.inversiones_extranjeras ALTER COLUMN id SET DEFAULT nextval('core.inversiones_extranjeras_id_seq'::regclass);


--
-- TOC entry 5009 (class 2604 OID 65703)
-- Name: movimientos_caja id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.movimientos_caja ALTER COLUMN id SET DEFAULT nextval('core.movimientos_caja_id_seq'::regclass);


--
-- TOC entry 4982 (class 2604 OID 41086)
-- Name: ordenes_pago id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.ordenes_pago ALTER COLUMN id SET DEFAULT nextval('core.ordenes_pago_id_seq'::regclass);


--
-- TOC entry 4945 (class 2604 OID 24653)
-- Name: postmortems id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.postmortems ALTER COLUMN id SET DEFAULT nextval('core.postmortems_id_seq'::regclass);


--
-- TOC entry 5018 (class 2604 OID 82059)
-- Name: preferencias_contacto id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.preferencias_contacto ALTER COLUMN id SET DEFAULT nextval('core.preferencias_contacto_id_seq'::regclass);


--
-- TOC entry 5004 (class 2604 OID 65654)
-- Name: presupuestos id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.presupuestos ALTER COLUMN id SET DEFAULT nextval('core.presupuestos_id_seq'::regclass);


--
-- TOC entry 4999 (class 2604 OID 57490)
-- Name: reportes_dcin id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.reportes_dcin ALTER COLUMN id SET DEFAULT nextval('core.reportes_dcin_id_seq'::regclass);


--
-- TOC entry 4979 (class 2604 OID 32878)
-- Name: reportes_regulatorios id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.reportes_regulatorios ALTER COLUMN id SET DEFAULT nextval('core.reportes_regulatorios_id_seq'::regclass);


--
-- TOC entry 4943 (class 2604 OID 24639)
-- Name: riesgos id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.riesgos ALTER COLUMN id SET DEFAULT nextval('core.riesgos_id_seq'::regclass);


--
-- TOC entry 4989 (class 2604 OID 49262)
-- Name: roles id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.roles ALTER COLUMN id SET DEFAULT nextval('core.roles_id_seq'::regclass);


--
-- TOC entry 5021 (class 2604 OID 82093)
-- Name: solicitudes_arco id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.solicitudes_arco ALTER COLUMN id SET DEFAULT nextval('core.solicitudes_arco_id_seq'::regclass);


--
-- TOC entry 4960 (class 2604 OID 24784)
-- Name: tenants id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tenants ALTER COLUMN id SET DEFAULT nextval('core.tenants_id_seq'::regclass);


--
-- TOC entry 4930 (class 2604 OID 24606)
-- Name: tokenizacion_legal id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tokenizacion_legal ALTER COLUMN id SET DEFAULT nextval('core.tokenizacion_legal_id_seq'::regclass);


--
-- TOC entry 5012 (class 2604 OID 65741)
-- Name: transacciones_bancarias_externas id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.transacciones_bancarias_externas ALTER COLUMN id SET DEFAULT nextval('core.transacciones_bancarias_externas_id_seq'::regclass);


--
-- TOC entry 4951 (class 2604 OID 24686)
-- Name: users id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.users ALTER COLUMN id SET DEFAULT nextval('core.users_id_seq'::regclass);


--
-- TOC entry 5404 (class 0 OID 49400)
-- Dependencies: 263
-- Data for Name: accionistas; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.accionistas (id, tenant_id, nombre_completo, tipo_documento, numero_documento, email, numero_acciones, created_at) FROM stdin;
1	1	Juan Perez Gomez	CC	12345678	juan.perez@email.com	1000	2025-11-14 07:21:58.531331-05
2	1	Inversiones ABC SAS	NIT	900.123.456-1	contabilidad@abc.com	5000	2025-11-14 07:21:58.531331-05
3	1	Maria Lopez Velez	CC	87654321	maria.lopez@email.com	2500	2025-11-14 07:21:58.531331-05
\.


--
-- TOC entry 5367 (class 0 OID 24617)
-- Dependencies: 226
-- Data for Name: aml_log; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.aml_log (id, inversionista_id, tipo_operacion, monto, pais_origen, riesgo, fecha) FROM stdin;
1	2	EMISION_TOKEN	1132321321.00	\N	BAJO	2025-11-20 07:38:45.48142
2	1	EMISION_TOKEN	1000.00	\N	BAJO	2025-11-20 09:02:40.923233
3	7	EMISION_TOKEN	1000.00	\N	BAJO	2025-11-20 09:02:44.858558
4	5	EMISION_TOKEN	1000.00	\N	BAJO	2025-11-20 09:02:48.646454
5	1	EMISION_TOKEN	654564546.00	\N	BAJO	2025-11-20 09:03:18.891654
6	1	EMISION_TOKEN	1132321332.00	\N	BAJO	2025-11-20 09:06:34.623757
7	4	EMISION_TOKEN	1000.00	\N	BAJO	2025-11-20 09:23:14.183241
8	1	EMISION_TOKEN	1000.00	\N	BAJO	2025-11-20 09:25:11.409059
9	4	EMISION_TOKEN	1000.00	\N	BAJO	2025-11-20 09:25:12.713322
10	6	EMISION_TOKEN	1000.00	\N	BAJO	2025-11-20 09:25:15.79771
11	5	EMISION_TOKEN	1000.00	\N	BAJO	2025-11-20 09:25:19.08946
12	1	EMISION_TOKEN	5000.00	\N	BAJO	2025-11-20 09:25:51.455946
13	4	EMISION_TOKEN	5000.00	\N	BAJO	2025-11-20 09:25:53.580517
14	1	EMISION_TOKEN	1000000.00	\N	BAJO	2025-11-20 09:37:08.738399
\.


--
-- TOC entry 5363 (class 0 OID 24590)
-- Dependencies: 222
-- Data for Name: auditoria_etica; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.auditoria_etica (id, decision_id, tipo_evento, descripcion, severidad, accion_tomada, fecha, cerrado, firmado_por) FROM stdin;
\.


--
-- TOC entry 5361 (class 0 OID 24579)
-- Dependencies: 220
-- Data for Name: auditoria_explicabilidad; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.auditoria_explicabilidad (id, modelo, version, decision, justificacion_algoritmica, variables_clave, score_explicabilidad, fecha, revisado_por, trace_id) FROM stdin;
\.


--
-- TOC entry 5398 (class 0 OID 41110)
-- Dependencies: 257
-- Data for Name: auditoria_pagos_log; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.auditoria_pagos_log (id, orden_pago_id, user_id, accion, detalles, hash_evidencia, fecha) FROM stdin;
1	1	1	CREAR	Orden creada por Pollos de Engorde por COP 10000000.	\N	2025-11-12 10:50:27.445053-05
2	2	1	CREAR	Orden creada por Pollos de Engorde por USD 10000000.	\N	2025-11-12 10:51:03.216309-05
3	2	1	FIRMAR_1	Firma aplicada por usuario 1. Nuevo estado: pendiente_firma_2	a0bafe3024a4e38542dd943c906f3baa56157df5890a3e5094247398aa0047a0	2025-11-12 10:51:48.364201-05
4	1	1	FIRMAR_1	Firma aplicada por usuario 1. Nuevo estado: aprobado	09cc858d429292edb88bd4f95be22e00c71d90e88f4216689dbf9f2edc48b8ad	2025-11-12 10:51:51.962903-05
5	2	2	FIRMAR_2	Firma aplicada por usuario 2. Nuevo estado: aprobado	ea5da2dea304c901de39bb2c8d785e3adc120e9ccffa5e9babf686d9de3c2ec2	2025-11-13 06:52:09.003111-05
6	3	2	CREAR	Orden creada por Pollos de Engorde por USD 1000.	\N	2025-11-13 09:07:00.78283-05
7	3	1	FIRMAR_1	Firma aplicada por usuario 1. Nuevo estado: aprobado	18dc14936a8e8e2766ea570a7cd4537c1c7bf1b67ad933cd80cfad0c8a5956ae	2025-11-13 09:07:35.955234-05
8	4	2	CREAR	Orden creada por Pollos de Engorde por USD 10001.	\N	2025-11-13 09:08:06.195642-05
9	4	2	FIRMAR_1	Firma aplicada por usuario 2. Nuevo estado: pendiente_firma_2	dae4c1a5e5f7710b4f59bcb549fef97f315be5d1fc9ab0b6817ebc8fabb24211	2025-11-13 09:08:36.306037-05
10	4	1	FIRMAR_2	Firma aplicada por usuario 1. Nuevo estado: aprobado	ed7ca825ff05bd0380d244752b13065d266c652ca5fe907a55d05db9a74f3129	2025-11-13 09:08:56.787261-05
11	5	1	CREAR	Orden creada por Pollos de Engorde por COP 50000.	\N	2025-11-15 09:48:30.922553-05
12	5	1	FIRMAR_1	Firma aplicada por usuario 1. Nuevo estado: aprobado	9a8d99e883b04be490e26d10e432af283eaddeb94a4171843916e0e2688306d5	2025-11-15 09:55:04.097885-05
13	6	1	CREAR	Orden creada por Pollos de Engorde por COP 36000000.	\N	2025-11-15 09:55:29.421928-05
14	6	1	FIRMAR_1	Firma aplicada por usuario 1. Nuevo estado: pendiente_firma_2	606ecf5b008e5250d1dce5e6f1183e443da2b7720faba297d95451ea7c29886d	2025-11-15 09:55:45.505754-05
15	6	2	FIRMAR_2	Firma aplicada por usuario 2. Nuevo estado: aprobado	0ae53a961c5f4ec74ea0bcebadcfd90e904d4b6b7693eccdf6eb2fdef55bab20	2025-11-15 09:56:15.01649-05
16	7	1	CREAR	Orden creada por Pollos de Engorde por COP 360000000.	\N	2025-11-15 09:56:46.26333-05
17	7	1	FIRMAR_1	Firma aplicada por usuario 1. Nuevo estado: pendiente_firma_2	ac31f5161fde67c740c48551586a13eb963e4d4a57dd7a3a1c7d6f303cf4b892	2025-11-15 09:56:50.339373-05
18	7	2	FIRMAR_2	Firma aplicada por usuario 2. Nuevo estado: aprobado	3640e699a0e56f84433bdf1fdaeba3b8397245398a8a0f511cac7384d207115e	2025-11-15 09:56:54.895734-05
19	8	1	CREAR	Orden creada por Pollos de Engorde por USD 1.	\N	2025-11-15 10:02:19.332224-05
20	8	1	FIRMAR_1	Firma aplicada por usuario 1. Nuevo estado: aprobado	e0c44a1d79dc2956f8969ee3b022c42aeda49531b77867ebed63f039b3248094	2025-11-15 10:02:22.708807-05
\.


--
-- TOC entry 5383 (class 0 OID 24756)
-- Dependencies: 242
-- Data for Name: balances_financieros; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.balances_financieros (id, tenant_id, tipo_empresa, normativa, periodo_fecha, datos_balance, hash_sha256, estado_firma, firmado_por_contador_id, firma_digital_hash, fecha_generacion, fecha_firma) FROM stdin;
8	default_tenant	Grupo 1-3	IFRS	2025-09-30	{"activos": 1200000, "pasivos": 800000, "patrimonio": 400000}	c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2	pendiente	\N	\N	2025-11-07 09:36:31.811128	\N
9	default_tenant	PyME	NIIF	2025-09-30	{"activos": 145000, "pasivos": 45000, "patrimonio": 100000}	d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3	firmado	2	firma_simulada_9876543210	2025-11-07 09:36:31.811128	2025-10-05 10:30:00
10	default_tenant	Micro	NIIF	2025-08-31	{"activos": 75000, "pasivos": 15000, "patrimonio": 60000}	e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4	firmado	2	firma_simulada_1234567890	2025-11-07 09:36:31.811128	2025-09-04 15:00:00
6	default_tenant	PyME	NIIF	2025-10-31	{"activos": 150000, "pasivos": 50000, "patrimonio": 100000}	a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890	firmado	1	simulacion_firma_1_2025-11-08T11:46:45.148Z	2025-11-07 09:36:31.811128	2025-11-08 06:46:45.148
7	default_tenant	Micro	NIIF	2025-10-31	{"activos": 80000, "pasivos": 20000, "patrimonio": 60000}	b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1	firmado	\N	\N	2025-11-07 09:36:31.811128	\N
\.


--
-- TOC entry 5391 (class 0 OID 24962)
-- Dependencies: 250
-- Data for Name: canal_etico_casos; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.canal_etico_casos (id, tenant_id, caso_uuid, creado_por_user_id, titulo, descripcion_irregularidad, tipo_irregularidad, fecha_creacion, estado, documento_legal_id, archivos_evidencia) FROM stdin;
1	default_tenant	367b81ce-b0c1-4086-8916-881c1ca96240	1	Denuncia: Posible conflicto de interés	Se ha observado un posible conflicto de interés en la asignación de contratos de proveeduría en la franquicia del sur.	conflicto_interes	2025-11-10 09:22:53.621968-05	resuelto	19	\N
2	default_tenant	8829fe05-092a-4adb-ba75-afe6ba548926	1	Denuncia: Soborno en Franquicia Central	Denuncia anónima recibida sobre pagos indebidos en la franquicia central. El comité investigó y emitió una resolución.	soborno	2025-11-10 09:22:53.621968-05	resuelto	\N	\N
3	default_tenant	9002c26e-c037-4729-8d86-d5d1da64ef6a	\N	UWU	UWU	acoso	2025-11-11 07:44:44.800465-05	abierto	\N	\N
4	default_tenant	5e968219-09c2-4dc3-9b93-1eadfb12d267	\N	UWU 2	UWU	acoso	2025-11-11 08:39:47.612124-05	abierto	\N	["default_tenant\\\\casos_eticos\\\\5e968219-09c2-4dc3-9b93-1eadfb12d267\\\\1762868387622-banner.png"]
5	default_tenant	de3994da-b76c-4fb8-aecd-f96d305cfdae	\N	MULTIPLE	MULTIPLE\r\n	fraude	2025-11-11 09:18:32.18158-05	resuelto	28	["default_tenant\\\\casos_eticos\\\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\\\1762870712188-banner.png", "default_tenant\\\\casos_eticos\\\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\\\1762870712190-next-env.d.ts", "default_tenant\\\\casos_eticos\\\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\\\1762870712190-notas.md", "default_tenant\\\\casos_eticos\\\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\\\1762870712191-NOTAS.txt", "default_tenant\\\\casos_eticos\\\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\\\1762870712193-banner.png", "default_tenant\\\\casos_eticos\\\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\\\1762870712195-next-env.d.ts", "default_tenant\\\\casos_eticos\\\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\\\1762870712196-notas.md", "default_tenant\\\\casos_eticos\\\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\\\1762870712197-NOTAS.txt"]
\.


--
-- TOC entry 5393 (class 0 OID 24999)
-- Dependencies: 252
-- Data for Name: canal_etico_respuestas; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.canal_etico_respuestas (id, caso_id, user_id, mensaje, fecha_creacion, visibilidad) FROM stdin;
\.


--
-- TOC entry 5369 (class 0 OID 24626)
-- Dependencies: 228
-- Data for Name: cap_table; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.cap_table (id, inversionista_id, token_id, porcentaje, fecha, lockup_hasta, calificado, cantidad) FROM stdin;
8	1	4c4ece88-5bee-4445-adbb-1ae79c0908cf	0.118	2025-11-20 09:25:11.407781	2026-11-20	f	10
9	4	7e9df68c-3992-4b9a-8001-24d8d3502128	0.118	2025-11-20 09:25:12.712861	2026-11-20	f	10
10	6	14ceb454-d68d-4614-b9c7-9f9cdeb5c27e	0.118	2025-11-20 09:25:15.796954	2026-11-20	f	10
11	5	a1b4568b-3d97-4194-85a2-02eb5813ecc6	0.118	2025-11-20 09:25:19.088935	2026-11-20	f	10
12	1	1db2e35f-7d0f-4485-8b06-bd8bcb85f38a	0.118	2025-11-20 09:25:51.45469	2026-11-20	f	10
13	4	35ba49a4-ed85-463d-896b-79bb760a2f27	0.118	2025-11-20 09:25:53.580013	2026-11-20	f	10
14	1	c94e84f2-74c3-4011-b2d0-290f770194b9	50.000	2025-11-20 09:37:08.736355	2026-11-20	f	8500
\.


--
-- TOC entry 5408 (class 0 OID 49444)
-- Dependencies: 267
-- Data for Name: certificadosdividendos; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.certificadosdividendos (id, accionista_id, ano_fiscal, verification_uuid, file_path, file_hash_sha256, fecha_emision) FROM stdin;
1	1	2023	dcbeaff1-7aa0-450e-8002-7f12b62c958e	CCOL-001/certificados_dividendos/certificado_2023_1.pdf	3aee7289c978c87f2f0aeb6f0d1fcf08439f14b9ac27808d90cf05479875bca5	2025-11-14 07:45:21.680118-05
2	2	2023	a6278f56-8b7c-4570-8a5b-30d7e5d484ca	CCOL-001/certificados_dividendos/certificado_2023_2.pdf	14aa3cc7bc11aefde1b90bdd5ac71093477d0b048228c3789283d73860f8ba78	2025-11-14 07:45:21.739003-05
\.


--
-- TOC entry 5422 (class 0 OID 73835)
-- Dependencies: 281
-- Data for Name: configuracion_pagos; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.configuracion_pagos (id, tenant_id, proveedor, public_key, private_key_enc, integrity_secret_enc, ambiente, cuenta_bancaria_id, is_active) FROM stdin;
\.


--
-- TOC entry 5377 (class 0 OID 24672)
-- Dependencies: 236
-- Data for Name: consent_cookies; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.consent_cookies (id, tenant, user_id, version_politica, categorias, ip, "timestamp") FROM stdin;
\.


--
-- TOC entry 5381 (class 0 OID 24701)
-- Dependencies: 240
-- Data for Name: consent_log; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.consent_log (id, user_id, ip, fecha, version, finalidad, tenant) FROM stdin;
1	1	::1	2025-11-06 08:56:14.878404	v3.0	registro	default_tenant
2	1	::1	2025-11-06 08:56:14.880978	v3.0	marketing	default_tenant
3	2	::1	2025-11-06 09:48:06.105489	v3.0	registro	default_tenant
4	2	::1	2025-11-06 09:48:06.109057	v3.0	marketing	default_tenant
5	3	::1	2025-11-06 09:56:52.038676	v3.0	registro	default_tenant
6	3	::1	2025-11-06 09:56:52.044105	v3.0	marketing	default_tenant
7	4	::1	2025-11-08 06:29:01.122254	v3.0	registro	default_tenant
8	4	::1	2025-11-08 06:29:01.125235	v3.0	marketing	default_tenant
9	5	::1	2025-11-08 06:33:51.694986	v3.0	registro	default_tenant
10	5	::1	2025-11-08 06:33:51.697015	v3.0	marketing	default_tenant
11	6	::1	2025-11-08 06:40:22.258899	v3.0	registro	CCOL-001
12	7	::1	2025-11-08 06:41:19.830496	v3.0	registro	default_tenant
\.


--
-- TOC entry 5416 (class 0 OID 65680)
-- Dependencies: 275
-- Data for Name: cuentas_bancarias; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.cuentas_bancarias (id, tenant_id, nombre_banco, numero_cuenta_display, moneda, descripcion, pasarela_integracion_id, fecha_creacion) FROM stdin;
1	default_tenant	Bancolombia	64645645456456465465465	COP	Recaudo	\N	2025-11-19 07:54:01.055591-05
\.


--
-- TOC entry 5375 (class 0 OID 24661)
-- Dependencies: 234
-- Data for Name: data_lineage; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.data_lineage (id, dataset_id, dataset_hash, modelo, version, origen_datos, licencia_datos, fecha) FROM stdin;
\.


--
-- TOC entry 5406 (class 0 OID 49424)
-- Dependencies: 265
-- Data for Name: dividendospagados; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.dividendospagados (id, accionista_id, ano_fiscal, monto_bruto, retencion, monto_neto, fecha_pago, created_at) FROM stdin;
1	1	2023	1000000.00	150000.00	850000.00	2023-04-15	2025-11-14 07:21:58.531331-05
2	2	2023	5000000.00	750000.00	4250000.00	2023-04-15	2025-11-14 07:21:58.531331-05
3	1	2024	750000.00	75000.00	675000.00	2024-03-20	2025-11-14 07:21:58.531331-05
4	1	2024	750000.00	75000.00	675000.00	2024-06-20	2025-11-14 07:21:58.531331-05
5	2	2024	6000000.00	600000.00	5400000.00	2024-03-20	2025-11-14 07:21:58.531331-05
6	3	2024	2000000.00	200000.00	1800000.00	2024-03-20	2025-11-14 07:21:58.531331-05
\.


--
-- TOC entry 5389 (class 0 OID 24845)
-- Dependencies: 248
-- Data for Name: documentos_legales; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.documentos_legales (id, tenant_id, creado_por_user_id, titulo, descripcion, tipo_documento, fecha_documento, fecha_creacion, version, documento_padre_id, estado, storage_path_original, hash_sha256_original, firmado_por_contador_id, fecha_firma_contador, hash_firma_contador, firmado_por_revisor_id, fecha_firma_revisor, hash_firma_revisor, storage_path_firmado) FROM stdin;
19	default_tenant	\N	Acta de Resolucion - TEST	A<BC	acta_etica	2025-11-11	2025-11-11 06:52:55.34262-05	1	\N	finalizado	default_tenant/actas_eticas/acta_etica_1_1762861975342.txt	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	1	2025-11-11 07:10:39.309557-05	firma_simulada_1762863037679	1	2025-11-11 07:10:43.499849-05	firma_simulada_1762863043379	s3://bucket/docs/doc_19_firmado.pdf
28	default_tenant	1	Acta de Resolucion - TEST MULTIPLE	Acta de Resolucion - TEST MULTIPLE	acta_etica	2025-11-12	2025-11-12 07:10:10.047448-05	1	\N	borrador	default_tenant\\actas_eticas_resueltas\\acta_etica_5_1762949414596.pdf	2ddf9e62b90fdb9aaa3d0e5491dd002e0e1fe267cff9076094b780e0f2e2b403	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5386 (class 0 OID 24802)
-- Dependencies: 245
-- Data for Name: facturas; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.facturas (id, tenant_id, creado_por_user_id, consecutivo, fecha_emision, fecha_vencimiento, cliente_documento, cliente_razon_social, cliente_email, moneda, total_sin_impuestos, total_impuestos, total_con_impuestos, items_json, estado_dian, es_habilitacion, cufe, qr_data, xml_ubl_generado, dian_xml_respuesta, dian_mensaje_error, cliente_tipo_documento, estado_pago, fecha_pago_efectivo, referencia_pasarela_pago) FROM stdin;
1	default_tenant	1	FE-001	2025-11-08 09:03:41.298958-05	2025-02-11	900123456	Pollos de Engorde S.A.S	pe@pe.pe	COP	190000.00	36100.00	226100.00	[{"cantidad": 10, "iva_tasa": 19, "total_iva": 36100, "descripcion": "pollote", "total_con_iva": 226100, "valor_unitario": 19000}]	aprobada	t	7dbbccefd69b941262bf0dd683a6e2207332f0e831e2a6d7830d0c9fcbe9477b	https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=7dbbccefd69b941262bf0dd683a6e2207332f0e831e2a6d7830d0c9fcbe9477b	\n      <?xml version="1.0" encoding="UTF-8"?>\n      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" ...>\n        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n        <cbc:ID>FE-001</cbc:ID>\n        <cbc:UUID schemeName="CUFE">7dbbccefd69b941262bf0dd683a6e2207332f0e831e2a6d7830d0c9fcbe9477b</cbc:UUID>\n        <cac:AccountingSupplierParty>\n          <cac:Party>\n            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>\n            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingSupplierParty>\n        <cac:AccountingCustomerParty>\n          <cac:Party>\n            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>\n            <cbc:CompanyID schemeName="31">900123456</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingCustomerParty>\n        <cac:LegalMonetaryTotal>\n          <cbc:LineExtensionAmount currencyID="COP">190000.00</cbc:LineExtensionAmount>\n          <cbc:TaxExclusiveAmount currencyID="COP">36100.00</cbc:TaxExclusiveAmount>\n          <cbc:PayableAmount currencyID="COP">226100.00</cbc:PayableAmount>\n        </cac:LegalMonetaryTotal>\n        ...\n        <!-- Aquí irían los ítems, firma digital, etc. -->\n      </Invoice>\n    	\n      <?xml version="1.0" encoding="UTF-8"?>\n      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2" ...>\n        <cbc:ResponseDate>2025-11-08T14:34:41.341Z</cbc:ResponseDate>\n        <cac:DocumentResponse>\n          <cac:Response>\n            <cbc:ResponseCode>00</cbc:ResponseCode>\n            <cbc:Description>Factura FE-001 APROBADA por la DIAN.</cbc:Description>\n          </cac:Response>\n        </cac:DocumentResponse>\n        <cbc:Note>Ambiente: Habilitacion</cbc:Note>\n      </ApplicationResponse>\n    	\N	31	pendiente	\N	\N
2	default_tenant	1	FE-002	2025-11-08 09:36:55.538989-05	2025-12-12	900123457	pe	jheison01@gmail.com	COP	1000.00	190.00	1190.00	[{"cantidad": 1, "iva_tasa": 19, "total_iva": 190, "descripcion": "aaaaa", "total_con_iva": 1190, "valor_unitario": 1000}]	aprobada	t	af5ec81d55557ce7979e0569469f4f73d15f3baa12852387f732042f60d38611	https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=af5ec81d55557ce7979e0569469f4f73d15f3baa12852387f732042f60d38611	\n      <?xml version="1.0" encoding="UTF-8"?>\n      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" ...>\n        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n        <cbc:ID>FE-002</cbc:ID>\n        <cbc:UUID schemeName="CUFE">af5ec81d55557ce7979e0569469f4f73d15f3baa12852387f732042f60d38611</cbc:UUID>\n        <cac:AccountingSupplierParty>\n          <cac:Party>\n            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>\n            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingSupplierParty>\n        <cac:AccountingCustomerParty>\n          <cac:Party>\n            <cbc:Name>pe</cbc:Name>\n            <cbc:CompanyID schemeName="13">900123457</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingCustomerParty>\n        <cac:LegalMonetaryTotal>\n          <cbc:LineExtensionAmount currencyID="COP">1000.00</cbc:LineExtensionAmount>\n          <cbc:TaxExclusiveAmount currencyID="COP">190.00</cbc:TaxExclusiveAmount>\n          <cbc:PayableAmount currencyID="COP">1190.00</cbc:PayableAmount>\n        </cac:LegalMonetaryTotal>\n        ...\n        <!-- Aquí irían los ítems, firma digital, etc. -->\n      </Invoice>\n    	\n      <?xml version="1.0" encoding="UTF-8"?>\n      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2" ...>\n        <cbc:ResponseDate>2025-11-08T14:37:01.321Z</cbc:ResponseDate>\n        <cac:DocumentResponse>\n          <cac:Response>\n            <cbc:ResponseCode>00</cbc:ResponseCode>\n            <cbc:Description>Factura FE-002 APROBADA por la DIAN.</cbc:Description>\n          </cac:Response>\n        </cac:DocumentResponse>\n        <cbc:Note>Ambiente: Habilitacion</cbc:Note>\n      </ApplicationResponse>\n    	\N	13	pendiente	\N	\N
3	default_tenant	1	FE-003	2025-11-08 09:52:27.015519-05	2025-03-21	900123456	Pollos de Engorde S.A.S	cesardavid9@hotmail.com	COP	10000.00	1900.00	11900.00	[{"cantidad": 1, "iva_tasa": 19, "total_iva": 1900, "descripcion": "aaaaa", "total_con_iva": 11900, "valor_unitario": 10000}]	aprobada	t	b869970d645399bb0c68a92371aa144517bb58c3c26ef7ac410569c83128736f	https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=b869970d645399bb0c68a92371aa144517bb58c3c26ef7ac410569c83128736f	<?xml version="1.0" encoding="UTF-8"?>\n      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" ...>\n        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n        <cbc:ID>FE-003</cbc:ID>\n        <cbc:UUID schemeName="CUFE">b869970d645399bb0c68a92371aa144517bb58c3c26ef7ac410569c83128736f</cbc:UUID>\n        <cac:AccountingSupplierParty>\n          <cac:Party>\n            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>\n            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingSupplierParty>\n        <cac:AccountingCustomerParty>\n          <cac:Party>\n            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>\n            <cbc:CompanyID schemeName="13">900123456</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingCustomerParty>\n        <cac:LegalMonetaryTotal>\n          <cbc:LineExtensionAmount currencyID="COP">10000.00</cbc:LineExtensionAmount>\n          <cbc:TaxExclusiveAmount currencyID="COP">1900.00</cbc:TaxExclusiveAmount>\n          <cbc:PayableAmount currencyID="COP">11900.00</cbc:PayableAmount>\n        </cac:LegalMonetaryTotal>\n        ...\n        <!-- Aquí irían los ítems, firma digital, etc. -->\n      </Invoice>\n    	<?xml version="1.0" encoding="UTF-8"?>\n      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2" ...>\n        <cbc:ResponseDate>2025-11-08T14:52:31.117Z</cbc:ResponseDate>\n        <cac:DocumentResponse>\n          <cac:Response>\n            <cbc:ResponseCode>00</cbc:ResponseCode>\n            <cbc:Description>Factura FE-003 APROBADA por la DIAN.</cbc:Description>\n          </cac:Response>\n        </cac:DocumentResponse>\n        <cbc:Note>Ambiente: Habilitacion</cbc:Note>\n      </ApplicationResponse>\n    	\N	13	pendiente	\N	\N
4	default_tenant	1	FE-004	2025-11-08 10:03:51.262104-05	2004-10-11	900123456	Pollos de Engorde S.A.S	henaosmafe@gmail.com	COP	1010.00	191.90	1201.90	[{"cantidad": 1, "iva_tasa": 19, "total_iva": 191.9, "descripcion": "fgdhdf", "total_con_iva": 1201.9, "valor_unitario": 1010}]	aprobada	t	b820ef4216782cba693423d2bde3efdacafb4eef3111c264a58c6158dc9c0aac	https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=b820ef4216782cba693423d2bde3efdacafb4eef3111c264a58c6158dc9c0aac	<?xml version="1.0" encoding="UTF-8"?>\n      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">\n        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n        <cbc:ID>FE-004</cbc:ID>\n        <cbc:UUID schemeName="CUFE">b820ef4216782cba693423d2bde3efdacafb4eef3111c264a58c6158dc9c0aac</cbc:UUID>\n        <cac:AccountingSupplierParty>\n          <cac:Party>\n            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>\n            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingSupplierParty>\n        <cac:AccountingCustomerParty>\n          <cac:Party>\n            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>\n            <cbc:CompanyID schemeName="13">900123456</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingCustomerParty>\n        <cac:LegalMonetaryTotal>\n          <cbc:LineExtensionAmount currencyID="COP">1010.00</cbc:LineExtensionAmount>\n          <cbc:TaxExclusiveAmount currencyID="COP">191.90</cbc:TaxExclusiveAmount>\n          <cbc:PayableAmount currencyID="COP">1201.90</cbc:PayableAmount>\n        </cac:LegalMonetaryTotal>\n        ...\n        <!-- Aquí irían los ítems, firma digital, etc. -->\n      </Invoice>\n    	<?xml version="1.0" encoding="UTF-8"?>\n      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">\n        <cbc:ResponseDate>2025-11-08T15:04:12.269Z</cbc:ResponseDate>\n        <cac:DocumentResponse>\n          <cac:Response>\n            <cbc:ResponseCode>00</cbc:ResponseCode>\n            <cbc:Description>Factura FE-004 APROBADA por la DIAN.</cbc:Description>\n          </cac:Response>\n        </cac:DocumentResponse>\n        <cbc:Note>Ambiente: Habilitacion</cbc:Note>\n      </ApplicationResponse>\n    	\N	13	pendiente	\N	\N
5	default_tenant	1	FE-005	2025-11-08 10:06:22.388833-05	2002-01-10	9001234561	Pollos de Engorde S.A.S	caegomezco@gmail.com	COP	10011.00	1902.09	11913.09	[{"cantidad": 1, "iva_tasa": 19, "total_iva": 1902.09, "descripcion": "1010", "total_con_iva": 11913.09, "valor_unitario": 10011}]	aprobada	t	b202d49d86c8a04adcb45b19e26d3cd8de31c4af7978c51fd8ebef07e788072b	https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=b202d49d86c8a04adcb45b19e26d3cd8de31c4af7978c51fd8ebef07e788072b	<?xml version="1.0" encoding="UTF-8"?>\n      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"\n               xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"\n               xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">\n        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n        <cbc:ID>FE-005</cbc:ID>\n        <cbc:UUID schemeName="CUFE">b202d49d86c8a04adcb45b19e26d3cd8de31c4af7978c51fd8ebef07e788072b</cbc:UUID>\n        <cac:AccountingSupplierParty>\n          <cac:Party>\n            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>\n            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingSupplierParty>\n        <cac:AccountingCustomerParty>\n          <cac:Party>\n            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>\n            <cbc:CompanyID schemeName="13">9001234561</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingCustomerParty>\n        <cac:LegalMonetaryTotal>\n          <cbc:LineExtensionAmount currencyID="COP">10011.00</cbc:LineExtensionAmount>\n          <cbc:TaxExclusiveAmount currencyID="COP">1902.09</cbc:TaxExclusiveAmount>\n          <cbc:PayableAmount currencyID="COP">11913.09</cbc:PayableAmount>\n        </cac:LegalMonetaryTotal>\n        ...\n        <!-- Aquí irían los ítems, firma digital, etc. -->\n      </Invoice>\n    	<?xml version="1.0" encoding="UTF-8"?>\n      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2"\n                           xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"\n                           xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">\n        <cbc:ResponseDate>2025-11-08T15:06:38.139Z</cbc:ResponseDate>\n        <cac:DocumentResponse>\n          <cac:Response>\n            <cbc:ResponseCode>00</cbc:ResponseCode>\n            <cbc:Description>Factura FE-005 APROBADA por la DIAN.</cbc:Description>\n          </cac:Response>\n        </cac:DocumentResponse>\n        <cbc:Note>Ambiente: Habilitacion</cbc:Note>\n      </ApplicationResponse>\n    	\N	13	pendiente	\N	\N
6	default_tenant	1	FE-006	2025-11-08 10:27:51.68318-05	2025-11-11	900123456	Pollos de Engorde S.A.S	sandramilenaduque3@gmail.com	COP	10101.00	1919.19	12020.19	[{"cantidad": 1, "iva_tasa": 19, "total_iva": 1919.19, "descripcion": "pollote", "total_con_iva": 12020.19, "valor_unitario": 10101}]	aprobada	t	56e2f3b0d7ba3680ae09bb94bbb342d4f5afa71c968a493f1d7bb8ce6cfd12f6	https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=56e2f3b0d7ba3680ae09bb94bbb342d4f5afa71c968a493f1d7bb8ce6cfd12f6	<?xml version="1.0" encoding="UTF-8"?>\n      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"\n               xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"\n               xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">\n        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n        <cbc:ID>FE-006</cbc:ID>\n        <cbc:UUID schemeName="CUFE">56e2f3b0d7ba3680ae09bb94bbb342d4f5afa71c968a493f1d7bb8ce6cfd12f6</cbc:UUID>\n        <cac:AccountingSupplierParty>\n          <cac:Party>\n            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>\n            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingSupplierParty>\n        <cac:AccountingCustomerParty>\n          <cac:Party>\n            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>\n            <cbc:CompanyID schemeName="13">900123456</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingCustomerParty>\n        <cac:LegalMonetaryTotal>\n          <cbc:LineExtensionAmount currencyID="COP">10101.00</cbc:LineExtensionAmount>\n          <cbc:TaxExclusiveAmount currencyID="COP">1919.19</cbc:TaxExclusiveAmount>\n          <cbc:PayableAmount currencyID="COP">12020.19</cbc:PayableAmount>\n        </cac:LegalMonetaryTotal>\n        ...\n        <!-- Aquí irían los ítems, firma digital, etc. -->\n      </Invoice>\n    	<?xml version="1.0" encoding="UTF-8"?>\n      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2"\n                           xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"\n                           xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">\n        <cbc:ResponseDate>2025-11-08T15:27:57.611Z</cbc:ResponseDate>\n        <cac:DocumentResponse>\n          <cac:Response>\n            <cbc:ResponseCode>00</cbc:ResponseCode>\n            <cbc:Description>Factura FE-006 APROBADA por la DIAN.</cbc:Description>\n          </cac:Response>\n        </cac:DocumentResponse>\n        <cbc:Note>Ambiente: Habilitacion</cbc:Note>\n      </ApplicationResponse>\n    	\N	13	pendiente	\N	\N
7	default_tenant	1	FE-007	2025-11-10 07:55:24.292185-05	2025-11-11	900123457	Pollos de Engorde S.A.S	longasf.6@gmail.com	COP	87500.00	16625.00	104125.00	[{"cantidad": 5, "iva_tasa": 19, "total_iva": 16625, "descripcion": "pollote", "total_con_iva": 104125, "valor_unitario": 17500}]	aprobada	t	bcf6e79e69abe3460a405dda2ec850baf18e2d47601f0953f213834433a123e1	https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=bcf6e79e69abe3460a405dda2ec850baf18e2d47601f0953f213834433a123e1	<?xml version="1.0" encoding="UTF-8"?>\n      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"\n               xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"\n               xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">\n        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n        <cbc:ID>FE-007</cbc:ID>\n        <cbc:UUID schemeName="CUFE">bcf6e79e69abe3460a405dda2ec850baf18e2d47601f0953f213834433a123e1</cbc:UUID>\n        <cac:AccountingSupplierParty>\n          <cac:Party>\n            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>\n            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingSupplierParty>\n        <cac:AccountingCustomerParty>\n          <cac:Party>\n            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>\n            <cbc:CompanyID schemeName="13">900123457</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingCustomerParty>\n        <cac:LegalMonetaryTotal>\n          <cbc:LineExtensionAmount currencyID="COP">87500.00</cbc:LineExtensionAmount>\n          <cbc:TaxExclusiveAmount currencyID="COP">16625.00</cbc:TaxExclusiveAmount>\n          <cbc:PayableAmount currencyID="COP">104125.00</cbc:PayableAmount>\n        </cac:LegalMonetaryTotal>\n        ...\n        <!-- Aquí irían los ítems, firma digital, etc. -->\n      </Invoice>\n    	<?xml version="1.0" encoding="UTF-8"?>\n      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2"\n                           xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"\n                           xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">\n        <cbc:ResponseDate>2025-11-10T12:55:43.122Z</cbc:ResponseDate>\n        <cac:DocumentResponse>\n          <cac:Response>\n            <cbc:ResponseCode>00</cbc:ResponseCode>\n            <cbc:Description>Factura FE-007 APROBADA por la DIAN.</cbc:Description>\n          </cac:Response>\n        </cac:DocumentResponse>\n        <cbc:Note>Ambiente: Habilitacion</cbc:Note>\n      </ApplicationResponse>\n    	\N	13	pendiente	\N	\N
8	default_tenant	1	FE-008	2025-11-11 07:19:11.957546-05	2025-11-12	900123456	Pollos de Engorde S.A.S	longasf.6@gmail.com	COP	10000.00	1900.00	11900.00	[{"cantidad": 1, "iva_tasa": 19, "total_iva": 1900, "descripcion": "aaaaa", "total_con_iva": 11900, "valor_unitario": 10000}]	borrador	f	\N	\N	\N	\N	\N	13	pendiente	\N	\N
9	default_tenant	1	FE-009	2025-11-11 07:19:51.876189-05	2025-11-11	900123457	Pollos de Engorde S.A.S	tecnicosenantioquiatesa@gmail.com	COP	100000.00	19000.00	119000.00	[{"cantidad": 1, "iva_tasa": 19, "total_iva": 19000, "descripcion": "pollote", "total_con_iva": 119000, "valor_unitario": 100000}]	aprobada	t	7857706b9aab74ff9047486c28a450c697aefa7d548fcec3d7d54bde6ad31439	https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=7857706b9aab74ff9047486c28a450c697aefa7d548fcec3d7d54bde6ad31439	<?xml version="1.0" encoding="UTF-8"?>\n      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"\n               xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"\n               xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">\n        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n        <cbc:ID>FE-009</cbc:ID>\n        <cbc:UUID schemeName="CUFE">7857706b9aab74ff9047486c28a450c697aefa7d548fcec3d7d54bde6ad31439</cbc:UUID>\n        <cac:AccountingSupplierParty>\n          <cac:Party>\n            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>\n            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingSupplierParty>\n        <cac:AccountingCustomerParty>\n          <cac:Party>\n            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>\n            <cbc:CompanyID schemeName="13">900123457</cbc:CompanyID>\n          </cac:Party>\n        </cac:AccountingCustomerParty>\n        <cac:LegalMonetaryTotal>\n          <cbc:LineExtensionAmount currencyID="COP">100000.00</cbc:LineExtensionAmount>\n          <cbc:TaxExclusiveAmount currencyID="COP">19000.00</cbc:TaxExclusiveAmount>\n          <cbc:PayableAmount currencyID="COP">119000.00</cbc:PayableAmount>\n        </cac:LegalMonetaryTotal>\n        ...\n        <!-- Aquí irían los ítems, firma digital, etc. -->\n      </Invoice>\n    	<?xml version="1.0" encoding="UTF-8"?>\n      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2"\n                           xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"\n                           xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">\n        <cbc:ResponseDate>2025-11-11T12:19:55.374Z</cbc:ResponseDate>\n        <cac:DocumentResponse>\n          <cac:Response>\n            <cbc:ResponseCode>00</cbc:ResponseCode>\n            <cbc:Description>Factura FE-009 APROBADA por la DIAN.</cbc:Description>\n          </cac:Response>\n        </cac:DocumentResponse>\n        <cbc:Note>Ambiente: Habilitacion</cbc:Note>\n      </ApplicationResponse>\n    	\N	13	pendiente	\N	\N
\.


--
-- TOC entry 5410 (class 0 OID 57457)
-- Dependencies: 269
-- Data for Name: inversiones_extranjeras; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.inversiones_extranjeras (id, tenant_id, creado_por_user_id, nombre_inversionista_extranjero, id_inversionista, pais_origen, fecha_inversion, monto_inversion, moneda_inversion, monto_equivalente_cop, estado_reporte, fecha_creacion) FROM stdin;
1	default_tenant	1	Global Investments Inc.	INV-G-5001	USA	2024-11-10	50000.0000	USD	205000000.0000	reportado	2025-11-14 08:29:52.23599-05
2	default_tenant	1	Pollos de Engorde	1234567844	USA	2025-11-14	50.0000	USD	200000.0000	reportado	2025-11-14 09:29:16.920711-05
3	default_tenant	1	Pollos de Engorde	123456784	USA	2025-11-15	100000.0000	USD	100000000.0000	reportado	2025-11-14 09:36:45.16606-05
6	default_tenant	1	Pollos de Engorde	1234567844	USA	2025-11-14	12345.0000	JPY	12345.0000	reportado	2025-11-14 09:43:45.495044-05
7	default_tenant	1	Pollos de Engorde	1234567844	USA	2025-11-14	564.0000	USD	46554654.0000	reportado	2025-11-14 10:06:53.214818-05
8	default_tenant	1	Pollos de Engorde	123789465	QAT	2025-11-15	50000.0000	USD	2000.0000	reportado	2025-11-15 07:38:19.051778-05
4	default_tenant	1	Pollos de Engorde	1234567844	USA	2025-11-14	123.0000	EUR	123.0000	reportado	2025-11-14 09:38:39.292898-05
5	default_tenant	1	Pollos de Engorde	1234567844	USA	2025-11-14	12345.0000	CAD	12345.0000	reportado	2025-11-14 09:38:49.77177-05
\.


--
-- TOC entry 5418 (class 0 OID 65700)
-- Dependencies: 277
-- Data for Name: movimientos_caja; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.movimientos_caja (id, tenant_id, fecha, tipo_movimiento, monto, moneda, descripcion, referencia_factura_id, referencia_orden_pago_id, cuenta_bancaria_id, referencia_pasarela, conciliado, fecha_creacion) FROM stdin;
\.


--
-- TOC entry 5396 (class 0 OID 41066)
-- Dependencies: 255
-- Data for Name: ordenes_pago; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.ordenes_pago (id, tenant_id, creado_por_user_id, proveedor_nit, proveedor_nombre, descripcion, monto, moneda, monto_equivalente_cop, estado, requiere_doble_firma, firmado_por_user_id_1, fecha_firma_1, hash_firma_1, firmado_por_user_id_2, fecha_firma_2, hash_firma_2, fecha_creacion, fecha_vencimiento, estado_pago, fecha_pago_efectivo, referencia_pago_externo) FROM stdin;
1	default_tenant	1	900012345	Pollos de Engorde	Pollote	10000000.0000	COP	10000000.0000	aprobado	f	1	2025-11-12 10:51:51.962903-05	09cc858d429292edb88bd4f95be22e00c71d90e88f4216689dbf9f2edc48b8ad	\N	\N	\N	2025-11-12 10:50:27.445053-05	\N	pendiente	\N	\N
2	default_tenant	1	900012345	Pollos de Engorde	Pollo 2	10000000.0000	USD	37609300000.0000	aprobado	t	1	2025-11-12 10:51:48.364201-05	a0bafe3024a4e38542dd943c906f3baa56157df5890a3e5094247398aa0047a0	2	2025-11-13 06:52:09.003111-05	ea5da2dea304c901de39bb2c8d785e3adc120e9ccffa5e9babf686d9de3c2ec2	2025-11-12 10:51:03.216309-05	\N	pendiente	\N	\N
3	default_tenant	2	900012345	Pollos de Engorde	Entrega Caliente\n	1000.0000	USD	3760930.0000	aprobado	f	1	2025-11-13 09:07:35.955234-05	18dc14936a8e8e2766ea570a7cd4537c1c7bf1b67ad933cd80cfad0c8a5956ae	\N	\N	\N	2025-11-13 09:07:00.78283-05	\N	pendiente	\N	\N
4	default_tenant	2	900012345	Pollos de Engorde	Cocinando con horno	10001.0000	USD	37613060.9300	aprobado	t	2	2025-11-13 09:08:36.306037-05	dae4c1a5e5f7710b4f59bcb549fef97f315be5d1fc9ab0b6817ebc8fabb24211	1	2025-11-13 09:08:56.787261-05	ed7ca825ff05bd0380d244752b13065d266c652ca5fe907a55d05db9a74f3129	2025-11-13 09:08:06.195642-05	\N	pendiente	\N	\N
5	default_tenant	1	ASASAS	Pollos de Engorde		50000.0000	COP	50000.0000	aprobado	f	1	2025-11-15 09:55:04.097885-05	9a8d99e883b04be490e26d10e432af283eaddeb94a4171843916e0e2688306d5	\N	\N	\N	2025-11-15 09:48:30.922553-05	\N	pendiente	\N	\N
6	default_tenant	1	ASASAS	Pollos de Engorde	AAAAAAAAAAAA	36000000.0000	COP	36000000.0000	aprobado	t	1	2025-11-15 09:55:45.505754-05	606ecf5b008e5250d1dce5e6f1183e443da2b7720faba297d95451ea7c29886d	2	2025-11-15 09:56:15.01649-05	0ae53a961c5f4ec74ea0bcebadcfd90e904d4b6b7693eccdf6eb2fdef55bab20	2025-11-15 09:55:29.421928-05	\N	pendiente	\N	\N
7	default_tenant	1	900012345	Pollos de Engorde	AAA	360000000.0000	COP	360000000.0000	aprobado	t	1	2025-11-15 09:56:50.339373-05	ac31f5161fde67c740c48551586a13eb963e4d4a57dd7a3a1c7d6f303cf4b892	2	2025-11-15 09:56:54.895734-05	3640e699a0e56f84433bdf1fdaeba3b8397245398a8a0f511cac7384d207115e	2025-11-15 09:56:46.26333-05	\N	pendiente	\N	\N
8	default_tenant	1	AASASA	Pollos de Engorde	AAAAAAAAA	1.0000	USD	3764.7700	aprobado	f	1	2025-11-15 10:02:22.708807-05	e0c44a1d79dc2956f8969ee3b022c42aeda49531b77867ebed63f039b3248094	\N	\N	\N	2025-11-15 10:02:19.332224-05	\N	pendiente	\N	\N
\.


--
-- TOC entry 5373 (class 0 OID 24650)
-- Dependencies: 232
-- Data for Name: postmortems; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.postmortems (id, incidente_id, fecha, impacto, causa_raiz, acciones_correlativas, owner, fecha_cierre) FROM stdin;
\.


--
-- TOC entry 5424 (class 0 OID 82056)
-- Dependencies: 283
-- Data for Name: preferencias_contacto; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.preferencias_contacto (id, user_id, tenant_id, canal, finalidad, autorizado, fecha_actualizacion, ip_origen) FROM stdin;
1	1	default_tenant	EMAIL	MARKETING	f	2025-11-20 10:39:43.54574-05	::1
3	1	default_tenant	TELEFONO	MARKETING	f	2025-11-20 10:39:44.38366-05	::1
6	1	default_tenant	EMAIL	FINANCIERO	t	2025-11-20 10:39:45.76384-05	::1
5	1	default_tenant	WHATSAPP	MARKETING	f	2025-11-20 10:39:46.495043-05	::1
\.


--
-- TOC entry 5414 (class 0 OID 65651)
-- Dependencies: 273
-- Data for Name: presupuestos; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.presupuestos (id, tenant_id, creado_por_user_id, nombre, ano_fiscal, mes, categoria, monto_proyectado, monto_ejecutado, fecha_creacion) FROM stdin;
\.


--
-- TOC entry 5412 (class 0 OID 57487)
-- Dependencies: 271
-- Data for Name: reportes_dcin; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.reportes_dcin (id, tenant_id, inversion_id, entidad_regulatoria, tipo_reporte, periodo_reportado, fecha_generacion, generado_por_user_id, estado, storage_path_reporte, hash_reporte, fecha_envio, trace_id_envio, respuesta_entidad) FROM stdin;
1	default_tenant	1	Banco de la República	DCIN 83	2024-11-10	2025-11-14 08:31:10.278785-05	1	ENVIADO	default_tenant\\reportes_dcin\\DCIN83_1_1763127070276.xml	00c00fb615fdac6b5e7e3b3d08aa2a4019cdd18b659d463be71f62b654df545a	2025-11-14 08:52:12.860892-05	7aeea201-806c-4c29-98d8-34d5c5690bc9	{"message": "Recibido exitosamente por el Banco de la República.", "traceId": "7aeea201-806c-4c29-98d8-34d5c5690bc9", "radicado": "BR-RAD-1763128332860"}
4	default_tenant	6	Banco de la República	DCIN 83	2025-11-14	2025-11-14 09:43:53.065529-05	1	ENVIADO	default_tenant\\reportes_dcin\\DCIN83_6_1763131433063.xml	f6bf00bf4c1a3d80a2586f6c9fe61ecd491d090856021cd9c7b2b2811f12626f	2025-11-14 10:06:22.000944-05	7af48443-3cb0-489a-817c-24126cd5edda	{"message": "Recibido exitosamente por el Banco de la República.", "traceId": "7af48443-3cb0-489a-817c-24126cd5edda", "radicado": "BR-RAD-1763132782000"}
3	default_tenant	3	Banco de la República	DCIN 83	2025-11-15	2025-11-14 09:36:54.344543-05	1	ENVIADO	default_tenant\\reportes_dcin\\DCIN83_3_1763131014342.xml	9df1886ebae545332e696bd24f6069ab7ec076f33b29656e944c515149ea8c31	2025-11-14 10:06:22.001084-05	9e820368-756b-4a7d-8aab-33fcd0d99aea	{"message": "Recibido exitosamente por el Banco de la República.", "traceId": "9e820368-756b-4a7d-8aab-33fcd0d99aea", "radicado": "BR-RAD-1763132782000"}
2	default_tenant	2	Banco de la República	DCIN 83	2025-11-14	2025-11-14 09:30:21.172914-05	1	ENVIADO	default_tenant\\reportes_dcin\\DCIN83_2_1763130621127.xml	f4f9c46e230d4b1e1e0eb91274383733662ef9a0f487804d680296336534dc1f	2025-11-14 10:06:22.05249-05	4930d631-571e-4140-bf09-2bc82cfe6cac	{"message": "Recibido exitosamente por el Banco de la República.", "traceId": "4930d631-571e-4140-bf09-2bc82cfe6cac", "radicado": "BR-RAD-1763132782051"}
5	default_tenant	7	Banco de la República	DCIN 83	2025-11-14	2025-11-14 10:07:04.294218-05	1	ENVIADO	default_tenant\\reportes_dcin\\DCIN83_7_1763132824291.xml	b94a2caeb4570b6a51ae87c97b6235a8ef00daa3720584770ddecf1ae2930fc2	2025-11-14 10:07:07.584878-05	81ea7fce-a3ba-455f-b61d-48c6f4a27d59	{"message": "Recibido exitosamente por el Banco de la República.", "traceId": "81ea7fce-a3ba-455f-b61d-48c6f4a27d59", "radicado": "BR-RAD-1763132827584"}
6	default_tenant	8	Banco de la República	DCIN 83	2025-11-15	2025-11-15 07:38:32.165365-05	1	GENERADO	default_tenant\\reportes_dcin\\DCIN83_8_1763210312162.xml	638c6f0de72240ca229d2d32f96dab6bb3e33fb6de4065e1e6020cde7affb6d7	\N	\N	\N
7	default_tenant	4	Banco de la República	DCIN 83	2025-11-14	2025-11-15 07:38:38.628355-05	1	GENERADO	default_tenant\\reportes_dcin\\DCIN83_4_1763210318626.xml	322a9b65c5fcd09909adef35123e4af48d656b2c211225c2ee1f8640f47668b3	\N	\N	\N
8	default_tenant	5	Banco de la República	DCIN 83	2025-11-14	2025-11-15 07:38:44.652168-05	1	GENERADO	default_tenant\\reportes_dcin\\DCIN83_5_1763210324650.xml	260beb77b413ba4a0c865336de2b0e4033a2aa84e11519703b1d64f46da1147d	\N	\N	\N
\.


--
-- TOC entry 5395 (class 0 OID 32875)
-- Dependencies: 254
-- Data for Name: reportes_regulatorios; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.reportes_regulatorios (id, tenant_id, balance_financiero_id, entidad_regulatoria, tipo_reporte, periodo_reportado, fecha_generacion, generado_por_user_id, estado, storage_path_reporte, hash_reporte, fecha_envio, trace_id_envio, respuesta_entidad) FROM stdin;
5	default_tenant	6	Superfinanciera	42-Empresarial	2025-10-31	2025-11-12 10:14:53.863711-05	\N	GENERADO	default_tenant\\reportes_regulatorios\\reporte_Superfinanciera_42-Empresarial_6_1762960493861.xml	23540b5fffca1472f09b635eba71d9d67edd9bb03abc012b029fc7b3a134cf17	\N	\N	\N
\.


--
-- TOC entry 5371 (class 0 OID 24636)
-- Dependencies: 230
-- Data for Name: riesgos; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.riesgos (id, dominio, riesgo, probabilidad, impacto, owner, control, estado, fecha) FROM stdin;
3	Legal	Incumplimiento de la Ley 1581 de 2012 (Habeas Data) por registro de consentimiento defectuoso, resultando en posibles sanciones millonarias por parte de la SIC.	4	5	Abogado Admin	Implementar registro granular en core.consent_log (IP, fecha, versión, finalidad) y auditoría trimestral de la API de registro.	mitigando	2025-10-15 09:00:00
4	Seguridad	Acceso no autorizado a la base de datos de producción (RDS).	5	5	Equipo DevSecOps	Implementar Zero Trust, MFA obligatorio para roles admin y microsegmentación de red en AWS VPC.	abierto	2025-11-01 10:30:00
5	IA	Sesgo en el modelo de IA (AI Manager) que discrimina en la aprobación de franquicias.	3	4	Comité de Ética IA	Implementar fairness index >= 0.85, reentrenamiento cada 90 días y mecanismo de veto humano (CHR) según la Etapa 4 del documento.	mitigando	2025-09-20 14:00:00
6	Finanzas	Error menor en la conciliación bancaria automática NIIF.	2	1	Contador Jr.	Ajuste manual realizado. Se actualizó el workflow de n8n (wf_conciliacion.json) para manejar la nueva nomenclatura del extracto.	cerrado	2025-08-05 11:00:00
7	Infraestructura	Fallo del proveedor de AWS en la región sa-east-1 (Sao Paulo).	1	5	Equipo SRE	Plan de Continuidad (BCP/DRP) con RTO < 1h y RPO < 15 min. Failover automático a us-east-1 (N. Virginia) validado trimestralmente.	cerrado	2025-10-01 08:00:00
8	Franquicias	Bajo cumplimiento de SLA (<90%) en una franquicia de México.	3	3	Gerente Expansión	Auditoría automática de Governance AI (wf_auditoria_franquicia.json) y generación de plan de mejora.	abierto	2025-11-05 15:00:00
10	Legal	Fallo en el reporte automático de operaciones sospechosas (ROS) a la UIAF.	4	4	Abogado Admin	Revisar workflow de Finance AI. Asegurar que todas las transacciones > 10.000 USD generen alerta inmediata y se registren en core.aml_log.	abierto	2025-11-07 07:00:00
11	IA	Tasa de error del modelo de predicción financiera > 15% (drift).	3	3	AI Manager	Reentrenamiento automático activado y validado por Governance AI.	cerrado	2025-10-28 17:00:00
9	Seguridad	Vulnerabilidad crítica (CVE-2025-XXXX) detectada en una dependencia de Node.js (npm package) que permite RCE. Vulnerabilidad crítica (CVE-2025-XXXX) detectada en una dependencia de Node.js (npm package) que permite RCE.Vulnerabilidad crítica (CVE-2025-XXXX) detectada en una dependencia de Node.js (npm package) que permite RCE.Vulnerabilidad crítica (CVE-2025-XXXX) detectada en una dependencia de Node.js (npm package) que permite RCE.Vulnerabilidad crítica (CVE-2025-XXXX) detectada en una dependencia de Node.js (npm package) que permite RCE.	5	5	Equipo DevSecOps	Ejecución de pipeline DevSecOps con SAST/DAST (SonarQube) y escaneo de SBOM. Parche de emergencia desplegado en 72h (SLA de vulnerabilidades críticas).	mitigando	2025-11-06 12:00:00
\.


--
-- TOC entry 5401 (class 0 OID 49259)
-- Dependencies: 260
-- Data for Name: roles; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.roles (id, nombre_rol) FROM stdin;
1	admin
\.


--
-- TOC entry 5426 (class 0 OID 82090)
-- Dependencies: 285
-- Data for Name: solicitudes_arco; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.solicitudes_arco (id, tenant_id, user_id, email_solicitante, tipo_solicitud, detalle_solicitud, estado, fecha_solicitud, fecha_limite_respuesta, fecha_resolucion, evidencia_respuesta, responsable_id) FROM stdin;
1	default_tenant	1	abogadosencolombiasas@gmail.com	ACCESO	ikp0	RESUELTO	2025-11-21 06:47:46.728504-05	\N	2025-11-21 07:35:07.009897-05		1
\.


--
-- TOC entry 5385 (class 0 OID 24781)
-- Dependencies: 244
-- Data for Name: tenants; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.tenants (id, tenant_id, nombre_empresa, subdominio, fecha_creacion, codigo_invitacion) FROM stdin;
1	CCOL-001	Contadores en Colombia S.A.S. (Matriz)	\N	2025-11-07 09:45:06.686711	CCOL_ADMIN
2	FRAN-002	Franquicia Cliente (Ejemplo)	\N	2025-11-07 09:45:06.686711	FRAN_CLIENTE
3	default_tenant	Tenant de Registro (Default)	\N	2025-11-07 09:45:06.686711	REGISTRO_WEB
\.


--
-- TOC entry 5365 (class 0 OID 24603)
-- Dependencies: 224
-- Data for Name: tokenizacion_legal; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.tokenizacion_legal (id, token_id, inversionista_id, porcentaje, valor_inicial, hash_firma, registro_cambiario, fecha, tipo_red, estado_blockchain, tx_hash, block_number, contract_address, token_standard, documento_legal_id, cantidad) FROM stdin;
8	4c4ece88-5bee-4445-adbb-1ae79c0908cf	1	0.12	1000.00	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	f	2025-11-20 09:25:11.404279	OFF_CHAIN	CONFIRMADO	0x5e0b60bd0f5766baa47ae49137437d2eb4015fba3afdce6b5b81a15c499e343d	\N	\N	ERC-1400	19	10
9	7e9df68c-3992-4b9a-8001-24d8d3502128	4	0.12	1000.00	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	f	2025-11-20 09:25:12.711986	OFF_CHAIN	CONFIRMADO	0xe2baf7575b35a41b4f7feccdb58a64179e7c343263da59d2bc57cbda1db30211	\N	\N	ERC-1400	19	10
10	14ceb454-d68d-4614-b9c7-9f9cdeb5c27e	6	0.12	1000.00	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	f	2025-11-20 09:25:15.795703	OFF_CHAIN	CONFIRMADO	0xa07d60db5476c6dbeca5fddb4c9ed65b4468fc81c5ecf1c547d18e1e7f9e5703	\N	\N	ERC-1400	19	10
11	a1b4568b-3d97-4194-85a2-02eb5813ecc6	5	0.12	1000.00	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	f	2025-11-20 09:25:19.087611	OFF_CHAIN	CONFIRMADO	0xa70e95bd9915bdbbd96049dc41155a04ced918e53515906c516db16d74b0067e	\N	\N	ERC-1400	19	10
12	1db2e35f-7d0f-4485-8b06-bd8bcb85f38a	1	0.12	5000.00	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	f	2025-11-20 09:25:51.451248	OFF_CHAIN	CONFIRMADO	0x060f7b066e7b4f5d1c2616338557973d92c06a10e88fecdcc5226a5c5ea6f709	\N	\N	ERC-1400	19	10
13	35ba49a4-ed85-463d-896b-79bb760a2f27	4	0.12	5000.00	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	f	2025-11-20 09:25:53.578987	OFF_CHAIN	CONFIRMADO	0x67036bd04534982c44b614ed6f3084de67d805760c0382d108c104a74d8a3d04	\N	\N	ERC-1400	19	10
14	c94e84f2-74c3-4011-b2d0-290f770194b9	1	50.00	1000000.00	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	f	2025-11-20 09:37:08.73335	OFF_CHAIN	CONFIRMADO	0x2faaad82d194c6d621c2df82e2403fb51ec1d9bd88cec9138716eb00a8f18fe0	\N	\N	ERC-1400	19	8500
\.


--
-- TOC entry 5420 (class 0 OID 65738)
-- Dependencies: 279
-- Data for Name: transacciones_bancarias_externas; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.transacciones_bancarias_externas (id, cuenta_bancaria_id, pasarela_id_transaccion, fecha, descripcion_original, monto, conciliado, movimiento_caja_id) FROM stdin;
\.


--
-- TOC entry 5402 (class 0 OID 49269)
-- Dependencies: 261
-- Data for Name: user_roles; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.user_roles (user_id, role_id) FROM stdin;
1	1
2	1
\.


--
-- TOC entry 5379 (class 0 OID 24683)
-- Dependencies: 238
-- Data for Name: users; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.users (id, email, password_hash, tenant_id, created_at, kyc_status, mfa_enabled, full_name) FROM stdin;
2	test@test.test	$2b$10$kmLWh7Bp0bvtxMG2DRVa1erRn5qEFR0viOUCjMWG/vPQ.2xOhHndC	default_tenant	2025-11-06 09:48:06.101021	aprobado	f	test uno
1	abogadosencolombiasas@gmail.com	$2b$10$uL.LP91xE40eQARTJHEEDuP1L0.1YSjoAamyIn6pfPdJhtobsYC8S	default_tenant	2025-11-06 08:56:14.872751	aprobado	f	Abogado Admin
7	ABOGADOSENCOLOMBIASAS@GMAIL.COM	$2b$10$JnHvSKZtbcgnUiAUlOVIXuPD/wmtqdTesJbosDVOZDmGGPsJ9M0ea	default_tenant	2025-11-08 06:41:19.824571	aprobado	f	LUZ DE ORTIZ
5	abogadosencolombiasas1@gmail.com	$2b$10$7pGxGv0rhcFA9s2q6KZm6.cUM3QAeCvqIiytI6LQVP1TMn.1qvxx6	default_tenant	2025-11-08 06:33:51.68952	aprobado	f	Sandra Duque
4	edihurtadou18@gmail.com	$2b$10$JIBOLaQrwD6XvvEhxf5BJuk8BxXSoi.X6I2pr9f54i//8hrN0/xjm	default_tenant	2025-11-08 06:29:01.113621	aprobado	f	Edison Hurtado
6	ferito2001@gmail.com	$2b$10$OdFtg7Y1nVuQGpbF9X5Mo.6ZKnhMJ2z8OlzcTh6nOPXwsn7TsOvLC	CCOL-001	2025-11-08 06:40:22.255343	aprobado	f	Ferito 2001
3	testdos@test.test	$2b$10$eZKYQel6K72nkr6nQ/l.PeR..NklWllmlvTK/W4hB97wC23yk0052	default_tenant	2025-11-06 09:56:52.032066	aprobado	f	test dos
\.


--
-- TOC entry 5465 (class 0 OID 0)
-- Dependencies: 262
-- Name: accionistas_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.accionistas_id_seq', 3, true);


--
-- TOC entry 5466 (class 0 OID 0)
-- Dependencies: 225
-- Name: aml_log_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.aml_log_id_seq', 14, true);


--
-- TOC entry 5467 (class 0 OID 0)
-- Dependencies: 221
-- Name: auditoria_etica_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.auditoria_etica_id_seq', 1, false);


--
-- TOC entry 5468 (class 0 OID 0)
-- Dependencies: 219
-- Name: auditoria_explicabilidad_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.auditoria_explicabilidad_id_seq', 1, false);


--
-- TOC entry 5469 (class 0 OID 0)
-- Dependencies: 258
-- Name: auditoria_pagos_log_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.auditoria_pagos_log_id_seq', 20, true);


--
-- TOC entry 5470 (class 0 OID 0)
-- Dependencies: 241
-- Name: balances_financieros_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.balances_financieros_id_seq', 10, true);


--
-- TOC entry 5471 (class 0 OID 0)
-- Dependencies: 249
-- Name: canal_etico_casos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.canal_etico_casos_id_seq', 5, true);


--
-- TOC entry 5472 (class 0 OID 0)
-- Dependencies: 251
-- Name: canal_etico_respuestas_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.canal_etico_respuestas_id_seq', 1, false);


--
-- TOC entry 5473 (class 0 OID 0)
-- Dependencies: 227
-- Name: cap_table_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.cap_table_id_seq', 14, true);


--
-- TOC entry 5474 (class 0 OID 0)
-- Dependencies: 266
-- Name: certificadosdividendos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.certificadosdividendos_id_seq', 3, true);


--
-- TOC entry 5475 (class 0 OID 0)
-- Dependencies: 280
-- Name: configuracion_pagos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.configuracion_pagos_id_seq', 1, false);


--
-- TOC entry 5476 (class 0 OID 0)
-- Dependencies: 235
-- Name: consent_cookies_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.consent_cookies_id_seq', 1, false);


--
-- TOC entry 5477 (class 0 OID 0)
-- Dependencies: 239
-- Name: consent_log_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.consent_log_id_seq', 12, true);


--
-- TOC entry 5478 (class 0 OID 0)
-- Dependencies: 274
-- Name: cuentas_bancarias_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.cuentas_bancarias_id_seq', 1, true);


--
-- TOC entry 5479 (class 0 OID 0)
-- Dependencies: 233
-- Name: data_lineage_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.data_lineage_id_seq', 1, false);


--
-- TOC entry 5480 (class 0 OID 0)
-- Dependencies: 264
-- Name: dividendospagados_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.dividendospagados_id_seq', 6, true);


--
-- TOC entry 5481 (class 0 OID 0)
-- Dependencies: 247
-- Name: documentos_legales_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.documentos_legales_id_seq', 28, true);


--
-- TOC entry 5482 (class 0 OID 0)
-- Dependencies: 246
-- Name: facturas_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.facturas_id_seq', 9, true);


--
-- TOC entry 5483 (class 0 OID 0)
-- Dependencies: 268
-- Name: inversiones_extranjeras_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.inversiones_extranjeras_id_seq', 8, true);


--
-- TOC entry 5484 (class 0 OID 0)
-- Dependencies: 276
-- Name: movimientos_caja_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.movimientos_caja_id_seq', 1, false);


--
-- TOC entry 5485 (class 0 OID 0)
-- Dependencies: 256
-- Name: ordenes_pago_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.ordenes_pago_id_seq', 8, true);


--
-- TOC entry 5486 (class 0 OID 0)
-- Dependencies: 231
-- Name: postmortems_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.postmortems_id_seq', 1, false);


--
-- TOC entry 5487 (class 0 OID 0)
-- Dependencies: 282
-- Name: preferencias_contacto_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.preferencias_contacto_id_seq', 7, true);


--
-- TOC entry 5488 (class 0 OID 0)
-- Dependencies: 272
-- Name: presupuestos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.presupuestos_id_seq', 1, false);


--
-- TOC entry 5489 (class 0 OID 0)
-- Dependencies: 270
-- Name: reportes_dcin_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.reportes_dcin_id_seq', 8, true);


--
-- TOC entry 5490 (class 0 OID 0)
-- Dependencies: 253
-- Name: reportes_regulatorios_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.reportes_regulatorios_id_seq', 5, true);


--
-- TOC entry 5491 (class 0 OID 0)
-- Dependencies: 229
-- Name: riesgos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.riesgos_id_seq', 11, true);


--
-- TOC entry 5492 (class 0 OID 0)
-- Dependencies: 259
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.roles_id_seq', 1, true);


--
-- TOC entry 5493 (class 0 OID 0)
-- Dependencies: 284
-- Name: solicitudes_arco_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.solicitudes_arco_id_seq', 1, true);


--
-- TOC entry 5494 (class 0 OID 0)
-- Dependencies: 243
-- Name: tenants_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.tenants_id_seq', 3, true);


--
-- TOC entry 5495 (class 0 OID 0)
-- Dependencies: 223
-- Name: tokenizacion_legal_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.tokenizacion_legal_id_seq', 14, true);


--
-- TOC entry 5496 (class 0 OID 0)
-- Dependencies: 278
-- Name: transacciones_bancarias_externas_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.transacciones_bancarias_externas_id_seq', 1, false);


--
-- TOC entry 5497 (class 0 OID 0)
-- Dependencies: 237
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.users_id_seq', 7, true);


--
-- TOC entry 5115 (class 2606 OID 49415)
-- Name: accionistas accionistas_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.accionistas
    ADD CONSTRAINT accionistas_pkey PRIMARY KEY (id);


--
-- TOC entry 5117 (class 2606 OID 49417)
-- Name: accionistas accionistas_tenant_id_numero_documento_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.accionistas
    ADD CONSTRAINT accionistas_tenant_id_numero_documento_key UNIQUE (tenant_id, numero_documento);


--
-- TOC entry 5052 (class 2606 OID 24624)
-- Name: aml_log aml_log_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.aml_log
    ADD CONSTRAINT aml_log_pkey PRIMARY KEY (id);


--
-- TOC entry 5046 (class 2606 OID 24601)
-- Name: auditoria_etica auditoria_etica_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.auditoria_etica
    ADD CONSTRAINT auditoria_etica_pkey PRIMARY KEY (id);


--
-- TOC entry 5044 (class 2606 OID 24588)
-- Name: auditoria_explicabilidad auditoria_explicabilidad_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.auditoria_explicabilidad
    ADD CONSTRAINT auditoria_explicabilidad_pkey PRIMARY KEY (id);


--
-- TOC entry 5106 (class 2606 OID 41122)
-- Name: auditoria_pagos_log auditoria_pagos_log_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.auditoria_pagos_log
    ADD CONSTRAINT auditoria_pagos_log_pkey PRIMARY KEY (id);


--
-- TOC entry 5070 (class 2606 OID 24773)
-- Name: balances_financieros balances_financieros_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.balances_financieros
    ADD CONSTRAINT balances_financieros_pkey PRIMARY KEY (id);


--
-- TOC entry 5091 (class 2606 OID 24982)
-- Name: canal_etico_casos canal_etico_casos_caso_uuid_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.canal_etico_casos
    ADD CONSTRAINT canal_etico_casos_caso_uuid_key UNIQUE (caso_uuid);


--
-- TOC entry 5093 (class 2606 OID 24980)
-- Name: canal_etico_casos canal_etico_casos_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.canal_etico_casos
    ADD CONSTRAINT canal_etico_casos_pkey PRIMARY KEY (id);


--
-- TOC entry 5096 (class 2606 OID 25014)
-- Name: canal_etico_respuestas canal_etico_respuestas_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.canal_etico_respuestas
    ADD CONSTRAINT canal_etico_respuestas_pkey PRIMARY KEY (id);


--
-- TOC entry 5054 (class 2606 OID 24634)
-- Name: cap_table cap_table_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.cap_table
    ADD CONSTRAINT cap_table_pkey PRIMARY KEY (id);


--
-- TOC entry 5123 (class 2606 OID 49462)
-- Name: certificadosdividendos certificadosdividendos_accionista_id_ano_fiscal_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.certificadosdividendos
    ADD CONSTRAINT certificadosdividendos_accionista_id_ano_fiscal_key UNIQUE (accionista_id, ano_fiscal);


--
-- TOC entry 5125 (class 2606 OID 49458)
-- Name: certificadosdividendos certificadosdividendos_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.certificadosdividendos
    ADD CONSTRAINT certificadosdividendos_pkey PRIMARY KEY (id);


--
-- TOC entry 5127 (class 2606 OID 49460)
-- Name: certificadosdividendos certificadosdividendos_verification_uuid_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.certificadosdividendos
    ADD CONSTRAINT certificadosdividendos_verification_uuid_key UNIQUE (verification_uuid);


--
-- TOC entry 5153 (class 2606 OID 73850)
-- Name: configuracion_pagos configuracion_pagos_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.configuracion_pagos
    ADD CONSTRAINT configuracion_pagos_pkey PRIMARY KEY (id);


--
-- TOC entry 5155 (class 2606 OID 73852)
-- Name: configuracion_pagos configuracion_pagos_tenant_id_proveedor_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.configuracion_pagos
    ADD CONSTRAINT configuracion_pagos_tenant_id_proveedor_key UNIQUE (tenant_id, proveedor);


--
-- TOC entry 5062 (class 2606 OID 24681)
-- Name: consent_cookies consent_cookies_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.consent_cookies
    ADD CONSTRAINT consent_cookies_pkey PRIMARY KEY (id);


--
-- TOC entry 5068 (class 2606 OID 24710)
-- Name: consent_log consent_log_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.consent_log
    ADD CONSTRAINT consent_log_pkey PRIMARY KEY (id);


--
-- TOC entry 5141 (class 2606 OID 65693)
-- Name: cuentas_bancarias cuentas_bancarias_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.cuentas_bancarias
    ADD CONSTRAINT cuentas_bancarias_pkey PRIMARY KEY (id);


--
-- TOC entry 5060 (class 2606 OID 24670)
-- Name: data_lineage data_lineage_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.data_lineage
    ADD CONSTRAINT data_lineage_pkey PRIMARY KEY (id);


--
-- TOC entry 5120 (class 2606 OID 49437)
-- Name: dividendospagados dividendospagados_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dividendospagados
    ADD CONSTRAINT dividendospagados_pkey PRIMARY KEY (id);


--
-- TOC entry 5087 (class 2606 OID 24866)
-- Name: documentos_legales documentos_legales_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales
    ADD CONSTRAINT documentos_legales_pkey PRIMARY KEY (id);


--
-- TOC entry 5081 (class 2606 OID 24830)
-- Name: facturas facturas_cufe_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.facturas
    ADD CONSTRAINT facturas_cufe_key UNIQUE (cufe);


--
-- TOC entry 5083 (class 2606 OID 24828)
-- Name: facturas facturas_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.facturas
    ADD CONSTRAINT facturas_pkey PRIMARY KEY (id);


--
-- TOC entry 5085 (class 2606 OID 24832)
-- Name: facturas facturas_tenant_consecutivo_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.facturas
    ADD CONSTRAINT facturas_tenant_consecutivo_key UNIQUE (tenant_id, consecutivo);


--
-- TOC entry 5131 (class 2606 OID 57474)
-- Name: inversiones_extranjeras inversiones_extranjeras_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.inversiones_extranjeras
    ADD CONSTRAINT inversiones_extranjeras_pkey PRIMARY KEY (id);


--
-- TOC entry 5146 (class 2606 OID 65716)
-- Name: movimientos_caja movimientos_caja_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.movimientos_caja
    ADD CONSTRAINT movimientos_caja_pkey PRIMARY KEY (id);


--
-- TOC entry 5104 (class 2606 OID 41088)
-- Name: ordenes_pago ordenes_pago_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.ordenes_pago
    ADD CONSTRAINT ordenes_pago_pkey PRIMARY KEY (id);


--
-- TOC entry 5058 (class 2606 OID 24659)
-- Name: postmortems postmortems_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.postmortems
    ADD CONSTRAINT postmortems_pkey PRIMARY KEY (id);


--
-- TOC entry 5157 (class 2606 OID 82066)
-- Name: preferencias_contacto preferencias_contacto_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.preferencias_contacto
    ADD CONSTRAINT preferencias_contacto_pkey PRIMARY KEY (id);


--
-- TOC entry 5159 (class 2606 OID 82068)
-- Name: preferencias_contacto preferencias_contacto_user_id_canal_finalidad_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.preferencias_contacto
    ADD CONSTRAINT preferencias_contacto_user_id_canal_finalidad_key UNIQUE (user_id, canal, finalidad);


--
-- TOC entry 5137 (class 2606 OID 65666)
-- Name: presupuestos presupuestos_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.presupuestos
    ADD CONSTRAINT presupuestos_pkey PRIMARY KEY (id);


--
-- TOC entry 5139 (class 2606 OID 65668)
-- Name: presupuestos presupuestos_tenant_id_ano_fiscal_mes_categoria_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.presupuestos
    ADD CONSTRAINT presupuestos_tenant_id_ano_fiscal_mes_categoria_key UNIQUE (tenant_id, ano_fiscal, mes, categoria);


--
-- TOC entry 5135 (class 2606 OID 57508)
-- Name: reportes_dcin reportes_dcin_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.reportes_dcin
    ADD CONSTRAINT reportes_dcin_pkey PRIMARY KEY (id);


--
-- TOC entry 5101 (class 2606 OID 32893)
-- Name: reportes_regulatorios reportes_regulatorios_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.reportes_regulatorios
    ADD CONSTRAINT reportes_regulatorios_pkey PRIMARY KEY (id);


--
-- TOC entry 5056 (class 2606 OID 24648)
-- Name: riesgos riesgos_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.riesgos
    ADD CONSTRAINT riesgos_pkey PRIMARY KEY (id);


--
-- TOC entry 5109 (class 2606 OID 49268)
-- Name: roles roles_nombre_rol_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.roles
    ADD CONSTRAINT roles_nombre_rol_key UNIQUE (nombre_rol);


--
-- TOC entry 5111 (class 2606 OID 49266)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5161 (class 2606 OID 82103)
-- Name: solicitudes_arco solicitudes_arco_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.solicitudes_arco
    ADD CONSTRAINT solicitudes_arco_pkey PRIMARY KEY (id);


--
-- TOC entry 5073 (class 2606 OID 24801)
-- Name: tenants tenants_codigo_invitacion_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tenants
    ADD CONSTRAINT tenants_codigo_invitacion_key UNIQUE (codigo_invitacion);


--
-- TOC entry 5075 (class 2606 OID 24790)
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- TOC entry 5077 (class 2606 OID 24794)
-- Name: tenants tenants_subdominio_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tenants
    ADD CONSTRAINT tenants_subdominio_key UNIQUE (subdominio);


--
-- TOC entry 5079 (class 2606 OID 24792)
-- Name: tenants tenants_tenant_id_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tenants
    ADD CONSTRAINT tenants_tenant_id_key UNIQUE (tenant_id);


--
-- TOC entry 5048 (class 2606 OID 24613)
-- Name: tokenizacion_legal tokenizacion_legal_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tokenizacion_legal
    ADD CONSTRAINT tokenizacion_legal_pkey PRIMARY KEY (id);


--
-- TOC entry 5050 (class 2606 OID 24615)
-- Name: tokenizacion_legal tokenizacion_legal_token_id_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tokenizacion_legal
    ADD CONSTRAINT tokenizacion_legal_token_id_key UNIQUE (token_id);


--
-- TOC entry 5149 (class 2606 OID 65754)
-- Name: transacciones_bancarias_externas transacciones_bancarias_externas_pasarela_id_transaccion_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.transacciones_bancarias_externas
    ADD CONSTRAINT transacciones_bancarias_externas_pasarela_id_transaccion_key UNIQUE (pasarela_id_transaccion);


--
-- TOC entry 5151 (class 2606 OID 65752)
-- Name: transacciones_bancarias_externas transacciones_bancarias_externas_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.transacciones_bancarias_externas
    ADD CONSTRAINT transacciones_bancarias_externas_pkey PRIMARY KEY (id);


--
-- TOC entry 5113 (class 2606 OID 49275)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- TOC entry 5064 (class 2606 OID 24699)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5066 (class 2606 OID 24697)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5118 (class 1259 OID 49468)
-- Name: idx_accionistas_tenant; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_accionistas_tenant ON core.accionistas USING btree (tenant_id);


--
-- TOC entry 5107 (class 1259 OID 41133)
-- Name: idx_auditoria_pagos_log_orden_id; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_auditoria_pagos_log_orden_id ON core.auditoria_pagos_log USING btree (orden_pago_id);


--
-- TOC entry 5071 (class 1259 OID 24779)
-- Name: idx_balances_tenant_periodo; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_balances_tenant_periodo ON core.balances_financieros USING btree (tenant_id, periodo_fecha DESC);


--
-- TOC entry 5097 (class 1259 OID 25026)
-- Name: idx_canal_etico_respuestas_caso; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_canal_etico_respuestas_caso ON core.canal_etico_respuestas USING btree (caso_id);


--
-- TOC entry 5094 (class 1259 OID 25025)
-- Name: idx_canal_etico_tenant_estado; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_canal_etico_tenant_estado ON core.canal_etico_casos USING btree (tenant_id, estado);


--
-- TOC entry 5128 (class 1259 OID 49470)
-- Name: idx_certificados_uuid; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_certificados_uuid ON core.certificadosdividendos USING btree (verification_uuid);


--
-- TOC entry 5121 (class 1259 OID 49469)
-- Name: idx_dividendos_accionista_ano; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_dividendos_accionista_ano ON core.dividendospagados USING btree (accionista_id, ano_fiscal);


--
-- TOC entry 5088 (class 1259 OID 24893)
-- Name: idx_documentos_estado; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_documentos_estado ON core.documentos_legales USING btree (estado);


--
-- TOC entry 5089 (class 1259 OID 24892)
-- Name: idx_documentos_tenant_tipo; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_documentos_tenant_tipo ON core.documentos_legales USING btree (tenant_id, tipo_documento);


--
-- TOC entry 5129 (class 1259 OID 57485)
-- Name: idx_inversiones_tenant_estado; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_inversiones_tenant_estado ON core.inversiones_extranjeras USING btree (tenant_id, estado_reporte);


--
-- TOC entry 5142 (class 1259 OID 65766)
-- Name: idx_movimientos_caja_factura_id; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_movimientos_caja_factura_id ON core.movimientos_caja USING btree (referencia_factura_id);


--
-- TOC entry 5143 (class 1259 OID 65767)
-- Name: idx_movimientos_caja_orden_pago_id; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_movimientos_caja_orden_pago_id ON core.movimientos_caja USING btree (referencia_orden_pago_id);


--
-- TOC entry 5144 (class 1259 OID 65765)
-- Name: idx_movimientos_caja_tenant_fecha; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_movimientos_caja_tenant_fecha ON core.movimientos_caja USING btree (tenant_id, fecha DESC);


--
-- TOC entry 5102 (class 1259 OID 41109)
-- Name: idx_ordenes_pago_tenant_estado; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_ordenes_pago_tenant_estado ON core.ordenes_pago USING btree (tenant_id, estado);


--
-- TOC entry 5132 (class 1259 OID 57525)
-- Name: idx_reportes_dcin_inversion_id; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_reportes_dcin_inversion_id ON core.reportes_dcin USING btree (inversion_id);


--
-- TOC entry 5133 (class 1259 OID 57524)
-- Name: idx_reportes_dcin_tenant_estado; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_reportes_dcin_tenant_estado ON core.reportes_dcin USING btree (tenant_id, estado);


--
-- TOC entry 5098 (class 1259 OID 32910)
-- Name: idx_reportes_reg_entidad_periodo; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_reportes_reg_entidad_periodo ON core.reportes_regulatorios USING btree (entidad_regulatoria, periodo_reportado);


--
-- TOC entry 5099 (class 1259 OID 32909)
-- Name: idx_reportes_reg_tenant_estado; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_reportes_reg_tenant_estado ON core.reportes_regulatorios USING btree (tenant_id, estado);


--
-- TOC entry 5147 (class 1259 OID 65768)
-- Name: idx_transacciones_externas_cuenta_id; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_transacciones_externas_cuenta_id ON core.transacciones_bancarias_externas USING btree (cuenta_bancaria_id);


--
-- TOC entry 5189 (class 2606 OID 49418)
-- Name: accionistas accionistas_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.accionistas
    ADD CONSTRAINT accionistas_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;


--
-- TOC entry 5185 (class 2606 OID 41123)
-- Name: auditoria_pagos_log auditoria_pagos_log_orden_pago_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.auditoria_pagos_log
    ADD CONSTRAINT auditoria_pagos_log_orden_pago_id_fkey FOREIGN KEY (orden_pago_id) REFERENCES core.ordenes_pago(id) ON DELETE CASCADE;


--
-- TOC entry 5186 (class 2606 OID 41128)
-- Name: auditoria_pagos_log auditoria_pagos_log_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.auditoria_pagos_log
    ADD CONSTRAINT auditoria_pagos_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id);


--
-- TOC entry 5165 (class 2606 OID 24774)
-- Name: balances_financieros balances_financieros_firmado_por_contador_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.balances_financieros
    ADD CONSTRAINT balances_financieros_firmado_por_contador_id_fkey FOREIGN KEY (firmado_por_contador_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- TOC entry 5173 (class 2606 OID 24988)
-- Name: canal_etico_casos canal_etico_casos_creado_por_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.canal_etico_casos
    ADD CONSTRAINT canal_etico_casos_creado_por_user_id_fkey FOREIGN KEY (creado_por_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- TOC entry 5174 (class 2606 OID 24993)
-- Name: canal_etico_casos canal_etico_casos_documento_legal_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.canal_etico_casos
    ADD CONSTRAINT canal_etico_casos_documento_legal_id_fkey FOREIGN KEY (documento_legal_id) REFERENCES core.documentos_legales(id) ON DELETE SET NULL;


--
-- TOC entry 5175 (class 2606 OID 24983)
-- Name: canal_etico_casos canal_etico_casos_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.canal_etico_casos
    ADD CONSTRAINT canal_etico_casos_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5176 (class 2606 OID 25015)
-- Name: canal_etico_respuestas canal_etico_respuestas_caso_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.canal_etico_respuestas
    ADD CONSTRAINT canal_etico_respuestas_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES core.canal_etico_casos(id) ON DELETE CASCADE;


--
-- TOC entry 5177 (class 2606 OID 25020)
-- Name: canal_etico_respuestas canal_etico_respuestas_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.canal_etico_respuestas
    ADD CONSTRAINT canal_etico_respuestas_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id);


--
-- TOC entry 5191 (class 2606 OID 49463)
-- Name: certificadosdividendos certificadosdividendos_accionista_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.certificadosdividendos
    ADD CONSTRAINT certificadosdividendos_accionista_id_fkey FOREIGN KEY (accionista_id) REFERENCES core.accionistas(id) ON DELETE CASCADE;


--
-- TOC entry 5206 (class 2606 OID 73858)
-- Name: configuracion_pagos configuracion_pagos_cuenta_bancaria_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.configuracion_pagos
    ADD CONSTRAINT configuracion_pagos_cuenta_bancaria_id_fkey FOREIGN KEY (cuenta_bancaria_id) REFERENCES core.cuentas_bancarias(id);


--
-- TOC entry 5207 (class 2606 OID 73853)
-- Name: configuracion_pagos configuracion_pagos_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.configuracion_pagos
    ADD CONSTRAINT configuracion_pagos_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5164 (class 2606 OID 24711)
-- Name: consent_log consent_log_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.consent_log
    ADD CONSTRAINT consent_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- TOC entry 5199 (class 2606 OID 65694)
-- Name: cuentas_bancarias cuentas_bancarias_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.cuentas_bancarias
    ADD CONSTRAINT cuentas_bancarias_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5190 (class 2606 OID 49438)
-- Name: dividendospagados dividendospagados_accionista_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dividendospagados
    ADD CONSTRAINT dividendospagados_accionista_id_fkey FOREIGN KEY (accionista_id) REFERENCES core.accionistas(id) ON DELETE CASCADE;


--
-- TOC entry 5168 (class 2606 OID 24872)
-- Name: documentos_legales documentos_legales_creado_por_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales
    ADD CONSTRAINT documentos_legales_creado_por_user_id_fkey FOREIGN KEY (creado_por_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- TOC entry 5169 (class 2606 OID 24877)
-- Name: documentos_legales documentos_legales_documento_padre_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales
    ADD CONSTRAINT documentos_legales_documento_padre_id_fkey FOREIGN KEY (documento_padre_id) REFERENCES core.documentos_legales(id) ON DELETE SET NULL;


--
-- TOC entry 5170 (class 2606 OID 24882)
-- Name: documentos_legales documentos_legales_firmado_por_contador_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales
    ADD CONSTRAINT documentos_legales_firmado_por_contador_id_fkey FOREIGN KEY (firmado_por_contador_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- TOC entry 5171 (class 2606 OID 24887)
-- Name: documentos_legales documentos_legales_firmado_por_revisor_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales
    ADD CONSTRAINT documentos_legales_firmado_por_revisor_id_fkey FOREIGN KEY (firmado_por_revisor_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- TOC entry 5172 (class 2606 OID 24867)
-- Name: documentos_legales documentos_legales_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales
    ADD CONSTRAINT documentos_legales_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5166 (class 2606 OID 24833)
-- Name: facturas facturas_creado_por_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.facturas
    ADD CONSTRAINT facturas_creado_por_user_id_fkey FOREIGN KEY (creado_por_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- TOC entry 5167 (class 2606 OID 24838)
-- Name: facturas facturas_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.facturas
    ADD CONSTRAINT facturas_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5163 (class 2606 OID 24795)
-- Name: users fk_tenant; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.users
    ADD CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5192 (class 2606 OID 57480)
-- Name: inversiones_extranjeras inversiones_extranjeras_creado_por_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.inversiones_extranjeras
    ADD CONSTRAINT inversiones_extranjeras_creado_por_user_id_fkey FOREIGN KEY (creado_por_user_id) REFERENCES core.users(id);


--
-- TOC entry 5193 (class 2606 OID 57475)
-- Name: inversiones_extranjeras inversiones_extranjeras_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.inversiones_extranjeras
    ADD CONSTRAINT inversiones_extranjeras_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5200 (class 2606 OID 65732)
-- Name: movimientos_caja movimientos_caja_cuenta_bancaria_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.movimientos_caja
    ADD CONSTRAINT movimientos_caja_cuenta_bancaria_id_fkey FOREIGN KEY (cuenta_bancaria_id) REFERENCES core.cuentas_bancarias(id);


--
-- TOC entry 5201 (class 2606 OID 65722)
-- Name: movimientos_caja movimientos_caja_referencia_factura_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.movimientos_caja
    ADD CONSTRAINT movimientos_caja_referencia_factura_id_fkey FOREIGN KEY (referencia_factura_id) REFERENCES core.facturas(id) ON DELETE SET NULL;


--
-- TOC entry 5202 (class 2606 OID 65727)
-- Name: movimientos_caja movimientos_caja_referencia_orden_pago_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.movimientos_caja
    ADD CONSTRAINT movimientos_caja_referencia_orden_pago_id_fkey FOREIGN KEY (referencia_orden_pago_id) REFERENCES core.ordenes_pago(id) ON DELETE SET NULL;


--
-- TOC entry 5203 (class 2606 OID 65717)
-- Name: movimientos_caja movimientos_caja_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.movimientos_caja
    ADD CONSTRAINT movimientos_caja_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5181 (class 2606 OID 41094)
-- Name: ordenes_pago ordenes_pago_creado_por_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.ordenes_pago
    ADD CONSTRAINT ordenes_pago_creado_por_user_id_fkey FOREIGN KEY (creado_por_user_id) REFERENCES core.users(id);


--
-- TOC entry 5182 (class 2606 OID 41099)
-- Name: ordenes_pago ordenes_pago_firmado_por_user_id_1_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.ordenes_pago
    ADD CONSTRAINT ordenes_pago_firmado_por_user_id_1_fkey FOREIGN KEY (firmado_por_user_id_1) REFERENCES core.users(id);


--
-- TOC entry 5183 (class 2606 OID 41104)
-- Name: ordenes_pago ordenes_pago_firmado_por_user_id_2_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.ordenes_pago
    ADD CONSTRAINT ordenes_pago_firmado_por_user_id_2_fkey FOREIGN KEY (firmado_por_user_id_2) REFERENCES core.users(id);


--
-- TOC entry 5184 (class 2606 OID 41089)
-- Name: ordenes_pago ordenes_pago_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.ordenes_pago
    ADD CONSTRAINT ordenes_pago_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5208 (class 2606 OID 82074)
-- Name: preferencias_contacto preferencias_contacto_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.preferencias_contacto
    ADD CONSTRAINT preferencias_contacto_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5209 (class 2606 OID 82069)
-- Name: preferencias_contacto preferencias_contacto_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.preferencias_contacto
    ADD CONSTRAINT preferencias_contacto_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id) ON DELETE CASCADE;


--
-- TOC entry 5197 (class 2606 OID 65674)
-- Name: presupuestos presupuestos_creado_por_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.presupuestos
    ADD CONSTRAINT presupuestos_creado_por_user_id_fkey FOREIGN KEY (creado_por_user_id) REFERENCES core.users(id);


--
-- TOC entry 5198 (class 2606 OID 65669)
-- Name: presupuestos presupuestos_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.presupuestos
    ADD CONSTRAINT presupuestos_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5194 (class 2606 OID 57519)
-- Name: reportes_dcin reportes_dcin_generado_por_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.reportes_dcin
    ADD CONSTRAINT reportes_dcin_generado_por_user_id_fkey FOREIGN KEY (generado_por_user_id) REFERENCES core.users(id);


--
-- TOC entry 5195 (class 2606 OID 57514)
-- Name: reportes_dcin reportes_dcin_inversion_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.reportes_dcin
    ADD CONSTRAINT reportes_dcin_inversion_id_fkey FOREIGN KEY (inversion_id) REFERENCES core.inversiones_extranjeras(id);


--
-- TOC entry 5196 (class 2606 OID 57509)
-- Name: reportes_dcin reportes_dcin_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.reportes_dcin
    ADD CONSTRAINT reportes_dcin_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5178 (class 2606 OID 32899)
-- Name: reportes_regulatorios reportes_regulatorios_balance_financiero_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.reportes_regulatorios
    ADD CONSTRAINT reportes_regulatorios_balance_financiero_id_fkey FOREIGN KEY (balance_financiero_id) REFERENCES core.balances_financieros(id);


--
-- TOC entry 5179 (class 2606 OID 32904)
-- Name: reportes_regulatorios reportes_regulatorios_generado_por_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.reportes_regulatorios
    ADD CONSTRAINT reportes_regulatorios_generado_por_user_id_fkey FOREIGN KEY (generado_por_user_id) REFERENCES core.users(id);


--
-- TOC entry 5180 (class 2606 OID 32894)
-- Name: reportes_regulatorios reportes_regulatorios_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.reportes_regulatorios
    ADD CONSTRAINT reportes_regulatorios_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5210 (class 2606 OID 82114)
-- Name: solicitudes_arco solicitudes_arco_responsable_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.solicitudes_arco
    ADD CONSTRAINT solicitudes_arco_responsable_id_fkey FOREIGN KEY (responsable_id) REFERENCES core.users(id);


--
-- TOC entry 5211 (class 2606 OID 82104)
-- Name: solicitudes_arco solicitudes_arco_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.solicitudes_arco
    ADD CONSTRAINT solicitudes_arco_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 5212 (class 2606 OID 82109)
-- Name: solicitudes_arco solicitudes_arco_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.solicitudes_arco
    ADD CONSTRAINT solicitudes_arco_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id);


--
-- TOC entry 5162 (class 2606 OID 82031)
-- Name: tokenizacion_legal tokenizacion_legal_documento_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tokenizacion_legal
    ADD CONSTRAINT tokenizacion_legal_documento_fkey FOREIGN KEY (documento_legal_id) REFERENCES core.documentos_legales(id);


--
-- TOC entry 5204 (class 2606 OID 65755)
-- Name: transacciones_bancarias_externas transacciones_bancarias_externas_cuenta_bancaria_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.transacciones_bancarias_externas
    ADD CONSTRAINT transacciones_bancarias_externas_cuenta_bancaria_id_fkey FOREIGN KEY (cuenta_bancaria_id) REFERENCES core.cuentas_bancarias(id);


--
-- TOC entry 5205 (class 2606 OID 65760)
-- Name: transacciones_bancarias_externas transacciones_bancarias_externas_movimiento_caja_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.transacciones_bancarias_externas
    ADD CONSTRAINT transacciones_bancarias_externas_movimiento_caja_id_fkey FOREIGN KEY (movimiento_caja_id) REFERENCES core.movimientos_caja(id) ON DELETE SET NULL;


--
-- TOC entry 5187 (class 2606 OID 49281)
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES core.roles(id) ON DELETE CASCADE;


--
-- TOC entry 5188 (class 2606 OID 49276)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id) ON DELETE CASCADE;


-- Completed on 2025-11-21 07:48:05

--
-- PostgreSQL database dump complete
--

\unrestrict DeQe3htlKbpqT8WFLPwmH1dOXhk5nfESzFvaE0wASluBERkaMPGg2uy4jgFjjEf

