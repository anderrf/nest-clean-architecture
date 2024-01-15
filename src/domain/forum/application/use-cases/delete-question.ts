import { Either } from './../../../../core/either'
import { left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Question } from '../../enterprise/entities/question'

interface DeleteQuestionUseCaseRequest {
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}
  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      return left(new ResourceNotFoundError())
    }
    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }
    await this.questionsRepository.delete(question)
    return right({ question })
  }
}
