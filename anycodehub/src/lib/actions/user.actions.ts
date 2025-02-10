'use server';

import User from "@/databases/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams } from "@/types";

export default async function createUser(user: CreateUserParams){
    try{
        connectToDatabase();
        const userAdded = await User.create(user);
        return userAdded;
    }
    catch(err){

    }
    finally{

    }
}