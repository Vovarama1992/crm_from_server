import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { Notification } from '@prisma/client';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(
    @Body() body: { title: string; content: string; createdBy: number },
  ): Promise<Notification> {
    return this.notificationService.createNotification(
      body.title,
      body.content,
      body.createdBy,
    );
  }

  @Get(':userId')
  async getNotifications(
    @Param('userId') userId: string,
  ): Promise<Notification[]> {
    return this.notificationService.getNotifications(Number(userId));
  }

  @Patch(':id/seen')
  async markNotificationAsSeen(
    @Param('id') id: string,
    @Body() body: { userId: number },
  ): Promise<Notification> {
    return this.notificationService.markNotificationAsSeen(
      Number(id),
      body.userId,
    );
  }
}
