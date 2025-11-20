--
-- PostgreSQL database dump
--

\restrict MYpovLqHWuJPXpLKiL5Cx3fUvENT2TCKYIdatK3fpOSayAnkRvc9AgC11cNFIJr

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-20 09:27:48

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
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 227
-- Name: cap_table_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.cap_table_id_seq OWNED BY core.cap_table.id;


--
-- TOC entry 4879 (class 2604 OID 24629)
-- Name: cap_table id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.cap_table ALTER COLUMN id SET DEFAULT nextval('core.cap_table_id_seq'::regclass);


--
-- TOC entry 5033 (class 0 OID 24626)
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
\.


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 227
-- Name: cap_table_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.cap_table_id_seq', 13, true);


--
-- TOC entry 4884 (class 2606 OID 24634)
-- Name: cap_table cap_table_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.cap_table
    ADD CONSTRAINT cap_table_pkey PRIMARY KEY (id);


-- Completed on 2025-11-20 09:27:49

--
-- PostgreSQL database dump complete
--

\unrestrict MYpovLqHWuJPXpLKiL5Cx3fUvENT2TCKYIdatK3fpOSayAnkRvc9AgC11cNFIJr

