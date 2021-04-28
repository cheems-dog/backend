import * as mongoose from 'mongoose';

export interface Image {
    name: string;
    author: string;
}

export const ImageSchema = new mongoose.Schema(
    {
        name: String,
        author: String
    },
    {
        collection: 'images'
    }
);

export const ImageModel = mongoose.model<Image & mongoose.Document>('Image', ImageSchema);