--
-- PostgreSQL database dump
--

\restrict N29haBQ19VUogOPE5KnR354zkeJEtLTSAcdldgBFjx2hIJzjL9NKEjgntcq2Tud

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-24 09:18:40

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
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 264
-- Name: dividendospagados_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.dividendospagados_id_seq OWNED BY core.dividendospagados.id;


--
-- TOC entry 4923 (class 2604 OID 49427)
-- Name: dividendospagados id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dividendospagados ALTER COLUMN id SET DEFAULT nextval('core.dividendospagados_id_seq'::regclass);


--
-- TOC entry 5077 (class 0 OID 49424)
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
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 264
-- Name: dividendospagados_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.dividendospagados_id_seq', 6, true);


--
-- TOC entry 4926 (class 2606 OID 49437)
-- Name: dividendospagados dividendospagados_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dividendospagados
    ADD CONSTRAINT dividendospagados_pkey PRIMARY KEY (id);


--
-- TOC entry 4927 (class 1259 OID 49469)
-- Name: idx_dividendos_accionista_ano; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_dividendos_accionista_ano ON core.dividendospagados USING btree (accionista_id, ano_fiscal);


--
-- TOC entry 4928 (class 2606 OID 49438)
-- Name: dividendospagados dividendospagados_accionista_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dividendospagados
    ADD CONSTRAINT dividendospagados_accionista_id_fkey FOREIGN KEY (accionista_id) REFERENCES core.accionistas(id) ON DELETE CASCADE;


-- Completed on 2025-11-24 09:18:41

--
-- PostgreSQL database dump complete
--

\unrestrict N29haBQ19VUogOPE5KnR354zkeJEtLTSAcdldgBFjx2hIJzjL9NKEjgntcq2Tud

