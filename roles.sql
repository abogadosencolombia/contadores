--
-- PostgreSQL database dump
--

\restrict HHSaUhO7lW9Yt2LZZcoVXPk1UPECerLu8F5W1vmhFFVGwMD8CIGUW2tj9s3diAh

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-22 07:32:53

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
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 259
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.roles_id_seq OWNED BY core.roles.id;


--
-- TOC entry 4893 (class 2604 OID 49262)
-- Name: roles id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.roles ALTER COLUMN id SET DEFAULT nextval('core.roles_id_seq'::regclass);


--
-- TOC entry 5046 (class 0 OID 49259)
-- Dependencies: 260
-- Data for Name: roles; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.roles (id, nombre_rol) FROM stdin;
1	admin
2	superadmin
\.


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 259
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.roles_id_seq', 2, true);


--
-- TOC entry 4895 (class 2606 OID 49268)
-- Name: roles roles_nombre_rol_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.roles
    ADD CONSTRAINT roles_nombre_rol_key UNIQUE (nombre_rol);


--
-- TOC entry 4897 (class 2606 OID 49266)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


-- Completed on 2025-11-22 07:32:54

--
-- PostgreSQL database dump complete
--

\unrestrict HHSaUhO7lW9Yt2LZZcoVXPk1UPECerLu8F5W1vmhFFVGwMD8CIGUW2tj9s3diAh

