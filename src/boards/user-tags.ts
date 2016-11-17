

export interface UserTag {
    board_id: number;
    user_id: number;
    name: string;
    
}



export class UserTags {

    constructor(protected db) {
    }

    add(board_id: number, user_id: number, name: string):Promise<void> {
        if (!board_id) {
            throw new Error("missing board_id");
        } else if (!name) {
            throw new Error("missing name");
        }
        this.db.none("DELETE FROM board_user_tag WHERE board_id = $1 AND user_id = $2",
            [board_id, user_id]);
        return this.db.none("INSERT INTO board_user_tag (board_id, user_id, tags) VALUES ($1, $2, $3)",
            [board_id, user_id, name]);
    }

    update(board_id: number, user_id: number, name: string):Promise<void> {
        if (!board_id) {
            throw new Error("missing board_id");
        } else if (!name) {
            throw new Error("missing name");
        }
        
        return this.db.none("UPDATE board_user_tag  SET tags = $3 WHERE board_id = $1 AND user_id = $2",
            [board_id, user_id, name]);
    }

    remove(board_id: number, user_id: number, name: string):Promise<any> {
        if (!board_id) {
            throw new Error("missing board_id");
        } else if (!name) {
            throw new Error("missing name");
        }
        return this.db.none("DELETE FROM board_user_tag WHERE board_id = $1 AND user_id = $2",
            [board_id, user_id]);
    }

    findusersbyboard(boardid: number): Promise<Array<any>> {
        if (!boardid) {
            throw new Error("missing boardid");
        }
        return this.db.manyOrNone("SELECT * FROM board_user_tag WHERE board_id = $1", boardid);
    }

    findForusertag(user_id: number): Promise<Array<any>> {
        if (!user_id) {
            throw new Error("missing userid");
        }
        return this.db.manyOrNone("SELECT * FROM board_user_tag WHERE user_id = $1", user_id);
    }
}
