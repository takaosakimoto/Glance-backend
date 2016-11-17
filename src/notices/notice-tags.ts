

export interface NoticeTag {
    board_id: number;
    notice_id: number;
    name: string;
}

export class NoticeTags {

    constructor(protected db) {
    }

    add(notice_id: number, board_id: number, name: string):Promise<any> {
        if (!board_id) {
            throw new Error("missing board_id");
        } else if (!notice_id) {
            throw new Error("missing notice_id");
        } else if (!name) {
            throw new Error("missing name");
        }
        return this.db.none("INSERT INTO notice_tags (notice_id, board_id, name) VALUES ($1, $2, $3)",
            [notice_id, board_id, name]);
    }

    remove(notice_id: number, board_id: number, name: string):Promise<any> {
        if (!board_id) {
            throw new Error("missing board_id");
        } else if (!notice_id) {
            throw new Error("missing notice_id");
        } else if (!name) {
            throw new Error("missing name");
        }
        return this.db.none("DELETE FROM notice_tags WHERE notice_id = $1 AND board_id = $2 AND name = $3",
            [notice_id, board_id, name]);
    }
    
    findForUser(user_id: number): Promise<Array<NoticeTag>> {
        if (!user_id) {
            throw new Error("missing user_id");
        }
        return this.db.manyOrNone("SELECT notice_tags.notice_id, notice_tags.name FROM notices LEFT OUTER JOIN board_users ON " +
            "(board_users.board_id = notices.board_id) LEFT OUTER JOIN notice_tags ON " +
            "(notice_tags.notice_id = notices.id) WHERE board_users.user_id = $1 ORDER BY notices.id", user_id);
    }
    
    findForNotice(notice_id: number): Promise<Array<NoticeTag>> {
        if (!notice_id) {
            throw new Error("missing notice_id");
        }
        return this.db.manyOrNone("SELECT * FROM notice_tags WHERE notice_id = $1", notice_id);
    }
}
