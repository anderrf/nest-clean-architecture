import { makeQuestionComment } from 'test/factories/make-question-comment'
import { describe, it, beforeEach, expect } from 'vitest'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Comment Comments Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const user = makeStudent({ name: 'Anderson Farias' })
    inMemoryStudentsRepository.create(user)
    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: user.id,
    })
    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityId('question-2'),
      authorId: user.id,
    })
    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: user.id,
    })
    await inMemoryQuestionCommentsRepository.create(comment1)
    await inMemoryQuestionCommentsRepository.create(comment2)
    await inMemoryQuestionCommentsRepository.create(comment3)
    const result = await sut.execute({
      page: 1,
      questionId: 'question-1',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(2)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'Anderson Farias',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'Anderson Farias',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated question comments', async () => {
    const user = makeStudent({ name: 'Anderson Farias' })
    inMemoryStudentsRepository.create(user)
    const question = makeQuestion()
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: question.id, authorId: user.id }),
      )
    }
    const result = await sut.execute({
      page: 2,
      questionId: question.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(2)
  })
})
