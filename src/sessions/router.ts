import * as passport from "passport";
import * as express from "express";

export function router(): express.Router {

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function current(req, res) {
        if (!req.user) {
            res.sendStatus(401);
        } else {
            res.send({result: req.user})
        }
    }

    var router = express.Router();

    router.route("/current")
        .get(current)
        .put(passport.authenticate('local'), current)
        .delete(logout);

    return router;
}
