--
-- PostgreSQL database dump
--

\restrict 3przZC1CUMcht0QYW3cfAzCgLgtOggC4Rt6mv5993lbRNeQ29H4enyhQ2L3d0ky

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-24 07:19:44

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
-- TOC entry 301 (class 1259 OID 90365)
-- Name: iso_hallazgos; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.iso_hallazgos (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    auditoria_id integer,
    control_iso_id integer,
    descripcion text NOT NULL,
    tipo_hallazgo character varying(50) NOT NULL,
    accion_correctiva text,
    responsable_id integer,
    fecha_compromiso date,
    estado character varying(20) DEFAULT 'ABIERTO'::character varying,
    evidencia_cierre_url text,
    created_at timestamp with time zone DEFAULT now(),
    descripcion_hallazgo text,
    analisis_causa_raiz text,
    fecha_cierre timestamp with time zone,
    evidencia_cierre text
);


ALTER TABLE core.iso_hallazgos OWNER TO postgres;

--
-- TOC entry 300 (class 1259 OID 90364)
-- Name: iso_hallazgos_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.iso_hallazgos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.iso_hallazgos_id_seq OWNER TO postgres;

--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 300
-- Name: iso_hallazgos_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.iso_hallazgos_id_seq OWNED BY core.iso_hallazgos.id;


--
-- TOC entry 4923 (class 2604 OID 90368)
-- Name: iso_hallazgos id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.iso_hallazgos ALTER COLUMN id SET DEFAULT nextval('core.iso_hallazgos_id_seq'::regclass);


--
-- TOC entry 5080 (class 0 OID 90365)
-- Dependencies: 301
-- Data for Name: iso_hallazgos; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.iso_hallazgos (id, tenant_id, auditoria_id, control_iso_id, descripcion, tipo_hallazgo, accion_correctiva, responsable_id, fecha_compromiso, estado, evidencia_cierre_url, created_at, descripcion_hallazgo, analisis_causa_raiz, fecha_cierre, evidencia_cierre) FROM stdin;
\.


--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 300
-- Name: iso_hallazgos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.iso_hallazgos_id_seq', 1, false);


--
-- TOC entry 4928 (class 2606 OID 90378)
-- Name: iso_hallazgos iso_hallazgos_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.iso_hallazgos
    ADD CONSTRAINT iso_hallazgos_pkey PRIMARY KEY (id);


--
-- TOC entry 4926 (class 1259 OID 90396)
-- Name: idx_iso_hallazgos_auditoria; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_iso_hallazgos_auditoria ON core.iso_hallazgos USING btree (auditoria_id);


--
-- TOC entry 4929 (class 2606 OID 90379)
-- Name: iso_hallazgos iso_hallazgos_auditoria_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.iso_hallazgos
    ADD CONSTRAINT iso_hallazgos_auditoria_id_fkey FOREIGN KEY (auditoria_id) REFERENCES core.iso_auditorias(id) ON DELETE CASCADE;


--
-- TOC entry 4930 (class 2606 OID 90384)
-- Name: iso_hallazgos iso_hallazgos_control_iso_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.iso_hallazgos
    ADD CONSTRAINT iso_hallazgos_control_iso_id_fkey FOREIGN KEY (control_iso_id) REFERENCES core.iso_controles(id);


--
-- TOC entry 4931 (class 2606 OID 90389)
-- Name: iso_hallazgos iso_hallazgos_responsable_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.iso_hallazgos
    ADD CONSTRAINT iso_hallazgos_responsable_id_fkey FOREIGN KEY (responsable_id) REFERENCES core.users(id);


-- Completed on 2025-11-24 07:19:45

--
-- PostgreSQL database dump complete
--

\unrestrict 3przZC1CUMcht0QYW3cfAzCgLgtOggC4Rt6mv5993lbRNeQ29H4enyhQ2L3d0ky

