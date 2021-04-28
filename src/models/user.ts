import * as mongoose from 'mongoose';

export interface User {
    username: string;
    token: string;
    uploadedFiles: number;
}

export const UserSchema = new mongoose.Schema(
    {
        username: String,
        token: String,
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