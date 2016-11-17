-- Remove the old tags and their keys

DROP TABLE notice_tags;
DROP TABLE tags;

-- The new tags have a key of <board, name> rather than just <name>

CREATE TABLE notice_tags (
  notice_id integer NOT NULL,
  board_id integer NOT NULL,
  name character varying NOT NULL
);

ALTER TABLE ONLY notice_tags
  ADD CONSTRAINT notice_tags_pk PRIMARY KEY (notice_id, board_id, name);

ALTER TABLE notice_tags OWNER TO glance;

CREATE TABLE board_tags (
  board_id integer NOT NULL,
  name character varying NOT NULL
);

ALTER TABLE ONLY board_tags
  ADD CONSTRAINT board_tags_pk PRIMARY KEY (board_id, name);

ALTER TABLE board_tags OWNER TO glance;

ALTER TABLE ONLY notice_tags
  ADD CONSTRAINT notice_tags_notices_id_fk FOREIGN KEY (notice_id) REFERENCES notices(id);

ALTER TABLE ONLY notice_tags
  ADD CONSTRAINT notice_tags_tags_name_fk FOREIGN KEY (board_id, name) REFERENCES board_tags(board_id, name);


