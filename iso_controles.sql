--
-- PostgreSQL database dump
--

\restrict WQwPUqfpnjxXQABKcOS3RZcQlKc20VQbuRVZhKLjgLiAI5dL6VA0TMIgKHOMYG2

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-24 07:48:14

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
-- TOC entry 297 (class 1259 OID 90326)
-- Name: iso_controles; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.iso_controles (
    id integer NOT NULL,
    tenant_id character varying(60) NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(255) NOT NULL,
    descripcion text,
    es_aplicable boolean DEFAULT true,
    justificacion_exclusion text,
    estado_implementacion character varying(50) DEFAULT 'NO_INICIADO'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    categoria character varying(50),
    responsable_implementacion_id integer,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.iso_controles OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 90325)
-- Name: iso_controles_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.iso_controles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.iso_controles_id_seq OWNER TO postgres;

--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 296
-- Name: iso_controles_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.iso_controles_id_seq OWNED BY core.iso_controles.id;


--
-- TOC entry 4923 (class 2604 OID 90329)
-- Name: iso_controles id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.iso_controles ALTER COLUMN id SET DEFAULT nextval('core.iso_controles_id_seq'::regclass);


--
-- TOC entry 5082 (class 0 OID 90326)
-- Dependencies: 297
-- Data for Name: iso_controles; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.iso_controles (id, tenant_id, codigo, nombre, descripcion, es_aplicable, justificacion_exclusion, estado_implementacion, created_at, categoria, responsable_implementacion_id, updated_at) FROM stdin;
4	default_tenant	A.5.4	Responsabilidades de la dirección	La dirección debe exigir a todo el personal que aplique la seguridad de la información de acuerdo con las políticas y procedimientos.	t	\N	NO_INICIADO	2025-11-24 06:51:23.497097-05	Organizacional	\N	2025-11-24 06:51:23.497097-05
5	default_tenant	A.5.7	Inteligencia de amenazas	La información sobre las amenazas a la seguridad de la información debe recopilarse y analizarse para producir inteligencia de amenazas.	t	\N	NO_INICIADO	2025-11-24 06:51:23.497097-05	Organizacional	\N	2025-11-24 06:51:23.497097-05
6	default_tenant	A.6.1	Selección del personal	La verificación de antecedentes de todos los candidatos a un empleo debe llevarse a cabo antes de unirse a la organización.	t	\N	NO_INICIADO	2025-11-24 06:51:23.497097-05	Personas	\N	2025-11-24 06:51:23.497097-05
7	default_tenant	A.6.3	Concienciación, educación y formación	El personal de la organización y las partes interesadas pertinentes deben recibir una concienciación, educación y formación adecuadas.	t	\N	NO_INICIADO	2025-11-24 06:51:23.497097-05	Personas	\N	2025-11-24 06:51:23.497097-05
8	default_tenant	A.7.1	Perímetros de seguridad física	Los perímetros de seguridad deben definirse y utilizarse para proteger las áreas que contienen información sensible y crítica.	t	\N	NO_INICIADO	2025-11-24 06:51:23.497097-05	Físico	\N	2025-11-24 06:51:23.497097-05
9	default_tenant	A.8.1	Dispositivos de punto final de usuario	La información almacenada, procesada o transmitida en dispositivos de punto final de usuario debe estar protegida.	t	\N	NO_INICIADO	2025-11-24 06:51:23.497097-05	Tecnológico	\N	2025-11-24 06:51:23.497097-05
10	default_tenant	A.8.2	Derechos de acceso privilegiado	La asignación y el uso de los derechos de acceso privilegiado deben restringirse y gestionarse estrictamente.	t	\N	NO_INICIADO	2025-11-24 06:51:23.497097-05	Tecnológico	\N	2025-11-24 06:51:23.497097-05
12	default_tenant	A.8.4	Acceso al código fuente	El acceso de lectura y escritura al código fuente, las herramientas de desarrollo y las bibliotecas de software debe gestionarse adecuadamente.	t	\N	NO_INICIADO	2025-11-24 06:51:23.497097-05	Tecnológico	\N	2025-11-24 06:51:23.497097-05
13	default_tenant	A.8.8	Gestión de vulnerabilidades técnicas	Se debe obtener información sobre las vulnerabilidades técnicas de los sistemas de información en uso y evaluar la exposición.	t	\N	NO_INICIADO	2025-11-24 06:51:23.497097-05	Tecnológico	\N	2025-11-24 06:51:23.497097-05
14	default_tenant	A.8.25	Ciclo de vida de desarrollo seguro	Se deben establecer reglas para el desarrollo seguro de software y sistemas.	t	\N	NO_INICIADO	2025-11-24 06:51:23.497097-05	Tecnológico	\N	2025-11-24 06:51:23.497097-05
15	default_tenant	A.8.28	Codificación segura	Los principios de codificación segura deben aplicarse al desarrollo de software.	t	\N	NO_INICIADO	2025-11-24 06:51:23.497097-05	Tecnológico	\N	2025-11-24 06:51:23.497097-05
3	default_tenant	A.5.3	Segregación de funciones	Las funciones conflictivas y las áreas de responsabilidad conflictivas deben segregarse.	t	\N	NO_APLICA	2025-11-24 06:51:23.497097-05	Organizacional	\N	2025-11-24 06:51:23.497097-05
1	default_tenant	A.5.1	Políticas para la seguridad de la información	Las políticas de seguridad de la información y las reglas específicas del tema deben ser definidas, aprobadas por la dirección, publicadas y comunicadas.	t	Nomas	NO_INICIADO	2025-11-24 06:51:23.497097-05	Organizacional	\N	2025-11-24 06:51:23.497097-05
2	default_tenant	A.5.2	Roles y responsabilidades de seguridad de la información	Los roles y responsabilidades de seguridad de la información deben definirse y asignarse de acuerdo con las necesidades de la organización.	t	\N	NO_INICIADO	2025-11-24 06:51:23.497097-05	Organizacional	\N	2025-11-24 06:51:23.497097-05
11	default_tenant	A.8.3	Restricción de acceso a la información	El acceso a la información y a las funciones de los sistemas de aplicaciones debe restringirse de acuerdo con la política de control de acceso.	t	\N	IMPLEMENTADO	2025-11-24 06:51:23.497097-05	Tecnológico	\N	2025-11-24 07:44:38.214082-05
\.


