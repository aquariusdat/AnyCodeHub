'use server';

import User from "@/databases/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, GetUserInfoParams, UpdateUserParams } from "@/types/params";
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

export async function updateUser(user: UpdateUserParams): Promise<UpdateUserParams | undefined> {
    try {
        console.log(`Updating user: ${JSON.stringify(user)}`);
        await connectToDatabase();
        const userUpdated = await User.findOneAndUpdate({ clerkId: user.clerkId }, user);
        console.log(`User updated: ${JSON.stringify(userUpdated)}`);
        return userUpdated;
    }
    catch (err) {
        console.log(`Error while updating user ${JSON.stringify(err)}`);
    }
    finally {
        console.log(`update user finally`);
    }
}

export async function deleteUser(user: DeleteUserParams): Promise<DeleteUserParams | undefined> {
    try {
        console.log(`Deleting user: ${JSON.stringify(user)}`);
        await connectToDatabase();
        const userDeleted = await User.findOneAndUpdate({ clerkId: user.clerkId }, user);
        console.log(`User deleted: ${JSON.stringify(userDeleted)}`);
        return userDeleted;
    }
    catch (err) {
        console.log(`Error while deleting user ${JSON.stringify(err)}`);
    }
    finally {
        console.log(`delete user finally`);
    }
}
