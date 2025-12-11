SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict ttNFcKONY3npwlU6iu68ooayG2u0QvjbMcKAJAjcY0KpAXXCmxUoBwb8Pl0Bsjv

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: tenants; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."tenants" ("id", "tenant_id", "nombre_empresa", "subdominio", "fecha_creacion", "codigo_invitacion") VALUES
	(1, 'CCOL-001', 'Contadores en Colombia S.A.S. (Matriz)', NULL, '2025-11-07 09:45:06.686711', 'CCOL_ADMIN'),
	(2, 'FRAN-002', 'Franquicia Cliente (Ejemplo)', NULL, '2025-11-07 09:45:06.686711', 'FRAN_CLIENTE'),
	(3, 'default_tenant', 'Tenant de Registro (Default)', NULL, '2025-11-07 09:45:06.686711', 'REGISTRO_WEB'),
	(5, 'POLLO-004', 'Pollos de Engorde', NULL, '2025-11-22 07:11:41.280197', 'POLLITOS');


--
-- Data for Name: accionistas; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."accionistas" ("id", "tenant_id", "nombre_completo", "tipo_documento", "numero_documento", "email", "numero_acciones", "created_at", "fecha_ingreso") VALUES
	(7, 3, 'Luis', 'CC', '1028120000', 'xl9luis@gmail.com', 10000, '2025-11-25 14:15:56.984736+00', '2024-11-24'),
	(8, 3, 'Edisonm', 'CC', '123456789', 'edihurtadou19@gmail.com', 1000, '2025-11-27 13:32:50.117916+00', '2025-11-27');


--
-- Data for Name: activos_fijos; Type: TABLE DATA; Schema: core; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."users" ("id", "email", "password_hash", "tenant_id", "created_at", "kyc_status", "mfa_enabled", "full_name") VALUES
	(2, 'test@test.test', '$2b$10$kmLWh7Bp0bvtxMG2DRVa1erRn5qEFR0viOUCjMWG/vPQ.2xOhHndC', 'default_tenant', '2025-11-06 09:48:06.101021', 'aprobado', false, 'test uno'),
	(5, 'abogadosencolombiasas1@gmail.com', '$2b$10$7pGxGv0rhcFA9s2q6KZm6.cUM3QAeCvqIiytI6LQVP1TMn.1qvxx6', 'default_tenant', '2025-11-08 06:33:51.68952', 'aprobado', false, 'Sandra Duque'),
	(6, 'ferito2001@gmail.com', '$2b$10$OdFtg7Y1nVuQGpbF9X5Mo.6ZKnhMJ2z8OlzcTh6nOPXwsn7TsOvLC', 'CCOL-001', '2025-11-08 06:40:22.255343', 'aprobado', false, 'Ferito 2001'),
	(3, 'testdos@test.test', '$2b$10$eZKYQel6K72nkr6nQ/l.PeR..NklWllmlvTK/W4hB97wC23yk0052', 'default_tenant', '2025-11-06 09:56:52.032066', 'aprobado', false, 'test dos'),
	(4, 'edihurtadou18@gmail.com', '$2b$10$JIBOLaQrwD6XvvEhxf5BJuk8BxXSoi.X6I2pr9f54i//8hrN0/xjm', 'POLLO-004', '2025-11-08 06:29:01.113621', 'aprobado', false, 'Edison Hurtado'),
	(8, 'jheison01@gmail.com', '$2b$10$GiGtH91lQcNkqScFgWV2iujhvvAzUSDK62pz8n2ehsgrQdFBoJ05K', 'default_tenant', '2025-11-22 07:36:28.216603', 'rechazado', false, 'JHEISON ESTEBAN RODRIGUEZ DUQUE'),
	(9, 'cesardavid9@hotmail.com', '$2b$10$W1rVnCScvSVEc3OJFOwmqe54Ju/Dsd.RyDM8pmocTkxYS4greC2mO', 'default_tenant', '2025-12-09 14:17:07.478396', 'approved', false, 'KYC KYC'),
	(7, 'ABOGADOSENCOLOMBIASAS@GMAIL.COM', '$2b$10$JnHvSKZtbcgnUiAUlOVIXuPD/wmtqdTesJbosDVOZDmGGPsJ9M0ea', 'default_tenant', '2025-11-08 06:41:19.824571', 'rejected', false, 'LUZ DE ORTIZ'),
	(10, 'henaosmafe@gmail.com', '$2b$10$YoeEPanZ.wdenZLyR/omgeQ4xyeoyyngZuTeXzOW2JB/ju4/urwlS', 'default_tenant', '2025-12-09 14:33:23.266822', 'approved', false, 'KYC2 KYC2'),
	(1, 'abogadosencolombiasas@gmail.com', '$2b$10$uL.LP91xE40eQARTJHEEDuP1L0.1YSjoAamyIn6pfPdJhtobsYC8S', 'default_tenant', '2025-11-06 08:56:14.872751', 'approved', false, 'Abogado Admin');


--
-- Data for Name: ai_governance_decisions; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."ai_governance_decisions" ("id", "tenant_id", "created_at", "model_name", "decision_type", "risk_score", "input_variables", "explanation", "is_vetoed", "user_id") VALUES
	('f167ca49-b146-422d-9d3b-5be931d340ea', 'default_tenant', '2025-11-17 14:09:03.061266+00', 'FraudDetection_v1', 'VETADO', 92.00, '{"monto": 15000000, "pais_ip": "RU", "dispositivo": "Nuevo", "pais_cuenta": "CO"}', 'Bloqueo preventivo: Discrepancia geográfica crítica (IP Rusia vs Cuenta Colombia). Monto inusual para el perfil transaccional del usuario (Desviación > 3 sigma).', true, 1),
	('5df013e8-9f6f-4c44-9aab-b18da389ef0b', 'default_tenant', '2025-11-22 02:09:03.061266+00', 'KnowYourCustomer_v3', 'VETADO', 88.50, '{"liveness": false, "documento": "CC123...", "match_facial": 45.0}', 'Fallo en prueba de vida (Liveness Check). Posible suplantación de identidad (Spoofing) mediante fotografía estática. Similitud facial inferior al umbral seguro (45% < 80%).', true, 1),
	('25019ea3-e2bd-420a-9fd5-3a586bbc9432', 'default_tenant', '2025-11-22 11:09:03.061266+00', 'TransactionMonitor_v5', 'APROBADO', 5.00, '{"hora": "14:00", "monto": 200000, "comercio": "Supermercado Exito"}', 'Transacción consistente con el patrón de consumo habitual (Categoría: Alimentación). Geolocalización coincide con el dispositivo de confianza.', false, 1),
	('fa154c7f-1003-46ec-a5b4-ff53c12efcd8', 'default_tenant', '2025-11-21 14:09:03.061266+00', 'CreditRisk_v2', 'REVISION_MANUAL', 65.00, '{"pep": true, "monto": 50000000, "ingresos": 12000000}', 'Usuario marcado como Persona Políticamente Expuesta (PEP). Requiere validación humana de origen de fondos según normativa SARLAFT, aunque el score crediticio es aceptable.', false, 1),
	('eab9564e-a17d-42dd-b5e6-48221a4831f8', 'default_tenant', '2025-11-20 14:09:03.061266+00', 'CreditRisk_v2', 'APROBADO', 12.50, '{"monto": 5000, "ingresos": 3500000, "historial_crediticio": "A"}', 'El usuario cumple con el umbral de ingresos (> 2 SMMLV) y tiene historial crediticio positivo (Score > 700). No se detectaron anomalías en la IP.', false, 1),
	('1c0c74ea-a994-4016-b537-6e373dc6738f', 'default_tenant', '2025-11-16 14:09:03.061266+00', 'CreditRisk_v2', 'APROBADO', 15.00, '{}', 'Aprobado estándar', false, 1),
	('8fa8bbfc-b4e7-42b2-b97c-38c6931fe39b', 'default_tenant', '2025-11-15 14:09:03.061266+00', 'CreditRisk_v2', 'APROBADO', 22.00, '{}', 'Aprobado estándar', false, 1),
	('5afeeab7-885c-4054-bb3a-9f1b79ace7e6', 'default_tenant', '2025-11-14 14:09:03.061266+00', 'FraudDetection_v1', 'VETADO', 99.00, '{}', 'IP en lista negra global.', true, 1),
	('9c50f2b7-2a56-4b2b-8c30-3076cf876d13', 'default_tenant', '2025-11-27 11:45:20.70581+00', 'x-ai/grok-4.1', 'APROBADO', 0.00, '{"cantidad": 1, "iva_tasa": 19, "total_iva": 3040, "descripcion": "pollote", "total_con_iva": 19040, "valor_unitario": 16000}', 'No se proporcionó información de facturación válida para análisis. No se detectaron anomalías según las reglas.', false, 1),
	('6f5892e7-e74d-4bde-92a1-5fd8160ca651', 'default_tenant', '2025-11-27 12:27:00.19169+00', 'x-ai/grok-4.1', 'APROBADO', 0.00, '{"cantidad": 1, "iva_tasa": 19, "total_iva": 3990, "descripcion": "pene", "total_con_iva": 24990, "valor_unitario": 21000}', 'No se proporcionó información de facturación válida para análisis.', false, 1),
	('43364313-a91c-4be1-8fd7-55c70d1c677f', 'default_tenant', '2025-11-27 12:29:24.929694+00', 'x-ai/grok-4.1', 'REVISION', 100.00, '{"cantidad": 1, "iva_tasa": 19, "total_iva": 19000, "descripcion": "pollote", "total_con_iva": 119000, "valor_unitario": 100000}', 'No se proporciona información de facturación válida para análisis, por lo que el riesgo sube.', false, 1);


--
-- Data for Name: ai_incidents; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."ai_incidents" ("id", "tenant_id", "decision_id", "reported_at", "description", "criticality", "status", "resolution_notes") VALUES
	('1593b5dc-cca3-420f-8fd5-bf874c4f9b46', 'default_tenant', 'f167ca49-b146-422d-9d3b-5be931d340ea', '2025-11-22 14:09:03.061266+00', 'Falso positivo en detección de fraude. Cliente VIP bloqueado en viaje legítimo.', 'CRITICA', 'ABIERTO', NULL),
	('342a5c81-a650-4294-a3e5-bace1648d979', 'default_tenant', '5df013e8-9f6f-4c44-9aab-b18da389ef0b', '2025-11-22 14:09:03.061266+00', 'El modelo KYC rechazó documento válido por mala iluminación. Se requiere reentrenamiento con imágenes oscuras.', 'MEDIA', 'EN_REVISION', 'El equipo de Data Science está etiquetando nuevas imágenes.'),
	('e645b8a9-7a57-48e3-9cda-f8bf5fba5e60', 'default_tenant', NULL, '2025-11-15 14:09:03.061266+00', 'Latencia alta en el modelo CreditRisk_v2 durante el pico de transacciones.', 'BAJA', 'RESUELTO', 'Se escalaron los pods en Kubernetes.');


--
-- Data for Name: aml_log; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."aml_log" ("id", "inversionista_id", "tipo_operacion", "monto", "pais_origen", "riesgo", "fecha") VALUES
	(1, 2, 'EMISION_TOKEN', 1132321321.00, NULL, 'BAJO', '2025-11-20 07:38:45.48142'),
	(2, 1, 'EMISION_TOKEN', 1000.00, NULL, 'BAJO', '2025-11-20 09:02:40.923233'),
	(3, 7, 'EMISION_TOKEN', 1000.00, NULL, 'BAJO', '2025-11-20 09:02:44.858558'),
	(4, 5, 'EMISION_TOKEN', 1000.00, NULL, 'BAJO', '2025-11-20 09:02:48.646454'),
	(5, 1, 'EMISION_TOKEN', 654564546.00, NULL, 'BAJO', '2025-11-20 09:03:18.891654'),
	(6, 1, 'EMISION_TOKEN', 1132321332.00, NULL, 'BAJO', '2025-11-20 09:06:34.623757'),
	(7, 4, 'EMISION_TOKEN', 1000.00, NULL, 'BAJO', '2025-11-20 09:23:14.183241'),
	(8, 1, 'EMISION_TOKEN', 1000.00, NULL, 'BAJO', '2025-11-20 09:25:11.409059'),
	(9, 4, 'EMISION_TOKEN', 1000.00, NULL, 'BAJO', '2025-11-20 09:25:12.713322'),
	(10, 6, 'EMISION_TOKEN', 1000.00, NULL, 'BAJO', '2025-11-20 09:25:15.79771'),
	(11, 5, 'EMISION_TOKEN', 1000.00, NULL, 'BAJO', '2025-11-20 09:25:19.08946'),
	(12, 1, 'EMISION_TOKEN', 5000.00, NULL, 'BAJO', '2025-11-20 09:25:51.455946'),
	(13, 4, 'EMISION_TOKEN', 5000.00, NULL, 'BAJO', '2025-11-20 09:25:53.580517'),
	(14, 1, 'EMISION_TOKEN', 1000000.00, NULL, 'BAJO', '2025-11-20 09:37:08.738399');


--
-- Data for Name: aml_risk_assessments; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."aml_risk_assessments" ("id", "user_id", "risk_score", "risk_level", "ai_analysis_summary", "ros_report_draft", "created_at") VALUES
	('97910ed3-fef7-49c0-a610-4212a236bc82', 1, 40, 'medium', 'Inconsistencia entre la IP de loopback y la geolocalización declarada en Colombia, pero sin acceso a más información para determinar el riesgo con precisión.', NULL, '2025-12-04 12:35:38.663488+00');


--
-- Data for Name: auditoria_etica; Type: TABLE DATA; Schema: core; Owner: postgres
--



--
-- Data for Name: auditoria_explicabilidad; Type: TABLE DATA; Schema: core; Owner: postgres
--



