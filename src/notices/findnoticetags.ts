import {NoticeTags} from "./notice-tags";

export function listnoticetags(noticetags: NoticeTags) {
    return (req, res) => {
        if (!req.body.boardid) {
            console.log("Can't list all boards unless you're logged in");
            res.sendStatus(401);
        } else {
            noticetags.findForNotice(req.body.noticeid).then(noticetags => {
                res.send({result: noticetags});
            }).catch(err => {
                console.log("Failed ot return notices", err);
                res.sendStatus(500)
            });
        }
    }
}