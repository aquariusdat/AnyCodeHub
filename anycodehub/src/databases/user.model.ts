import { EUserRole, EUserStatus } from "@/types/enums";
import { model, models, Schema } from "mongoose";



const userSchema = new Schema<IUser>({
    clerkId: { type: String },
    name: { type: String },
    userName: { type: String, unique: true, required: true },
    emailAddress: { type: String, unique: true, required: true },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String },
    status: { type: String, enum: Object.values(EUserStatus), default: EUserStatus.ACTIVE },
    role: { type: String, enum: Object.values(EUserRole), default: EUserRole.GUEST },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: String },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
});

const User = models.User || model<IUser>('User', userSchema);
export default User;