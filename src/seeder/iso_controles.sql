-- Limpiar controles previos del tenant para evitar conflictos de códigos duplicados
DELETE FROM core.iso_controles WHERE tenant_id = 'default_tenant';

-- Insertar controles con la nueva estructura (incluyendo CATEGORIA)
INSERT INTO core.iso_controles (tenant_id, codigo, nombre, categoria, descripcion) VALUES
('default_tenant', 'A.5.1', 'Políticas para la seguridad de la información', 'Organizacional', 'Las políticas de seguridad de la información y las reglas específicas del tema deben ser definidas, aprobadas por la dirección, publicadas y comunicadas.'),
('default_tenant', 'A.5.2', 'Roles y responsabilidades de seguridad de la información', 'Organizacional', 'Los roles y responsabilidades de seguridad de la información deben definirse y asignarse de acuerdo con las necesidades de la organización.'),
('default_tenant', 'A.5.3', 'Segregación de funciones', 'Organizacional', 'Las funciones conflictivas y las áreas de responsabilidad conflictivas deben segregarse.'),
('default_tenant', 'A.5.4', 'Responsabilidades de la dirección', 'Organizacional', 'La dirección debe exigir a todo el personal que aplique la seguridad de la información de acuerdo con las políticas y procedimientos.'),
('default_tenant', 'A.5.7', 'Inteligencia de amenazas', 'Organizacional', 'La información sobre las amenazas a la seguridad de la información debe recopilarse y analizarse para producir inteligencia de amenazas.'),
('default_tenant', 'A.6.1', 'Selección del personal', 'Personas', 'La verificación de antecedentes de todos los candidatos a un empleo debe llevarse a cabo antes de unirse a la organización.'),
('default_tenant', 'A.6.3', 'Concienciación, educación y formación', 'Personas', 'El personal de la organización y las partes interesadas pertinentes deben recibir una concienciación, educación y formación adecuadas.'),
('default_tenant', 'A.7.1', 'Perímetros de seguridad física', 'Físico', 'Los perímetros de seguridad deben definirse y utilizarse para proteger las áreas que contienen información sensible y crítica.'),
('default_tenant', 'A.8.1', 'Dispositivos de punto final de usuario', 'Tecnológico', 'La información almacenada, procesada o transmitida en dispositivos de punto final de usuario debe estar protegida.'),
('default_tenant', 'A.8.2', 'Derechos de acceso privilegiado', 'Tecnológico', 'La asignación y el uso de los derechos de acceso privilegiado deben restringirse y gestionarse estrictamente.'),
('default_tenant', 'A.8.3', 'Restricción de acceso a la información', 'Tecnológico', 'El acceso a la información y a las funciones de los sistemas de aplicaciones debe restringirse de acuerdo con la política de control de acceso.'),
('default_tenant', 'A.8.4', 'Acceso al código fuente', 'Tecnológico', 'El acceso de lectura y escritura al código fuente, las herramientas de desarrollo y las bibliotecas de software debe gestionarse adecuadamente.'),
('default_tenant', 'A.8.8', 'Gestión de vulnerabilidades técnicas', 'Tecnológico', 'Se debe obtener información sobre las vulnerabilidades técnicas de los sistemas de información en uso y evaluar la exposición.'),
('default_tenant', 'A.8.25', 'Ciclo de vida de desarrollo seguro', 'Tecnológico', 'Se deben establecer reglas para el desarrollo seguro de software y sistemas.'),
('default_tenant', 'A.8.28', 'Codificación segura', 'Tecnológico', 'Los principios de codificación segura deben aplicarse al desarrollo de software.');
