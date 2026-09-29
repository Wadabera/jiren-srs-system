import { Controller, Post, Get, Body, Param, UseGuards, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  @Post()
  async sendMessage(@Body() body: any) {
    const newMsg = new this.messageModel(body);
    return newMsg.save();
  }

  @Get(':userId')
  async getMessages(@Param('userId') userId: string) {
    // Get messages where user is sender or receiver
    return this.messageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: 1 }).exec();
  }

  @Post('read/:id')
  async markRead(@Param('id') id: string) {
    return this.messageModel.findByIdAndUpdate(id, { isRead: true }).exec();
  }
}
