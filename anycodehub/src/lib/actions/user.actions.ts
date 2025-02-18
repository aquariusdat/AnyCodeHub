'use server';

import User from "@/databases/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams } from "@/types/params";

export default async function createUser(user: CreateUserParams) : Promise<CreateUserParams | undefined>{
    try{
        connectToDatabase();
        const userAdded = await User.create(user);
        return userAdded;
    }
    catch(err){
        console.error(err);

    }
    finally{

    }
}