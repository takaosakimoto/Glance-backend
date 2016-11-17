import {Notices} from "./notices"
import {BoardUsers} from "../boards/board-users";
import {NoticeTags} from "./notice-tags"
export function removetag(boardUsers: BoardUsers, noticetags: NoticeTags) {

     return (req, res) => {
        if (!req.body.boardid) {
            console.log("Can't delete tag unless you're logged in");
            res.sendStatus(401);
        } else {
            noticetags.remove(req.body.noticeid, req.body.boardid, req.body.name).then(() => {
               console.log("delete noticetag to notice");
               res.sendStatus(200);
            }).catch(err => {
                console.error("Failed to delete noticetag", err);
                res.sendStatus(500);
            });
        }
    }
}
