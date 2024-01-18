import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface FindQuestionBySlugUseCaseRequest {
  slug: string
}

type FindQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>

@Injectable()
export class FindQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: FindQuestionBySlugUseCaseRequest): Promise<FindQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug)
    if (!question) {
      return left(new ResourceNotFoundError())
    }
    return right({
      question,
    })
  }
}
