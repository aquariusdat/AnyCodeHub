type CreateUserParams = {
    clerkId: string;
    userName: string;
    emailAddress: string;
    name?: string;
    avatar?: string;
};

type GetUserInfoParams = {
    userId: string;
}

export type { CreateUserParams, GetUserInfoParams };