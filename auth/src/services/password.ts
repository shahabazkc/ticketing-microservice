import bcrypt from 'bcryptjs';

export class Password {

    static async toHash(password: string) {
        let hashedPass = await bcrypt.hash(password, 10);
        return hashedPass;
    }

    static async compare(suppliedPassword: string, storedPassword: string) {
        return new Promise(function (resolve, reject) {
            bcrypt.compare(suppliedPassword, storedPassword, function (err, res) {
                if (err) {
                    reject(false);
                } else if (res) {
                    resolve(true);
                } else {
                    reject(false);
                }
            });
        });
    }
};
