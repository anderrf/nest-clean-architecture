import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('FetchRecentQuestions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Anderson Farias',
        email: 'anderson.farias@example.com',
        password: await hash('123456', 8),
      },
    })
    const accessToken = jwt.sign({ sub: user.id })
    await prisma.question.createMany({
      data: [
        {
          title: 'Question 01',
          slug: 'question-01',
          content: 'Example content',
          authorId: user.id,
        },
        {
          title: 'Question 02',
          slug: 'question-02',
          content: 'Another content',
          authorId: user.id,
        },
      ],
    })
    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 01' }),
        expect.objectContaining({ title: 'Question 02' }),
      ],
    })
  })
})
