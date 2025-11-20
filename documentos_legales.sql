--
-- PostgreSQL database dump
--

\restrict peB3qBg4Zo0Rc1Eghd3f4b2fruvjjb0FCbIDn1k4hcdIEal31S2xDwOgj6yZXOq

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-20 09:46:13

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

SET default_tablespace = '';

SET default_table_access_method = heap;

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
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 247
-- Name: documentos_legales_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.documentos_legales_id_seq OWNED BY core.documentos_legales.id;


--
-- TOC entry 4879 (class 2604 OID 24848)
-- Name: documentos_legales id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales ALTER COLUMN id SET DEFAULT nextval('core.documentos_legales_id_seq'::regclass);


--
-- TOC entry 5042 (class 0 OID 24845)
-- Dependencies: 248
-- Data for Name: documentos_legales; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.documentos_legales (id, tenant_id, creado_por_user_id, titulo, descripcion, tipo_documento, fecha_documento, fecha_creacion, version, documento_padre_id, estado, storage_path_original, hash_sha256_original, firmado_por_contador_id, fecha_firma_contador, hash_firma_contador, firmado_por_revisor_id, fecha_firma_revisor, hash_firma_revisor, storage_path_firmado) FROM stdin;
19	default_tenant	\N	Acta de Resolucion - TEST	A<BC	acta_etica	2025-11-11	2025-11-11 06:52:55.34262-05	1	\N	finalizado	default_tenant/actas_eticas/acta_etica_1_1762861975342.txt	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	1	2025-11-11 07:10:39.309557-05	firma_simulada_1762863037679	1	2025-11-11 07:10:43.499849-05	firma_simulada_1762863043379	s3://bucket/docs/doc_19_firmado.pdf
28	default_tenant	1	Acta de Resolucion - TEST MULTIPLE	Acta de Resolucion - TEST MULTIPLE	acta_etica	2025-11-12	2025-11-12 07:10:10.047448-05	1	\N	borrador	default_tenant\\actas_eticas_resueltas\\acta_etica_5_1762949414596.pdf	2ddf9e62b90fdb9aaa3d0e5491dd002e0e1fe267cff9076094b780e0f2e2b403	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 247
-- Name: documentos_legales_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.documentos_legales_id_seq', 28, true);


--
-- TOC entry 4886 (class 2606 OID 24866)
-- Name: documentos_legales documentos_legales_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales
    ADD CONSTRAINT documentos_legales_pkey PRIMARY KEY (id);


--
-- TOC entry 4887 (class 1259 OID 24893)
-- Name: idx_documentos_estado; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_documentos_estado ON core.documentos_legales USING btree (estado);


--
-- TOC entry 4888 (class 1259 OID 24892)
-- Name: idx_documentos_tenant_tipo; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_documentos_tenant_tipo ON core.documentos_legales USING btree (tenant_id, tipo_documento);


--
-- TOC entry 4889 (class 2606 OID 24872)
-- Name: documentos_legales documentos_legales_creado_por_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales
    ADD CONSTRAINT documentos_legales_creado_por_user_id_fkey FOREIGN KEY (creado_por_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- TOC entry 4890 (class 2606 OID 24877)
-- Name: documentos_legales documentos_legales_documento_padre_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales
    ADD CONSTRAINT documentos_legales_documento_padre_id_fkey FOREIGN KEY (documento_padre_id) REFERENCES core.documentos_legales(id) ON DELETE SET NULL;


--
-- TOC entry 4891 (class 2606 OID 24882)
-- Name: documentos_legales documentos_legales_firmado_por_contador_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales
    ADD CONSTRAINT documentos_legales_firmado_por_contador_id_fkey FOREIGN KEY (firmado_por_contador_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- TOC entry 4892 (class 2606 OID 24887)
-- Name: documentos_legales documentos_legales_firmado_por_revisor_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales
    ADD CONSTRAINT documentos_legales_firmado_por_revisor_id_fkey FOREIGN KEY (firmado_por_revisor_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- TOC entry 4893 (class 2606 OID 24867)
-- Name: documentos_legales documentos_legales_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.documentos_legales
    ADD CONSTRAINT documentos_legales_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


-- Completed on 2025-11-20 09:46:13

--
-- PostgreSQL database dump complete
--

\unrestrict peB3qBg4Zo0Rc1Eghd3f4b2fruvjjb0FCbIDn1k4hcdIEal31S2xDwOgj6yZXOq