--
-- Data for Name: ordenes_pago; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."ordenes_pago" ("id", "tenant_id", "creado_por_user_id", "proveedor_nit", "proveedor_nombre", "descripcion", "monto", "moneda", "monto_equivalente_cop", "estado", "requiere_doble_firma", "firmado_por_user_id_1", "fecha_firma_1", "hash_firma_1", "firmado_por_user_id_2", "fecha_firma_2", "hash_firma_2", "fecha_creacion", "fecha_vencimiento", "estado_pago", "fecha_pago_efectivo", "referencia_pago_externo") VALUES
	(1, 'default_tenant', 1, '900012345', 'Pollos de Engorde', 'Pollote', 10000000.0000, 'COP', 10000000.0000, 'aprobado', false, 1, '2025-11-12 15:51:51.962903+00', '09cc858d429292edb88bd4f95be22e00c71d90e88f4216689dbf9f2edc48b8ad', NULL, NULL, NULL, '2025-11-12 15:50:27.445053+00', NULL, 'pendiente', NULL, NULL),
	(2, 'default_tenant', 1, '900012345', 'Pollos de Engorde', 'Pollo 2', 10000000.0000, 'USD', 37609300000.0000, 'aprobado', true, 1, '2025-11-12 15:51:48.364201+00', 'a0bafe3024a4e38542dd943c906f3baa56157df5890a3e5094247398aa0047a0', 2, '2025-11-13 11:52:09.003111+00', 'ea5da2dea304c901de39bb2c8d785e3adc120e9ccffa5e9babf686d9de3c2ec2', '2025-11-12 15:51:03.216309+00', NULL, 'pendiente', NULL, NULL),
	(3, 'default_tenant', 2, '900012345', 'Pollos de Engorde', 'Entrega Caliente
', 1000.0000, 'USD', 3760930.0000, 'aprobado', false, 1, '2025-11-13 14:07:35.955234+00', '18dc14936a8e8e2766ea570a7cd4537c1c7bf1b67ad933cd80cfad0c8a5956ae', NULL, NULL, NULL, '2025-11-13 14:07:00.78283+00', NULL, 'pendiente', NULL, NULL),
	(4, 'default_tenant', 2, '900012345', 'Pollos de Engorde', 'Cocinando con horno', 10001.0000, 'USD', 37613060.9300, 'aprobado', true, 2, '2025-11-13 14:08:36.306037+00', 'dae4c1a5e5f7710b4f59bcb549fef97f315be5d1fc9ab0b6817ebc8fabb24211', 1, '2025-11-13 14:08:56.787261+00', 'ed7ca825ff05bd0380d244752b13065d266c652ca5fe907a55d05db9a74f3129', '2025-11-13 14:08:06.195642+00', NULL, 'pendiente', NULL, NULL),
	(5, 'default_tenant', 1, 'ASASAS', 'Pollos de Engorde', '', 50000.0000, 'COP', 50000.0000, 'aprobado', false, 1, '2025-11-15 14:55:04.097885+00', '9a8d99e883b04be490e26d10e432af283eaddeb94a4171843916e0e2688306d5', NULL, NULL, NULL, '2025-11-15 14:48:30.922553+00', NULL, 'pendiente', NULL, NULL),
	(6, 'default_tenant', 1, 'ASASAS', 'Pollos de Engorde', 'AAAAAAAAAAAA', 36000000.0000, 'COP', 36000000.0000, 'aprobado', true, 1, '2025-11-15 14:55:45.505754+00', '606ecf5b008e5250d1dce5e6f1183e443da2b7720faba297d95451ea7c29886d', 2, '2025-11-15 14:56:15.01649+00', '0ae53a961c5f4ec74ea0bcebadcfd90e904d4b6b7693eccdf6eb2fdef55bab20', '2025-11-15 14:55:29.421928+00', NULL, 'pendiente', NULL, NULL),
	(7, 'default_tenant', 1, '900012345', 'Pollos de Engorde', 'AAA', 360000000.0000, 'COP', 360000000.0000, 'aprobado', true, 1, '2025-11-15 14:56:50.339373+00', 'ac31f5161fde67c740c48551586a13eb963e4d4a57dd7a3a1c7d6f303cf4b892', 2, '2025-11-15 14:56:54.895734+00', '3640e699a0e56f84433bdf1fdaeba3b8397245398a8a0f511cac7384d207115e', '2025-11-15 14:56:46.26333+00', NULL, 'pendiente', NULL, NULL),
	(8, 'default_tenant', 1, 'AASASA', 'Pollos de Engorde', 'AAAAAAAAA', 1.0000, 'USD', 3764.7700, 'aprobado', false, 1, '2025-11-15 15:02:22.708807+00', 'e0c44a1d79dc2956f8969ee3b022c42aeda49531b77867ebed63f039b3248094', NULL, NULL, NULL, '2025-11-15 15:02:19.332224+00', NULL, 'pendiente', NULL, NULL);


--
-- Data for Name: auditoria_pagos_log; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."auditoria_pagos_log" ("id", "orden_pago_id", "user_id", "accion", "detalles", "hash_evidencia", "fecha") VALUES
	(1, 1, 1, 'CREAR', 'Orden creada por Pollos de Engorde por COP 10000000.', NULL, '2025-11-12 15:50:27.445053+00'),
	(2, 2, 1, 'CREAR', 'Orden creada por Pollos de Engorde por USD 10000000.', NULL, '2025-11-12 15:51:03.216309+00'),
	(3, 2, 1, 'FIRMAR_1', 'Firma aplicada por usuario 1. Nuevo estado: pendiente_firma_2', 'a0bafe3024a4e38542dd943c906f3baa56157df5890a3e5094247398aa0047a0', '2025-11-12 15:51:48.364201+00'),
	(4, 1, 1, 'FIRMAR_1', 'Firma aplicada por usuario 1. Nuevo estado: aprobado', '09cc858d429292edb88bd4f95be22e00c71d90e88f4216689dbf9f2edc48b8ad', '2025-11-12 15:51:51.962903+00'),
	(5, 2, 2, 'FIRMAR_2', 'Firma aplicada por usuario 2. Nuevo estado: aprobado', 'ea5da2dea304c901de39bb2c8d785e3adc120e9ccffa5e9babf686d9de3c2ec2', '2025-11-13 11:52:09.003111+00'),
	(6, 3, 2, 'CREAR', 'Orden creada por Pollos de Engorde por USD 1000.', NULL, '2025-11-13 14:07:00.78283+00'),
	(7, 3, 1, 'FIRMAR_1', 'Firma aplicada por usuario 1. Nuevo estado: aprobado', '18dc14936a8e8e2766ea570a7cd4537c1c7bf1b67ad933cd80cfad0c8a5956ae', '2025-11-13 14:07:35.955234+00'),
	(8, 4, 2, 'CREAR', 'Orden creada por Pollos de Engorde por USD 10001.', NULL, '2025-11-13 14:08:06.195642+00'),
	(9, 4, 2, 'FIRMAR_1', 'Firma aplicada por usuario 2. Nuevo estado: pendiente_firma_2', 'dae4c1a5e5f7710b4f59bcb549fef97f315be5d1fc9ab0b6817ebc8fabb24211', '2025-11-13 14:08:36.306037+00'),
	(10, 4, 1, 'FIRMAR_2', 'Firma aplicada por usuario 1. Nuevo estado: aprobado', 'ed7ca825ff05bd0380d244752b13065d266c652ca5fe907a55d05db9a74f3129', '2025-11-13 14:08:56.787261+00'),
	(11, 5, 1, 'CREAR', 'Orden creada por Pollos de Engorde por COP 50000.', NULL, '2025-11-15 14:48:30.922553+00'),
	(12, 5, 1, 'FIRMAR_1', 'Firma aplicada por usuario 1. Nuevo estado: aprobado', '9a8d99e883b04be490e26d10e432af283eaddeb94a4171843916e0e2688306d5', '2025-11-15 14:55:04.097885+00'),
	(13, 6, 1, 'CREAR', 'Orden creada por Pollos de Engorde por COP 36000000.', NULL, '2025-11-15 14:55:29.421928+00'),
	(14, 6, 1, 'FIRMAR_1', 'Firma aplicada por usuario 1. Nuevo estado: pendiente_firma_2', '606ecf5b008e5250d1dce5e6f1183e443da2b7720faba297d95451ea7c29886d', '2025-11-15 14:55:45.505754+00'),
	(15, 6, 2, 'FIRMAR_2', 'Firma aplicada por usuario 2. Nuevo estado: aprobado', '0ae53a961c5f4ec74ea0bcebadcfd90e904d4b6b7693eccdf6eb2fdef55bab20', '2025-11-15 14:56:15.01649+00'),
	(16, 7, 1, 'CREAR', 'Orden creada por Pollos de Engorde por COP 360000000.', NULL, '2025-11-15 14:56:46.26333+00'),
	(17, 7, 1, 'FIRMAR_1', 'Firma aplicada por usuario 1. Nuevo estado: pendiente_firma_2', 'ac31f5161fde67c740c48551586a13eb963e4d4a57dd7a3a1c7d6f303cf4b892', '2025-11-15 14:56:50.339373+00'),
	(18, 7, 2, 'FIRMAR_2', 'Firma aplicada por usuario 2. Nuevo estado: aprobado', '3640e699a0e56f84433bdf1fdaeba3b8397245398a8a0f511cac7384d207115e', '2025-11-15 14:56:54.895734+00'),
	(19, 8, 1, 'CREAR', 'Orden creada por Pollos de Engorde por USD 1.', NULL, '2025-11-15 15:02:19.332224+00'),
	(20, 8, 1, 'FIRMAR_1', 'Firma aplicada por usuario 1. Nuevo estado: aprobado', 'e0c44a1d79dc2956f8969ee3b022c42aeda49531b77867ebed63f039b3248094', '2025-11-15 15:02:22.708807+00');


--
-- Data for Name: balances_financieros; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."balances_financieros" ("id", "tenant_id", "tipo_empresa", "normativa", "periodo_fecha", "datos_balance", "hash_sha256", "estado_firma", "firmado_por_contador_id", "firma_digital_hash", "fecha_generacion", "fecha_firma") VALUES
	(9, 'default_tenant', 'PyME', 'NIIF', '2025-09-30', '{"activos": 145000, "pasivos": 45000, "patrimonio": 100000}', 'd4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3', 'firmado', 2, 'firma_simulada_9876543210', '2025-11-07 09:36:31.811128', '2025-10-05 10:30:00'),
	(10, 'default_tenant', 'Micro', 'NIIF', '2025-08-31', '{"activos": 75000, "pasivos": 15000, "patrimonio": 60000}', 'e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4', 'firmado', 2, 'firma_simulada_1234567890', '2025-11-07 09:36:31.811128', '2025-09-04 15:00:00'),
	(6, 'default_tenant', 'PyME', 'NIIF', '2025-10-31', '{"activos": 150000, "pasivos": 50000, "patrimonio": 100000}', 'a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890', 'firmado', 1, 'simulacion_firma_1_2025-11-08T11:46:45.148Z', '2025-11-07 09:36:31.811128', '2025-11-08 06:46:45.148'),
	(7, 'default_tenant', 'Micro', 'NIIF', '2025-10-31', '{"activos": 80000, "pasivos": 20000, "patrimonio": 60000}', 'b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1', 'firmado', NULL, NULL, '2025-11-07 09:36:31.811128', NULL),
	(8, 'default_tenant', 'Grupo 1-3', 'IFRS', '2025-09-30', '{"activos": 1200000, "pasivos": 800000, "patrimonio": 400000}', 'c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2', 'firmado', 1, 'simulacion_firma_1_2025-11-24T14:17:05.124Z', '2025-11-07 09:36:31.811128', '2025-11-24 09:17:05.124'),
	(12, 'default_tenant', 'PyME', 'NIIF', '2025-11-27', '{"activos": {"corrientes": 86219.20000000001, "no_corrientes": 129328.79999999999}, "pasivos": {"corrientes": 91957, "no_corrientes": 91957}, "patrimonio": {"capital_social": 31634, "utilidad_ejercicio": 3163.4}}', '01d6183b45f044edc8674bcb086db693382b319fa398014a2082bca0bbb82f7d', 'pendiente', NULL, NULL, '2025-11-27 14:48:17.691013', NULL),
	(11, 'CCOL-001', 'PyME', 'NIIF', '2025-11-27', '{"activos": {"corrientes": 183577.6, "no_corrientes": 275366.39999999997}, "pasivos": {"corrientes": 50277, "no_corrientes": 50277}, "patrimonio": {"capital_social": 358390, "utilidad_ejercicio": 35839}}', '763f76ac65bfeb872e336c22541759c8a9e2ceae1909a89ad89052091c51b356', 'pendiente', NULL, NULL, '2025-11-27 14:48:17.690802', NULL),
	(13, 'POLLO-004', 'PyME', 'NIIF', '2025-11-27', '{"activos": {"corrientes": 132431.6, "no_corrientes": 198647.4}, "pasivos": {"corrientes": 47271, "no_corrientes": 47271}, "patrimonio": {"capital_social": 236537, "utilidad_ejercicio": 23653.7}}', '286b55b3f0f594d62a7f436c622c31a737aaf1b720a6be65c2d88b6a3580662e', 'pendiente', NULL, NULL, '2025-11-27 14:48:17.736457', NULL),
	(14, 'FRAN-002', 'PyME', 'NIIF', '2025-11-27', '{"activos": {"corrientes": 128820, "no_corrientes": 193230}, "pasivos": {"corrientes": 33706.5, "no_corrientes": 33706.5}, "patrimonio": {"capital_social": 254637, "utilidad_ejercicio": 25463.7}}', 'd6c2f473a9113b5d35dca4d23dd8ef44c8733e150b5f0979d3e14813fd155c35', 'pendiente', NULL, NULL, '2025-11-27 14:48:17.795572', NULL),
	(15, 'POLLO-004', 'PyME', 'NIIF', '2025-11-27', '{"activos": {"detalle": {"efectivo": 0, "cuentas_por_cobrar": 0}, "corrientes": 0, "no_corrientes": 0}, "pasivos": {"corrientes": 0, "no_corrientes": 0}, "patrimonio": {"capital_social": 1014000, "utilidad_ejercicio": -1014000}}', 'ed8326111bd3533331f19a9c57b0c287c4473ae854093feec2ba17fd73234325', 'pendiente', NULL, NULL, '2025-11-27 15:13:09.811124', NULL),
	(16, 'CCOL-001', 'PyME', 'NIIF', '2025-11-27', '{"activos": {"detalle": {"efectivo": 0, "cuentas_por_cobrar": 0}, "corrientes": 0, "no_corrientes": 0}, "pasivos": {"corrientes": 0, "no_corrientes": 0}, "patrimonio": {"capital_social": 1014000, "utilidad_ejercicio": -1014000}}', 'ed8326111bd3533331f19a9c57b0c287c4473ae854093feec2ba17fd73234325', 'pendiente', NULL, NULL, '2025-11-27 15:13:09.882063', NULL),
	(18, 'FRAN-002', 'PyME', 'NIIF', '2025-11-27', '{"activos": {"detalle": {"efectivo": 0, "cuentas_por_cobrar": 0}, "corrientes": 0, "no_corrientes": 0}, "pasivos": {"corrientes": 0, "no_corrientes": 0}, "patrimonio": {"capital_social": 1014000, "utilidad_ejercicio": -1014000}}', 'ed8326111bd3533331f19a9c57b0c287c4473ae854093feec2ba17fd73234325', 'pendiente', NULL, NULL, '2025-11-27 15:13:09.955311', NULL),
	(17, 'default_tenant', 'PyME', 'NIIF', '2025-11-27', '{"activos": {"detalle": {"efectivo": 0, "cuentas_por_cobrar": 7454626.48}, "corrientes": 7454626.48, "no_corrientes": 351781467}, "pasivos": {"corrientes": 38056727755.7, "no_corrientes": 0}, "patrimonio": {"capital_social": 1014000, "utilidad_ejercicio": -37698505662.22}}', '4b87a3d273d6a042874d72f1f5b83e1e7436a06e63cbccb3f700854df1dd9191', 'firmado', 1, 'simulacion_firma_1_2025-11-28T11:50:28.495Z', '2025-11-27 15:13:09.883564', '2025-11-28 06:50:28.495'),
	(19, 'FRAN-002', 'PyME', 'NIIF', '2025-12-10', '{"activos": {"detalle": {"efectivo": 0, "cuentas_por_cobrar": 0}, "corrientes": 0, "no_corrientes": 0}, "pasivos": {"corrientes": 0, "no_corrientes": 0}, "patrimonio": {"capital_social": 1014000, "utilidad_ejercicio": -1014000}}', 'ed8326111bd3533331f19a9c57b0c287c4473ae854093feec2ba17fd73234325', 'pendiente', NULL, NULL, '2025-12-10 13:40:22.365698', NULL),
	(20, 'CCOL-001', 'PyME', 'NIIF', '2025-12-10', '{"activos": {"detalle": {"efectivo": 0, "cuentas_por_cobrar": 0}, "corrientes": 0, "no_corrientes": 0}, "pasivos": {"corrientes": 0, "no_corrientes": 0}, "patrimonio": {"capital_social": 1014000, "utilidad_ejercicio": -1014000}}', 'ed8326111bd3533331f19a9c57b0c287c4473ae854093feec2ba17fd73234325', 'pendiente', NULL, NULL, '2025-12-10 13:40:22.419983', NULL),
	(21, 'POLLO-004', 'PyME', 'NIIF', '2025-12-10', '{"activos": {"detalle": {"efectivo": 0, "cuentas_por_cobrar": 0}, "corrientes": 0, "no_corrientes": 0}, "pasivos": {"corrientes": 0, "no_corrientes": 0}, "patrimonio": {"capital_social": 1014000, "utilidad_ejercicio": -1014000}}', 'ed8326111bd3533331f19a9c57b0c287c4473ae854093feec2ba17fd73234325', 'pendiente', NULL, NULL, '2025-12-10 13:40:22.461671', NULL),
	(22, 'default_tenant', 'PyME', 'NIIF', '2025-12-10', '{"activos": {"detalle": {"efectivo": 0, "cuentas_por_cobrar": 7454626.48}, "corrientes": 7454626.48, "no_corrientes": 351781467}, "pasivos": {"corrientes": 38056727755.7, "no_corrientes": 0}, "patrimonio": {"capital_social": 1014000, "utilidad_ejercicio": -37698505662.22}}', '4b87a3d273d6a042874d72f1f5b83e1e7436a06e63cbccb3f700854df1dd9191', 'pendiente', NULL, NULL, '2025-12-10 13:40:22.471715', NULL);


--
-- Data for Name: documentos_legales; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."documentos_legales" ("id", "tenant_id", "creado_por_user_id", "titulo", "descripcion", "tipo_documento", "fecha_documento", "fecha_creacion", "version", "documento_padre_id", "estado", "storage_path_original", "hash_sha256_original", "firmado_por_contador_id", "fecha_firma_contador", "hash_firma_contador", "firmado_por_revisor_id", "fecha_firma_revisor", "hash_firma_revisor", "storage_path_firmado") VALUES
	(19, 'default_tenant', NULL, 'Acta de Resolucion - TEST', 'A<BC', 'acta_etica', '2025-11-11', '2025-11-11 11:52:55.34262+00', 1, NULL, 'finalizado', 'default_tenant/actas_eticas/acta_etica_1_1762861975342.txt', '95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce', 1, '2025-11-11 12:10:39.309557+00', 'firma_simulada_1762863037679', 1, '2025-11-11 12:10:43.499849+00', 'firma_simulada_1762863043379', 's3://bucket/docs/doc_19_firmado.pdf'),
	(33, 'default_tenant', 1, 'SUPABASE-AR', 'SUPABASE-ARSUPABASE-ARSUPABASE-ARSUPABASE-ARSUPABASE-ARSUPABASE-AR', 'acta_etica', '2025-11-29', '2025-11-29 13:48:54.784664+00', 1, NULL, 'finalizado', 'default_tenant/actas_eticas_resueltas/acta_etica_9_1764424134870.pdf', 'a23e62a8368f9b91a45cae994d37099774729ed85efc33ad986005fce02a1318', 1, '2025-11-29 13:49:10.475567+00', 'firma_simulada_1764424149610', 1, '2025-11-29 13:49:14.121544+00', 'firma_simulada_1764424153813', 's3://bucket/docs/doc_33_firmado.pdf'),
	(30, 'default_tenant', 1, '98¿'',kjik,jkjkiuj', 'jjjjjjjjjjjjjjjjjj', 'acta_etica', '2025-11-29', '2025-11-29 11:56:52.375739+00', 1, NULL, 'finalizado', 'default_tenant\actas_eticas_resueltas\acta_etica_7_1764417413990.pdf', '30f75f7fd26db1ed23f9e35a8a8d939b8823f5f92ede1d33b22194a7e0dfd01f', 1, '2025-11-29 12:00:02.038177+00', 'firma_simulada_1764417601139', 1, '2025-11-29 12:00:05.891692+00', 'firma_simulada_1764417606957', 's3://bucket/docs/doc_30_firmado.pdf'),
	(34, 'default_tenant', 1, 'SUPABASE-AR2', 'SUPABASE-AR2SUPABASE-AR2SUPABASE-AR2SUPABASE-AR2SUPABASE-AR2SUPABASE-AR2', 'acta_etica', '2025-11-29', '2025-11-29 13:54:39.538432+00', 1, NULL, 'pendiente_firma', 'default_tenant/actas_eticas_resueltas/acta_etica_10_1764424482331.pdf', 'fc06148e4c865c2c3ff858137283bbbbdea7a7621b8af3060e7d59cbf51dac9b', 1, '2025-11-29 13:55:00.793057+00', 'firma_simulada_1764424499878', NULL, NULL, NULL, NULL),
	(31, 'default_tenant', 1, 'SUPABASE 2', 'OWO', 'acta_etica', '2025-11-29', '2025-11-29 12:41:29.059354+00', 1, NULL, 'finalizado', 'default_tenant\actas_eticas_resueltas\acta_etica_8_1764420088731.pdf', '8b4cd3f45c9489572b753ce380d523d30f31f7fe34bb142aad540669142fb95a', 1, '2025-11-29 12:42:00.750751+00', 'firma_simulada_1764420118477', 1, '2025-11-29 12:42:04.215742+00', 'firma_simulada_1764420123460', 's3://bucket/docs/doc_31_firmado.pdf'),
	(32, 'default_tenant', 1, 'SUPABASE1', 'uokyuiouiol', 'contrato', '2025-11-29', '2025-11-29 13:43:04.357025+00', 1, NULL, 'finalizado', 'default_tenant/1764423782425_1764419474483-default_tenant_actas_eticas_resueltas_acta_etica_5_1762948334417.pdf', 'b13588b1cff0523eb19a112c8c14a08e21b750c89d57d14ccee8f01ad2cac10f', 1, '2025-11-29 13:43:17.721823+00', 'firma_simulada_1764423795911', 1, '2025-11-29 13:43:31.846848+00', 'firma_simulada_1764423811511', 's3://bucket/docs/doc_32_firmado.pdf'),
	(36, 'default_tenant', 1, 'LINTES', 'LINTES', 'acta_etica', '2025-11-29', '2025-11-29 14:24:05.159149+00', 1, NULL, 'pendiente_firma', 'default_tenant/actas_eticas_resueltas/acta_etica_12_1764426245660.pdf', 'b8ff68ab9c11e2e5171916f8897707cbff96c6e88a7e32144efb8ff5b54ec3c0', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(35, 'default_tenant', 1, 'SUPABASE-AR23', 'SUPABASE-AR23SUPABASE-AR23SUPABASE-AR23SUPABASE-AR23SUPABASE-AR23SUPABASE-AR23', 'acta_etica', '2025-11-29', '2025-11-29 14:01:21.34024+00', 1, NULL, 'pendiente_firma', 'default_tenant/actas_eticas_resueltas/acta_etica_11_1764424883723.pdf', 'c0443f8be0826bdb7f5bccf68ecb30c7999826b6953ff708310198eb266bac83', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(28, 'default_tenant', 1, 'Acta de Resolucion - TEST MULTIPLE', 'Acta de Resolucion - TEST MULTIPLE', 'acta_etica', '2025-11-12', '2025-11-12 12:10:10.047448+00', 1, NULL, 'pendiente_firma', 'default_tenant\actas_eticas_resueltas\acta_etica_5_1762949414596.pdf', '2ddf9e62b90fdb9aaa3d0e5491dd002e0e1fe267cff9076094b780e0f2e2b403', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(29, 'default_tenant', 1, 'SUPABASE', 'ytyrtyrtyrty', 'contrato', '2025-11-25', '2025-11-25 12:20:23.377049+00', 1, NULL, 'pendiente_firma', 'default_tenant/1764073223107_soa-iso-27001.pdf', 'cff489cdfcad2324c2dda31290837126cc7021f4540b01198b79ae5c7f0e85ac', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(37, 'default_tenant', 1, 'APIAPIAPI', 'APIAPIAPI', 'acta_etica', '2025-11-29', '2025-11-29 14:29:21.141946+00', 1, NULL, 'borrador', 'default_tenant/actas_eticas_resueltas/acta_etica_13_1764426562044.pdf', '04e054c98d3ffd9200cdcb36768bd02a9aaf4ece61b21de39a6a40457f914985', NULL, NULL, NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: canal_etico_casos; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."canal_etico_casos" ("id", "tenant_id", "caso_uuid", "creado_por_user_id", "titulo", "descripcion_irregularidad", "tipo_irregularidad", "fecha_creacion", "estado", "documento_legal_id", "archivos_evidencia") VALUES
	(1, 'default_tenant', '367b81ce-b0c1-4086-8916-881c1ca96240', 1, 'Denuncia: Posible conflicto de interés', 'Se ha observado un posible conflicto de interés en la asignación de contratos de proveeduría en la franquicia del sur.', 'conflicto_interes', '2025-11-10 14:22:53.621968+00', 'resuelto', 19, NULL),
	(2, 'default_tenant', '8829fe05-092a-4adb-ba75-afe6ba548926', 1, 'Denuncia: Soborno en Franquicia Central', 'Denuncia anónima recibida sobre pagos indebidos en la franquicia central. El comité investigó y emitió una resolución.', 'soborno', '2025-11-10 14:22:53.621968+00', 'resuelto', NULL, NULL),
	(3, 'default_tenant', '9002c26e-c037-4729-8d86-d5d1da64ef6a', NULL, 'UWU', 'UWU', 'acoso', '2025-11-11 12:44:44.800465+00', 'abierto', NULL, NULL),
	(4, 'default_tenant', '5e968219-09c2-4dc3-9b93-1eadfb12d267', NULL, 'UWU 2', 'UWU', 'acoso', '2025-11-11 13:39:47.612124+00', 'abierto', NULL, '["default_tenant\\casos_eticos\\5e968219-09c2-4dc3-9b93-1eadfb12d267\\1762868387622-banner.png"]'),
	(5, 'default_tenant', 'de3994da-b76c-4fb8-aecd-f96d305cfdae', NULL, 'MULTIPLE', 'MULTIPLE
', 'fraude', '2025-11-11 14:18:32.18158+00', 'resuelto', 28, '["default_tenant\\casos_eticos\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\1762870712188-banner.png", "default_tenant\\casos_eticos\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\1762870712190-next-env.d.ts", "default_tenant\\casos_eticos\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\1762870712190-notas.md", "default_tenant\\casos_eticos\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\1762870712191-NOTAS.txt", "default_tenant\\casos_eticos\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\1762870712193-banner.png", "default_tenant\\casos_eticos\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\1762870712195-next-env.d.ts", "default_tenant\\casos_eticos\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\1762870712196-notas.md", "default_tenant\\casos_eticos\\de3994da-b76c-4fb8-aecd-f96d305cfdae\\1762870712197-NOTAS.txt"]'),
	(6, 'default_tenant', '8badf58c-3dd9-44aa-b6e4-d5feb164e1c8', NULL, 'Test', '456789321174285936', 'otro', '2025-11-29 11:54:57.592761+00', 'abierto', NULL, '["default_tenant\\casos_eticos\\8badf58c-3dd9-44aa-b6e4-d5feb164e1c8\\1764417299040-"]'),
	(12, 'default_tenant', '2531ffea-ad17-4393-9fac-9106a908a745', NULL, 'LINTES', 'LINTESLINTESLINTESLINTESLINTESLINTESLINTESLINTES', 'otro', '2025-11-29 14:23:48.438125+00', 'resuelto', 36, '["default_tenant/casos_eticos/2531ffea-ad17-4393-9fac-9106a908a745/1764426228350-acta_etica_9_1764424134870.pdf"]'),
	(7, 'default_tenant', 'd364d15b-7d00-46fd-973b-cecdb801da4b', NULL, '´kp+p´+p', '{}ok´{kop{', 'fraude', '2025-11-29 11:55:52.557893+00', 'resuelto', 30, '["default_tenant\\casos_eticos\\d364d15b-7d00-46fd-973b-cecdb801da4b\\1764417353921-cedula-contadores.png", "default_tenant\\casos_eticos\\d364d15b-7d00-46fd-973b-cecdb801da4b\\1764417353928-cedula-contadores.png"]'),
	(8, 'default_tenant', '580f4248-c438-41be-b63e-b59103c49933', NULL, 'SUPABASE', 'SUPABASE', 'soborno', '2025-11-29 12:31:13.623011+00', 'resuelto', 31, '["default_tenant/casos_eticos/580f4248-c438-41be-b63e-b59103c49933/1764419473679-cedula-contadores.png", "default_tenant/casos_eticos/580f4248-c438-41be-b63e-b59103c49933/1764419474483-default_tenant_actas_eticas_resueltas_acta_etica_5_1762948334417.pdf"]'),
	(9, 'default_tenant', 'df8d4820-8b06-44f2-84ed-145a37c13bff', NULL, 'SUPABASE-AR', 'SUPABASE-AR', 'soborno', '2025-11-29 13:48:28.16578+00', 'resuelto', 33, '["default_tenant/casos_eticos/df8d4820-8b06-44f2-84ed-145a37c13bff/1764424108107-FE-FE-005-Grafica.pdf", "default_tenant/casos_eticos/df8d4820-8b06-44f2-84ed-145a37c13bff/1764424108843-571151344_1466220578836454_5833981679984533719_n.jpg"]'),
	(13, 'default_tenant', 'e9f7fd2d-3d00-4f9f-81ae-73c890189c9b', NULL, 'APIAPIAPIAPIAPIAPIAPIAPIAPI', 'APIAPIAPIAPIAPIAPI', 'fraude', '2025-11-29 14:29:05.149716+00', 'resuelto', 37, '["default_tenant/casos_eticos/e9f7fd2d-3d00-4f9f-81ae-73c890189c9b/1764426545057-1764419473679-cedula-contadores.png"]'),
	(10, 'default_tenant', 'e7e5c916-a842-45e5-9de0-bc8383f613f1', NULL, 'SUPABASE-AR2', 'SUPABASE-AR2', 'soborno', '2025-11-29 13:54:23.935044+00', 'resuelto', 34, '["default_tenant/casos_eticos/e7e5c916-a842-45e5-9de0-bc8383f613f1/1764424463866-1764424108843-571151344_1466220578836454_5833981679984533719_n.jpg", "default_tenant/casos_eticos/e7e5c916-a842-45e5-9de0-bc8383f613f1/1764424464632-1764424108107-FE-FE-005-Grafica.pdf", "default_tenant/casos_eticos/e7e5c916-a842-45e5-9de0-bc8383f613f1/1764424464825-TUTELAACEPTACIONPODERELLETRONICO.docx"]'),
	(11, 'default_tenant', '3645a26a-941d-4312-9904-07b22c8c5b7b', NULL, 'SUPABASE-AR23', 'SUPABASE-AR23SUPABASE-AR23SUPABASE-AR23SUPABASE-AR23SUPABASE-AR23SUPABASE-AR23SUPABASE-AR23', 'soborno', '2025-11-29 14:01:10.733708+00', 'resuelto', 35, '["default_tenant/casos_eticos/3645a26a-941d-4312-9904-07b22c8c5b7b/1764424870648-acta_etica_10_1764424482331.pdf", "default_tenant/casos_eticos/3645a26a-941d-4312-9904-07b22c8c5b7b/1764424871532-1764419473679-cedula-contadores1.png", "default_tenant/casos_eticos/3645a26a-941d-4312-9904-07b22c8c5b7b/1764424871739-MODELODEMANDACONPAGAR.docx"]');


--
-- Data for Name: canal_etico_respuestas; Type: TABLE DATA; Schema: core; Owner: postgres
--



--
-- Data for Name: cap_table; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."cap_table" ("id", "inversionista_id", "token_id", "porcentaje", "fecha", "lockup_hasta", "calificado", "cantidad") VALUES
	(8, 1, '4c4ece88-5bee-4445-adbb-1ae79c0908cf', 0.118, '2025-11-20 09:25:11.407781', '2026-11-20', false, 10),
	(9, 4, '7e9df68c-3992-4b9a-8001-24d8d3502128', 0.118, '2025-11-20 09:25:12.712861', '2026-11-20', false, 10),
	(10, 6, '14ceb454-d68d-4614-b9c7-9f9cdeb5c27e', 0.118, '2025-11-20 09:25:15.796954', '2026-11-20', false, 10),
	(11, 5, 'a1b4568b-3d97-4194-85a2-02eb5813ecc6', 0.118, '2025-11-20 09:25:19.088935', '2026-11-20', false, 10),
	(12, 1, '1db2e35f-7d0f-4485-8b06-bd8bcb85f38a', 0.118, '2025-11-20 09:25:51.45469', '2026-11-20', false, 10),
	(13, 4, '35ba49a4-ed85-463d-896b-79bb760a2f27', 0.118, '2025-11-20 09:25:53.580013', '2026-11-20', false, 10),
	(14, 1, 'c94e84f2-74c3-4011-b2d0-290f770194b9', 50.000, '2025-11-20 09:37:08.736355', '2026-11-20', false, 8500);


--
-- Data for Name: certificadosdividendos; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."certificadosdividendos" ("id", "accionista_id", "ano_fiscal", "verification_uuid", "file_path", "file_hash_sha256", "fecha_emision") VALUES
	(16, 7, 2025, '24187700-b8de-461b-a397-47b51cffb67e', 'default_tenant/certificados_dividendos/certificado_2025_7.pdf', '6b01c8a27a52a50838ff7a5450a45f156781b17e58b3011d53cdbf00fccf9d5a', '2025-11-25 14:16:25.120178+00'),
	(17, 8, 2025, 'cb71700d-ecae-448b-a69b-c01b0dae126c', 'default_tenant/certificados_dividendos/certificado_2025_8.pdf', '061828ec0e446eecf37f0ee013cc168ec027a1a8753df81d0e63a2c7899a8670', '2025-11-27 13:33:05.735864+00');


--
-- Data for Name: configuracion_dividendos; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."configuracion_dividendos" ("id", "tenant_id", "ano_fiscal", "valor_accion", "porcentaje_dividendo", "porcentaje_retencion", "updated_at") VALUES
	(1, 3, 2025, 10000.00, 5.00, 2.50, '2025-11-25 14:14:57.904372');


--
-- Data for Name: cuentas_bancarias; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."cuentas_bancarias" ("id", "tenant_id", "nombre_banco", "numero_cuenta_display", "moneda", "descripcion", "pasarela_integracion_id", "fecha_creacion") VALUES
	(1, 'default_tenant', 'Bancolombia', '64645645456456465465465', 'COP', 'Recaudo', NULL, '2025-11-19 12:54:01.055591+00');


--
-- Data for Name: configuracion_pagos; Type: TABLE DATA; Schema: core; Owner: postgres
--



--
-- Data for Name: consent_cookies; Type: TABLE DATA; Schema: core; Owner: postgres
--



--
-- Data for Name: consent_log; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."consent_log" ("id", "user_id", "ip", "fecha", "version", "finalidad", "tenant") VALUES
	(1, 1, '::1', '2025-11-06 08:56:14.878404', 'v3.0', 'registro', 'default_tenant'),
	(2, 1, '::1', '2025-11-06 08:56:14.880978', 'v3.0', 'marketing', 'default_tenant'),
	(3, 2, '::1', '2025-11-06 09:48:06.105489', 'v3.0', 'registro', 'default_tenant'),
	(4, 2, '::1', '2025-11-06 09:48:06.109057', 'v3.0', 'marketing', 'default_tenant'),
	(5, 3, '::1', '2025-11-06 09:56:52.038676', 'v3.0', 'registro', 'default_tenant'),
	(6, 3, '::1', '2025-11-06 09:56:52.044105', 'v3.0', 'marketing', 'default_tenant'),
	(7, 4, '::1', '2025-11-08 06:29:01.122254', 'v3.0', 'registro', 'default_tenant'),
	(8, 4, '::1', '2025-11-08 06:29:01.125235', 'v3.0', 'marketing', 'default_tenant'),
	(9, 5, '::1', '2025-11-08 06:33:51.694986', 'v3.0', 'registro', 'default_tenant'),
	(10, 5, '::1', '2025-11-08 06:33:51.697015', 'v3.0', 'marketing', 'default_tenant'),
	(11, 6, '::1', '2025-11-08 06:40:22.258899', 'v3.0', 'registro', 'CCOL-001'),
	(12, 7, '::1', '2025-11-08 06:41:19.830496', 'v3.0', 'registro', 'default_tenant'),
	(13, 8, '::1', '2025-11-22 07:36:28.230124', 'v3.0', 'registro', 'default_tenant'),
	(14, 8, '::1', '2025-11-22 07:36:28.233448', 'v3.0', 'marketing', 'default_tenant'),
	(15, 9, '::1', '2025-12-09 14:17:07.71554', 'v3.0', 'registro', 'default_tenant'),
	(16, 9, '::1', '2025-12-09 14:17:07.791776', 'v3.0', 'marketing', 'default_tenant'),
	(17, 10, '::1', '2025-12-09 14:33:23.52988', 'v3.0', 'registro', 'default_tenant'),
	(18, 10, '::1', '2025-12-09 14:33:23.616046', 'v3.0', 'marketing', 'default_tenant');


--
-- Data for Name: data_lineage; Type: TABLE DATA; Schema: core; Owner: postgres
--



--
-- Data for Name: dividendospagados; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."dividendospagados" ("id", "accionista_id", "ano_fiscal", "monto_bruto", "retencion", "monto_neto", "fecha_pago", "created_at") VALUES
	(12, 7, 2025, 5000000.00, 125000.00, 4875000.00, '2025-11-25', '2025-11-25 14:16:23.358204+00'),
	(13, 8, 2025, 46575.00, 1164.00, 45411.00, '2025-11-27', '2025-11-27 13:33:01.475395+00');


--
-- Data for Name: esg_categorias; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."esg_categorias" ("id", "nombre", "descripcion", "created_at") VALUES
	(1, 'Ambiental', 'Métricas relacionadas con el impacto en el medio ambiente', '2025-11-22 14:52:49.62974+00'),
	(2, 'Social', 'Métricas relacionadas con empleados, comunidad y derechos humanos', '2025-11-22 14:52:49.62974+00'),
	(3, 'Gobernanza', 'Métricas sobre ética, transparencia y estructura directiva', '2025-11-22 14:52:49.62974+00');


--
-- Data for Name: esg_metricas; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."esg_metricas" ("id", "categoria_id", "nombre", "unidad_medida", "descripcion", "activo", "created_at") VALUES
	(1, 1, 'Huella de Carbono', 'tCO2e', NULL, true, '2025-11-22 14:52:49.62974+00'),
	(2, 1, 'Consumo de Energía Eléctrica', 'kWh', NULL, true, '2025-11-22 14:52:49.62974+00'),
	(3, 2, 'Brecha Salarial de Género', '%', NULL, true, '2025-11-22 14:52:49.62974+00'),
	(4, 2, 'Horas de Capacitación por Empleado', 'Horas', NULL, true, '2025-11-22 14:52:49.62974+00'),
	(5, 3, 'Miembros Independientes en Junta', '%', NULL, true, '2025-11-22 14:52:49.62974+00'),
	(6, 3, 'Denuncias Canal Ético Resueltas', '%', NULL, true, '2025-11-22 14:52:49.62974+00');


--
-- Data for Name: esg_registros; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."esg_registros" ("id", "metrica_id", "usuario_id", "valor", "periodo_fecha", "evidencia_url", "observaciones", "created_at", "updated_at") VALUES
	(1, 2, NULL, 1200.00, '2025-11-21', NULL, NULL, '2025-11-22 15:13:08.335343+00', '2025-11-22 15:13:08.335343+00'),
	(2, 1, NULL, 500.00, '2025-11-21', NULL, NULL, '2025-11-22 15:13:28.176787+00', '2025-11-22 15:13:28.176787+00'),
	(3, 3, NULL, 600.00, '2025-11-21', NULL, NULL, '2025-11-22 15:13:40.797321+00', '2025-11-22 15:13:40.797321+00'),
	(4, 4, NULL, 550.00, '2025-11-21', NULL, NULL, '2025-11-22 15:13:58.26807+00', '2025-11-22 15:13:58.26807+00'),
	(5, 6, NULL, 400.00, '2025-11-21', NULL, NULL, '2025-11-22 15:14:08.778227+00', '2025-11-22 15:14:08.778227+00'),
	(6, 5, NULL, 400.00, '2025-11-21', NULL, NULL, '2025-11-22 15:14:18.128626+00', '2025-11-22 15:14:18.128626+00');


--
-- Data for Name: facturas; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."facturas" ("id", "tenant_id", "creado_por_user_id", "consecutivo", "fecha_emision", "fecha_vencimiento", "cliente_documento", "cliente_razon_social", "cliente_email", "moneda", "total_sin_impuestos", "total_impuestos", "total_con_impuestos", "items_json", "estado_dian", "es_habilitacion", "cufe", "qr_data", "xml_ubl_generado", "dian_xml_respuesta", "dian_mensaje_error", "cliente_tipo_documento", "estado_pago", "fecha_pago_efectivo", "referencia_pasarela_pago") VALUES
	(1, 'default_tenant', 1, 'FE-001', '2025-11-08 14:03:41.298958+00', '2025-02-11', '900123456', 'Pollos de Engorde S.A.S', 'pe@pe.pe', 'COP', 190000.00, 36100.00, 226100.00, '[{"cantidad": 10, "iva_tasa": 19, "total_iva": 36100, "descripcion": "pollote", "total_con_iva": 226100, "valor_unitario": 19000}]', 'aprobada', true, '7dbbccefd69b941262bf0dd683a6e2207332f0e831e2a6d7830d0c9fcbe9477b', 'https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=7dbbccefd69b941262bf0dd683a6e2207332f0e831e2a6d7830d0c9fcbe9477b', '
      <?xml version="1.0" encoding="UTF-8"?>
      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" ...>
        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
        <cbc:ID>FE-001</cbc:ID>
        <cbc:UUID schemeName="CUFE">7dbbccefd69b941262bf0dd683a6e2207332f0e831e2a6d7830d0c9fcbe9477b</cbc:UUID>
        <cac:AccountingSupplierParty>
          <cac:Party>
            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>
            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingSupplierParty>
        <cac:AccountingCustomerParty>
          <cac:Party>
            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>
            <cbc:CompanyID schemeName="31">900123456</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingCustomerParty>
        <cac:LegalMonetaryTotal>
          <cbc:LineExtensionAmount currencyID="COP">190000.00</cbc:LineExtensionAmount>
          <cbc:TaxExclusiveAmount currencyID="COP">36100.00</cbc:TaxExclusiveAmount>
          <cbc:PayableAmount currencyID="COP">226100.00</cbc:PayableAmount>
        </cac:LegalMonetaryTotal>
        ...
        <!-- Aquí irían los ítems, firma digital, etc. -->
      </Invoice>
    ', '
      <?xml version="1.0" encoding="UTF-8"?>
      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2" ...>
        <cbc:ResponseDate>2025-11-08T14:34:41.341Z</cbc:ResponseDate>
        <cac:DocumentResponse>
          <cac:Response>
            <cbc:ResponseCode>00</cbc:ResponseCode>
            <cbc:Description>Factura FE-001 APROBADA por la DIAN.</cbc:Description>
          </cac:Response>
        </cac:DocumentResponse>
        <cbc:Note>Ambiente: Habilitacion</cbc:Note>
      </ApplicationResponse>
    ', NULL, '31', 'pendiente', NULL, NULL),
	(2, 'default_tenant', 1, 'FE-002', '2025-11-08 14:36:55.538989+00', '2025-12-12', '900123457', 'pe', 'jheison01@gmail.com', 'COP', 1000.00, 190.00, 1190.00, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 190, "descripcion": "aaaaa", "total_con_iva": 1190, "valor_unitario": 1000}]', 'aprobada', true, 'af5ec81d55557ce7979e0569469f4f73d15f3baa12852387f732042f60d38611', 'https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=af5ec81d55557ce7979e0569469f4f73d15f3baa12852387f732042f60d38611', '
      <?xml version="1.0" encoding="UTF-8"?>
      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" ...>
        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
        <cbc:ID>FE-002</cbc:ID>
        <cbc:UUID schemeName="CUFE">af5ec81d55557ce7979e0569469f4f73d15f3baa12852387f732042f60d38611</cbc:UUID>
        <cac:AccountingSupplierParty>
          <cac:Party>
            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>
            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingSupplierParty>
        <cac:AccountingCustomerParty>
          <cac:Party>
            <cbc:Name>pe</cbc:Name>
            <cbc:CompanyID schemeName="13">900123457</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingCustomerParty>
        <cac:LegalMonetaryTotal>
          <cbc:LineExtensionAmount currencyID="COP">1000.00</cbc:LineExtensionAmount>
          <cbc:TaxExclusiveAmount currencyID="COP">190.00</cbc:TaxExclusiveAmount>
          <cbc:PayableAmount currencyID="COP">1190.00</cbc:PayableAmount>
        </cac:LegalMonetaryTotal>
        ...
        <!-- Aquí irían los ítems, firma digital, etc. -->
      </Invoice>
    ', '
      <?xml version="1.0" encoding="UTF-8"?>
      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2" ...>
        <cbc:ResponseDate>2025-11-08T14:37:01.321Z</cbc:ResponseDate>
        <cac:DocumentResponse>
          <cac:Response>
            <cbc:ResponseCode>00</cbc:ResponseCode>
            <cbc:Description>Factura FE-002 APROBADA por la DIAN.</cbc:Description>
          </cac:Response>
        </cac:DocumentResponse>
        <cbc:Note>Ambiente: Habilitacion</cbc:Note>
      </ApplicationResponse>
    ', NULL, '13', 'pendiente', NULL, NULL),
	(3, 'default_tenant', 1, 'FE-003', '2025-11-08 14:52:27.015519+00', '2025-03-21', '900123456', 'Pollos de Engorde S.A.S', 'cesardavid9@hotmail.com', 'COP', 10000.00, 1900.00, 11900.00, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 1900, "descripcion": "aaaaa", "total_con_iva": 11900, "valor_unitario": 10000}]', 'aprobada', true, 'b869970d645399bb0c68a92371aa144517bb58c3c26ef7ac410569c83128736f', 'https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=b869970d645399bb0c68a92371aa144517bb58c3c26ef7ac410569c83128736f', '<?xml version="1.0" encoding="UTF-8"?>
      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" ...>
        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
        <cbc:ID>FE-003</cbc:ID>
        <cbc:UUID schemeName="CUFE">b869970d645399bb0c68a92371aa144517bb58c3c26ef7ac410569c83128736f</cbc:UUID>
        <cac:AccountingSupplierParty>
          <cac:Party>
            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>
            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingSupplierParty>
        <cac:AccountingCustomerParty>
          <cac:Party>
            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>
            <cbc:CompanyID schemeName="13">900123456</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingCustomerParty>
        <cac:LegalMonetaryTotal>
          <cbc:LineExtensionAmount currencyID="COP">10000.00</cbc:LineExtensionAmount>
          <cbc:TaxExclusiveAmount currencyID="COP">1900.00</cbc:TaxExclusiveAmount>
          <cbc:PayableAmount currencyID="COP">11900.00</cbc:PayableAmount>
        </cac:LegalMonetaryTotal>
        ...
        <!-- Aquí irían los ítems, firma digital, etc. -->
      </Invoice>
    ', '<?xml version="1.0" encoding="UTF-8"?>
      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2" ...>
        <cbc:ResponseDate>2025-11-08T14:52:31.117Z</cbc:ResponseDate>
        <cac:DocumentResponse>
          <cac:Response>
            <cbc:ResponseCode>00</cbc:ResponseCode>
            <cbc:Description>Factura FE-003 APROBADA por la DIAN.</cbc:Description>
          </cac:Response>
        </cac:DocumentResponse>
        <cbc:Note>Ambiente: Habilitacion</cbc:Note>
      </ApplicationResponse>
    ', NULL, '13', 'pendiente', NULL, NULL),
	(4, 'default_tenant', 1, 'FE-004', '2025-11-08 15:03:51.262104+00', '2004-10-11', '900123456', 'Pollos de Engorde S.A.S', 'henaosmafe@gmail.com', 'COP', 1010.00, 191.90, 1201.90, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 191.9, "descripcion": "fgdhdf", "total_con_iva": 1201.9, "valor_unitario": 1010}]', 'aprobada', true, 'b820ef4216782cba693423d2bde3efdacafb4eef3111c264a58c6158dc9c0aac', 'https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=b820ef4216782cba693423d2bde3efdacafb4eef3111c264a58c6158dc9c0aac', '<?xml version="1.0" encoding="UTF-8"?>
      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
        <cbc:ID>FE-004</cbc:ID>
        <cbc:UUID schemeName="CUFE">b820ef4216782cba693423d2bde3efdacafb4eef3111c264a58c6158dc9c0aac</cbc:UUID>
        <cac:AccountingSupplierParty>
          <cac:Party>
            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>
            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingSupplierParty>
        <cac:AccountingCustomerParty>
          <cac:Party>
            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>
            <cbc:CompanyID schemeName="13">900123456</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingCustomerParty>
        <cac:LegalMonetaryTotal>
          <cbc:LineExtensionAmount currencyID="COP">1010.00</cbc:LineExtensionAmount>
          <cbc:TaxExclusiveAmount currencyID="COP">191.90</cbc:TaxExclusiveAmount>
          <cbc:PayableAmount currencyID="COP">1201.90</cbc:PayableAmount>
        </cac:LegalMonetaryTotal>
        ...
        <!-- Aquí irían los ítems, firma digital, etc. -->
      </Invoice>
    ', '<?xml version="1.0" encoding="UTF-8"?>
      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">
        <cbc:ResponseDate>2025-11-08T15:04:12.269Z</cbc:ResponseDate>
        <cac:DocumentResponse>
          <cac:Response>
            <cbc:ResponseCode>00</cbc:ResponseCode>
            <cbc:Description>Factura FE-004 APROBADA por la DIAN.</cbc:Description>
          </cac:Response>
        </cac:DocumentResponse>
        <cbc:Note>Ambiente: Habilitacion</cbc:Note>
      </ApplicationResponse>
    ', NULL, '13', 'pendiente', NULL, NULL),
	(5, 'default_tenant', 1, 'FE-005', '2025-11-08 15:06:22.388833+00', '2002-01-10', '9001234561', 'Pollos de Engorde S.A.S', 'caegomezco@gmail.com', 'COP', 10011.00, 1902.09, 11913.09, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 1902.09, "descripcion": "1010", "total_con_iva": 11913.09, "valor_unitario": 10011}]', 'aprobada', true, 'b202d49d86c8a04adcb45b19e26d3cd8de31c4af7978c51fd8ebef07e788072b', 'https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=b202d49d86c8a04adcb45b19e26d3cd8de31c4af7978c51fd8ebef07e788072b', '<?xml version="1.0" encoding="UTF-8"?>
      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
               xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
               xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
        <cbc:ID>FE-005</cbc:ID>
        <cbc:UUID schemeName="CUFE">b202d49d86c8a04adcb45b19e26d3cd8de31c4af7978c51fd8ebef07e788072b</cbc:UUID>
        <cac:AccountingSupplierParty>
          <cac:Party>
            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>
            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingSupplierParty>
        <cac:AccountingCustomerParty>
          <cac:Party>
            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>
            <cbc:CompanyID schemeName="13">9001234561</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingCustomerParty>
        <cac:LegalMonetaryTotal>
          <cbc:LineExtensionAmount currencyID="COP">10011.00</cbc:LineExtensionAmount>
          <cbc:TaxExclusiveAmount currencyID="COP">1902.09</cbc:TaxExclusiveAmount>
          <cbc:PayableAmount currencyID="COP">11913.09</cbc:PayableAmount>
        </cac:LegalMonetaryTotal>
        ...
        <!-- Aquí irían los ítems, firma digital, etc. -->
      </Invoice>
    ', '<?xml version="1.0" encoding="UTF-8"?>
      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2"
                           xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                           xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
        <cbc:ResponseDate>2025-11-08T15:06:38.139Z</cbc:ResponseDate>
        <cac:DocumentResponse>
          <cac:Response>
            <cbc:ResponseCode>00</cbc:ResponseCode>
            <cbc:Description>Factura FE-005 APROBADA por la DIAN.</cbc:Description>
          </cac:Response>
        </cac:DocumentResponse>
        <cbc:Note>Ambiente: Habilitacion</cbc:Note>
      </ApplicationResponse>
    ', NULL, '13', 'pendiente', NULL, NULL),
	(6, 'default_tenant', 1, 'FE-006', '2025-11-08 15:27:51.68318+00', '2025-11-11', '900123456', 'Pollos de Engorde S.A.S', 'sandramilenaduque3@gmail.com', 'COP', 10101.00, 1919.19, 12020.19, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 1919.19, "descripcion": "pollote", "total_con_iva": 12020.19, "valor_unitario": 10101}]', 'aprobada', true, '56e2f3b0d7ba3680ae09bb94bbb342d4f5afa71c968a493f1d7bb8ce6cfd12f6', 'https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=56e2f3b0d7ba3680ae09bb94bbb342d4f5afa71c968a493f1d7bb8ce6cfd12f6', '<?xml version="1.0" encoding="UTF-8"?>
      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
               xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
               xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
        <cbc:ID>FE-006</cbc:ID>
        <cbc:UUID schemeName="CUFE">56e2f3b0d7ba3680ae09bb94bbb342d4f5afa71c968a493f1d7bb8ce6cfd12f6</cbc:UUID>
        <cac:AccountingSupplierParty>
          <cac:Party>
            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>
            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingSupplierParty>
        <cac:AccountingCustomerParty>
          <cac:Party>
            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>
            <cbc:CompanyID schemeName="13">900123456</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingCustomerParty>
        <cac:LegalMonetaryTotal>
          <cbc:LineExtensionAmount currencyID="COP">10101.00</cbc:LineExtensionAmount>
          <cbc:TaxExclusiveAmount currencyID="COP">1919.19</cbc:TaxExclusiveAmount>
          <cbc:PayableAmount currencyID="COP">12020.19</cbc:PayableAmount>
        </cac:LegalMonetaryTotal>
        ...
        <!-- Aquí irían los ítems, firma digital, etc. -->
      </Invoice>
    ', '<?xml version="1.0" encoding="UTF-8"?>
      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2"
                           xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                           xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
        <cbc:ResponseDate>2025-11-08T15:27:57.611Z</cbc:ResponseDate>
        <cac:DocumentResponse>
          <cac:Response>
            <cbc:ResponseCode>00</cbc:ResponseCode>
            <cbc:Description>Factura FE-006 APROBADA por la DIAN.</cbc:Description>
          </cac:Response>
        </cac:DocumentResponse>
        <cbc:Note>Ambiente: Habilitacion</cbc:Note>
      </ApplicationResponse>
    ', NULL, '13', 'pendiente', NULL, NULL),
	(7, 'default_tenant', 1, 'FE-007', '2025-11-10 12:55:24.292185+00', '2025-11-11', '900123457', 'Pollos de Engorde S.A.S', 'longasf.6@gmail.com', 'COP', 87500.00, 16625.00, 104125.00, '[{"cantidad": 5, "iva_tasa": 19, "total_iva": 16625, "descripcion": "pollote", "total_con_iva": 104125, "valor_unitario": 17500}]', 'aprobada', true, 'bcf6e79e69abe3460a405dda2ec850baf18e2d47601f0953f213834433a123e1', 'https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=bcf6e79e69abe3460a405dda2ec850baf18e2d47601f0953f213834433a123e1', '<?xml version="1.0" encoding="UTF-8"?>
      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
               xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
               xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
        <cbc:ID>FE-007</cbc:ID>
        <cbc:UUID schemeName="CUFE">bcf6e79e69abe3460a405dda2ec850baf18e2d47601f0953f213834433a123e1</cbc:UUID>
        <cac:AccountingSupplierParty>
          <cac:Party>
            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>
            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingSupplierParty>
        <cac:AccountingCustomerParty>
          <cac:Party>
            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>
            <cbc:CompanyID schemeName="13">900123457</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingCustomerParty>
        <cac:LegalMonetaryTotal>
          <cbc:LineExtensionAmount currencyID="COP">87500.00</cbc:LineExtensionAmount>
          <cbc:TaxExclusiveAmount currencyID="COP">16625.00</cbc:TaxExclusiveAmount>
          <cbc:PayableAmount currencyID="COP">104125.00</cbc:PayableAmount>
        </cac:LegalMonetaryTotal>
        ...
        <!-- Aquí irían los ítems, firma digital, etc. -->
      </Invoice>
    ', '<?xml version="1.0" encoding="UTF-8"?>
      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2"
                           xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                           xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
        <cbc:ResponseDate>2025-11-10T12:55:43.122Z</cbc:ResponseDate>
        <cac:DocumentResponse>
          <cac:Response>
            <cbc:ResponseCode>00</cbc:ResponseCode>
            <cbc:Description>Factura FE-007 APROBADA por la DIAN.</cbc:Description>
          </cac:Response>
        </cac:DocumentResponse>
        <cbc:Note>Ambiente: Habilitacion</cbc:Note>
      </ApplicationResponse>
    ', NULL, '13', 'pendiente', NULL, NULL),
	(8, 'default_tenant', 1, 'FE-008', '2025-11-11 12:19:11.957546+00', '2025-11-12', '900123456', 'Pollos de Engorde S.A.S', 'longasf.6@gmail.com', 'COP', 10000.00, 1900.00, 11900.00, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 1900, "descripcion": "aaaaa", "total_con_iva": 11900, "valor_unitario": 10000}]', 'borrador', false, NULL, NULL, NULL, NULL, NULL, '13', 'pendiente', NULL, NULL),
	(9, 'default_tenant', 1, 'FE-009', '2025-11-11 12:19:51.876189+00', '2025-11-11', '900123457', 'Pollos de Engorde S.A.S', 'tecnicosenantioquiatesa@gmail.com', 'COP', 100000.00, 19000.00, 119000.00, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 19000, "descripcion": "pollote", "total_con_iva": 119000, "valor_unitario": 100000}]', 'aprobada', true, '7857706b9aab74ff9047486c28a450c697aefa7d548fcec3d7d54bde6ad31439', 'https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=7857706b9aab74ff9047486c28a450c697aefa7d548fcec3d7d54bde6ad31439', '<?xml version="1.0" encoding="UTF-8"?>
      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
               xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
               xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
        <cbc:ID>FE-009</cbc:ID>
        <cbc:UUID schemeName="CUFE">7857706b9aab74ff9047486c28a450c697aefa7d548fcec3d7d54bde6ad31439</cbc:UUID>
        <cac:AccountingSupplierParty>
          <cac:Party>
            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>
            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingSupplierParty>
        <cac:AccountingCustomerParty>
          <cac:Party>
            <cbc:Name>Pollos de Engorde S.A.S</cbc:Name>
            <cbc:CompanyID schemeName="13">900123457</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingCustomerParty>
        <cac:LegalMonetaryTotal>
          <cbc:LineExtensionAmount currencyID="COP">100000.00</cbc:LineExtensionAmount>
          <cbc:TaxExclusiveAmount currencyID="COP">19000.00</cbc:TaxExclusiveAmount>
          <cbc:PayableAmount currencyID="COP">119000.00</cbc:PayableAmount>
        </cac:LegalMonetaryTotal>
        ...
        <!-- Aquí irían los ítems, firma digital, etc. -->
      </Invoice>
    ', '<?xml version="1.0" encoding="UTF-8"?>
      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2"
                           xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                           xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
        <cbc:ResponseDate>2025-11-11T12:19:55.374Z</cbc:ResponseDate>
        <cac:DocumentResponse>
          <cac:Response>
            <cbc:ResponseCode>00</cbc:ResponseCode>
            <cbc:Description>Factura FE-009 APROBADA por la DIAN.</cbc:Description>
          </cac:Response>
        </cac:DocumentResponse>
        <cbc:Note>Ambiente: Habilitacion</cbc:Note>
      </ApplicationResponse>
    ', NULL, '13', 'pendiente', NULL, NULL),
	(10, 'default_tenant', 1, 'FE-011', '2025-11-26 14:27:15.885883+00', NULL, '900123456', 'ddfgdfg', 'longasf.6@gmail.com', 'COP', 1000.00, 190.00, 1190.00, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 190, "descripcion": "pollote", "total_con_iva": 1190, "valor_unitario": 1000}]', 'borrador', true, NULL, NULL, NULL, NULL, NULL, '13', 'pendiente', NULL, NULL),
	(11, 'default_tenant', 1, 'FE-012', '2025-11-26 14:27:56.830381+00', '2025-11-11', '900123456', 'AASaS', 'jheison01@gmail.com', 'COP', 10000.00, 1900.00, 11900.00, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 1900, "descripcion": "adssd", "total_con_iva": 11900, "valor_unitario": 10000}]', 'borrador', true, NULL, NULL, NULL, NULL, NULL, '13', 'pendiente', NULL, NULL),
	(12, 'default_tenant', 1, 'FE-013', '2025-11-26 14:29:05.545746+00', '2025-11-11', '900123456', 'ASas', 'cesardavid9@hotmail.com', 'COP', 20000.00, 3800.00, 23800.00, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 3800, "descripcion": "aaaaa", "total_con_iva": 23800, "valor_unitario": 20000}]', 'borrador', true, NULL, NULL, NULL, NULL, NULL, '13', 'pendiente', NULL, NULL),
	(15, 'default_tenant', 1, 'FE-020', '2025-11-26 14:33:20.694596+00', '2025-11-11', '900123456', 'fdgdf', 'tecnicosenantioquiatesa@gmail.com', 'COP', 5454545.00, 1036363.55, 6490908.55, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 1036363.55, "descripcion": "dfgdfg", "total_con_iva": 6490908.55, "valor_unitario": 5454545}]', 'borrador', true, NULL, NULL, NULL, NULL, NULL, '13', 'pendiente', NULL, NULL),
	(16, 'default_tenant', 1, 'FE-N8N', '2025-11-26 14:37:09.649683+00', '2025-11-11', '900123456', 'ASas', 'caegomezco@gmail.com', 'COP', 102225.00, 19422.75, 121647.75, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 19422.75, "descripcion": "pollote", "total_con_iva": 121647.75, "valor_unitario": 102225}]', 'borrador', true, NULL, NULL, NULL, NULL, NULL, '13', 'pendiente', NULL, NULL),
	(17, 'default_tenant', 1, 'FE-TEST', '2025-11-27 11:25:14.492271+00', '2025-11-27', '1028120088', 'Abogados', 'abogadosencolombiasas@gmail.com', 'COP', 100000.00, 19000.00, 119000.00, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 19000, "descripcion": "Libro", "total_con_iva": 119000, "valor_unitario": 100000}]', 'borrador', true, NULL, NULL, NULL, NULL, NULL, '13', 'pendiente', NULL, NULL),
	(18, 'default_tenant', 1, 'FE-N8N2', '2025-11-27 11:27:08.386178+00', '2025-11-27', '900123456', 'Abogados en Colombia SAS', 'abogadosencolombiasas@gmail.com', 'COP', 20000.00, 3800.00, 23800.00, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 3800, "descripcion": "PAPEL x 500", "total_con_iva": 23800, "valor_unitario": 20000}]', 'borrador', true, NULL, NULL, NULL, NULL, NULL, '31', 'pendiente', NULL, NULL),
	(19, 'default_tenant', 1, 'FE-N8N3', '2025-11-27 11:34:58.675547+00', '2025-11-27', '900123456', 'ddfgdfg', 'longasf.6@gmail.com', 'COP', 16000.00, 3040.00, 19040.00, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 3040, "descripcion": "pollote", "total_con_iva": 19040, "valor_unitario": 16000}]', 'borrador', true, NULL, NULL, NULL, NULL, NULL, '13', 'pendiente', NULL, NULL),
	(20, 'default_tenant', 1, 'FE-N8N4', '2025-11-27 12:26:49.737277+00', '2025-11-11', '565565A', 'S.A.S', 'abogadosencolombiasas@gmail.com', 'COP', 21000.00, 3990.00, 24990.00, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 3990, "descripcion": "pene", "total_con_iva": 24990, "valor_unitario": 21000}]', 'borrador', true, NULL, NULL, NULL, NULL, NULL, '31', 'pendiente', NULL, NULL),
	(21, 'default_tenant', 1, 'GROKSITO', '2025-11-27 12:29:13.984926+00', NULL, '900123456', 'pe', 'tecnicosenantioquiatesa@gmail.com', 'COP', 100000.00, 19000.00, 119000.00, '[{"cantidad": 1, "iva_tasa": 19, "total_iva": 19000, "descripcion": "pollote", "total_con_iva": 119000, "valor_unitario": 100000}]', 'borrador', true, NULL, NULL, NULL, NULL, NULL, '31', 'pendiente', NULL, NULL);


