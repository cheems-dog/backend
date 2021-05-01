import * as mongoose from 'mongoose';

export interface Verification {
    verificationId: string;
    type: string;
    owner: string;
}

export const VerificationSchema = new mongoose.Schema(
    {
        verificationId: String,
        type: String,
        owner: String
    },
    {
        collection: 'verification'
    }
);

export const VerificationModel = mongoose.model<Verification & mongoose.Document>('Verification', VerificationSchema);