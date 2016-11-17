import {BoardTags} from "./board-tags";

export function listtags(boardTags: BoardTags) {
    return (req, res) => {
        if (!req.body.boardid) {
            console.log("Can't list all boards unless you're logged in");
            res.sendStatus(401);
        } else {
            boardTags.findForBoard(req.body.boardid).then(boardtags => {
                res.send({result: boardtags});
            }).catch(err => {
                console.log("Failed ot return boards", err);
                res.sendStatus(500)
            });
        }
    }
}
