'use server';

import User from "@/databases/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, GetUserInfoParams } from "@/types/params";
export async function createUser(user: CreateUserParams): Promise<CreateUserParams | undefined> {
    try {
        await connectToDatabase();
        const userAdded = await User.create(user);
        return userAdded;
    }
    catch (err) {
        console.error(err);

    }
    finally {

    }
}

export async function getUserInfo(user: GetUserInfoParams): Promise<IUser | undefined> {
    try {
        await connectToDatabase();
        const userFiltered = await User.findOne({ clerkId: user.userId });
        return userFiltered;
    }
    catch (err) {
        console.error(err);
    }
}
