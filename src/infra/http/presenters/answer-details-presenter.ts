import { AnswerDetails } from './../../../domain/forum/enterprise/entities/value-objects/answer-details'
import { AttachmentPresenter } from './attachment-presenter'

export class AnswerDetailsPresenter {
  static toHTTP(answerDetails: AnswerDetails) {
    return {
      questionId: answerDetails.questionId.toString(),
      authorId: answerDetails.authorId.toString(),
      author: answerDetails.author,
      content: answerDetails.content,
      attachments: answerDetails.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: answerDetails.createdAt,
      updatedAt: answerDetails.updatedAt,
    }
  }
}
