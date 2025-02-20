import { model, models, Schema } from "mongoose";

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

const sectionSchema = new Schema<ISection>({
    title: { type: String, required: true },
    orderIndex: { type: Number, default: 0 },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Section = models.Section || model<ISection>('Section', sectionSchema);
export default Section;