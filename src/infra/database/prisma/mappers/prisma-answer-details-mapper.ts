import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-details'
import {
  Answer as PrismaAnswer,
  Attachment as PrismaAttachment,
  User as PrismaUser,
} from 'prisma/prisma-client'

import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaAnswerDetails = PrismaAnswer & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaAnswerDetailsMapper {
  static toDomain(raw: PrismaAnswerDetails): AnswerDetails {
    return AnswerDetails.create({
      questionId: new UniqueEntityId(raw.questionId),
      answerId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
