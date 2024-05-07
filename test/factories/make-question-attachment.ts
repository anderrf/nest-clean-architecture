import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from './../../src/core/entities/unique-entity-id'

export function makeQuestionAttachment(
  override: Partial<QuestionAttachment>,
  id?: UniqueEntityId,
) {
  const questionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
  return questionAttachment
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentProps> = {},
  ): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(data)
    await this.prisma.attachment.update({
      where: { id: questionAttachment.attachmentId.toString() },
      data: { questionId: questionAttachment.questionId.toString() },
    })
    return questionAttachment
  }
}
