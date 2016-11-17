import * as passport from "passport";
import {Application} from "express";
import {User, Users, UserCrypto} from "../users";
import * as expressSession from "express-session";
import * as cookieParser from "cookie-parser";

/**
 * Attaches the passport middleware, making the session management global
 */
export function initialize(app: Application, users: Users, crypto: UserCrypto, sessionConf: expressSession.SessionOptions) {
    app.use(cookieParser());
    app.use(expressSession(sessionConf));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser(users));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(strategy(users, crypto));
}


export function deserializeUser(users) {
    return (id, done) => {
        users.findProfileById(id).then((user) => {
            done(null, user);
        }).catch((err) => {
            console.error("Failed to deserialize user", id, err);
            done(err, null);
        });
    }
}

export function serializeUser(user, done) {
    done(null, user.id);
}

/**
 * A passport strategy for working with Glance sessions
 */
export function strategy(users: Users, crypto: UserCrypto) {

    var strategyClass = require("passport-local").Strategy;

    function whitelistUserFields(user: User): any {
        return {
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            is_manager: user.is_manager,
            is_admin: user.is_admin
        }
    }

    function authenticate(username, password, done) {
        users.findByEmail(username).then((user) => {
            if (user == null) {
                console.log("Unknown username", username);
                return done(null, false)
            }
            crypto.verify(user.password, password).then((match) => {
                if (match) {
                    console.log("Successfully logged in as", username);
                    done(null, whitelistUserFields(user));
                } else {
                    console.log("Bad password for", username);
                    done(null, false);
                }
            }).catch(done);
        }).catch(done);
    }

    return new strategyClass(authenticate)
}
