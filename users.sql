--
-- PostgreSQL database dump
--

\restrict RCPL26buzZ5MseNSZoquIE3Wc1lcktT8899fBpu2ox6hGMdiRfpIDXGlbri7soD

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-22 07:33:05

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
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 237
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.users_id_seq OWNED BY core.users.id;


--
-- TOC entry 4893 (class 2604 OID 24686)
-- Name: users id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.users ALTER COLUMN id SET DEFAULT nextval('core.users_id_seq'::regclass);


--
-- TOC entry 5050 (class 0 OID 24683)
-- Dependencies: 238
-- Data for Name: users; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.users (id, email, password_hash, tenant_id, created_at, kyc_status, mfa_enabled, full_name) FROM stdin;
2	test@test.test	$2b$10$kmLWh7Bp0bvtxMG2DRVa1erRn5qEFR0viOUCjMWG/vPQ.2xOhHndC	default_tenant	2025-11-06 09:48:06.101021	aprobado	f	test uno
1	abogadosencolombiasas@gmail.com	$2b$10$uL.LP91xE40eQARTJHEEDuP1L0.1YSjoAamyIn6pfPdJhtobsYC8S	default_tenant	2025-11-06 08:56:14.872751	aprobado	f	Abogado Admin
7	ABOGADOSENCOLOMBIASAS@GMAIL.COM	$2b$10$JnHvSKZtbcgnUiAUlOVIXuPD/wmtqdTesJbosDVOZDmGGPsJ9M0ea	default_tenant	2025-11-08 06:41:19.824571	aprobado	f	LUZ DE ORTIZ
5	abogadosencolombiasas1@gmail.com	$2b$10$7pGxGv0rhcFA9s2q6KZm6.cUM3QAeCvqIiytI6LQVP1TMn.1qvxx6	default_tenant	2025-11-08 06:33:51.68952	aprobado	f	Sandra Duque
6	ferito2001@gmail.com	$2b$10$OdFtg7Y1nVuQGpbF9X5Mo.6ZKnhMJ2z8OlzcTh6nOPXwsn7TsOvLC	CCOL-001	2025-11-08 06:40:22.255343	aprobado	f	Ferito 2001
3	testdos@test.test	$2b$10$eZKYQel6K72nkr6nQ/l.PeR..NklWllmlvTK/W4hB97wC23yk0052	default_tenant	2025-11-06 09:56:52.032066	aprobado	f	test dos
4	edihurtadou18@gmail.com	$2b$10$JIBOLaQrwD6XvvEhxf5BJuk8BxXSoi.X6I2pr9f54i//8hrN0/xjm	POLLO-004	2025-11-08 06:29:01.113621	aprobado	f	Edison Hurtado
\.


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 237
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.users_id_seq', 7, true);


--
-- TOC entry 4898 (class 2606 OID 24699)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4900 (class 2606 OID 24697)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4901 (class 2606 OID 24795)
-- Name: users fk_tenant; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.users
    ADD CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


-- Completed on 2025-11-22 07:33:05

--
-- PostgreSQL database dump complete
--

\unrestrict RCPL26buzZ5MseNSZoquIE3Wc1lcktT8899fBpu2ox6hGMdiRfpIDXGlbri7soD

