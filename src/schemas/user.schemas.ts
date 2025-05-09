import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema({ strict: true, timestamps: true })
export class User {
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

  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
