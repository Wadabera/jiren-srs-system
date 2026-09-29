import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement, AnnouncementDocument } from './schemas/announcement.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(@InjectModel(Announcement.name) private announcementModel: Model<AnnouncementDocument>) {}

  async create(createAnnouncementDto: CreateAnnouncementDto): Promise<Announcement> {
    const createdAnnouncement = new this.announcementModel(createAnnouncementDto);
    return createdAnnouncement.save();
  }

  async findAll(forRole?: string): Promise<Announcement[]> {
    // A role-targeted query also returns 'all' (broadcast-to-everyone) announcements.
    const filter = forRole
      ? { announcementFor: { $in: [forRole, 'all'] } }
      : {};
    return this.announcementModel.find(filter).sort({ _id: -1 }).exec();
  }
}
