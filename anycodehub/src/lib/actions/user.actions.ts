'use server';

import User from "@/databases/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, GetUserInfoParams } from "@/types/params";
export async function createUser(user: CreateUserParams): Promise<CreateUserParams | undefined> {
    try {
        console.log(`Creating user: ${JSON.stringify(user)}`);
        await connectToDatabase();
        const userAdded = await User.create(user);
        console.log(`User created: ${JSON.stringify(userAdded)}`);
        return userAdded;
    }
    catch (err) {
        console.log(`Error while creating user ${JSON.stringify(err)}`);
    }
    finally {
        console.log(`create user finally`);
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
