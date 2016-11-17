import * as express from "express";
import * as bodyParser from "body-parser";
import {SessionOptions} from "express-session";
import * as sessions from "./sessions";
import * as users from "./users";
import * as healthcheck from "./healthcheck";
import * as notices from "./notices";
import * as dashboard from "./dashboard";
import * as boards from "./boards";

var pgp = require("pg-promise")();

export function app() {
    // FIXME refactor to make testable

    let dbConf = {
        user: process.env.GLANCE_DB_USER || "glance",
        password: process.env.GLANCE_DB_PASSWORD || "",
        host: process.env.GLANCE_DB_HOSTNAME || "localhost",
        database: process.env.GLANCE_DB_NAME || "glance"
    };

    let sessionConf: SessionOptions = {
        secret: process.env.GLANCE_SESSION_SECRET || "omg_the_cats_escaped",
        resave: false,
        saveUninitialized: false
    };

    let app = express();

    // Models
    let db = pgp(dbConf);
    let userCrypto = new users.UserCrypto();
    let usersModel = new users.Users(db);
    let noticesModel = new notices.Notices(db);
    let boardsModel = new boards.Boards(db);
    let boardUsersModel = new boards.BoardUsers(db);
    let boardTagsModel = new boards.BoardTags(db);
    let noticeTagsModel = new notices.NoticeTags(db);
    let userTagsModel = new boards.UserTags(db);
    let usertokenModel = new users.Devicetokens(db);
    // Utility
    let noticeTagsMultiMap = new notices.NoticeTagsMultiMap(noticeTagsModel);

    // Middleware
    app.use(bodyParser.json());
    sessions.initialize(app, usersModel, userCrypto, sessionConf);
    
    // Routes
    app.use(express.static('public'));
    app.use("/sessions", sessions.router());
  //  app.use("/users", users.router(usersModel, userCrypto));
    app.use("/users", users.router(usersModel, userCrypto, usertokenModel));
    app.use("/healthcheck", healthcheck.router(noticesModel));
    app.use("/notices", notices.router(boardUsersModel, noticesModel, noticeTagsModel, usertokenModel, userTagsModel, boardsModel));
    app.use("/boards", boards.router(boardsModel, boardUsersModel, boardTagsModel, userTagsModel));
    app.use("/dashboard", dashboard.router(usersModel, noticesModel, boardsModel, noticeTagsMultiMap, userTagsModel));

    return app;
}
