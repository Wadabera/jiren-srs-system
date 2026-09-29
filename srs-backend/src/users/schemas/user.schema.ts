import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password?: string; // bcrypt hashed

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, enum: ['student', 'teacher', 'director'] })
  role: string;

  @Prop()
  photo: string;

  @Prop()
  banner: string;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
