import { Document, model, Schema } from "mongoose";

export interface IGenerateDoc extends Document {
  collectionType: string;
  key?: number;
}

const generateSchema = new Schema({
  collectionType: {
    type: String,
    required: true,
  },
  key: {
    type: Number,
    default: 0,
  },
});

export const GenerateModel = model<IGenerateDoc>(
  "generate",
  generateSchema,
  "generate"
);

export default GenerateModel;
