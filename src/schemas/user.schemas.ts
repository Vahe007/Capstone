import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

export class User {
    @Prop({required: true})
    firstName: string;

    @Prop({required: true})
    lastName: string;

    @Prop({ required: true})
    email: string;

    @Prop({required: true, unique: true})
    userName: string;

    @Prop({required: true})
    passwordHash: string;

    @Prop()
    medicalData: string[];

    @Prop({default: 0})
    hasHeartDisease: number;
}

export const UserSchema = SchemaFactory.createForClass(User);