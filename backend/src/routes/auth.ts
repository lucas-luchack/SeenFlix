import { Router } from "express";
import { ConflictError, UnprocessableEntityError } from "../errors";
import { createUser, findUserByEmail } from "../models";

export const authRouter: Router = Router();

authRouter.post("/signup",  async (req, res, next) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) 
            throw new UnprocessableEntityError("Passwords do not match", "PASSWORD_MISMATCH")

        if (await findUserByEmail(email))
            throw new ConflictError("Email already exist in database", "ACCOUNT_ALREADY_EXIST");

        const hashedPassword = await Bun.password.hash(password);
        const res = await createUser({ email, password: hashedPassword });

        
    } catch {

    }
})