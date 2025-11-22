--
-- PostgreSQL database dump
--

\restrict lcXJ4nQ4oee04OJ2J3o7aD6fIQBRrgCDSrANpFoTktZ7SsAfgGexrLhuIs6bRxW

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-22 07:32:42

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
-- TOC entry 261 (class 1259 OID 49269)
-- Name: user_roles; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.user_roles (
    user_id integer NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE core.user_roles OWNER TO postgres;

--
-- TOC entry 5044 (class 0 OID 49269)
-- Dependencies: 261
-- Data for Name: user_roles; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.user_roles (user_id, role_id) FROM stdin;
2	1
4	1
1	2
\.


--
-- TOC entry 4894 (class 2606 OID 49275)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- TOC entry 4895 (class 2606 OID 49281)
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES core.roles(id) ON DELETE CASCADE;


--
-- TOC entry 4896 (class 2606 OID 49276)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id) ON DELETE CASCADE;


-- Completed on 2025-11-22 07:32:42

--
-- PostgreSQL database dump complete
--

\unrestrict lcXJ4nQ4oee04OJ2J3o7aD6fIQBRrgCDSrANpFoTktZ7SsAfgGexrLhuIs6bRxW

