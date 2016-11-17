var argon2 = require('argon2');

export class UserCrypto {

    constructor() {
    }

    verify(hash, plain): Promise<boolean> {
        return argon2.verify(hash, plain);
    }

    hash(password): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            argon2.generateSalt().then(salt => {
                argon2.hash(password, salt).then((hash) => {
                    if (password == salt || salt == null) {
                        throw new Error("Sanity check on password failed")
                    }
                    resolve(hash);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

}
