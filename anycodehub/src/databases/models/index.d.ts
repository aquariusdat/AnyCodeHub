interface ICourse extends Document {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    introUrl: string;
    salePrice: number;
    slug: string;
    status: ECourseStatus;
    createdAt: Date;
    createdBy: Schema.Types.ObjectId;
    level: ECourseLevel;
    durationTime: number;
    views: number;
    rating: number[];
    info: {
        requirements: string[];
        qa: {
            question: string;
            answer: string;
        }[]
    };
    section: Schema.Types.ObjectId[];
    isDeleted: boolean;
    deletedAt: Date;
    deletedBy: Schema.Types.ObjectId;
}

interface ILesson extends Document {
    _id: string;
    title: string;
    slug: string;
    section: Schema.Types.ObjectId;
    course: Schema.Types.ObjectId;
    orderIndex: number;
    durationTime: number;
    videoUrl: string;
    content: string;
    type: ELessonType;
    createdAt: Date;
    createdBy: Schema.Types.ObjectId;
    isDeleted: boolean;
    deletedAt: Date;
    deletedBy: Schema.Types.ObjectId;
}

interface ISection extends Document {
    _id: string;
    title: string;
    course: Schema.Types.ObjectId;
    lessons: Schema.Types.ObjectId[];
    orderIndex: number;
    createdAt: Date;
    createdBy: Schema.Types.ObjectId;
    isDeleted: boolean;
    deletedAt: Date;
    deletedBy: Schema.Types.ObjectId;
}

interface IUser extends Document {
    clerkId: string;
    name: string;
    userName: string;
    emailAddress: string;
    avatar: string;
    createdAt: Date;
    createdBy: string;
    status: EUserStatus;
    role: EUserRole;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt: Date;
    deletedBy: string;
    courses: Schema.Types.ObjectId[];
}