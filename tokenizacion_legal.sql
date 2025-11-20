--
-- PostgreSQL database dump
--

\restrict 4GbGsoFdyvsLh6rbZZL1M9hdpCI7GAXbLDdGdUFpbdbOoJu41M3vThreoaj6koR

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-20 09:28:12

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
-- TOC entry 224 (class 1259 OID 24603)
-- Name: tokenizacion_legal; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.tokenizacion_legal (
    id integer NOT NULL,
    token_id uuid,
    inversionista_id integer,
    porcentaje numeric(5,2),
    valor_inicial numeric(14,2),
    hash_firma text,
    registro_cambiario boolean DEFAULT false,
    fecha timestamp without time zone DEFAULT now(),
    tipo_red character varying(20) DEFAULT 'OFF_CHAIN'::character varying,
    estado_blockchain character varying(20) DEFAULT 'PENDIENTE'::character varying,
    tx_hash text,
    block_number integer,
    contract_address text,
    token_standard character varying(20) DEFAULT 'ERC-1400'::character varying,
    documento_legal_id integer,
    cantidad numeric(18,0) DEFAULT 0,
    CONSTRAINT tokenizacion_legal_estado_blockchain_check CHECK (((estado_blockchain)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'MINADO'::character varying, 'FALLIDO'::character varying, 'CONFIRMADO'::character varying])::text[]))),
    CONSTRAINT tokenizacion_legal_tipo_red_check CHECK (((tipo_red)::text = ANY ((ARRAY['HYPERLEDGER'::character varying, 'ERC1400'::character varying, 'OFF_CHAIN'::character varying])::text[])))
);


ALTER TABLE core.tokenizacion_legal OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24602)
-- Name: tokenizacion_legal_id_seq; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.tokenizacion_legal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE core.tokenizacion_legal_id_seq OWNER TO postgres;

--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 223
-- Name: tokenizacion_legal_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: postgres
--

ALTER SEQUENCE core.tokenizacion_legal_id_seq OWNED BY core.tokenizacion_legal.id;


--
-- TOC entry 4879 (class 2604 OID 24606)
-- Name: tokenizacion_legal id; Type: DEFAULT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tokenizacion_legal ALTER COLUMN id SET DEFAULT nextval('core.tokenizacion_legal_id_seq'::regclass);


--
-- TOC entry 5041 (class 0 OID 24603)
-- Dependencies: 224
-- Data for Name: tokenizacion_legal; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.tokenizacion_legal (id, token_id, inversionista_id, porcentaje, valor_inicial, hash_firma, registro_cambiario, fecha, tipo_red, estado_blockchain, tx_hash, block_number, contract_address, token_standard, documento_legal_id, cantidad) FROM stdin;
8	4c4ece88-5bee-4445-adbb-1ae79c0908cf	1	0.12	1000.00	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	f	2025-11-20 09:25:11.404279	OFF_CHAIN	CONFIRMADO	0x5e0b60bd0f5766baa47ae49137437d2eb4015fba3afdce6b5b81a15c499e343d	\N	\N	ERC-1400	19	10
9	7e9df68c-3992-4b9a-8001-24d8d3502128	4	0.12	1000.00	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	f	2025-11-20 09:25:12.711986	OFF_CHAIN	CONFIRMADO	0xe2baf7575b35a41b4f7feccdb58a64179e7c343263da59d2bc57cbda1db30211	\N	\N	ERC-1400	19	10
10	14ceb454-d68d-4614-b9c7-9f9cdeb5c27e	6	0.12	1000.00	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	f	2025-11-20 09:25:15.795703	OFF_CHAIN	CONFIRMADO	0xa07d60db5476c6dbeca5fddb4c9ed65b4468fc81c5ecf1c547d18e1e7f9e5703	\N	\N	ERC-1400	19	10
11	a1b4568b-3d97-4194-85a2-02eb5813ecc6	5	0.12	1000.00	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	f	2025-11-20 09:25:19.087611	OFF_CHAIN	CONFIRMADO	0xa70e95bd9915bdbbd96049dc41155a04ced918e53515906c516db16d74b0067e	\N	\N	ERC-1400	19	10
12	1db2e35f-7d0f-4485-8b06-bd8bcb85f38a	1	0.12	5000.00	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	f	2025-11-20 09:25:51.451248	OFF_CHAIN	CONFIRMADO	0x060f7b066e7b4f5d1c2616338557973d92c06a10e88fecdcc5226a5c5ea6f709	\N	\N	ERC-1400	19	10
13	35ba49a4-ed85-463d-896b-79bb760a2f27	4	0.12	5000.00	95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce	f	2025-11-20 09:25:53.578987	OFF_CHAIN	CONFIRMADO	0x67036bd04534982c44b614ed6f3084de67d805760c0382d108c104a74d8a3d04	\N	\N	ERC-1400	19	10
\.


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 223
-- Name: tokenizacion_legal_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.tokenizacion_legal_id_seq', 13, true);


--
-- TOC entry 4889 (class 2606 OID 24613)
-- Name: tokenizacion_legal tokenizacion_legal_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tokenizacion_legal
    ADD CONSTRAINT tokenizacion_legal_pkey PRIMARY KEY (id);


--
-- TOC entry 4891 (class 2606 OID 24615)
-- Name: tokenizacion_legal tokenizacion_legal_token_id_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tokenizacion_legal
    ADD CONSTRAINT tokenizacion_legal_token_id_key UNIQUE (token_id);


--
-- TOC entry 4892 (class 2606 OID 82031)
-- Name: tokenizacion_legal tokenizacion_legal_documento_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tokenizacion_legal
    ADD CONSTRAINT tokenizacion_legal_documento_fkey FOREIGN KEY (documento_legal_id) REFERENCES core.documentos_legales(id);


-- Completed on 2025-11-20 09:28:12

--
-- PostgreSQL database dump complete
--

\unrestrict 4GbGsoFdyvsLh6rbZZL1M9hdpCI7GAXbLDdGdUFpbdbOoJu41M3vThreoaj6koR

