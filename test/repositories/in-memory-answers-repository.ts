import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-details'

import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)
    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id)
    if (!answer) {
      return null
    }
    return answer
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )
    this.items.splice(itemIndex, 1)
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )
    this.items[itemIndex] = answer
    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    )
    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
    return answers
  }

  async findManyByQuestionIdWithDetails(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<AnswerDetails[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
    const authors = answers.map((answer) => {
      const author = this.studentsRepository.items.find((student) => {
        return student.id.equals(answer.authorId)
      })
      if (!author) {
        throw new Error(
          `Author with ID "${answer.authorId.toString()}" not found`,
        )
      }
      return author
    })

    const answerAttachments = answers.flatMap((answer) =>
      this.answerAttachmentsRepository.items.filter((answerAttachment) => {
        return answerAttachment.answerId.equals(answer.id)
      }),
    )
    const attachments = answerAttachments.map((answerAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(answerAttachment.id)
      })
      if (!attachment) {
        throw new Error(`Attachment with ID "${answerAttachment.id}" not found`)
      }
      return attachment
    })
    return answers.map((answer) => {
      const answerAttachmentsIdsList = answerAttachments
        .filter((answerAttachment) =>
          answerAttachment.answerId.equals(answer.id),
        )
        .map((answerAttachment) => answerAttachment.id.toString())
      const attachmentsList = attachments.filter((attachment) =>
        answerAttachmentsIdsList.includes(attachment.id.toString()),
      )
      return AnswerDetails.create({
        questionId: answer.questionId,
        answerId: answer.id,
        authorId: answer.authorId,
        author: authors.find((author) => author.id.equals(answer.authorId))!
          .name,
        content: answer.content,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
        attachments: attachmentsList,
      })
    })
  }
}
