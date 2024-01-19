import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import request from 'supertest'
import { PrismaService } from '@/prisma/prisma.service'
import { AnswerFactory } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Edit Answer [E2E]', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    await app.init()
  })
  test('[PUT] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const questionId = question.id.toString()
    const answer = await answerFactory.makePrismaAnswer({
      content: 'Old Answer Content',
      questionId: new UniqueEntityId(questionId),
      authorId: user.id,
    })
    const answerId = answer.id.toString()
    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'New Answer Content' })
    expect(response.statusCode).toBe(204)
    const answerOnDatabase = await prisma.answer.findFirst({
      where: { content: 'New Answer Content' },
    })
    expect(answerOnDatabase).toBeTruthy()
  })
})
