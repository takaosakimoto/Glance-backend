import {Boards} from "./boards"
// import {BoardUsers} from "./board-users";

export function updateimage(boards: Boards) {

    function validateBody(body:any) {
        return body &&
            body.name && body.boardimage.length > 0
    }

    return (req, res) => {
        if(req.body.boardimage){
            boards
            .updateimage(req.body.board_id, req.body.boardimage)
            .then(() => {
                console.log("updated board image");
            }).catch(err => {
                console.log("Failed to do update", err);
                res.sendStatus(500)
            });

        }else{
            console.log("updatefailed", req.body);
            return res.sendStatus(400);
        }
    }
}
