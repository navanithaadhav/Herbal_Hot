import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isVerified?: boolean;
    verificationToken?: string;
    verificationTokenExpire?: Date;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    role: 'user' | 'admin';
    address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    addresses?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        mode?: string;
    }[];
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        verificationToken: { type: String },
        verificationTokenExpire: { type: Date },
        resetPasswordToken: { type: String },
        resetPasswordExpire: { type: Date },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            zip: { type: String },
            country: { type: String },
        },
        addresses: [
            {
                street: { type: String },
                city: { type: String },
                state: { type: String },
                zip: { type: String },
                country: { type: String },
                mode: { type: String }, // 'home' or 'work'
            }
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
