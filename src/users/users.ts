import {User} from "./user"

export class Users {

    constructor(public db) {
    }

    findByEmail(email: string): Promise<User> {
        if (email == null) {
            throw new Error("missing email")
        }
        return this.db.oneOrNone("SELECT * FROM users WHERE email = $1", email);
    }

    findById(id: number): Promise<User> {
        if (id == null) {
            throw new Error("missing id")
        }
        return this.db.one("SELECT * FROM users WHERE id = $1", id);
    }

    findProfileById(id: number): Promise<User> {
        if (id == null) {
            throw new Error("missing id")
        }
        return this.db.one("SELECT id, email, fullname, is_manager, is_admin FROM users WHERE id = $1", id);
    }
    
    listAllProfiles(): Promise<Array<User>> {
        return this.db.manyOrNone("SELECT id, email, fullname, is_manager, is_admin FROM users")
    }

    updateIsManager(id: number, value: boolean): Promise<void> {
        if (id == null) {
            throw new Error("missing id")
        } else if (value == null) {
            throw new Error("missing value")
        }
        return this.db.none("UPDATE users SET is_manager = $2 WHERE id = $1", [id, value]);
    }

    register(email: string, password: string, fullname: string): Promise<any> {
        if (email == null) {
            throw new Error("missing email")
        } else if (password == null) {
            throw new Error("missing password")
        } else if (fullname == null) {
            throw new Error("missing fullname")
        }
        return this.db.one("INSERT INTO users (email, password, fullname) VALUES ($1, $2, $3) RETURNING id",
            [email, password, fullname]);
    }

    updatePassword(id: number, password: string): Promise<void> {
        if (id == null) {
            throw new Error("missing id")
        } else if (password == null) {
            throw new Error("missing password")
        }
        return this.db.none("UPDATE users SET password = $2 WHERE id = $1", [id, password]);
    }

    resetPassword(email: string, password: string): Promise<void> {
        if (email == null) {
            throw new Error("missing email")
        } else if (password == null) {
            throw new Error("missing password")
        }
        return this.db.none("UPDATE users SET password = $2 WHERE email = $1", [email, password]);
    }

    updateProfile(id: number, fullname: string): Promise<void> {
        if (id == null) {
            throw new Error("missing id")
        } else if (fullname == null) {
            throw new Error("missing fullname")
        }
        return this.db.none("UPDATE users SET fullname = $2 WHERE id = $1", [id, fullname]);
    }
}