--
-- Data for Name: inversiones_extranjeras; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."inversiones_extranjeras" ("id", "tenant_id", "creado_por_user_id", "nombre_inversionista_extranjero", "id_inversionista", "pais_origen", "fecha_inversion", "monto_inversion", "moneda_inversion", "monto_equivalente_cop", "estado_reporte", "fecha_creacion") VALUES
	(1, 'default_tenant', 1, 'Global Investments Inc.', 'INV-G-5001', 'USA', '2024-11-10', 50000.0000, 'USD', 205000000.0000, 'reportado', '2025-11-14 13:29:52.23599+00'),
	(2, 'default_tenant', 1, 'Pollos de Engorde', '1234567844', 'USA', '2025-11-14', 50.0000, 'USD', 200000.0000, 'reportado', '2025-11-14 14:29:16.920711+00'),
	(3, 'default_tenant', 1, 'Pollos de Engorde', '123456784', 'USA', '2025-11-15', 100000.0000, 'USD', 100000000.0000, 'reportado', '2025-11-14 14:36:45.16606+00'),
	(6, 'default_tenant', 1, 'Pollos de Engorde', '1234567844', 'USA', '2025-11-14', 12345.0000, 'JPY', 12345.0000, 'reportado', '2025-11-14 14:43:45.495044+00'),
	(7, 'default_tenant', 1, 'Pollos de Engorde', '1234567844', 'USA', '2025-11-14', 564.0000, 'USD', 46554654.0000, 'reportado', '2025-11-14 15:06:53.214818+00'),
	(8, 'default_tenant', 1, 'Pollos de Engorde', '123789465', 'QAT', '2025-11-15', 50000.0000, 'USD', 2000.0000, 'reportado', '2025-11-15 12:38:19.051778+00'),
	(4, 'default_tenant', 1, 'Pollos de Engorde', '1234567844', 'USA', '2025-11-14', 123.0000, 'EUR', 123.0000, 'reportado', '2025-11-14 14:38:39.292898+00'),
	(5, 'default_tenant', 1, 'Pollos de Engorde', '1234567844', 'USA', '2025-11-14', 12345.0000, 'CAD', 12345.0000, 'reportado', '2025-11-14 14:38:49.77177+00');


