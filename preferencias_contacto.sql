--
-- PostgreSQL database dump
--

\restrict BBJvW3uN7tuPuBn9RoQBjct3QjrllDRZGMWexPIfNzafT17MmvHXkNh6jtl9Rh9

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-20 10:23:37

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
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 282
-- Name: preferencias_contacto_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.preferencias_contacto_id_seq OWNED BY core.preferencias_contacto.id;


--
-- TOC entry 4889 (class 2604 OID 82059)
-- Name: preferencias_contacto id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.preferencias_contacto ALTER COLUMN id SET DEFAULT nextval('core.preferencias_contacto_id_seq'::regclass);


--
-- TOC entry 5046 (class 0 OID 82056)
-- Dependencies: 283
-- Data for Name: preferencias_contacto; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.preferencias_contacto (id, user_id, tenant_id, canal, finalidad, autorizado, fecha_actualizacion, ip_origen) FROM stdin;
\.


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 282
-- Name: preferencias_contacto_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.preferencias_contacto_id_seq', 1, false);


--
-- TOC entry 4893 (class 2606 OID 82066)
-- Name: preferencias_contacto preferencias_contacto_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.preferencias_contacto
    ADD CONSTRAINT preferencias_contacto_pkey PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 82068)
-- Name: preferencias_contacto preferencias_contacto_user_id_canal_finalidad_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.preferencias_contacto
    ADD CONSTRAINT preferencias_contacto_user_id_canal_finalidad_key UNIQUE (user_id, canal, finalidad);


--
-- TOC entry 4896 (class 2606 OID 82074)
-- Name: preferencias_contacto preferencias_contacto_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.preferencias_contacto
    ADD CONSTRAINT preferencias_contacto_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 4897 (class 2606 OID 82069)
-- Name: preferencias_contacto preferencias_contacto_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.preferencias_contacto
    ADD CONSTRAINT preferencias_contacto_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id) ON DELETE CASCADE;


-- Completed on 2025-11-20 10:23:37

--
-- PostgreSQL database dump complete
--

\unrestrict BBJvW3uN7tuPuBn9RoQBjct3QjrllDRZGMWexPIfNzafT17MmvHXkNh6jtl9Rh9

