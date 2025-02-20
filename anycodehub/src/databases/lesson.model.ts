import { ELessonType } from "@/types/enums";
import { model, models, Schema } from "mongoose";

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

const lessonSchema = new Schema<ILesson>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    section: { type: Schema.Types.ObjectId, ref: 'Section' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    orderIndex: { type: Number, default: 0 },
    durationTime: { type: Number, default: 0 },
    videoUrl: { type: String },
    content: { type: String },
    type: { type: String, enum: Object.values(ELessonType), default: ELessonType.VIDEO },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Lesson = models.Lesson || model<ILesson>('Lesson', lessonSchema);
export default Lesson;