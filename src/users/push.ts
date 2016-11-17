

export interface Devicetoken {
    id: number;
    token: string;
    user_id: number;
   
}


export class Devicetokens {

    constructor(public db) {
    }

   

    register(userid: number, token: string, newid: number): Promise<number> {
        if (userid == null) {
            throw new Error("missing userid")
        } else if (token == null) {
            throw new Error("missing token")
        } 
        if(newid== null){
            newid=0;
        }

        return this.db.one("INSERT INTO tokentable (id, token, user_id) VALUES ($1, $2, $3) RETURNING id", [newid+1, token, userid]);
    }
    
    getmaxid(): Promise<any> {

        return this.db.query("SELECT MAX(id) FROM tokentable");
    }

    finduserBytoken(token: string): Promise<any> {
        if (token == null) {
            throw new Error("missing token");
        }

        return this.db.manyOrNone("SELECT * FROM tokentable WHERE token = $1", token);

       // return this.db.none("DELETE FROM tokentable");
    }

    gettokens(): Promise<Array<any>>{
        return this.db.manyOrNone("SELECT token FROM tokentable");
    }

    gettokensbyuserids(userids: Array<any>): Promise<Array<any>>{
        // return this.db.manyOrNone("SELECT token FROM tokentable WHERE user_id IN ($1)", userids);
        return this.db.manyOrNone("SELECT * FROM tokentable WHERE user_id IN ("+userids+")");
     // return this.db.manyOrNone("SELECT * FROM tokentable");
    }

    updateuserid(token: string, userid: number, id: number): Promise<void> {
        if (userid == null) {
            throw new Error("missing userid")
        } else if (token == null) {
            throw new Error("missing token")
        }
        return this.db.none("UPDATE tokentable SET user_id = $2 WHERE id = $1", [id, userid]);
    }

    
}
