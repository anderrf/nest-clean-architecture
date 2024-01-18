import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '../../src/core/entities/unique-entity-id'
import { Slug } from '../../src/domain/forum/enterprise/entities/value-objects/slug'
import {
  Question,
  QuestionProps,
} from './../../src/domain/forum/enterprise/entities/question'
import { faker } from '@faker-js/faker'
import { PrismaService } from '@/prisma/prisma.service'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      slug: Slug.create('example-question'),
      ...override,
    },
    id,
  )
  return question
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = makeQuestion(data)
    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })
    return question
  }
}