--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 296
-- Name: iso_controles_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.iso_controles_id_seq', 15, true);


--
-- TOC entry 4930 (class 2606 OID 90340)
-- Name: iso_controles iso_controles_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.iso_controles
    ADD CONSTRAINT iso_controles_pkey PRIMARY KEY (id);


--
-- TOC entry 4932 (class 2606 OID 90342)
-- Name: iso_controles unique_control_tenant; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.iso_controles
    ADD CONSTRAINT unique_control_tenant UNIQUE (tenant_id, codigo);


--
-- TOC entry 4928 (class 1259 OID 90394)
-- Name: idx_iso_controles_tenant; Type: INDEX; Schema: core; Owner: postgres
--

CREATE INDEX idx_iso_controles_tenant ON core.iso_controles USING btree (tenant_id);


--
-- TOC entry 4933 (class 2606 OID 90399)
-- Name: iso_controles iso_controles_responsable_implementacion_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.iso_controles
    ADD CONSTRAINT iso_controles_responsable_implementacion_id_fkey FOREIGN KEY (responsable_implementacion_id) REFERENCES core.users(id);


-- Completed on 2025-11-24 07:48:14

--
-- PostgreSQL database dump complete
--

\unrestrict WQwPUqfpnjxXQABKcOS3RZcQlKc20VQbuRVZhKLjgLiAI5dL6VA0TMIgKHOMYG2

