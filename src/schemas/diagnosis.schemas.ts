import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, SchemaTypes } from 'mongoose';
import { User } from './user.schemas';

export type DiagnosisDocument = Diagnosis & Document;

@Schema({ strict: true, timestamps: true })
export class Diagnosis {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  userId: ObjectId;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  requestInput: Record<string, string | number>;

  @Prop({ required: true, type: String, default: null })
  initialDiagnosisResult: string | null;

  @Prop({ requried: true, type: String, default: null })
  mlModelUsed: string | null;

  @Prop({ required: true, type: Number, default: null })
  mlPredictionResult: number | null;

  @Prop({ type: String, default: null })
  errorMessage?: string;

  // @Prop({ required: true, enum: ['processing', 'completed', 'failed'], default: 'processing' })
  // status: string;

  // @Prop({ type: Date })
  // completedAt?: Date;
}

export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);
