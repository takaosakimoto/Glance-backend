import * as express from "express";
import {Notices} from "./notices/notices";

export function router(notices: Notices): express.Router {

    var router = express.Router();

    function heathcheck(req, res) {
        notices.totalNotices().then((row) => {
            res.send({notices: row.count});
        }).catch((err) => {
            res.sendStatus(500);;
        });
    }

    router.get("/", heathcheck);

    return router;
}
