--
-- PostgreSQL database dump
--

\restrict IAmdqsj2jMOld1M3Uj4KG6PAfTfGBSWxAY0EOjEfMcY4V3nx89LHiijn30JLAp7

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-24 09:18:19

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
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 262
-- Name: accionistas_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.accionistas_id_seq OWNED BY core.accionistas.id;


--
-- TOC entry 4923 (class 2604 OID 49403)
-- Name: accionistas id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.accionistas ALTER COLUMN id SET DEFAULT nextval('core.accionistas_id_seq'::regclass);


--
-- TOC entry 5079 (class 0 OID 49400)
-- Dependencies: 263
-- Data for Name: accionistas; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.accionistas (id, tenant_id, nombre_completo, tipo_documento, numero_documento, email, numero_acciones, created_at) FROM stdin;
1	1	Juan Perez Gomez	CC	12345678	juan.perez@email.com	1000	2025-11-14 07:21:58.531331-05
2	1	Inversiones ABC SAS	NIT	900.123.456-1	contabilidad@abc.com	5000	2025-11-14 07:21:58.531331-05
3	1	Maria Lopez Velez	CC	87654321	maria.lopez@email.com	2500	2025-11-14 07:21:58.531331-05
\.


--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 262
-- Name: accionistas_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.accionistas_id_seq', 3, true);


--
-- TOC entry 4926 (class 2606 OID 49415)
-- Name: accionistas accionistas_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.accionistas
    ADD CONSTRAINT accionistas_pkey PRIMARY KEY (id);


--
-- TOC entry 4928 (class 2606 OID 49417)
-- Name: accionistas accionistas_tenant_id_numero_documento_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.accionistas
    ADD CONSTRAINT accionistas_tenant_id_numero_documento_key UNIQUE (tenant_id, numero_documento);


--
-- TOC entry 4929 (class 1259 OID 49468)
-- Name: idx_accionistas_tenant; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_accionistas_tenant ON core.accionistas USING btree (tenant_id);


--
-- TOC entry 4930 (class 2606 OID 49418)
-- Name: accionistas accionistas_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.accionistas
    ADD CONSTRAINT accionistas_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;


-- Completed on 2025-11-24 09:18:20

--
-- PostgreSQL database dump complete
--

\unrestrict IAmdqsj2jMOld1M3Uj4KG6PAfTfGBSWxAY0EOjEfMcY4V3nx89LHiijn30JLAp7

