--
-- PostgreSQL database dump
--

\restrict ixrFhQzzHGJEi79hIAxa2Q906qQi3oiIdsE1P1v440Xg1521u4Fl2Aiu16kcfJq

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-21 08:18:38

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
-- TOC entry 287 (class 1259 OID 82120)
-- Name: rnbd_registros; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.rnbd_registros (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    numero_radicado character varying(50),
    tipo_novedad character varying(50) DEFAULT 'INSCRIPCION'::character varying,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_vencimiento date NOT NULL,
    estado character varying(20) DEFAULT 'PENDIENTE'::character varying,
    respuesta_sic jsonb,
    xml_enviado text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT rnbd_estado_check CHECK (((estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'RADICADO'::character varying, 'RECHAZADO'::character varying, 'VENCIDO'::character varying])::text[]))),
    CONSTRAINT rnbd_tipo_check CHECK (((tipo_novedad)::text = ANY ((ARRAY['INSCRIPCION'::character varying, 'ACTUALIZACION'::character varying, 'RENOVACION'::character varying, 'RECLAMO'::character varying])::text[])))
);


ALTER TABLE core.rnbd_registros OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 82119)
-- Name: rnbd_registros_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.rnbd_registros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.rnbd_registros_id_seq OWNER TO postgres;

--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 286
-- Name: rnbd_registros_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.rnbd_registros_id_seq OWNED BY core.rnbd_registros.id;


--
-- TOC entry 4893 (class 2604 OID 82123)
-- Name: rnbd_registros id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.rnbd_registros ALTER COLUMN id SET DEFAULT nextval('core.rnbd_registros_id_seq'::regclass);


--
-- TOC entry 5052 (class 0 OID 82120)
-- Dependencies: 287
-- Data for Name: rnbd_registros; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.rnbd_registros (id, tenant_id, numero_radicado, tipo_novedad, fecha_registro, fecha_vencimiento, estado, respuesta_sic, xml_enviado, created_at) FROM stdin;
\.


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 286
-- Name: rnbd_registros_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.rnbd_registros_id_seq', 1, false);


--
-- TOC entry 4902 (class 2606 OID 82136)
-- Name: rnbd_registros rnbd_registros_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.rnbd_registros
    ADD CONSTRAINT rnbd_registros_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 1259 OID 82142)
-- Name: idx_rnbd_vencimiento; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_rnbd_vencimiento ON core.rnbd_registros USING btree (estado, fecha_vencimiento);


--
-- TOC entry 4903 (class 2606 OID 82137)
-- Name: rnbd_registros rnbd_registros_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.rnbd_registros
    ADD CONSTRAINT rnbd_registros_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);


-- Completed on 2025-11-21 08:18:38

--
-- PostgreSQL database dump complete
--

\unrestrict ixrFhQzzHGJEi79hIAxa2Q906qQi3oiIdsE1P1v440Xg1521u4Fl2Aiu16kcfJq

