--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.2
-- Dumped by pg_dump version 9.5.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: board_users; Type: TABLE; Schema: public; Owner: glance
--

CREATE TABLE board_users (
    board_id integer NOT NULL,
    user_id integer NOT NULL,
    is_manager boolean DEFAULT false NOT NULL,
    joined_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE board_users OWNER TO glance;

--
-- Name: boards; Type: TABLE; Schema: public; Owner: glance
--

CREATE TABLE boards (
    id integer NOT NULL,
    name character varying NOT NULL,
    location_text character varying NOT NULL,
    description character varying NOT NULL,
    invite_code character varying NOT NULL
);


ALTER TABLE boards OWNER TO glance;

--
-- Name: boards_id_seq; Type: SEQUENCE; Schema: public; Owner: glance
--

CREATE SEQUENCE boards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE boards_id_seq OWNER TO glance;

--
-- Name: boards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: glance
--

ALTER SEQUENCE boards_id_seq OWNED BY boards.id;


--
-- Name: notice_tags; Type: TABLE; Schema: public; Owner: glance
--

CREATE TABLE notice_tags (
    notice_id integer NOT NULL,
    tag_name character varying NOT NULL
);


ALTER TABLE notice_tags OWNER TO glance;

--
-- Name: notices_id_seq; Type: SEQUENCE; Schema: public; Owner: glance
--

CREATE SEQUENCE notices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE notices_id_seq OWNER TO glance;

--
-- Name: notices; Type: TABLE; Schema: public; Owner: glance
--

CREATE TABLE notices (
    id integer DEFAULT nextval('notices_id_seq'::regclass) NOT NULL,
    title character varying NOT NULL,
    occurs_at timestamp without time zone,
    board_id integer NOT NULL,
    posted_by integer NOT NULL
);


ALTER TABLE notices OWNER TO glance;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: glance
--

CREATE TABLE tags (
    name character varying NOT NULL
);


ALTER TABLE tags OWNER TO glance;

--
-- Name: users; Type: TABLE; Schema: public; Owner: glance
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying,
    fullname character varying,
    registered_at timestamp without time zone DEFAULT now() NOT NULL,
    password character varying
);


ALTER TABLE users OWNER TO glance;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: glance
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO glance;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: glance
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: glance
--

ALTER TABLE ONLY boards ALTER COLUMN id SET DEFAULT nextval('boards_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: glance
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: board_users_board_id_user_id_pk; Type: CONSTRAINT; Schema: public; Owner: glance
--

ALTER TABLE ONLY board_users
    ADD CONSTRAINT board_users_board_id_user_id_pk PRIMARY KEY (board_id, user_id);


--
-- Name: boards_pkey; Type: CONSTRAINT; Schema: public; Owner: glance
--

ALTER TABLE ONLY boards
    ADD CONSTRAINT boards_pkey PRIMARY KEY (id);


--
-- Name: notice_tags_notice_id_tag_name_pk; Type: CONSTRAINT; Schema: public; Owner: glance
--

ALTER TABLE ONLY notice_tags
    ADD CONSTRAINT notice_tags_notice_id_tag_name_pk PRIMARY KEY (notice_id, tag_name);


--
-- Name: notices_id_pk; Type: CONSTRAINT; Schema: public; Owner: glance
--

ALTER TABLE ONLY notices
    ADD CONSTRAINT notices_id_pk PRIMARY KEY (id);


--
-- Name: tags_name_pk; Type: CONSTRAINT; Schema: public; Owner: glance
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT tags_name_pk PRIMARY KEY (name);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: glance
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: boards_invite_code_uindex; Type: INDEX; Schema: public; Owner: glance
--

CREATE UNIQUE INDEX boards_invite_code_uindex ON boards USING btree (invite_code);


--
-- Name: users_id_uindex; Type: INDEX; Schema: public; Owner: glance
--

CREATE UNIQUE INDEX users_id_uindex ON users USING btree (id);


--
-- Name: users_username_uindex; Type: INDEX; Schema: public; Owner: glance
--

CREATE UNIQUE INDEX users_username_uindex ON users USING btree (email);


--
-- Name: board_users_boards_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: glance
--

ALTER TABLE ONLY board_users
    ADD CONSTRAINT board_users_boards_id_fk FOREIGN KEY (board_id) REFERENCES boards(id);


--
-- Name: board_users_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: glance
--

ALTER TABLE ONLY board_users
    ADD CONSTRAINT board_users_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: notice_tags_notices_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: glance
--

ALTER TABLE ONLY notice_tags
    ADD CONSTRAINT notice_tags_notices_id_fk FOREIGN KEY (notice_id) REFERENCES notices(id);


--
-- Name: notice_tags_tags_name_fk; Type: FK CONSTRAINT; Schema: public; Owner: glance
--

ALTER TABLE ONLY notice_tags
    ADD CONSTRAINT notice_tags_tags_name_fk FOREIGN KEY (tag_name) REFERENCES tags(name);


--
-- Name: notices_boards_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: glance
--

ALTER TABLE ONLY notices
    ADD CONSTRAINT notices_boards_id_fk FOREIGN KEY (board_id) REFERENCES boards(id);


--
-- Name: notices_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: glance
--

ALTER TABLE ONLY notices
    ADD CONSTRAINT notices_users_id_fk FOREIGN KEY (posted_by) REFERENCES users(id);

--
-- PostgreSQL database dump complete
--

