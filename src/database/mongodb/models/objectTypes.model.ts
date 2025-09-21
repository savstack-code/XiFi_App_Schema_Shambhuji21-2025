import { Document, model, Schema } from "mongoose";

export interface IObjectTypesDoc extends Document {
  objectTypesId: string;
  objectTypename: string;
  maxLimit?: number;
  followupObject?: number;
}

const objectTypesSchema = new Schema({
  objectTypesId: {
    type: String,
    required: true,
  },
  objectTypename: {
    type: String,
    required: true,
  },
  maxLimit: {
    type: Number,
  },
  followupObject: {
    type: Number,
  },
});

export const ObjectTypesModel = model<IObjectTypesDoc>(
  "ObjectTypes",
  objectTypesSchema,
  "ObjectTypes"
);

export default ObjectTypesModel;
