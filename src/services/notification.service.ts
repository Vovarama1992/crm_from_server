import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(
    title: string,
    content: string,
    createdBy: number,
  ): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        title,
        content,
        createdBy,
        seenBy: [], // Инициализация пустым массивом
      },
    });
  }

  async getNotifications(userId: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        NOT: {
          seenBy: {
            has: userId,
          },
        },
      },
    });
  }

  async markNotificationAsSeen(
    notificationId: number,
    userId: number,
  ): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        seenBy: {
          push: userId,
        },
      },
    });
  }
}
