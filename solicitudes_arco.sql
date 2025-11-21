--
-- PostgreSQL database dump
--

\restrict wcqGu3iMkUGe1T08067lobINjEzUGN4F3309BEiYl7Gv3hSQBW53y3clWvx7WVd

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-21 07:10:29

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
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 284
-- Name: solicitudes_arco_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.solicitudes_arco_id_seq OWNED BY core.solicitudes_arco.id;


--
-- TOC entry 4889 (class 2604 OID 82093)
-- Name: solicitudes_arco id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.solicitudes_arco ALTER COLUMN id SET DEFAULT nextval('core.solicitudes_arco_id_seq'::regclass);


--
-- TOC entry 5046 (class 0 OID 82090)
-- Dependencies: 285
-- Data for Name: solicitudes_arco; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.solicitudes_arco (id, tenant_id, user_id, email_solicitante, tipo_solicitud, detalle_solicitud, estado, fecha_solicitud, fecha_limite_respuesta, fecha_resolucion, evidencia_respuesta, responsable_id) FROM stdin;
1	default_tenant	1	abogadosencolombiasas@gmail.com	ACCESO	ikp0	PENDIENTE	2025-11-21 06:47:46.728504-05	\N	\N	\N	\N
\.


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 284
-- Name: solicitudes_arco_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.solicitudes_arco_id_seq', 1, true);


--
-- TOC entry 4894 (class 2606 OID 82103)
-- Name: solicitudes_arco solicitudes_arco_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.solicitudes_arco
    ADD CONSTRAINT solicitudes_arco_pkey PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 82114)
-- Name: solicitudes_arco solicitudes_arco_responsable_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.solicitudes_arco
    ADD CONSTRAINT solicitudes_arco_responsable_id_fkey FOREIGN KEY (responsable_id) REFERENCES core.users(id);


--
-- TOC entry 4896 (class 2606 OID 82104)
-- Name: solicitudes_arco solicitudes_arco_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.solicitudes_arco
    ADD CONSTRAINT solicitudes_arco_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


--
-- TOC entry 4897 (class 2606 OID 82109)
-- Name: solicitudes_arco solicitudes_arco_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.solicitudes_arco
    ADD CONSTRAINT solicitudes_arco_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id);


-- Completed on 2025-11-21 07:10:30

--
-- PostgreSQL database dump complete
--

\unrestrict wcqGu3iMkUGe1T08067lobINjEzUGN4F3309BEiYl7Gv3hSQBW53y3clWvx7WVd

