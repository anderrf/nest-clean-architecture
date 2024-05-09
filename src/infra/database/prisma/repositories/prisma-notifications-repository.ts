import { PaginationParams } from '@/core/repositories/pagination-params'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)
    await this.prisma.notification.create({
      data,
    })
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    })
    if (!notification) {
      return null
    }
    return PrismaNotificationMapper.toDomain(notification)
  }

  async delete(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)
    await this.prisma.notification.delete({
      where: {
        id: data.id,
      },
    })
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.update({
      where: {
        id: notification.id.toString(),
      },
      data,
    })
  }

  async findManyRecent({ page }: PaginationParams): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return notifications.map(PrismaNotificationMapper.toDomain)
  }
}
