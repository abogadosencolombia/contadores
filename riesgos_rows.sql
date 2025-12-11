create table core.riesgos (
  id serial not null,
  dominio character varying(50) null,
  riesgo text null,
  probabilidad smallint null,
  impacto smallint null,
  owner character varying(120) null,
  control text null,
  estado character varying(20) null,
  fecha timestamp without time zone null default now(),
  constraint riesgos_pkey primary key (id),
  constraint riesgos_estado_check check (
    (
      (estado)::text = any (
        array[
          ('abierto'::character varying)::text,
          ('mitigando'::character varying)::text,
          ('cerrado'::character varying)::text
        ]
      )
    )
  ),
  constraint riesgos_probabilidad_check check (
    (
      (probabilidad >= 1)
      and (probabilidad <= 5)
    )
  ),
  constraint riesgos_probabilidad_check1 check (
    (
      (probabilidad >= 1)
      and (probabilidad <= 5)
    )
  )
) TABLESPACE pg_default;
