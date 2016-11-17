CREATE TABLE board_images (
	board_id integer NOT NULL,
	board_image character varying
);

ALTER TABLE board_images OWNER TO glance;
ALTER TABLE ONLY board_images ADD CONSTRAINT board_images_board_id_pk PRIMARY KEY (board_id);
ALTER TABLE ONLY board_images ADD CONSTRAINT board_images_board_id_fk FOREIGN KEY (board_id) REFERENCES boards(id);
