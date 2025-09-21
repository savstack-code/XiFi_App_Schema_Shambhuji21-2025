import { Document, model, Schema } from "mongoose";

export interface ISMSErrorDoc extends Document {
  identifier: number;
  receiver: string;
  isInternational: boolean;
  errorsTxt?: string;
  createdOn?: Date;
}

const smsErrorSchema = new Schema({
  identifier: {
    type: Number,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  isInternational: {
    type: Boolean,
    required: true,
  },
  errorsTxt: {
    type: String,
  },
  createdOn: {
    type: Date,
  },
}).index({ identifier: 1 }, { unique: true });

export const SMSErrorModel = model<ISMSErrorDoc>(
  "SMSError",
  smsErrorSchema,
  "SMSError"
);

export default SMSErrorModel;
