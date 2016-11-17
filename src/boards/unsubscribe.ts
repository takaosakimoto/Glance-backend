import {BoardUsers} from "./board-users"

export function unsubscribe(boardUsers: BoardUsers) {
    return (req, res) => {
        if (!req.user) {
            console.log("Can't unsubscribe unless you're logged in");
            res.sendStatus(401);
        } else {
            boardUsers.removeUser(req.params.board_id, req.user.id).then(() => {
                res.sendStatus(200);
            }).catch(err => {
                console.log("Failed to unsubscribe", err);
                res.sendStatus(500)
            });
        }
    }
}
