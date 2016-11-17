CREATE TABLE tokentable (
    id integer NOT NULL,
    token character varying NOT NULL,
    user_id integer NOT NULL
);
ALTER TABLE ONLY tokentable
  ADD CONSTRAINT tokentable_pk PRIMARY KEY (id);

ALTER TABLE tokentable OWNER TO glance;