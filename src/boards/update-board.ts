import {Boards} from "./boards"
import {BoardUsers} from "./board-users";

export function updateBoard(boards: Boards, boardUsers: BoardUsers) {

    function validateBody(id: number, body:any) {
        return body &&
            body.id && body.id > 0 && id == body.id &&
            body.name && body.name.length > 0 &&
            body.description && body.description.length > 0
    }

    function doUpdate(id: number, body: any, res) {
        boards
            .update(id, body.name, body.location_text, body.description, body.boardimage)
            .then(() => {
                console.log("Updated", id, body);
                res.sendStatus(200);
            }).catch(err => {
                console.log("Failed to do update", err, body);
                res.sendStatus(500)
            });
    }

    function updateIfManager(boardId: number, userId: number, body: any, res) {
        boardUsers.isManager(boardId, userId).then(isManager => {
            if (isManager) {
                doUpdate(boardId, body, res);
            } else {
                console.log("Can't update unless you're logged in");
                res.sendStatus(401);
            }
        }).catch(err => {
            console.log("Failed to check if manager", err);
            res.sendStatus(500)
        });
    }

    return (req, res) => {
        if (!req.user) {
            console.log("Can't update unless you're logged in");
            res.sendStatus(401);
        } else if (!validateBody(req.params.board_id, req.body)) {
            console.log("Invalid update request", req.params, req.body);
            res.sendStatus(400);
        } else {
            updateIfManager(req.params.board_id, req.user.id, req.body, res);
        }
    }
}
