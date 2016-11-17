

export interface BoardTag {
    board_id: number;
    name: string;
    //checked:boolean;
}

export class BoardTags {

    

    constructor(protected db) {
    }

    add(board_id: number, name: string):Promise<void> {
        if (!board_id) {
            throw new Error("missing board_id");
        } else if (!name) {
            throw new Error("missing name");
        }
        return this.db.none("INSERT INTO board_tags (board_id, name) VALUES ($1, $2)",
            [board_id, name]);
    }

    remove(board_id: number, name: string):Promise<any> {
        if (!board_id) {
            throw new Error("missing board_id");
        } else if (!name) {
            throw new Error("missing name");
        }
        return this.db.none("DELETE FROM board_tags WHERE board_id = $1 AND name = $2",
            [board_id, name]);
    }

    findForBoard(board_id: number): Promise<Array<BoardTag>> {
        if (!board_id) {
            throw new Error("missing board_id");
        }
        return this.db.manyOrNone("SELECT * FROM board_tags WHERE board_id = $1", board_id);
    }
}
