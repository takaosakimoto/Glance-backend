

export interface BoardUser {
    board_id: number;
    user_id: number;
    is_manager: boolean;
    joined_at: Date;
}

export class BoardUsers {

    constructor(public db) {
    }

    addUser(board_id: number, user_id: number, is_manager: boolean = false): Promise<void> {
        if (user_id == null) {
            throw new Error("missing user_id");
        } else if (board_id == null) {
            throw new Error("missing board_id");
        }
        return this.db.none("INSERT INTO board_users (board_id, user_id, is_manager) VALUES ($1, $2, $3) " +
            "ON CONFLICT (board_id, user_id) DO NOTHING", [board_id, user_id, is_manager]);
    }

    removeUser(board_id: number, user_id: number): Promise<void> {
        if (user_id == null) {
            throw new Error("missing user_id");
        } else if (board_id == null) {
            throw new Error("missing board_id");
        }
        this.db.none("DELETE FROM board_user_tag WHERE board_id = $1 AND user_id = $2", [board_id, user_id]);
        return this.db.none("DELETE FROM board_users WHERE board_id = $1 AND user_id = $2", [board_id, user_id]);
    }

    canSeeNotices(board_id: number, user_id: number): Promise<boolean> {
        return this.db.oneOrNone("SELECT EXISTS(SELECT 1 FROM board_users WHERE board_id = $1 AND user_id = $2)", [board_id, user_id])
    }

    isManager(board_id: number, user_id: number): Promise<boolean> {
        return this.db.oneOrNone("SELECT EXISTS(SELECT 1 FROM board_users WHERE board_id = $1 AND user_id = $2 AND is_manager = TRUE)", [board_id, user_id])
    }

    findById(board_id: number, user_id: number): Promise<BoardUser> {
        if (user_id == null) {
            throw new Error("missing user_id");
        } else if (board_id == null) {
            throw new Error("missing board_id");
        }
        return this.db.oneOrNone("SELECT * FROM board_users WHERE board_id = $1 AND user_id = $2", [board_id, user_id])
    }

    getCountsofUsersById(board_id: number): Promise<Number> {
        if (board_id == null) {
            throw new Error("missing board_id");
        } 
        return this.db.manyOrNone("SELECT COUNT(*) FROM board_users WHERE board_id = $1", board_id);
    }
}
