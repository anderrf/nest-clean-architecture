import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'
import { z } from 'zod'

import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))
type PageQueryParamsSchema = z.infer<typeof pageQueryParamSchema>
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
  ) {
    try {
      const result = await this.fetchRecentQuestions.execute({
        page,
      })
      if (result.isLeft()) {
        throw new BadRequestException()
      }
      const questions = result.value.questions
      return {
        questions: questions.map(QuestionPresenter.toHTTP),
      }
    } catch (err) {
      console.log(err)
    }
  }
}
