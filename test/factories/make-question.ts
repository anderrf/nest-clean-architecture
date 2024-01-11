import { UniqueEntityId } from '../../src/core/entities/unique-entity-id'
import { Slug } from '../../src/domain/forum/enterprise/entities/value-objects/slug'
import {
  Question,
  QuestionProps,
} from './../../src/domain/forum/enterprise/entities/question'
import { faker } from '@faker-js/faker'

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