--
-- Data for Name: iso_auditorias; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."iso_auditorias" ("id", "tenant_id", "creado_por_user_id", "nombre_auditoria", "tipo_auditoria", "fecha_programada", "fecha_ejecucion", "auditor_lider", "alcance", "estado", "created_at", "fecha_ejecucion_inicio", "fecha_ejecucion_fin", "equipo_auditor", "objetivos", "documento_informe_id") VALUES
	(1, 'default_tenant', 1, 'A120', 'INTERNA', '2025-11-25', NULL, 'OWO', NULL, 'PLANIFICADA', '2025-11-24 11:56:46.190659+00', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: iso_controles; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."iso_controles" ("id", "tenant_id", "codigo", "nombre", "descripcion", "es_aplicable", "justificacion_exclusion", "estado_implementacion", "created_at", "categoria", "responsable_implementacion_id", "updated_at") VALUES
	(4, 'default_tenant', 'A.5.4', 'Responsabilidades de la dirección', 'La dirección debe exigir a todo el personal que aplique la seguridad de la información de acuerdo con las políticas y procedimientos.', true, NULL, 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Organizacional', NULL, '2025-11-24 11:51:23.497097+00'),
	(5, 'default_tenant', 'A.5.7', 'Inteligencia de amenazas', 'La información sobre las amenazas a la seguridad de la información debe recopilarse y analizarse para producir inteligencia de amenazas.', true, NULL, 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Organizacional', NULL, '2025-11-24 11:51:23.497097+00'),
	(6, 'default_tenant', 'A.6.1', 'Selección del personal', 'La verificación de antecedentes de todos los candidatos a un empleo debe llevarse a cabo antes de unirse a la organización.', true, NULL, 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Personas', NULL, '2025-11-24 11:51:23.497097+00'),
	(7, 'default_tenant', 'A.6.3', 'Concienciación, educación y formación', 'El personal de la organización y las partes interesadas pertinentes deben recibir una concienciación, educación y formación adecuadas.', true, NULL, 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Personas', NULL, '2025-11-24 11:51:23.497097+00'),
	(8, 'default_tenant', 'A.7.1', 'Perímetros de seguridad física', 'Los perímetros de seguridad deben definirse y utilizarse para proteger las áreas que contienen información sensible y crítica.', true, NULL, 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Físico', NULL, '2025-11-24 11:51:23.497097+00'),
	(9, 'default_tenant', 'A.8.1', 'Dispositivos de punto final de usuario', 'La información almacenada, procesada o transmitida en dispositivos de punto final de usuario debe estar protegida.', true, NULL, 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Tecnológico', NULL, '2025-11-24 11:51:23.497097+00'),
	(10, 'default_tenant', 'A.8.2', 'Derechos de acceso privilegiado', 'La asignación y el uso de los derechos de acceso privilegiado deben restringirse y gestionarse estrictamente.', true, NULL, 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Tecnológico', NULL, '2025-11-24 11:51:23.497097+00'),
	(12, 'default_tenant', 'A.8.4', 'Acceso al código fuente', 'El acceso de lectura y escritura al código fuente, las herramientas de desarrollo y las bibliotecas de software debe gestionarse adecuadamente.', true, NULL, 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Tecnológico', NULL, '2025-11-24 11:51:23.497097+00'),
	(13, 'default_tenant', 'A.8.8', 'Gestión de vulnerabilidades técnicas', 'Se debe obtener información sobre las vulnerabilidades técnicas de los sistemas de información en uso y evaluar la exposición.', true, NULL, 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Tecnológico', NULL, '2025-11-24 11:51:23.497097+00'),
	(14, 'default_tenant', 'A.8.25', 'Ciclo de vida de desarrollo seguro', 'Se deben establecer reglas para el desarrollo seguro de software y sistemas.', true, NULL, 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Tecnológico', NULL, '2025-11-24 11:51:23.497097+00'),
	(15, 'default_tenant', 'A.8.28', 'Codificación segura', 'Los principios de codificación segura deben aplicarse al desarrollo de software.', true, NULL, 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Tecnológico', NULL, '2025-11-24 11:51:23.497097+00'),
	(1, 'default_tenant', 'A.5.1', 'Políticas para la seguridad de la información', 'Las políticas de seguridad de la información y las reglas específicas del tema deben ser definidas, aprobadas por la dirección, publicadas y comunicadas.', true, 'Nomas', 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Organizacional', NULL, '2025-11-24 11:51:23.497097+00'),
	(2, 'default_tenant', 'A.5.2', 'Roles y responsabilidades de seguridad de la información', 'Los roles y responsabilidades de seguridad de la información deben definirse y asignarse de acuerdo con las necesidades de la organización.', true, NULL, 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Organizacional', NULL, '2025-11-24 11:51:23.497097+00'),
	(11, 'default_tenant', 'A.8.3', 'Restricción de acceso a la información', 'El acceso a la información y a las funciones de los sistemas de aplicaciones debe restringirse de acuerdo con la política de control de acceso.', true, NULL, 'IMPLEMENTADO', '2025-11-24 11:51:23.497097+00', 'Tecnológico', NULL, '2025-11-24 12:44:38.214082+00'),
	(3, 'default_tenant', 'A.5.3', 'Segregación de funciones', 'Las funciones conflictivas y las áreas de responsabilidad conflictivas deben segregarse.', true, NULL, 'NO_INICIADO', '2025-11-24 11:51:23.497097+00', 'Organizacional', NULL, '2025-11-24 12:50:38.093961+00');


--
-- Data for Name: iso_hallazgos; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."iso_hallazgos" ("id", "tenant_id", "auditoria_id", "control_iso_id", "descripcion", "tipo_hallazgo", "accion_correctiva", "responsable_id", "fecha_compromiso", "estado", "evidencia_cierre_url", "created_at", "descripcion_hallazgo", "analisis_causa_raiz", "fecha_cierre", "evidencia_cierre") VALUES
	(1, 'default_tenant', 1, 1, 'opipipo', 'OBSERVACION', 'klllllllllllllllllllllllllllllll', 2, '2025-11-24', 'CERRADO', '/uploads/iso/1763990863838_Screenshot_5.png', '2025-11-24 13:27:21.51284+00', NULL, NULL, '2025-11-24 13:27:43.846+00', 'pe');


--
-- Data for Name: kyc_logs; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."kyc_logs" ("id", "user_id", "document_url", "ip_address", "geo_location", "status", "created_at") VALUES
	('fac1ea27-8866-440b-a3e2-2d9fe7e58879', 9, 'https://nrrgqajzlpaqpnnkckzy.supabase.co/storage/v1/object/public/kyc/1765290318467_cedula-contadores.png', '::1', '{"accuracy": 2450.572506515651, "latitude": 6.2757745, "longitude": -75.580784}', 'pending', '2025-12-09 14:25:18.99612+00'),
	('8ea0acac-6c83-4026-a145-ea2a8ed09365', 10, 'https://nrrgqajzlpaqpnnkckzy.supabase.co/storage/v1/object/public/kyc/1765290914255_default_tenant_casos_eticos_d364d15b-7d00-46fd-973b-cecdb801da4b_1764417353921-cedula-contadores_(1).png', '::1', '{"accuracy": 2450.572506515651, "latitude": 6.2757745, "longitude": -75.580784}', 'pending', '2025-12-09 14:35:15.028591+00');


--
-- Data for Name: movimientos_caja; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."movimientos_caja" ("id", "tenant_id", "fecha", "tipo_movimiento", "monto", "moneda", "descripcion", "referencia_factura_id", "referencia_orden_pago_id", "cuenta_bancaria_id", "referencia_pasarela", "conciliado", "fecha_creacion") VALUES
	(4, 'default_tenant', '2025-12-18 00:00:00+00', 'egreso', 120000.0000, 'COP', 'PAGO SERVICIO INTERNET', NULL, NULL, 1, 'TX-MATCH-004', false, '2025-12-10 14:14:17.186736+00'),
	(5, 'default_tenant', '2025-12-20 00:00:00+00', 'ingreso', 5000000.0000, 'COP', 'INVERSION SOCIO A', NULL, NULL, 1, 'TX-MATCH-005', false, '2025-12-10 14:14:17.186736+00'),
	(10, 'default_tenant', '2025-12-12 00:00:00+00', 'egreso', 50000.0000, 'COP', 'COMPRA INSUMOS OFICINA', NULL, NULL, NULL, NULL, false, '2025-12-10 14:54:02.360247+00'),
	(11, 'default_tenant', '2025-12-13 00:00:00+00', 'ingreso', 3200500.5000, 'COP', 'TRANSFERENCIA ENTRANTE', NULL, NULL, NULL, NULL, false, '2025-12-10 14:54:02.360247+00'),
	(9, 'default_tenant', '2025-12-11 00:00:00+00', 'ingreso', 1500000.0000, 'COP', 'PAGO CLIENTE FACT-001', NULL, NULL, NULL, NULL, true, '2025-12-10 14:54:02.360247+00'),
	(12, 'default_tenant', '2026-01-05 07:27:52.581+00', 'egreso', 7487.4800, 'COP', 'GASTO OPERATIVO 9', NULL, NULL, 1, '81b19d7a-1367-47f6-a9c2-a29a5e73cf03', true, '2025-12-10 15:05:37.434274+00'),
	(13, 'default_tenant', '2025-12-11 12:44:13.749639+00', 'egreso', 9999999.0000, 'COP', 'Pago servicios varios urgente', NULL, NULL, NULL, NULL, false, '2025-12-11 12:44:13.749639+00'),
	(14, 'default_tenant', '2025-12-11 11:44:13.749639+00', 'egreso', 4500000.0000, 'COP', 'Consultoría externa', NULL, NULL, NULL, NULL, false, '2025-12-11 12:44:13.749639+00'),
	(15, 'default_tenant', '2025-12-11 12:44:13.749639+00', 'egreso', 4500000.0000, 'COP', 'Consultoria externa pago 2', NULL, NULL, NULL, NULL, false, '2025-12-11 12:44:13.749639+00'),
	(16, 'default_tenant', '2025-12-11 12:44:13.749639+00', 'ingreso', 150000.0000, 'COP', 'Venta mostrador #123', NULL, NULL, NULL, NULL, false, '2025-12-11 12:44:13.749639+00');


--
-- Data for Name: postmortems; Type: TABLE DATA; Schema: core; Owner: postgres
--



--
-- Data for Name: preferencias_contacto; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."preferencias_contacto" ("id", "user_id", "tenant_id", "canal", "finalidad", "autorizado", "fecha_actualizacion", "ip_origen") VALUES
	(1, 1, 'default_tenant', 'EMAIL', 'MARKETING', false, '2025-11-20 15:39:43.54574+00', '::1'),
	(3, 1, 'default_tenant', 'TELEFONO', 'MARKETING', false, '2025-11-20 15:39:44.38366+00', '::1'),
	(6, 1, 'default_tenant', 'EMAIL', 'FINANCIERO', true, '2025-11-20 15:39:45.76384+00', '::1'),
	(5, 1, 'default_tenant', 'WHATSAPP', 'MARKETING', false, '2025-11-20 15:39:46.495043+00', '::1');


--
-- Data for Name: presupuestos; Type: TABLE DATA; Schema: core; Owner: postgres
--



--
-- Data for Name: reportes_dcin; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."reportes_dcin" ("id", "tenant_id", "inversion_id", "entidad_regulatoria", "tipo_reporte", "periodo_reportado", "fecha_generacion", "generado_por_user_id", "estado", "storage_path_reporte", "hash_reporte", "fecha_envio", "trace_id_envio", "respuesta_entidad") VALUES
	(1, 'default_tenant', 1, 'Banco de la República', 'DCIN 83', '2024-11-10', '2025-11-14 13:31:10.278785+00', 1, 'ENVIADO', 'default_tenant\reportes_dcin\DCIN83_1_1763127070276.xml', '00c00fb615fdac6b5e7e3b3d08aa2a4019cdd18b659d463be71f62b654df545a', '2025-11-14 13:52:12.860892+00', '7aeea201-806c-4c29-98d8-34d5c5690bc9', '{"message": "Recibido exitosamente por el Banco de la República.", "traceId": "7aeea201-806c-4c29-98d8-34d5c5690bc9", "radicado": "BR-RAD-1763128332860"}'),
	(4, 'default_tenant', 6, 'Banco de la República', 'DCIN 83', '2025-11-14', '2025-11-14 14:43:53.065529+00', 1, 'ENVIADO', 'default_tenant\reportes_dcin\DCIN83_6_1763131433063.xml', 'f6bf00bf4c1a3d80a2586f6c9fe61ecd491d090856021cd9c7b2b2811f12626f', '2025-11-14 15:06:22.000944+00', '7af48443-3cb0-489a-817c-24126cd5edda', '{"message": "Recibido exitosamente por el Banco de la República.", "traceId": "7af48443-3cb0-489a-817c-24126cd5edda", "radicado": "BR-RAD-1763132782000"}'),
	(3, 'default_tenant', 3, 'Banco de la República', 'DCIN 83', '2025-11-15', '2025-11-14 14:36:54.344543+00', 1, 'ENVIADO', 'default_tenant\reportes_dcin\DCIN83_3_1763131014342.xml', '9df1886ebae545332e696bd24f6069ab7ec076f33b29656e944c515149ea8c31', '2025-11-14 15:06:22.001084+00', '9e820368-756b-4a7d-8aab-33fcd0d99aea', '{"message": "Recibido exitosamente por el Banco de la República.", "traceId": "9e820368-756b-4a7d-8aab-33fcd0d99aea", "radicado": "BR-RAD-1763132782000"}'),
	(2, 'default_tenant', 2, 'Banco de la República', 'DCIN 83', '2025-11-14', '2025-11-14 14:30:21.172914+00', 1, 'ENVIADO', 'default_tenant\reportes_dcin\DCIN83_2_1763130621127.xml', 'f4f9c46e230d4b1e1e0eb91274383733662ef9a0f487804d680296336534dc1f', '2025-11-14 15:06:22.05249+00', '4930d631-571e-4140-bf09-2bc82cfe6cac', '{"message": "Recibido exitosamente por el Banco de la República.", "traceId": "4930d631-571e-4140-bf09-2bc82cfe6cac", "radicado": "BR-RAD-1763132782051"}'),
	(5, 'default_tenant', 7, 'Banco de la República', 'DCIN 83', '2025-11-14', '2025-11-14 15:07:04.294218+00', 1, 'ENVIADO', 'default_tenant\reportes_dcin\DCIN83_7_1763132824291.xml', 'b94a2caeb4570b6a51ae87c97b6235a8ef00daa3720584770ddecf1ae2930fc2', '2025-11-14 15:07:07.584878+00', '81ea7fce-a3ba-455f-b61d-48c6f4a27d59', '{"message": "Recibido exitosamente por el Banco de la República.", "traceId": "81ea7fce-a3ba-455f-b61d-48c6f4a27d59", "radicado": "BR-RAD-1763132827584"}'),
	(6, 'default_tenant', 8, 'Banco de la República', 'DCIN 83', '2025-11-15', '2025-11-15 12:38:32.165365+00', 1, 'GENERADO', 'default_tenant\reportes_dcin\DCIN83_8_1763210312162.xml', '638c6f0de72240ca229d2d32f96dab6bb3e33fb6de4065e1e6020cde7affb6d7', NULL, NULL, NULL),
	(7, 'default_tenant', 4, 'Banco de la República', 'DCIN 83', '2025-11-14', '2025-11-15 12:38:38.628355+00', 1, 'GENERADO', 'default_tenant\reportes_dcin\DCIN83_4_1763210318626.xml', '322a9b65c5fcd09909adef35123e4af48d656b2c211225c2ee1f8640f47668b3', NULL, NULL, NULL),
	(8, 'default_tenant', 5, 'Banco de la República', 'DCIN 83', '2025-11-14', '2025-11-15 12:38:44.652168+00', 1, 'GENERADO', 'default_tenant\reportes_dcin\DCIN83_5_1763210324650.xml', '260beb77b413ba4a0c865336de2b0e4033a2aa84e11519703b1d64f46da1147d', NULL, NULL, NULL);


--
-- Data for Name: reportes_regulatorios; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."reportes_regulatorios" ("id", "tenant_id", "balance_financiero_id", "entidad_regulatoria", "tipo_reporte", "periodo_reportado", "fecha_generacion", "generado_por_user_id", "estado", "storage_path_reporte", "hash_reporte", "fecha_envio", "trace_id_envio", "respuesta_entidad") VALUES
	(5, 'default_tenant', 6, 'Superfinanciera', '42-Empresarial', '2025-10-31', '2025-11-12 15:14:53.863711+00', NULL, 'GENERADO', 'default_tenant\reportes_regulatorios\reporte_Superfinanciera_42-Empresarial_6_1762960493861.xml', '23540b5fffca1472f09b635eba71d9d67edd9bb03abc012b029fc7b3a134cf17', NULL, NULL, NULL);


--
-- Data for Name: riesgos; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."riesgos" ("id", "dominio", "riesgo", "probabilidad", "impacto", "owner", "control", "estado", "fecha") VALUES
	(3, 'Legal', 'Incumplimiento de la Ley 1581 de 2012 (Habeas Data) por registro de consentimiento defectuoso, resultando en posibles sanciones millonarias por parte de la SIC.', 4, 5, 'Abogado Admin', 'Implementar registro granular en core.consent_log (IP, fecha, versión, finalidad) y auditoría trimestral de la API de registro.', 'mitigando', '2025-10-15 09:00:00'),
	(4, 'Seguridad', 'Acceso no autorizado a la base de datos de producción (RDS).', 5, 5, 'Equipo DevSecOps', 'Implementar Zero Trust, MFA obligatorio para roles admin y microsegmentación de red en AWS VPC.', 'abierto', '2025-11-01 10:30:00'),
	(5, 'IA', 'Sesgo en el modelo de IA (AI Manager) que discrimina en la aprobación de franquicias.', 3, 4, 'Comité de Ética IA', 'Implementar fairness index >= 0.85, reentrenamiento cada 90 días y mecanismo de veto humano (CHR) según la Etapa 4 del documento.', 'mitigando', '2025-09-20 14:00:00'),
	(6, 'Finanzas', 'Error menor en la conciliación bancaria automática NIIF.', 2, 1, 'Contador Jr.', 'Ajuste manual realizado. Se actualizó el workflow de n8n (wf_conciliacion.json) para manejar la nueva nomenclatura del extracto.', 'cerrado', '2025-08-05 11:00:00'),
	(7, 'Infraestructura', 'Fallo del proveedor de AWS en la región sa-east-1 (Sao Paulo).', 1, 5, 'Equipo SRE', 'Plan de Continuidad (BCP/DRP) con RTO < 1h y RPO < 15 min. Failover automático a us-east-1 (N. Virginia) validado trimestralmente.', 'cerrado', '2025-10-01 08:00:00'),
	(8, 'Franquicias', 'Bajo cumplimiento de SLA (<90%) en una franquicia de México.', 3, 3, 'Gerente Expansión', 'Auditoría automática de Governance AI (wf_auditoria_franquicia.json) y generación de plan de mejora.', 'abierto', '2025-11-05 15:00:00'),
	(10, 'Legal', 'Fallo en el reporte automático de operaciones sospechosas (ROS) a la UIAF.', 4, 4, 'Abogado Admin', 'Revisar workflow de Finance AI. Asegurar que todas las transacciones > 10.000 USD generen alerta inmediata y se registren en core.aml_log.', 'abierto', '2025-11-07 07:00:00'),
	(11, 'IA', 'Tasa de error del modelo de predicción financiera > 15% (drift).', 3, 3, 'AI Manager', 'Reentrenamiento automático activado y validado por Governance AI.', 'cerrado', '2025-10-28 17:00:00'),
	(9, 'Seguridad', 'Vulnerabilidad crítica (CVE-2025-XXXX) detectada en una dependencia de Node.js (npm package) que permite RCE. Vulnerabilidad crítica (CVE-2025-XXXX) detectada en una dependencia de Node.js (npm package) que permite RCE.Vulnerabilidad crítica (CVE-2025-XXXX) detectada en una dependencia de Node.js (npm package) que permite RCE.Vulnerabilidad crítica (CVE-2025-XXXX) detectada en una dependencia de Node.js (npm package) que permite RCE.Vulnerabilidad crítica (CVE-2025-XXXX) detectada en una dependencia de Node.js (npm package) que permite RCE.', 5, 5, 'Equipo DevSecOps', 'Ejecución de pipeline DevSecOps con SAST/DAST (SonarQube) y escaneo de SBOM. Parche de emergencia desplegado en 72h (SLA de vulnerabilidades críticas).', 'mitigando', '2025-11-06 12:00:00');


--
-- Data for Name: riesgos_contables; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."riesgos_contables" ("id", "tenant_id", "titulo", "descripcion", "categoria_niif", "nivel_confianza_ia", "explicacion_ia", "estado", "datos_relacionados", "fecha_deteccion", "validado_por_user_id", "comentarios_revisor", "fecha_validacion") VALUES
	(2, 'default_tenant', 'Ingreso sin referencia de cuenta bancaria ni factura', 'El registro de ''ingreso'' de caja/mostrador carece de un ID de factura asociado y de una cuenta bancaria/caja de destino. Esto dificulta la conciliación del efectivo o la verificación del cumplimiento de NIIF 15 (Trazabilidad de ingresos).', 'Trazabilidad de Ingresos (NIIF 15)', 0.80, 'El registro de ''ingreso'' de caja/mostrador carece de un ID de factura asociado y de una cuenta bancaria/caja de destino. Esto dificulta la conciliación del efectivo o la verificación del cumplimiento de NIIF 15 (Trazabilidad de ingresos).', 'DETECTADO', '{"movimiento_id": 16}', '2025-12-11 12:55:23.80054+00', NULL, NULL, NULL),
	(3, 'default_tenant', 'Monto sospechoso y falta de documentación', 'Egreso por un monto elevado (9,999,999) con una descripción vaga ("servicios varios urgente"). Carece de referencias de factura, orden de pago y cuenta bancaria, lo que incumple los controles internos y las NIIF (IAS 1 y IAS 8) en cuanto a la documentación de transacciones.', 'Control Interno y Documentación', 0.90, 'Egreso por un monto elevado (9,999,999) con una descripción vaga ("servicios varios urgente"). Carece de referencias de factura, orden de pago y cuenta bancaria, lo que incumple los controles internos y las NIIF (IAS 1 y IAS 8) en cuanto a la documentación de transacciones.', 'DETECTADO', '{"movimiento_id": 13}', '2025-12-11 12:55:23.82676+00', NULL, NULL, NULL),
	(1, 'default_tenant', 'Transacción de ingreso sin referencias de soporte', 'El registro de un ingreso significativo (3,2 millones COP) carece de referencias críticas como el ''referencia_factura_id'' y el ''cuenta_bancaria_id''. Esto dificulta la trazabilidad de la transacción, la verificación de la fuente de los fondos (IFRS 9) y la validación de la existencia de un ingreso devengado (IFRS 15). Indica una debilidad en los controles internos de registro.', 'Trazabilidad de Ingresos y Control Interno (IFRS 15, IFRS 9)', 85.00, 'El registro de un ingreso significativo (3,2 millones COP) carece de referencias críticas como el ''referencia_factura_id'' y el ''cuenta_bancaria_id''. Esto dificulta la trazabilidad de la transacción, la verificación de la fuente de los fondos (IFRS 9) y la validación de la existencia de un ingreso devengado (IFRS 15). Indica una debilidad en los controles internos de registro.', 'DETECTADO', '{"movimiento_id": 11}', '2025-12-11 12:55:23.827375+00', NULL, NULL, NULL),
	(5, 'default_tenant', 'Egreso sin documentación de soporte NIIF', 'El egreso de 4,500,000 COP carece de referencias clave (factura_id, orden_pago_id, cuenta_bancaria_id) y tiene una fecha futura (2025). Esta falta de documentación contraviene los principios de fiabilidad en la medición y el control interno NIIF, sugiriendo un posible fraude o error de registro. La ausencia de una factura de soporte dificulta la verificación de la obligación de pago y su reconocimiento.', 'Reconocimiento de Transacciones', 0.90, 'El egreso de 4,500,000 COP carece de referencias clave (factura_id, orden_pago_id, cuenta_bancaria_id) y tiene una fecha futura (2025). Esta falta de documentación contraviene los principios de fiabilidad en la medición y el control interno NIIF, sugiriendo un posible fraude o error de registro. La ausencia de una factura de soporte dificulta la verificación de la obligación de pago y su reconocimiento.', 'DETECTADO', '{"movimiento_id": 14}', '2025-12-11 12:55:23.82747+00', NULL, NULL, NULL),
	(4, 'default_tenant', 'Egreso sin soporte documental', 'El egreso carece de referencias de factura, orden de pago y cuenta bancaria. Esto representa una debilidad crítica de control interno y riesgo de fraude por egresos ficticios.', 'Control Interno y Evidencia Documental', 0.90, 'El egreso carece de referencias de factura, orden de pago y cuenta bancaria. Esto representa una debilidad crítica de control interno y riesgo de fraude por egresos ficticios.', 'DETECTADO', '{"movimiento_id": 10}', '2025-12-11 12:55:23.808586+00', NULL, NULL, NULL),
	(7, 'default_tenant', 'Egreso sin referencia de factura ni orden de pago', 'El egreso por un monto significativo (4.5M COP) carece de referencias clave como la ''referencia_factura_id'' y la ''referencia_orden_pago_id''. Esto incumple los controles internos básicos, dificultando la trazabilidad y verificación del gasto. Representa un alto riesgo de error contable o posible fraude, ya que no se puede validar la existencia de la obligación ni el destino del pago.', 'Verificabilidad y Control Interno (Marco Conceptual)', 90.00, 'El egreso por un monto significativo (4.5M COP) carece de referencias clave como la ''referencia_factura_id'' y la ''referencia_orden_pago_id''. Esto incumple los controles internos básicos, dificultando la trazabilidad y verificación del gasto. Representa un alto riesgo de error contable o posible fraude, ya que no se puede validar la existencia de la obligación ni el destino del pago.', 'DETECTADO', '{"movimiento_id": 15}', '2025-12-11 12:55:23.799895+00', NULL, NULL, NULL),
	(6, 'default_tenant', 'Egreso sin soporte documental (Factura/Orden de Pago)', 'La transacción de egreso no tiene asociada ninguna referencia de factura (referencia_factura_id: null) ni orden de pago (referencia_orden_pago_id: null). Esto representa una deficiencia crítica en los controles internos de pago, impidiendo la validación del gasto y aumentando el riesgo de fraude o error en el registro contable, ya que no se puede verificar la legitimidad ni el monto de la obligación.', 'Control Interno y Fiabilidad de la Información (NIIF 1)', 0.90, 'La transacción de egreso no tiene asociada ninguna referencia de factura (referencia_factura_id: null) ni orden de pago (referencia_orden_pago_id: null). Esto representa una deficiencia crítica en los controles internos de pago, impidiendo la validación del gasto y aumentando el riesgo de fraude o error en el registro contable, ya que no se puede verificar la legitimidad ni el monto de la obligación.', 'DETECTADO', '{"movimiento_id": 4}', '2025-12-11 12:55:23.891332+00', NULL, NULL, NULL),
	(8, 'default_tenant', 'Falta de documentación de respaldo para inversión de socio', 'Transacción de alto valor (5,000,000 COP) descrita como "INVERSION SOCIO A" (transacción con parte relacionada). La ausencia de referencias a documentos legales como contratos de capitalización o acuerdos de préstamo (null en `referencia_factura_id` y `referencia_orden_pago_id`) dificulta la correcta clasificación NIIF entre patrimonio (IAS 32) y pasivo financiero (IFRS 9), constituyendo una debilidad de control interno y riesgo de clasificación.', 'IAS 24 / IAS 32', 4.00, 'Transacción de alto valor (5,000,000 COP) descrita como "INVERSION SOCIO A" (transacción con parte relacionada). La ausencia de referencias a documentos legales como contratos de capitalización o acuerdos de préstamo (null en `referencia_factura_id` y `referencia_orden_pago_id`) dificulta la correcta clasificación NIIF entre patrimonio (IAS 32) y pasivo financiero (IFRS 9), constituyendo una debilidad de control interno y riesgo de clasificación.', 'DETECTADO', '{"movimiento_id": 5}', '2025-12-11 12:55:23.894885+00', NULL, NULL, NULL),
	(9, 'default_tenant', 'Egreso sin soporte documental', 'El egreso carece de referencias de factura, orden de pago y cuenta bancaria. Esto representa una debilidad crítica de control interno y riesgo de fraude por egresos ficticios.', 'Control Interno y Evidencia Documental', 0.90, 'El egreso carece de referencias de factura, orden de pago y cuenta bancaria. Esto representa una debilidad crítica de control interno y riesgo de fraude por egresos ficticios.', 'DETECTADO', '{"movimiento_id": 10}', '2025-12-11 13:02:49.397531+00', NULL, NULL, NULL),
	(10, 'default_tenant', 'Egreso sin documentación de soporte NIIF', 'El egreso de 4,500,000 COP carece de referencias clave (factura_id, orden_pago_id, cuenta_bancaria_id) y tiene una fecha futura (2025). Esta falta de documentación contraviene los principios de fiabilidad en la medición y el control interno NIIF, sugiriendo un posible fraude o error de registro. La ausencia de una factura de soporte dificulta la verificación de la obligación de pago y su reconocimiento.', 'Reconocimiento de Transacciones', 0.90, 'El egreso de 4,500,000 COP carece de referencias clave (factura_id, orden_pago_id, cuenta_bancaria_id) y tiene una fecha futura (2025). Esta falta de documentación contraviene los principios de fiabilidad en la medición y el control interno NIIF, sugiriendo un posible fraude o error de registro. La ausencia de una factura de soporte dificulta la verificación de la obligación de pago y su reconocimiento.', 'DETECTADO', '{"movimiento_id": 14}', '2025-12-11 13:02:49.397713+00', NULL, NULL, NULL),
	(11, 'default_tenant', 'Egreso sin soporte documental (Factura/Orden de Pago)', 'La transacción de egreso no tiene asociada ninguna referencia de factura (referencia_factura_id: null) ni orden de pago (referencia_orden_pago_id: null). Esto representa una deficiencia crítica en los controles internos de pago, impidiendo la validación del gasto y aumentando el riesgo de fraude o error en el registro contable, ya que no se puede verificar la legitimidad ni el monto de la obligación.', 'Control Interno y Fiabilidad de la Información (NIIF 1)', 0.90, 'La transacción de egreso no tiene asociada ninguna referencia de factura (referencia_factura_id: null) ni orden de pago (referencia_orden_pago_id: null). Esto representa una deficiencia crítica en los controles internos de pago, impidiendo la validación del gasto y aumentando el riesgo de fraude o error en el registro contable, ya que no se puede verificar la legitimidad ni el monto de la obligación.', 'DETECTADO', '{"movimiento_id": 4}', '2025-12-11 13:02:49.419167+00', NULL, NULL, NULL),
	(12, 'default_tenant', 'Egreso sin referencia de factura ni orden de pago', 'El egreso por un monto significativo (4.5M COP) carece de referencias clave como la ''referencia_factura_id'' y la ''referencia_orden_pago_id''. Esto incumple los controles internos básicos, dificultando la trazabilidad y verificación del gasto. Representa un alto riesgo de error contable o posible fraude, ya que no se puede validar la existencia de la obligación ni el destino del pago.', 'Verificabilidad y Control Interno (Marco Conceptual)', 90.00, 'El egreso por un monto significativo (4.5M COP) carece de referencias clave como la ''referencia_factura_id'' y la ''referencia_orden_pago_id''. Esto incumple los controles internos básicos, dificultando la trazabilidad y verificación del gasto. Representa un alto riesgo de error contable o posible fraude, ya que no se puede validar la existencia de la obligación ni el destino del pago.', 'DETECTADO', '{"movimiento_id": 15}', '2025-12-11 13:02:49.408937+00', NULL, NULL, NULL),
	(13, 'default_tenant', 'Monto sospechoso y falta de documentación', 'Egreso por un monto elevado (9,999,999) con una descripción vaga ("servicios varios urgente"). Carece de referencias de factura, orden de pago y cuenta bancaria, lo que incumple los controles internos y las NIIF (IAS 1 y IAS 8) en cuanto a la documentación de transacciones.', 'Control Interno y Documentación', 0.90, 'Egreso por un monto elevado (9,999,999) con una descripción vaga ("servicios varios urgente"). Carece de referencias de factura, orden de pago y cuenta bancaria, lo que incumple los controles internos y las NIIF (IAS 1 y IAS 8) en cuanto a la documentación de transacciones.', 'DETECTADO', '{"movimiento_id": 13}', '2025-12-11 13:02:49.427754+00', NULL, NULL, NULL),
	(14, 'default_tenant', 'Transacción de ingreso sin referencias de soporte', 'El registro de un ingreso significativo (3,2 millones COP) carece de referencias críticas como el ''referencia_factura_id'' y el ''cuenta_bancaria_id''. Esto dificulta la trazabilidad de la transacción, la verificación de la fuente de los fondos (IFRS 9) y la validación de la existencia de un ingreso devengado (IFRS 15). Indica una debilidad en los controles internos de registro.', 'Trazabilidad de Ingresos y Control Interno (IFRS 15, IFRS 9)', 85.00, 'El registro de un ingreso significativo (3,2 millones COP) carece de referencias críticas como el ''referencia_factura_id'' y el ''cuenta_bancaria_id''. Esto dificulta la trazabilidad de la transacción, la verificación de la fuente de los fondos (IFRS 9) y la validación de la existencia de un ingreso devengado (IFRS 15). Indica una debilidad en los controles internos de registro.', 'DETECTADO', '{"movimiento_id": 11}', '2025-12-11 13:02:49.437779+00', NULL, NULL, NULL),
	(15, 'default_tenant', 'Falta de documentación de respaldo para inversión de socio', 'Transacción de alto valor (5,000,000 COP) descrita como "INVERSION SOCIO A" (transacción con parte relacionada). La ausencia de referencias a documentos legales como contratos de capitalización o acuerdos de préstamo (null en `referencia_factura_id` y `referencia_orden_pago_id`) dificulta la correcta clasificación NIIF entre patrimonio (IAS 32) y pasivo financiero (IFRS 9), constituyendo una debilidad de control interno y riesgo de clasificación.', 'IAS 24 / IAS 32', 4.00, 'Transacción de alto valor (5,000,000 COP) descrita como "INVERSION SOCIO A" (transacción con parte relacionada). La ausencia de referencias a documentos legales como contratos de capitalización o acuerdos de préstamo (null en `referencia_factura_id` y `referencia_orden_pago_id`) dificulta la correcta clasificación NIIF entre patrimonio (IAS 32) y pasivo financiero (IFRS 9), constituyendo una debilidad de control interno y riesgo de clasificación.', 'DETECTADO', '{"movimiento_id": 5}', '2025-12-11 13:02:49.447374+00', NULL, NULL, NULL),
	(16, 'default_tenant', 'Ingreso sin referencia de cuenta bancaria ni factura', 'El registro de ''ingreso'' de caja/mostrador carece de un ID de factura asociado y de una cuenta bancaria/caja de destino. Esto dificulta la conciliación del efectivo o la verificación del cumplimiento de NIIF 15 (Trazabilidad de ingresos).', 'Trazabilidad de Ingresos (NIIF 15)', 0.80, 'El registro de ''ingreso'' de caja/mostrador carece de un ID de factura asociado y de una cuenta bancaria/caja de destino. Esto dificulta la conciliación del efectivo o la verificación del cumplimiento de NIIF 15 (Trazabilidad de ingresos).', 'DETECTADO', '{"movimiento_id": 16}', '2025-12-11 13:02:49.448157+00', NULL, NULL, NULL);


--
-- Data for Name: rnbd_registros; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."rnbd_registros" ("id", "tenant_id", "numero_radicado", "tipo_novedad", "fecha_registro", "fecha_vencimiento", "estado", "respuesta_sic", "xml_enviado", "created_at") VALUES
	(1, 'CCOL-001', 'SIC-2024-885421', 'INSCRIPCION', '2025-05-05 14:15:11.370463+00', '2025-11-01', 'VENCIDO', '{"status": "ok"}', NULL, '2025-11-21 14:15:11.370463+00'),
	(2, 'FRAN-002', 'SIC-2025-001245', 'RENOVACION', '2025-10-22 14:15:11.370463+00', '2026-04-20', 'RADICADO', '{"status": "ok"}', NULL, '2025-11-21 14:15:11.370463+00'),
	(3, 'default_tenant', 'SIC-PEND-998', 'ACTUALIZACION', '2025-11-20 14:15:11.370463+00', '2026-05-19', 'PENDIENTE', NULL, NULL, '2025-11-21 14:15:11.370463+00'),
	(4, 'CCOL-001', 'SIC-1763735605613-727', 'RENOVACION', '2025-11-21 14:33:25.686419+00', '2026-05-20', 'RADICADO', '{"mensaje": "Radicación exitosa", "radicado": "SIC-1763735605613-727", "timestamp": "2025-11-21T14:33:25.613Z"}', NULL, '2025-11-21 14:33:25.686419+00'),
	(5, 'default_tenant', '36-789456-02', 'RENOVACION', '2025-11-22 12:57:39.95+00', '2026-05-20', 'RADICADO', '{"mensaje": "Registro manual exitoso", "fecha_carga": "2025-11-22T12:57:39.950Z", "url_evidencia": "/uploads/rnbd/1763816259941-_Suplemento_Nutricional_con_Tecnolog_a_...pdf"}', NULL, '2025-11-22 12:57:40.254537+00');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."roles" ("id", "nombre_rol") VALUES
	(1, 'admin'),
	(2, 'superadmin');


--
-- Data for Name: solicitudes_arco; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."solicitudes_arco" ("id", "tenant_id", "user_id", "email_solicitante", "tipo_solicitud", "detalle_solicitud", "estado", "fecha_solicitud", "fecha_limite_respuesta", "fecha_resolucion", "evidencia_respuesta", "responsable_id") VALUES
	(1, 'default_tenant', 1, 'abogadosencolombiasas@gmail.com', 'ACCESO', 'ikp0', 'RESUELTO', '2025-11-21 11:47:46.728504+00', NULL, '2025-11-21 12:35:07.009897+00', '', 1);


--
-- Data for Name: tokenizacion_legal; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."tokenizacion_legal" ("id", "token_id", "inversionista_id", "porcentaje", "valor_inicial", "hash_firma", "registro_cambiario", "fecha", "tipo_red", "estado_blockchain", "tx_hash", "block_number", "contract_address", "token_standard", "documento_legal_id", "cantidad") VALUES
	(8, '4c4ece88-5bee-4445-adbb-1ae79c0908cf', 1, 0.12, 1000.00, '95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce', false, '2025-11-20 09:25:11.404279', 'OFF_CHAIN', 'CONFIRMADO', '0x5e0b60bd0f5766baa47ae49137437d2eb4015fba3afdce6b5b81a15c499e343d', NULL, NULL, 'ERC-1400', 19, 10),
	(9, '7e9df68c-3992-4b9a-8001-24d8d3502128', 4, 0.12, 1000.00, '95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce', false, '2025-11-20 09:25:12.711986', 'OFF_CHAIN', 'CONFIRMADO', '0xe2baf7575b35a41b4f7feccdb58a64179e7c343263da59d2bc57cbda1db30211', NULL, NULL, 'ERC-1400', 19, 10),
	(10, '14ceb454-d68d-4614-b9c7-9f9cdeb5c27e', 6, 0.12, 1000.00, '95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce', false, '2025-11-20 09:25:15.795703', 'OFF_CHAIN', 'CONFIRMADO', '0xa07d60db5476c6dbeca5fddb4c9ed65b4468fc81c5ecf1c547d18e1e7f9e5703', NULL, NULL, 'ERC-1400', 19, 10),
	(11, 'a1b4568b-3d97-4194-85a2-02eb5813ecc6', 5, 0.12, 1000.00, '95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce', false, '2025-11-20 09:25:19.087611', 'OFF_CHAIN', 'CONFIRMADO', '0xa70e95bd9915bdbbd96049dc41155a04ced918e53515906c516db16d74b0067e', NULL, NULL, 'ERC-1400', 19, 10),
	(12, '1db2e35f-7d0f-4485-8b06-bd8bcb85f38a', 1, 0.12, 5000.00, '95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce', false, '2025-11-20 09:25:51.451248', 'OFF_CHAIN', 'CONFIRMADO', '0x060f7b066e7b4f5d1c2616338557973d92c06a10e88fecdcc5226a5c5ea6f709', NULL, NULL, 'ERC-1400', 19, 10),
	(13, '35ba49a4-ed85-463d-896b-79bb760a2f27', 4, 0.12, 5000.00, '95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce', false, '2025-11-20 09:25:53.578987', 'OFF_CHAIN', 'CONFIRMADO', '0x67036bd04534982c44b614ed6f3084de67d805760c0382d108c104a74d8a3d04', NULL, NULL, 'ERC-1400', 19, 10),
	(14, 'c94e84f2-74c3-4011-b2d0-290f770194b9', 1, 50.00, 1000000.00, '95781a0d8bbd81e17a875eeb20c56a5951f5dc6cdc1176efcf3f0ca4eae35bce', false, '2025-11-20 09:37:08.73335', 'OFF_CHAIN', 'CONFIRMADO', '0x2faaad82d194c6d621c2df82e2403fb51ec1d9bd88cec9138716eb00a8f18fe0', NULL, NULL, 'ERC-1400', 19, 8500);


--
-- Data for Name: transacciones_bancarias_externas; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."transacciones_bancarias_externas" ("id", "cuenta_bancaria_id", "pasarela_id_transaccion", "fecha", "descripcion_original", "monto", "conciliado", "movimiento_caja_id") VALUES
	(99, 1, 'TX-MATCH-001', '2025-12-11 00:00:00+00', 'PAGO CLIENTE FACT-001', 1500000.0000, true, 9),
	(83, 1, '81b19d7a-1367-47f6-a9c2-a29a5e73cf03', '2026-01-05 07:27:52.581+00', 'GASTO OPERATIVO 9', -7487.4800, true, 12),
	(81, 1, 'b6111af3-66bb-4831-93f4-23130a40c132', '2026-01-08 17:26:39.156+00', 'INGRESO VARIOS 14', 1817.7900, false, NULL),
	(82, 1, 'b116dd69-1356-4144-9535-77aff4a9e7db', '2026-01-07 04:20:00.063+00', 'GASTO OPERATIVO 3', -2052.8300, false, NULL),
	(84, 1, '38728b9b-9ff2-44ee-b624-1f7ed0954f12', '2026-01-01 20:03:15.647+00', 'INGRESO VARIOS 10', 6598.0200, false, NULL),
	(85, 1, '58f1ef34-e1bb-47ff-9981-e49cb702820c', '2025-12-30 12:44:41.053+00', 'GASTO OPERATIVO 1', -7979.2500, false, NULL),
	(86, 1, '12695843-e062-41f9-b954-59f1c5933435', '2025-12-29 04:28:04.28+00', 'GASTO OPERATIVO 11', -8809.5100, false, NULL),
	(87, 1, '9464610b-fef4-4c39-b4c0-ee1a6af7d2ef', '2025-12-26 21:36:43.483+00', 'INGRESO VARIOS 12', 8998.5600, false, NULL),
	(88, 1, '551f09be-d305-4800-8886-c1b855d1ef56', '2025-12-25 23:03:43.585+00', 'GASTO OPERATIVO 4', -7879.1500, false, NULL),
	(89, 1, 'fb311af6-5b48-4291-98a4-25c727bc5e84', '2025-12-25 15:56:49.55+00', 'GASTO OPERATIVO 13', -3787.4600, false, NULL),
	(90, 1, '30ed4da5-e548-45e2-850d-f1de89cdaae3', '2025-12-23 16:45:15.789+00', 'INGRESO VARIOS 7', 9372.6100, false, NULL),
	(91, 1, 'f13cb3b0-810c-44a9-8429-3057a2b36ace', '2025-12-22 17:16:57.783+00', 'GASTO OPERATIVO 0', -5738.3300, false, NULL),
	(92, 1, 'TX-MATCH-005', '2025-12-20 00:00:00+00', 'INVERSION SOCIO A', 5000000.0000, false, NULL),
	(93, 1, '52fa3a90-753a-4197-8154-3377d6901769', '2025-12-18 19:32:08.646+00', 'INGRESO VARIOS 5', 4989.2900, false, NULL),
	(94, 1, '3070c317-9057-4eb1-900b-88be9e074034', '2025-12-18 17:27:25.972+00', 'INGRESO VARIOS 8', 5966.0400, false, NULL),
	(95, 1, 'TX-MATCH-004', '2025-12-18 00:00:00+00', 'PAGO SERVICIO INTERNET', -120000.0000, false, NULL),
	(96, 1, '3089388a-4579-40a7-ae00-4c161d40afaf', '2025-12-16 18:43:26.602+00', 'GASTO OPERATIVO 2', -2954.2900, false, NULL),
	(97, 1, 'TX-MATCH-003', '2025-12-15 00:00:00+00', 'TRANSFERENCIA ENTRANTE', 3200500.5000, false, NULL),
	(98, 1, 'TX-MATCH-002', '2025-12-12 00:00:00+00', 'COMPRA INSUMOS OFICINA', -50000.0000, false, NULL),
	(100, 1, '6fb3357f-ed40-443e-a43a-bfcc0c637660', '2025-12-10 06:38:58.014+00', 'GASTO OPERATIVO 6', -5310.8800, false, NULL);


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: core; Owner: postgres
--

INSERT INTO "core"."user_roles" ("user_id", "role_id") VALUES
	(2, 1),
	(4, 1),
	(1, 2),
	(1, 1),
	(8, 1),
	(6, 1),
	(9, 1),
	(10, 1);


--
-- Data for Name: test; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('secure-uploads', 'secure-uploads', NULL, '2025-11-25 12:15:18.280083+00', '2025-11-25 12:15:18.280083+00', false, false, NULL, NULL, NULL, 'STANDARD'),
	('kyc', 'kyc', NULL, '2025-12-04 12:11:43.681972+00', '2025-12-04 12:11:43.681972+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") VALUES
	('812db31e-3894-4fe1-a7d2-b696ef393b10', 'secure-uploads', 'default_tenant/1764073223107_soa-iso-27001.pdf', NULL, '2025-11-25 12:20:22.732768+00', '2025-11-25 12:20:22.732768+00', '2025-11-25 12:20:22.732768+00', '{"eTag": "\"2080e9fdbc6405ff5bd0bd6272381bd5\"", "size": 20803, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:20:23.000Z", "contentLength": 20803, "httpStatusCode": 200}', '6c0fffa1-ccb2-48ef-a3ae-9f177edc846e', NULL, '{}', 2),
	('0ee7d180-7fad-4abd-b287-0664dd27ff37', 'secure-uploads', 'default_tenant/casos_eticos/e7e5c916-a842-45e5-9de0-bc8383f613f1/1764424464825-TUTELAACEPTACIONPODERELLETRONICO.docx', NULL, '2025-11-29 13:54:25.195671+00', '2025-11-29 13:54:25.195671+00', '2025-11-29 13:54:25.195671+00', '{"eTag": "\"6676e5ff551ef62929dc48b73b6d1982\"", "size": 283024, "mimetype": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T13:54:26.000Z", "contentLength": 283024, "httpStatusCode": 200}', 'add1fcee-4947-435a-a8e1-f370d9f07194', NULL, '{}', 4),
	('29aa874e-3ca5-4bd3-8426-b2867888dab2', 'secure-uploads', 'default_tenant/casos_eticos/e7e5c916-a842-45e5-9de0-bc8383f613f1/1764424464632-1764424108107-FE-FE-005-Grafica.pdf', NULL, '2025-11-29 13:54:24.896701+00', '2025-11-29 13:54:24.896701+00', '2025-11-29 13:54:24.896701+00', '{"eTag": "\"0cc237a675dd7cac0a5781db5a373116\"", "size": 860, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T13:54:25.000Z", "contentLength": 860, "httpStatusCode": 200}', '7328ea90-1dd2-45d8-bea7-4104aec5a0c2', NULL, '{}', 4),
	('7b4f15dc-81cf-4f03-bf52-0de10751aeb6', 'secure-uploads', 'default_tenant/actas_eticas_resueltas/acta_etica_10_1764424482331.pdf', NULL, '2025-11-29 13:54:42.911806+00', '2025-11-29 13:54:42.911806+00', '2025-11-29 13:54:42.911806+00', '{"eTag": "\"f5693d23e11b81902c8b85f8cce3328f\"", "size": 218117, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T13:54:43.000Z", "contentLength": 218117, "httpStatusCode": 200}', '37c795bf-f0c1-4894-82ae-d984d193885a', NULL, '{}', 3),
	('c30e2343-3286-44b3-9eb2-4629d3a515b7', 'secure-uploads', 'default_tenant/reportes_dcin/DCIN83_3_1763131014342.xml', NULL, '2025-11-25 12:27:14.228859+00', '2025-11-25 12:27:14.228859+00', '2025-11-25 12:27:14.228859+00', '{"eTag": "\"beeb4fdf26d89ea2e49f8bc807bfe913-1\"", "size": 700, "mimetype": "text/xml", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:14.000Z", "contentLength": 700, "httpStatusCode": 200}', '231299ec-8eac-4801-b5fe-7e182831d6dc', NULL, NULL, 3),
	('c4e69f84-394d-4a01-a168-169a3528e47b', 'secure-uploads', 'default_tenant/reportes_dcin/DCIN83_2_1763130621127.xml', NULL, '2025-11-25 12:27:14.234551+00', '2025-11-25 12:27:14.234551+00', '2025-11-25 12:27:14.234551+00', '{"eTag": "\"8e120977c74bf25ea658bf89c00bad03-1\"", "size": 347, "mimetype": "text/xml", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:14.000Z", "contentLength": 347, "httpStatusCode": 200}', '74a23955-2251-42bf-80e6-42d3e277c14d', NULL, NULL, 3),
	('dd70b1b6-15ff-4264-b0ef-d12326ab1d39', 'secure-uploads', 'default_tenant/FE-FE-005-Grafica__1_.pdf', NULL, '2025-11-25 12:27:14.236917+00', '2025-11-25 12:27:14.236917+00', '2025-11-25 12:27:14.236917+00', '{"eTag": "\"415299075393f836a94c03742c8d4fc7-1\"", "size": 860, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:14.000Z", "contentLength": 860, "httpStatusCode": 200}', 'ce12f1f9-79ff-4f90-a6ef-c3f569f715eb', NULL, NULL, 2),
	('ab8c0911-a505-47cf-9d24-f0da336abed2', 'secure-uploads', 'default_tenant/reportes_dcin/DCIN83_4_1763210318626.xml', NULL, '2025-11-25 12:27:14.244822+00', '2025-11-25 12:27:14.244822+00', '2025-11-25 12:27:14.244822+00', '{"eTag": "\"c02131ec1a2c4c82fe1105e015e72804-1\"", "size": 692, "mimetype": "text/xml", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:14.000Z", "contentLength": 692, "httpStatusCode": 200}', 'ca3a55cd-4c95-4cf4-abea-9e0250b0d0ca', NULL, NULL, 3),
	('f62ffdf0-368e-423e-9ce7-8543825b9b8f', 'secure-uploads', 'default_tenant/reportes_dcin/DCIN83_6_1763131433063.xml', NULL, '2025-11-25 12:27:14.265571+00', '2025-11-25 12:27:14.265571+00', '2025-11-25 12:27:14.265571+00', '{"eTag": "\"31f95e5af7716d53ada3e7de754c3026-1\"", "size": 696, "mimetype": "text/xml", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:14.000Z", "contentLength": 696, "httpStatusCode": 200}', '65e93e9d-80ec-4250-8bd1-db955b9ea6fe', NULL, NULL, 3),
	('363f5c43-6080-4d94-aa0f-98b11cc581e5', 'secure-uploads', 'default_tenant/reportes_dcin/DCIN83_5_1763210324650.xml', NULL, '2025-11-25 12:27:14.280193+00', '2025-11-25 12:27:14.280193+00', '2025-11-25 12:27:14.280193+00', '{"eTag": "\"22975897f654fed27de1b7f072ad2487-1\"", "size": 696, "mimetype": "text/xml", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:14.000Z", "contentLength": 696, "httpStatusCode": 200}', '3e404ce4-3ba0-450c-bbc4-ef6ec1a80214', NULL, NULL, 3),
	('6ba8e2e3-c4f7-4735-b176-f9ffcd72ffd6', 'secure-uploads', 'default_tenant/reportes_dcin/DCIN83_1_1763127070276.xml', NULL, '2025-11-25 12:27:14.31376+00', '2025-11-25 12:27:14.31376+00', '2025-11-25 12:27:14.31376+00', '{"eTag": "\"b32843818302c4d210faf8e1f89fb29f-1\"", "size": 353, "mimetype": "text/xml", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:14.000Z", "contentLength": 353, "httpStatusCode": 200}', '5e607a84-96d1-4f8e-8bd7-7c5ce7270382', NULL, NULL, 3),
	('a586401b-5581-4509-a841-b7b6a0983529', 'secure-uploads', 'default_tenant/reportes_dcin/DCIN83_7_1763132824291.xml', NULL, '2025-11-25 12:27:14.345619+00', '2025-11-25 12:27:14.345619+00', '2025-11-25 12:27:14.345619+00', '{"eTag": "\"6f875476c9c22ff54c3561ba7850eb12-1\"", "size": 697, "mimetype": "text/xml", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:14.000Z", "contentLength": 697, "httpStatusCode": 200}', '9d38274a-5882-4404-b3c4-6560dc093be7', NULL, NULL, 3),
	('58e32859-8ca9-4f9d-a446-04769291c028', 'secure-uploads', 'default_tenant/super.docx', NULL, '2025-11-25 12:27:16.356272+00', '2025-11-25 12:27:16.356272+00', '2025-11-25 12:27:16.356272+00', '{"eTag": "\"3d952ed4f251185107d39f967fe99465-2\"", "size": 6989077, "mimetype": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:14.000Z", "contentLength": 6989077, "httpStatusCode": 200}', '0e0eedaf-f284-4a09-9061-f2e6afe903d3', NULL, NULL, 2),
	('3983fe63-6abb-40cc-b7e5-99ebca6565c9', 'secure-uploads', 'default_tenant/certificados_dividendos/certificado_2025_7.pdf', NULL, '2025-11-25 14:16:25.007453+00', '2025-11-28 11:22:13.187316+00', '2025-11-25 14:16:25.007453+00', '{"eTag": "\"f0bbdc4d15dd5e1202c4676771c4fc35\"", "size": 3746, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-28T11:22:14.000Z", "contentLength": 3746, "httpStatusCode": 200}', '1faae632-8037-4551-86b7-1cddd545e635', NULL, '{}', 3),
	('74b0343e-d441-4f0a-8244-e763891c2279', 'secure-uploads', 'default_tenant/casos_eticos/3645a26a-941d-4312-9904-07b22c8c5b7b/1764424870648-acta_etica_10_1764424482331.pdf', NULL, '2025-11-29 14:01:11.605372+00', '2025-11-29 14:01:11.605372+00', '2025-11-29 14:01:11.605372+00', '{"eTag": "\"f5693d23e11b81902c8b85f8cce3328f\"", "size": 218117, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T14:01:12.000Z", "contentLength": 218117, "httpStatusCode": 200}', '8cefbf00-fee3-4d12-a071-6d7de3842eaa', NULL, '{}', 4),
	('c1577393-3723-40bd-a9cb-2d48a0b3309a', 'secure-uploads', 'default_tenant/casos_eticos/3645a26a-941d-4312-9904-07b22c8c5b7b/1764424871532-1764419473679-cedula-contadores1.png', NULL, '2025-11-29 14:01:11.815977+00', '2025-11-29 14:01:11.815977+00', '2025-11-29 14:01:11.815977+00', '{"eTag": "\"ba5d1afea77960b24cf42d71bc941ef4\"", "size": 65478, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T14:01:12.000Z", "contentLength": 65478, "httpStatusCode": 200}', 'd1e3c314-b60a-4e33-b7a6-f179398d4017', NULL, '{}', 4),
	('bf77e144-ce74-4c88-89cc-ff87819b9692', 'secure-uploads', 'default_tenant/casos_eticos/3645a26a-941d-4312-9904-07b22c8c5b7b/1764424871739-MODELODEMANDACONPAGAR.docx', NULL, '2025-11-29 14:01:12.126666+00', '2025-11-29 14:01:12.126666+00', '2025-11-29 14:01:12.126666+00', '{"eTag": "\"0e77621f7dff970097275ae859709c41\"", "size": 287183, "mimetype": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T14:01:13.000Z", "contentLength": 287183, "httpStatusCode": 200}', 'cd976a49-1cb2-4a2b-99b3-81eba287becd', NULL, '{}', 4),
	('5bd471ab-d229-42a8-b335-2b3cbb557a84', 'secure-uploads', 'default_tenant/actas_eticas_resueltas/acta_etica_11_1764424883723.pdf', NULL, '2025-11-29 14:01:24.406719+00', '2025-11-29 14:01:24.406719+00', '2025-11-29 14:01:24.406719+00', '{"eTag": "\"a860ec7ef376a5d2e2b501e34b39ab84\"", "size": 277809, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T14:01:25.000Z", "contentLength": 277809, "httpStatusCode": 200}', '7dae33fa-da16-4d27-8874-3cddbcf252b1', NULL, '{}', 3),
	('83759ce8-64a8-4624-9b0d-2260068a18e0', 'kyc', '.emptyFolderPlaceholder', NULL, '2025-12-04 14:17:01.404748+00', '2025-12-04 14:17:01.404748+00', '2025-12-04 14:17:01.404748+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-12-04T14:17:01.404Z", "contentLength": 0, "httpStatusCode": 200}', 'e41d4cbe-fdb7-4d24-b2a2-93f4dabc3b13', NULL, '{}', 1),
	('509c0423-69d2-479a-a0f0-28a5baf2ed98', 'secure-uploads', 'default_tenant/reportes_regulatorios/reporte_Supersociedades_42-Empresarial_6_1762957176450.xml', NULL, '2025-11-25 12:27:17.094333+00', '2025-11-25 12:27:17.094333+00', '2025-11-25 12:27:17.094333+00', '{"eTag": "\"17618154499da8052edb105909e3b412-1\"", "size": 467, "mimetype": "text/xml", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:17.000Z", "contentLength": 467, "httpStatusCode": 200}', 'f41f850e-8703-4f74-abb2-763cd2c528ea', NULL, NULL, 3),
	('e2d8adff-8a91-431c-9137-50ad0378138f', 'secure-uploads', 'default_tenant/casos_eticos/de3994da-b76c-4fb8-aecd-f96d305cfdae/1762870712190-next-env.d.ts', NULL, '2025-11-25 12:27:18.033186+00', '2025-11-25 12:27:18.033186+00', '2025-11-25 12:27:18.033186+00', '{"eTag": "\"8b453676276eae295c188371b3e1bd2d-1\"", "size": 216, "mimetype": "video/mp2t", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:18.000Z", "contentLength": 216, "httpStatusCode": 200}', '5cd90260-7e5f-432c-9d71-b9c3798aa943', NULL, NULL, 4),
	('91cb9ac7-4426-4c91-8822-4bf3bedd4bd6', 'secure-uploads', 'default_tenant/casos_eticos/de3994da-b76c-4fb8-aecd-f96d305cfdae/1762870712188-banner.png', NULL, '2025-11-25 12:27:18.99002+00', '2025-11-25 12:27:18.99002+00', '2025-11-25 12:27:18.99002+00', '{"eTag": "\"430af3e0001e0038a6e41bb54eeecab5-1\"", "size": 1430718, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:19.000Z", "contentLength": 1430718, "httpStatusCode": 200}', '9a65114d-62a5-47d5-95bb-ea997d2c3408', NULL, NULL, 4),
	('dcc5d573-d593-4443-94ad-1d05684afd82', 'secure-uploads', 'default_tenant/casos_eticos/de3994da-b76c-4fb8-aecd-f96d305cfdae/1762870712193-banner.png', NULL, '2025-11-25 12:27:19.016886+00', '2025-11-25 12:27:19.016886+00', '2025-11-25 12:27:19.016886+00', '{"eTag": "\"430af3e0001e0038a6e41bb54eeecab5-1\"", "size": 1430718, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:19.000Z", "contentLength": 1430718, "httpStatusCode": 200}', 'ccff86b6-5689-4daf-b9e1-16e74f2d3274', NULL, NULL, 4),
	('6c25bd4f-ff7c-40f8-86a5-c5f5731de71c', 'secure-uploads', 'default_tenant/actas_eticas_resueltas/acta_etica_12_1764426245660.pdf', NULL, '2025-11-29 14:24:06.144096+00', '2025-11-29 14:24:06.144096+00', '2025-11-29 14:24:06.144096+00', '{"eTag": "\"a8fa16fa45bdd546e07bfe4d03cfa4c2\"", "size": 2499, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T14:24:07.000Z", "contentLength": 2499, "httpStatusCode": 200}', '2142f099-a334-4b15-a0c7-aa515ed61709', NULL, '{}', 3),
	('c8679974-923c-4ba3-a240-c2dbe4d2075e', 'secure-uploads', 'default_tenant/casos_eticos/e9f7fd2d-3d00-4f9f-81ae-73c890189c9b/1764426545057-1764419473679-cedula-contadores.png', NULL, '2025-11-29 14:29:05.893134+00', '2025-11-29 14:29:05.893134+00', '2025-11-29 14:29:05.893134+00', '{"eTag": "\"ba5d1afea77960b24cf42d71bc941ef4\"", "size": 65478, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T14:29:06.000Z", "contentLength": 65478, "httpStatusCode": 200}', 'c8908de2-f8df-4726-858b-e6371abede7e', NULL, '{}', 4),
	('5218ca5c-e50a-4621-8cdb-c141a16fa2f0', 'secure-uploads', 'default_tenant/certificados_dividendos/certificado_2025_8.pdf', NULL, '2025-11-27 13:33:05.629177+00', '2025-11-28 11:22:13.55831+00', '2025-11-27 13:33:05.629177+00', '{"eTag": "\"aec7f9e27daceee916cdad71e26b666b\"", "size": 3784, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-28T11:22:14.000Z", "contentLength": 3784, "httpStatusCode": 200}', '6d8cb565-72a9-4a6c-a592-574b72dc5691', NULL, '{}', 3),
	('610b21c0-337a-41e5-96ae-b822e9ef6a5d', 'secure-uploads', 'default_tenant/casos_eticos/2531ffea-ad17-4393-9fac-9106a908a745/1764426228350-acta_etica_9_1764424134870.pdf', NULL, '2025-11-29 14:23:48.855819+00', '2025-11-29 14:23:48.855819+00', '2025-11-29 14:23:48.855819+00', '{"eTag": "\"936dc406adcad8e96e87e3e8d2849926\"", "size": 1598, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T14:23:49.000Z", "contentLength": 1598, "httpStatusCode": 200}', '8d274579-02f9-4045-98ce-509004c51379', NULL, '{}', 4),
	('34b2e6f1-32e0-45b8-804c-11d59f4fa41a', 'secure-uploads', 'default_tenant/actas_eticas_resueltas/acta_etica_13_1764426562044.pdf', NULL, '2025-11-29 14:29:22.667517+00', '2025-11-29 14:29:22.667517+00', '2025-11-29 14:29:22.667517+00', '{"eTag": "\"5bb015530b55690b71e9f8e7fd66cad3\"", "size": 59864, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T14:29:23.000Z", "contentLength": 59864, "httpStatusCode": 200}', '79953dbc-5bf9-4ecc-b9be-c445ed46ce9a', NULL, '{}', 3),
	('a98d88d3-9e1b-4da5-9afa-6669daf22a80', 'kyc', '1765290021049_cedula-contadores.png', NULL, '2025-12-09 14:20:21.148866+00', '2025-12-09 14:20:21.148866+00', '2025-12-09 14:20:21.148866+00', '{"eTag": "\"ba5d1afea77960b24cf42d71bc941ef4\"", "size": 65478, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-12-09T14:20:22.000Z", "contentLength": 65478, "httpStatusCode": 200}', '5cd3983d-5070-469f-ba86-e5ec68e41ab9', NULL, '{}', 1),
	('6f8caf23-bb8b-42ce-9fe4-4b7f18dad118', 'kyc', '1765290039046_cedula-contadores.png', NULL, '2025-12-09 14:20:38.884363+00', '2025-12-09 14:20:38.884363+00', '2025-12-09 14:20:38.884363+00', '{"eTag": "\"ba5d1afea77960b24cf42d71bc941ef4\"", "size": 65478, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-12-09T14:20:39.000Z", "contentLength": 65478, "httpStatusCode": 200}', '6daa3076-d60d-4969-931e-a1c3dc0f4d8c', NULL, '{}', 1),
	('c4d7b595-4456-4859-97ee-4d8c8332c2b9', 'secure-uploads', 'default_tenant/casos_eticos/580f4248-c438-41be-b63e-b59103c49933/1764419473679-cedula-contadores.png', NULL, '2025-11-29 12:31:14.397084+00', '2025-11-29 12:31:14.397084+00', '2025-11-29 12:31:14.397084+00', '{"eTag": "\"ba5d1afea77960b24cf42d71bc941ef4\"", "size": 65478, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T12:31:15.000Z", "contentLength": 65478, "httpStatusCode": 200}', 'b3fdd5c5-1fe0-47d4-8173-d5ba68950122', NULL, '{}', 4),
	('3022ade8-0b75-417f-8554-97a08f54541e', 'secure-uploads', 'default_tenant/casos_eticos/580f4248-c438-41be-b63e-b59103c49933/1764419474483-default_tenant_actas_eticas_resueltas_acta_etica_5_1762948334417.pdf', NULL, '2025-11-29 12:31:15.386893+00', '2025-11-29 12:31:15.386893+00', '2025-11-29 12:31:15.386893+00', '{"eTag": "\"dabfb19fa508f5e6f2ad93e2cbd93286\"", "size": 2868422, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T12:31:16.000Z", "contentLength": 2868422, "httpStatusCode": 200}', '86bc5638-792f-4fdb-a165-cee09f5efaf3', NULL, '{}', 4),
	('e83876a6-7cab-4c90-aeb5-d8295e0b4bff', 'secure-uploads', 'default_tenant/actas_eticas_resueltas/acta_etica_5_1762873709139.txt', NULL, '2025-11-25 12:27:16.983274+00', '2025-11-25 12:27:16.983274+00', '2025-11-25 12:27:16.983274+00', '{"eTag": "\"4d807900c02f99ff2e7b273735358e02-1\"", "size": 788, "mimetype": "text/plain", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:17.000Z", "contentLength": 788, "httpStatusCode": 200}', '10eefa33-6e9c-4340-85b3-4a691a6ecfe8', NULL, NULL, 3),
	('34380287-5d1d-4780-ba98-6212bde1516c', 'secure-uploads', 'default_tenant/reportes_regulatorios/reporte_Superfinanciera_42-Empresarial_6_1762960493861.xml', NULL, '2025-11-25 12:27:17.149981+00', '2025-11-25 12:27:17.149981+00', '2025-11-25 12:27:17.149981+00', '{"eTag": "\"79d8864862fe00a1b346781a6deef00f-1\"", "size": 547, "mimetype": "text/xml", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:17.000Z", "contentLength": 547, "httpStatusCode": 200}', '32cc24e8-ea64-460a-be9a-da958e75a928', NULL, NULL, 3),
	('e3287748-8b40-46f2-a632-252dd2d99f11', 'secure-uploads', 'default_tenant/reportes_regulatorios/reporte_Superfinanciera_42-Empresarial_6_1762957790218.xml', NULL, '2025-11-25 12:27:17.164056+00', '2025-11-25 12:27:17.164056+00', '2025-11-25 12:27:17.164056+00', '{"eTag": "\"17618154499da8052edb105909e3b412-1\"", "size": 467, "mimetype": "text/xml", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:17.000Z", "contentLength": 467, "httpStatusCode": 200}', '5a0579dd-4e68-4eff-8d22-f09db0a203eb', NULL, NULL, 3),
	('819b5b54-e85e-45ed-9555-18994ce8eaaa', 'secure-uploads', 'default_tenant/actas_eticas_resueltas/acta_etica_5_1762948334417.pdf', NULL, '2025-11-25 12:27:17.427919+00', '2025-11-25 12:27:17.427919+00', '2025-11-25 12:27:17.427919+00', '{"eTag": "\"2f13fed1e4414813f135d04275f6c56b-1\"", "size": 2868422, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:17.000Z", "contentLength": 2868422, "httpStatusCode": 200}', '0f541b37-79ad-422f-9cca-4455815de84b', NULL, NULL, 3),
	('98ca0c92-8dec-4ff0-b00b-d45db480def5', 'secure-uploads', 'default_tenant/casos_eticos/de3994da-b76c-4fb8-aecd-f96d305cfdae/1762870712190-notas.md', NULL, '2025-11-25 12:27:18.013603+00', '2025-11-25 12:27:18.013603+00', '2025-11-25 12:27:18.013603+00', '{"eTag": "\"bc13ea302be30034a19ffd337a6b2be7-1\"", "size": 179, "mimetype": "text/markdown", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:18.000Z", "contentLength": 179, "httpStatusCode": 200}', '25768608-6b6f-443f-9850-171f475a5d21', NULL, NULL, 4),
	('a99633af-42fd-4bb5-b86e-652e1e745bb7', 'secure-uploads', 'default_tenant/casos_eticos/de3994da-b76c-4fb8-aecd-f96d305cfdae/1762870712195-next-env.d.ts', NULL, '2025-11-25 12:27:18.028829+00', '2025-11-25 12:27:18.028829+00', '2025-11-25 12:27:18.028829+00', '{"eTag": "\"8b453676276eae295c188371b3e1bd2d-1\"", "size": 216, "mimetype": "video/mp2t", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:18.000Z", "contentLength": 216, "httpStatusCode": 200}', 'e4b85ca9-864f-4149-bc47-2c542108e604', NULL, NULL, 4),
	('ce3b81f8-557a-417a-8a0f-4fa200d8a20e', 'kyc', '1765290318467_cedula-contadores.png', NULL, '2025-12-09 14:25:18.7517+00', '2025-12-09 14:25:18.7517+00', '2025-12-09 14:25:18.7517+00', '{"eTag": "\"ba5d1afea77960b24cf42d71bc941ef4\"", "size": 65478, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-12-09T14:25:19.000Z", "contentLength": 65478, "httpStatusCode": 200}', '40873c3c-52dc-4c70-8237-db22a347a983', NULL, '{}', 1),
	('ff4f5ca7-f94a-44e7-86b3-1df55ea36e67', 'secure-uploads', 'default_tenant/actas_eticas_resueltas/acta_etica_5_1762949414596.pdf', NULL, '2025-11-25 12:27:18.949986+00', '2025-11-25 12:27:18.949986+00', '2025-11-25 12:27:18.949986+00', '{"eTag": "\"83e43ca39f0dc757ec98f995a1e450db-1\"", "size": 2869116, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:19.000Z", "contentLength": 2869116, "httpStatusCode": 200}', 'fa7bb91c-f117-4096-8080-a88410ae4407', NULL, NULL, 3),
	('a03179cd-fdd9-4849-9eca-5fa076d9c5e1', 'secure-uploads', 'default_tenant/actas_eticas_resueltas/acta_etica_5_1762948761710.pdf', NULL, '2025-11-25 12:27:19.386697+00', '2025-11-25 12:27:19.386697+00', '2025-11-25 12:27:19.386697+00', '{"eTag": "\"43007b35a2ec3610c8644654887ec298-1\"", "size": 2868441, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:19.000Z", "contentLength": 2868441, "httpStatusCode": 200}', '853d3cb7-0e36-4ec7-97fe-0baa14c038ce', NULL, NULL, 3),
	('9fe113bf-0f9c-4fe0-9d5e-842059c72bfd', 'kyc', '1765290914255_default_tenant_casos_eticos_d364d15b-7d00-46fd-973b-cecdb801da4b_1764417353921-cedula-contadores_(1).png', NULL, '2025-12-09 14:35:14.810879+00', '2025-12-09 14:35:14.810879+00', '2025-12-09 14:35:14.810879+00', '{"eTag": "\"ba5d1afea77960b24cf42d71bc941ef4\"", "size": 65478, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-12-09T14:35:15.000Z", "contentLength": 65478, "httpStatusCode": 200}', '9c33e310-8b15-4bb8-ab21-8dceb0f00c98', NULL, '{}', 1),
	('411774f9-d0fc-4323-88a7-00d6549b71a1', 'secure-uploads', 'default_tenant/reportes_dcin/DCIN83_8_1763210312162.xml', NULL, '2025-11-25 12:27:16.888932+00', '2025-11-25 12:27:16.888932+00', '2025-11-25 12:27:16.888932+00', '{"eTag": "\"ff93dca9a0772978ab9be9585a9fe51f-1\"", "size": 694, "mimetype": "text/xml", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:17.000Z", "contentLength": 694, "httpStatusCode": 200}', '8e94bf88-5c58-432b-a22a-6dd3fbf5c140', NULL, NULL, 3),
	('a67b909e-bc73-48cb-bb87-06ea608dbcf2', 'secure-uploads', 'default_tenant/reportes_regulatorios/reporte_Superfinanciera_42-Empresarial_9_1762957798674.xml', NULL, '2025-11-25 12:27:16.906688+00', '2025-11-25 12:27:16.906688+00', '2025-11-25 12:27:16.906688+00', '{"eTag": "\"17618154499da8052edb105909e3b412-1\"", "size": 467, "mimetype": "text/xml", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:17.000Z", "contentLength": 467, "httpStatusCode": 200}', 'f2fa0ca6-242f-4f67-9023-97e753c6d3b6', NULL, NULL, 3),
	('1ce02ec3-3411-4579-9927-fd697842dcdd', 'secure-uploads', 'default_tenant/1764423782425_1764419474483-default_tenant_actas_eticas_resueltas_acta_etica_5_1762948334417.pdf', NULL, '2025-11-29 13:43:03.65968+00', '2025-11-29 13:43:03.65968+00', '2025-11-29 13:43:03.65968+00', '{"eTag": "\"dabfb19fa508f5e6f2ad93e2cbd93286\"", "size": 2868422, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T13:43:04.000Z", "contentLength": 2868422, "httpStatusCode": 200}', 'f33663ec-5e8a-4e58-8e79-8a62ee1e8299', NULL, '{}', 2),
	('ad4b9af5-758c-4147-8966-ae42af47fa3b', 'secure-uploads', 'default_tenant/actas_eticas_resueltas/acta_etica_5_1762874154629.pdf', NULL, '2025-11-25 12:27:16.949612+00', '2025-11-25 12:27:16.949612+00', '2025-11-25 12:27:16.949612+00', '{"eTag": "\"d04e0b1efc5dd954037b011daaebc5a1-1\"", "size": 1582, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:17.000Z", "contentLength": 1582, "httpStatusCode": 200}', 'a2179ce8-ca59-44c6-836c-96b2b8fbc23e', NULL, NULL, 3),
	('c1bac7c0-abd7-4785-bddf-6152713ba376', 'secure-uploads', 'default_tenant/actas_eticas_resueltas/acta_etica_5_1762873584195.txt', NULL, '2025-11-25 12:27:16.994964+00', '2025-11-25 12:27:16.994964+00', '2025-11-25 12:27:16.994964+00', '{"eTag": "\"23a82891103d88d6dc961f993315d44c-1\"", "size": 772, "mimetype": "text/plain", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:17.000Z", "contentLength": 772, "httpStatusCode": 200}', '2a806e6f-3ab4-45ad-9d3e-262d2fe43f60', NULL, NULL, 3),
	('daab5800-96b1-4c38-8a0e-f17b1fcd6447', 'secure-uploads', 'default_tenant/reportes_regulatorios/reporte_Supersociedades_XBRL-NIIF-Plena_10_1762957781338.xml', NULL, '2025-11-25 12:27:17.031926+00', '2025-11-25 12:27:17.031926+00', '2025-11-25 12:27:17.031926+00', '{"eTag": "\"17618154499da8052edb105909e3b412-1\"", "size": 467, "mimetype": "text/xml", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:17.000Z", "contentLength": 467, "httpStatusCode": 200}', '916c0411-a1fc-442b-84ae-8e3bcfdf70eb', NULL, NULL, 3),
	('25e5f1e3-ca9a-44fb-93ea-b5ed7dbedd8e', 'secure-uploads', 'default_tenant/casos_eticos/df8d4820-8b06-44f2-84ed-145a37c13bff/1764424108107-FE-FE-005-Grafica.pdf', NULL, '2025-11-29 13:48:28.885056+00', '2025-11-29 13:48:28.885056+00', '2025-11-29 13:48:28.885056+00', '{"eTag": "\"0cc237a675dd7cac0a5781db5a373116\"", "size": 860, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T13:48:29.000Z", "contentLength": 860, "httpStatusCode": 200}', '09f42b1e-4092-47a1-945d-11aaec3a7226', NULL, '{}', 4),
	('19388d41-5f24-4816-8401-e70bdc6370ac', 'secure-uploads', 'default_tenant/casos_eticos/de3994da-b76c-4fb8-aecd-f96d305cfdae/1762870712196-notas.md', NULL, '2025-11-25 12:27:18.101453+00', '2025-11-25 12:27:18.101453+00', '2025-11-25 12:27:18.101453+00', '{"eTag": "\"bc13ea302be30034a19ffd337a6b2be7-1\"", "size": 179, "mimetype": "text/markdown", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:18.000Z", "contentLength": 179, "httpStatusCode": 200}', 'b9184c10-2c5f-4193-8a0a-286f57aa16f3', NULL, NULL, 4),
	('5c962ae0-047d-48ac-977f-0dba38556067', 'secure-uploads', 'default_tenant/casos_eticos/df8d4820-8b06-44f2-84ed-145a37c13bff/1764424108843-571151344_1466220578836454_5833981679984533719_n.jpg', NULL, '2025-11-29 13:48:29.466765+00', '2025-11-29 13:48:29.466765+00', '2025-11-29 13:48:29.466765+00', '{"eTag": "\"238ead9a482b22fd0ed5fa7c6c05f6c7\"", "size": 216022, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T13:48:30.000Z", "contentLength": 216022, "httpStatusCode": 200}', 'b25c9f5f-2398-43b6-bd1e-2e7ae4ca7b64', NULL, '{}', 4),
	('17ec9d0f-8f71-4091-acbf-f038b77c5f3f', 'secure-uploads', 'default_tenant/casos_eticos/5e968219-09c2-4dc3-9b93-1eadfb12d267/1762868387622-banner.png', NULL, '2025-11-25 12:27:18.982886+00', '2025-11-25 12:27:18.982886+00', '2025-11-25 12:27:18.982886+00', '{"eTag": "\"430af3e0001e0038a6e41bb54eeecab5-1\"", "size": 1430718, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T12:27:19.000Z", "contentLength": 1430718, "httpStatusCode": 200}', 'b69c344d-6b45-4988-b0ca-30259abcfd6f', NULL, NULL, 4),
	('6a596b45-c514-4018-97ed-3ea799ed2143', 'secure-uploads', 'default_tenant/actas_eticas_resueltas/acta_etica_9_1764424134870.pdf', NULL, '2025-11-29 13:48:55.697589+00', '2025-11-29 13:48:55.697589+00', '2025-11-29 13:48:55.697589+00', '{"eTag": "\"936dc406adcad8e96e87e3e8d2849926\"", "size": 1598, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T13:48:56.000Z", "contentLength": 1598, "httpStatusCode": 200}', 'a92038df-753f-49c8-84e9-02846464b12f', NULL, '{}', 3),
	('baaa574c-0d01-4676-94f9-e1458cb4742b', 'secure-uploads', 'default_tenant/certificados_dividendos/.emptyFolderPlaceholder', NULL, '2025-11-25 13:39:12.978642+00', '2025-11-25 13:39:12.978642+00', '2025-11-25 13:39:12.978642+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-11-25T13:39:12.981Z", "contentLength": 0, "httpStatusCode": 200}', '03c7a53d-d09d-4e50-a82e-9e6baf5077ef', NULL, '{}', 3),
	('4599dad0-0564-4760-b0e8-d5e00de1f5ea', 'secure-uploads', 'default_tenant/casos_eticos/e7e5c916-a842-45e5-9de0-bc8383f613f1/1764424463866-1764424108843-571151344_1466220578836454_5833981679984533719_n.jpg', NULL, '2025-11-29 13:54:24.696457+00', '2025-11-29 13:54:24.696457+00', '2025-11-29 13:54:24.696457+00', '{"eTag": "\"238ead9a482b22fd0ed5fa7c6c05f6c7\"", "size": 216022, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T13:54:25.000Z", "contentLength": 216022, "httpStatusCode": 200}', '7754ca8d-69ae-4f99-85c2-dcb36ff9b156', NULL, '{}', 4);


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."prefixes" ("bucket_id", "name", "created_at", "updated_at") VALUES
	('secure-uploads', 'default_tenant', '2025-11-25 12:20:22.732768+00', '2025-11-25 12:20:22.732768+00'),
	('secure-uploads', 'default_tenant/reportes_dcin', '2025-11-25 12:27:14.228859+00', '2025-11-25 12:27:14.228859+00'),
	('secure-uploads', 'default_tenant/reportes_regulatorios', '2025-11-25 12:27:16.906688+00', '2025-11-25 12:27:16.906688+00'),
	('secure-uploads', 'default_tenant/actas_eticas_resueltas', '2025-11-25 12:27:16.949612+00', '2025-11-25 12:27:16.949612+00'),
	('secure-uploads', 'default_tenant/casos_eticos', '2025-11-25 12:27:18.013603+00', '2025-11-25 12:27:18.013603+00'),
	('secure-uploads', 'default_tenant/casos_eticos/de3994da-b76c-4fb8-aecd-f96d305cfdae', '2025-11-25 12:27:18.013603+00', '2025-11-25 12:27:18.013603+00'),
	('secure-uploads', 'default_tenant/casos_eticos/5e968219-09c2-4dc3-9b93-1eadfb12d267', '2025-11-25 12:27:18.982886+00', '2025-11-25 12:27:18.982886+00'),
	('secure-uploads', 'default_tenant/certificados_dividendos', '2025-11-25 13:39:12.978642+00', '2025-11-25 13:39:12.978642+00'),
	('secure-uploads', 'default_tenant/casos_eticos/580f4248-c438-41be-b63e-b59103c49933', '2025-11-29 12:31:14.397084+00', '2025-11-29 12:31:14.397084+00'),
	('secure-uploads', 'default_tenant/casos_eticos/df8d4820-8b06-44f2-84ed-145a37c13bff', '2025-11-29 13:48:28.885056+00', '2025-11-29 13:48:28.885056+00'),
	('secure-uploads', 'default_tenant/casos_eticos/e7e5c916-a842-45e5-9de0-bc8383f613f1', '2025-11-29 13:54:24.696457+00', '2025-11-29 13:54:24.696457+00'),
	('secure-uploads', 'default_tenant/casos_eticos/3645a26a-941d-4312-9904-07b22c8c5b7b', '2025-11-29 14:01:11.605372+00', '2025-11-29 14:01:11.605372+00'),
	('secure-uploads', 'default_tenant/casos_eticos/2531ffea-ad17-4393-9fac-9106a908a745', '2025-11-29 14:23:48.855819+00', '2025-11-29 14:23:48.855819+00'),
	('secure-uploads', 'default_tenant/casos_eticos/e9f7fd2d-3d00-4f9f-81ae-73c890189c9b', '2025-11-29 14:29:05.893134+00', '2025-11-29 14:29:05.893134+00');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: accionistas_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."accionistas_id_seq"', 8, true);


--
-- Name: activos_fijos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."activos_fijos_id_seq"', 1, false);


--
-- Name: aml_log_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."aml_log_id_seq"', 14, true);


--
-- Name: auditoria_etica_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."auditoria_etica_id_seq"', 1, false);


--
-- Name: auditoria_explicabilidad_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."auditoria_explicabilidad_id_seq"', 1, false);


--
-- Name: auditoria_pagos_log_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."auditoria_pagos_log_id_seq"', 20, true);


--
-- Name: balances_financieros_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."balances_financieros_id_seq"', 22, true);


--
-- Name: canal_etico_casos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."canal_etico_casos_id_seq"', 13, true);


--
-- Name: canal_etico_respuestas_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."canal_etico_respuestas_id_seq"', 1, false);


--
-- Name: cap_table_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."cap_table_id_seq"', 14, true);


--
-- Name: certificadosdividendos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."certificadosdividendos_id_seq"', 22, true);


--
-- Name: configuracion_dividendos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."configuracion_dividendos_id_seq"', 1, true);


--
-- Name: configuracion_pagos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."configuracion_pagos_id_seq"', 1, false);


--
-- Name: consent_cookies_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."consent_cookies_id_seq"', 1, false);


--
-- Name: consent_log_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."consent_log_id_seq"', 18, true);


--
-- Name: cuentas_bancarias_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."cuentas_bancarias_id_seq"', 1, true);


--
-- Name: data_lineage_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."data_lineage_id_seq"', 1, false);


--
-- Name: dividendospagados_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."dividendospagados_id_seq"', 13, true);


--
-- Name: documentos_legales_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."documentos_legales_id_seq"', 37, true);


--
-- Name: esg_categorias_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."esg_categorias_id_seq"', 3, true);


--
-- Name: esg_metricas_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."esg_metricas_id_seq"', 6, true);


--
-- Name: esg_registros_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."esg_registros_id_seq"', 6, true);


--
-- Name: facturas_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."facturas_id_seq"', 21, true);


--
-- Name: inversiones_extranjeras_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."inversiones_extranjeras_id_seq"', 8, true);


--
-- Name: iso_auditorias_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."iso_auditorias_id_seq"', 1, true);


--
-- Name: iso_controles_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."iso_controles_id_seq"', 15, true);


--
-- Name: iso_hallazgos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."iso_hallazgos_id_seq"', 1, true);


--
-- Name: movimientos_caja_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."movimientos_caja_id_seq"', 16, true);


--
-- Name: ordenes_pago_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."ordenes_pago_id_seq"', 8, true);


--
-- Name: postmortems_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."postmortems_id_seq"', 1, false);


--
-- Name: preferencias_contacto_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."preferencias_contacto_id_seq"', 7, true);


--
-- Name: presupuestos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."presupuestos_id_seq"', 1, false);


--
-- Name: reportes_dcin_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."reportes_dcin_id_seq"', 8, true);


--
-- Name: reportes_regulatorios_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."reportes_regulatorios_id_seq"', 5, true);


--
-- Name: riesgos_contables_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."riesgos_contables_id_seq"', 16, true);


--
-- Name: riesgos_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."riesgos_id_seq"', 11, true);


--
-- Name: rnbd_registros_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."rnbd_registros_id_seq"', 5, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."roles_id_seq"', 2, true);


--
-- Name: solicitudes_arco_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."solicitudes_arco_id_seq"', 1, true);


--
-- Name: tenants_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."tenants_id_seq"', 5, true);


--
-- Name: tokenizacion_legal_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."tokenizacion_legal_id_seq"', 14, true);


--
-- Name: transacciones_bancarias_externas_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."transacciones_bancarias_externas_id_seq"', 100, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('"core"."users_id_seq"', 10, true);


--
-- Name: test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."test_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict ttNFcKONY3npwlU6iu68ooayG2u0QvjbMcKAJAjcY0KpAXXCmxUoBwb8Pl0Bsjv

RESET ALL;
