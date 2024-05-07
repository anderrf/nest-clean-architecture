import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch Question Comments (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    await app.init()
  })

  test('[GET] /questions/:questionId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'Anderson Farias',
    })
    const accessToken = jwt.sign({ sub: user.id.toString() })
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const questionId = question.id.toString()
    await Promise.all([
      questionCommentFactory.makePrismaQuestionComment({
        questionId: new UniqueEntityId(questionId),
        content: 'Question Comment 01',
        authorId: user.id,
      }),
      questionCommentFactory.makePrismaQuestionComment({
        questionId: new UniqueEntityId(questionId),
        content: 'Question Comment 02',
        authorId: user.id,
      }),
    ])
    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questionComments: expect.arrayContaining([
        expect.objectContaining({
          content: 'Question Comment 01',
          author: 'Anderson Farias',
        }),
        expect.objectContaining({
          content: 'Question Comment 02',
          author: 'Anderson Farias',
        }),
      ]),
    })
  })
})
