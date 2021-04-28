import * as mongoose from 'mongoose';

interface Image {
    name: string;
    author: string;
}

const ImageSchema = new mongoose.Schema(
    {
        name: String,
        author: String
    },
    {
        collection: 'images'
    }
);

const ImageModel = mongoose.model<Image & mongoose.Document>('Image', ImageSchema);

export default ImageModel;