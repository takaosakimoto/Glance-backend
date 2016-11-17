import {BoardTags} from "./board-tags";
import {BoardUsers} from "./board-users";

export function removeboardtag(boardUsers: BoardUsers, boardtags: BoardTags) {

     return (req, res) => {
        if (!req.params.board_id) {
            console.log("Can't delete tag unless you're logged in");
            res.sendStatus(401);
        } else {
            boardtags.remove(req.params.board_id, req.params.name).then(() => {
               console.log("delete noticetag to notice");
               res.sendStatus(200);
            }).catch(err => {
                console.error("Failed to delete noticetag", err);
                res.sendStatus(500);
            });
        }
    }
}
