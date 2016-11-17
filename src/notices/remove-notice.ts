import {Notices} from "./notices"
import {BoardUsers} from "../boards/board-users";
import {NoticeTags} from "./notice-tags"
export function removenotice(boardUsers: BoardUsers, notices: Notices) {

     return (req, res) => {
        if (!req.body.boardid) {
            console.log("Can't delete notice unless you're logged in");
            res.sendStatus(401);
        } else {
            notices.remove(req.body.noticeid, req.body.boardid).then(() => {
               console.log("delete notice");
               res.sendStatus(200);
            }).catch(err => {
                console.error("Failed to delete notice", err);
                res.sendStatus(500);
            });
        }
    }
}
