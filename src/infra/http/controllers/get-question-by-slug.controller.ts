import { FindQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/find-question-by-slug'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { QuestionDetailsPresenter } from '../presenters/question-details-presenter'

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private findQuestionBySlug: FindQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.findQuestionBySlug.execute({ slug })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    return { question: QuestionDetailsPresenter.toHTTP(result.value.question) }
  }
}
