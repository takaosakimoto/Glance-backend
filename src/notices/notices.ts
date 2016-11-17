
export interface Notice {
    id: number;
    title: string;
    description: string;
    url: string;
    location_text: string;
    occurs_at: Date;
    finishes_at: Date;
    posted_by: number;
    board_id: number;
    noticeDate: Date;
    noticestate: boolean;
}

export class Notices {

    constructor(protected db) {
    }

    create(board_id: number, title: string, posted_by: number, occurs_at: Date, finishes_at: Date,
           location_text: string, description: string, url: string, noticeDate: Date, noticestate: boolean): Promise<number> {
        if (title == null) {
            throw new Error("missing title");
        } else if (!noticeDate) {
            throw new Error("missing noticeDate");
        }
        return this.db.one("INSERT INTO notices (board_id, title, posted_by, occurs_at, " +
            "finishes_at, location_text, description, url, noticeDate, noticestate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id",
            [board_id, title, posted_by, occurs_at, finishes_at, location_text, description, url, noticeDate, noticestate]);
    }
    remove(notice_id: number, board_id: number):Promise<any> {
        if (!board_id) {
            throw new Error("missing board_id");
        } else if (!notice_id) {
            throw new Error("missing notice_id");
        }
        this.db.none("DELETE FROM notice_tags WHERE notice_id = $1 AND board_id = $2",
            [notice_id, board_id]);
        
        return this.db.none("DELETE FROM notices WHERE id = $1 AND board_id = $2",
            [notice_id, board_id]);
    }

     update(id: number, board_id: number, title: string, posted_by: number, occurs_at: Date, finishes_at: Date,
           location_text: string, description: string, url: string, noticeDate: Date, noticestate: boolean): Promise<void> {
        if (title == null) {
            throw new Error("missing title");
        } else if (id == null) {
            throw new Error("missing id");
        }else if (board_id == null) {
            throw new Error("missing board_id");
        }
       

        return this.db.none("UPDATE notices SET title = $3, posted_by = $4, occurs_at = $5," + 
            "finishes_at = $6, location_text = $7, description = $8, url= $9, noticeDate= $10, noticestate=$11 WHERE id = $1 AND board_id = $2",
            [id, board_id, title, posted_by, occurs_at, finishes_at, location_text, description, url, noticeDate, noticestate]);
    }

    findByBoard(board_id: number): Promise<Array<Notice>> {
        return this.db.manyOrNone("SELECT * FROM notices WHERE board_id = $1", board_id)
    }

    totalNotices(): Promise<any> {
        return this.db.one("SELECT COUNT(*) AS count FROM notices");
    }

    myNotices(user: number): Promise<Array<Notice>> {
        if (!user) {
            throw new Error("missing user_id");
        }

        return this.db.manyOrNone("SELECT notices.* FROM notices LEFT OUTER JOIN board_users ON " +
            "(board_users.board_id = notices.board_id) WHERE board_users.user_id = $1", user);
        // return this.db.manyOrNone("SELECT notices.* FROM notices LEFT OUTER JOIN board_users ON " +
        //     "(board_users.board_id = notices.board_id) WHERE board_users.user_id = $1", user);

        // return this.db.manyOrNone("SELECT n.* FROM notices n, notice_tags t, board_user_tag u, board_users b WHERE n.id = t.notice_id AND n.board_id = b.board_id AND" +
        //  " t.board_id = b.board_id AND u.board_id = b.board_id AND u.user_id = b.user_id AND t.name IN (u.tags) AND b.user_id = $1", user);
        // return this.db.manyOrNone("SELECT * FROM notices INNER JOIN board_users ON (board_users.board_id = notices.board_id) " + 
        //     "INNER JOIN notice_tags ON (notice_tags.notice_id = notices.id AND notice_tags.board_id = board_users.board_id) " + 
        //     " INNER JOIN board_user_tag ON (notice_tags.name IN (string_to_array(board_user_tag.tags, ',')) AND board_user_tag.board_id = board_users.board_id AND board_user_tag.user_id = board_users.user_id) " + 
        //     "WHERE board_users.user_id = $1", user);
    }
    myNoticesbymanager(user: number): Promise<Array<Notice>> {
        if (!user) {
            throw new Error("missing user_id");
        }
      
        return this.db.manyOrNone("SELECT notices.* FROM notices LEFT OUTER JOIN board_users ON " +
            "(board_users.board_id = notices.board_id) WHERE board_users.user_id = $1 AND board_users.is_manager = 'true'", user);

        
    }
}
