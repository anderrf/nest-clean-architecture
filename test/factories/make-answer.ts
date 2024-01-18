import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '../../src/core/entities/unique-entity-id'
import {
  Answer,
  AnswerProps,
} from '../../src/domain/forum/enterprise/entities/answer'
import { faker } from '@faker-js/faker'
import { PrismaService } from '@/prisma/prisma.service'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId,
) {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
  return answer
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data)
    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    })
    return answer
  }
}
