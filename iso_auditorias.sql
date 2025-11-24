--
-- PostgreSQL database dump
--

\restrict Qom5lN02fqCQLM4LnVNIo4maz4ydRcIdzeNPcsONx6wLfxug9jBhdhb5AzfDMaZ

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-24 07:20:14

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
-- TOC entry 299 (class 1259 OID 90344)
-- Name: iso_auditorias; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.iso_auditorias (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    creado_por_user_id integer,
    nombre_auditoria character varying(255) NOT NULL,
    tipo_auditoria character varying(50) NOT NULL,
    fecha_programada date NOT NULL,
    fecha_ejecucion date,
    auditor_lider character varying(150),
    alcance text,
    estado character varying(20) DEFAULT 'PLANIFICADA'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    fecha_ejecucion_inicio date,
    fecha_ejecucion_fin date,
    equipo_auditor text,
    objetivos text,
    documento_informe_id integer
);


ALTER TABLE core.iso_auditorias OWNER TO postgres;

--
-- TOC entry 298 (class 1259 OID 90343)
-- Name: iso_auditorias_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.iso_auditorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.iso_auditorias_id_seq OWNER TO postgres;

--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 298
-- Name: iso_auditorias_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.iso_auditorias_id_seq OWNED BY core.iso_auditorias.id;


--
-- TOC entry 4923 (class 2604 OID 90347)
-- Name: iso_auditorias id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.iso_auditorias ALTER COLUMN id SET DEFAULT nextval('core.iso_auditorias_id_seq'::regclass);


--
-- TOC entry 5079 (class 0 OID 90344)
-- Dependencies: 299
-- Data for Name: iso_auditorias; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.iso_auditorias (id, tenant_id, creado_por_user_id, nombre_auditoria, tipo_auditoria, fecha_programada, fecha_ejecucion, auditor_lider, alcance, estado, created_at, fecha_ejecucion_inicio, fecha_ejecucion_fin, equipo_auditor, objetivos, documento_informe_id) FROM stdin;
1	default_tenant	1	A120	INTERNA	2025-11-25	\N	OWO	\N	PLANIFICADA	2025-11-24 06:56:46.190659-05	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 298
-- Name: iso_auditorias_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.iso_auditorias_id_seq', 1, true);


--
-- TOC entry 4928 (class 2606 OID 90358)
-- Name: iso_auditorias iso_auditorias_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.iso_auditorias
    ADD CONSTRAINT iso_auditorias_pkey PRIMARY KEY (id);


--
-- TOC entry 4926 (class 1259 OID 90395)
-- Name: idx_iso_auditorias_tenant; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_iso_auditorias_tenant ON core.iso_auditorias USING btree (tenant_id);


--
-- TOC entry 4929 (class 2606 OID 90359)
-- Name: iso_auditorias iso_auditorias_creado_por_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.iso_auditorias
    ADD CONSTRAINT iso_auditorias_creado_por_user_id_fkey FOREIGN KEY (creado_por_user_id) REFERENCES core.users(id);


--
-- TOC entry 4930 (class 2606 OID 90404)
-- Name: iso_auditorias iso_auditorias_documento_informe_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.iso_auditorias
    ADD CONSTRAINT iso_auditorias_documento_informe_id_fkey FOREIGN KEY (documento_informe_id) REFERENCES core.documentos_legales(id);


-- Completed on 2025-11-24 07:20:14

--
-- PostgreSQL database dump complete
--

\unrestrict Qom5lN02fqCQLM4LnVNIo4maz4ydRcIdzeNPcsONx6wLfxug9jBhdhb5AzfDMaZ

