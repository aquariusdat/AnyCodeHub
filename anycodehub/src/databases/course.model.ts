import { ECourseLevel, ECourseStatus, EUserRole, EUserStatus } from "@/types/enums";
import { model, models, Schema } from "mongoose";

interface Course extends Document 
{
    title:string;
    description: string;
    price:number;
    imageUrl:string;
    introUrl:string;
    salePrice:number;
    slug:string;
    status:ECourseStatus;
    createdAt:Date;
    createdBy:Schema.Types.ObjectId;
    level:ECourseLevel;
    durationTime:number;
    views:number;
    rating:number[];
    info:{
        requirements:string[];
        qa:{
            question:string;
            answer:string;
        }[]
    };
    section:Schema.Types.ObjectId[];
}

const courseSchema = new Schema<Course>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    introUrl: { type: String, required: true },
    salePrice: { type: Number },
    slug: { type: String, unique: true, required: true },
    status: { type: String, enum: Object.values(ECourseStatus), default: ECourseStatus.PENDING },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    level: { type: String, enum: Object.values(ECourseLevel), default: ECourseLevel.BEGINNER },
    durationTime: { type: Number },
    views: { type: Number, default: 0 },
    rating: [{ type: Number }],
    info: {
    },
    section: [{ type: Schema.Types.ObjectId, ref: 'Section' }]
});