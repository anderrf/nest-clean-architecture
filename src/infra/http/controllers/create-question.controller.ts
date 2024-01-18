import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})
type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
  ) {
    try {
      const { title, content } = body
      const userId = user.sub
      const result = await this.createQuestion.execute({
        title,
        content,
        authorId: userId,
        attachmentsIds: [],
      })
      if (result.isLeft()) {
        throw new BadRequestException()
      }
    } catch (err) {
      console.log(err)
    }
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}
