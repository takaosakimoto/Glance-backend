import {BoardUsers} from "./board-users";
import {BoardTags} from "./board-tags";

function editTag(boardUsers: BoardUsers, modifyTag: (number, string) => Promise<void> ) {

    function applyEditTag(user_id: number, board_id: number, name: string, res) {
        modifyTag(board_id, name).then(() => {
            console.log("Modified tag", user_id, board_id, name);
            res.sendStatus(200);
        }).catch(err => {
            console.log("Failed to modify tag", user_id, board_id, name, err);
            res.sendStatus(500);
        });
    }

    return (req, res) => {
        if (!req.user ) {
            console.log("Can't modify a board tag unless you're logged in");
            return res.sendStatus(401);
        }

        let user_id = req.user.id;
        let board_id = req.params.board_id;
        let name = req.params.name;

        boardUsers.isManager(board_id, user_id).then((isManager) => {
            if (!isManager) {
                console.log("Not a manager of this board", user_id, board_id, name);
                return res.sendStatus(401);
            }
            applyEditTag(user_id, board_id, name, res);
        }).catch(err => {
            console.log("Failed to modify tag", user_id, board_id, name, err);
            res.sendStatus(500)
        });
    }
}

export function removeTag(boardUsers: BoardUsers, boardTags: BoardTags) {
    return editTag(boardUsers, boardTags.remove.bind(boardTags));
}

export function addTag(boardUsers: BoardUsers, boardTags: BoardTags) {
    return editTag(boardUsers, boardTags.add.bind(boardTags));
}
export function findsBoardtag(boardUsers: BoardUsers, boardTags: BoardTags) {
    return editTag(boardUsers, boardTags.findForBoard.bind(boardTags));
   // return findForBoard(boardTags.add.bind(boardTags));
}