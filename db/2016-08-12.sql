CREATE TABLE board_user_tag (
	board_id integer NOT NULL,
	user_id integer NOT NULL,
	tags character varying NOT NULL
);

ALTER TABLE board_user_tag OWNER TO glance;
ALTER TABLE ONLY board_user_tag ADD CONSTRAINT board_user_tag_pk PRIMARY KEY (board_id, user_id);
ALTER TABLE ONLY board_user_tag ADD CONSTRAINT board_user_tag_board_id_fk FOREIGN KEY (board_id) REFERENCES boards(id);
ALTER TABLE ONLY board_user_tag ADD CONSTRAINT board_user_tag_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id);
