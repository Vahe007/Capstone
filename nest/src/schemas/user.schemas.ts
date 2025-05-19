import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ strict: true, timestamps: true })
export class User {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  medicalData: string[];

  @Prop({ default: 0 })
  hasHeartDisease: number;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: false })
  token?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
