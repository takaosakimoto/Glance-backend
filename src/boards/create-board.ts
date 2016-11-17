import {Boards} from "./boards"
import {BoardUsers} from "./board-users";

export function createBoard(boards: Boards, boardUsers: BoardUsers) {

    function validateBody(body:any) {
        return body &&
            body.name && body.name.length > 0 &&
            body.location_text && body.location_text.length > 0 &&
            body.description && body.description.length > 0
    }

    function addCreatorAsManager(boardId: number, userId: number, inviteCode: string, res) {
        boardUsers.addUser(boardId, userId, true).then(() => {
            console.log("Added creator as manager", boardId, userId);
            res.send({result: {id: boardId, invite_code: inviteCode}});
        }).catch(err => {
            console.log("Failed to add user as manager", err);
            res.sendStatus(500)
        });
    }

    return (req, res) => {
        if (!req.user || !req.user.is_manager) {
            console.log("Can't update unless you're a manager");
            return res.sendStatus(401);
        } else if (!validateBody(req.body)) {
            console.log("Invalid create body", req.body);
            return res.sendStatus(400);
        }

        // FIXME: Should be random
        let inviteCode = "GLANCE" + req.user.id;

        boards
            .create(req.body.name, req.body.location_text, req.body.description, inviteCode, req.body.boardimage)
            .then((row) => {
                console.log("Created", row.id, req.body);
                addCreatorAsManager(row.id, req.user.id, inviteCode, res);
            }).catch(err => {
                console.log("Failed to do update", err);
                res.sendStatus(500)
            });
    }
}
