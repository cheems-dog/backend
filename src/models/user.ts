import * as mongoose from 'mongoose';

export interface User {
    username: string;
    password: string;
    email: string;
    token: string;
    uploadedFiles: number;
}

export const UserSchema = new mongoose.Schema(
    {
        username: String,
        token: String,
        password: String,
        email: String,
        uploadedFiles: {
            type: Number,
            default: 0
        }
    },
    {
        collection: 'users'
    }
);

export const UserModel = mongoose.model<User & mongoose.Document>('User', UserSchema);