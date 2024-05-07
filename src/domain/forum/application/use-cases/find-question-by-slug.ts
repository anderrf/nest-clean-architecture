import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FindQuestionBySlugUseCaseRequest {
  slug: string
}

type FindQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails
  }
>

@Injectable()
export class FindQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: FindQuestionBySlugUseCaseRequest): Promise<FindQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findDetailsbySlug(slug)
    if (!question) {
      return left(new ResourceNotFoundError())
    }
    return right({
      question,
    })
  }
}
