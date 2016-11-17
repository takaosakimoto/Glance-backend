import {Notices, Notice} from "./notices";

export function Mynotices(mynotice: Notices) {
    return (req, res) => {
        if (!req.user) {
            console.log("Can't find lists of notices unless you're logged in");
            res.sendStatus(401);
        }  else {
            mynotice.myNotices(req.user.id).then(notices => {
                res.send({result: notices});
            }).catch(err => {
                console.log("Failed at return notices", err);
                res.sendStatus(500);
            });
        }
    }
}