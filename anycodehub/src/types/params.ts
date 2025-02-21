type CreateUserParams = {
    clerkId: string;
    userName: string;
    emailAddress: string;
    name?: string;
    avatar?: string;
    status?: string;
    role?: string;
};

type GetUserInfoParams = {
    userId: string;
}

type UpdateUserParams = {
    clerkId: string;
    userName: string;
    emailAddress: string;
    name?: string;
    avatar?: string;
    updatedBy: string;
    updatedAt: Date;
}

type DeleteUserParams = {
    clerkId: string;
    deleteBy: string;
    deleteAt: Date;
}

export type { CreateUserParams, GetUserInfoParams, DeleteUserParams, UpdateUserParams };