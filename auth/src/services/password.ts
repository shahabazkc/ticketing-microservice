import bcrypt from 'bcryptjs';

export class Password {

    static async toHash(password: string) {
        let hashedPass = await bcrypt.hash(password, 10);
        return hashedPass;
    }

    static compare(suppliedPassword: string, storedPassword: string,) {
        bcrypt.compare(suppliedPassword, storedPassword).then(passwordMatched => passwordMatched === true ? true : false)
    }
};
