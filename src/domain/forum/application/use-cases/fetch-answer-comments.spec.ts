import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { describe, it, beforeEach, expect } from 'vitest'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Comment Comments Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({
      name: 'Anderson Farias',
    })
    await inMemoryStudentsRepository.create(student)
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
        authorId: student.id,
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-2'),
        authorId: student.id,
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
        authorId: student.id,
      }),
    )
    const result = await sut.execute({
      page: 1,
      answerId: 'answer-1',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)
  })

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({
      name: 'Anderson Farias',
    })
    await inMemoryStudentsRepository.create(student)
    const answer = makeAnswer()
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: answer.id, authorId: student.id }),
      )
    }
    const result = await sut.execute({
      page: 2,
      answerId: answer.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)
  })
})
