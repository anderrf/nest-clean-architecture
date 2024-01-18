import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { FindQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/find-question-by-slug'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'

@Module({
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
  ],
  imports: [DatabaseModule, CryptographyModule],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
    FindQuestionBySlugUseCase,
  ],
})
export class HttpModule {}
