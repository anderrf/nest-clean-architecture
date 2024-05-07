import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { Attachment } from '../attachment'

export interface AnswerDetailsProps {
  questionId: UniqueEntityId
  answerId: UniqueEntityId
  authorId: UniqueEntityId
  author: string
  content: string
  attachments: Attachment[]
  createdAt: Date
  updatedAt?: Date | null
}

export class AnswerDetails extends ValueObject<AnswerDetailsProps> {
  public get questionId(): UniqueEntityId {
    return this.props.questionId
  }

  public get answerId(): UniqueEntityId {
    return this.props.answerId
  }

  public get authorId(): UniqueEntityId {
    return this.props.authorId
  }

  public get author(): string {
    return this.props.author
  }

  public get content(): string {
    return this.props.content
  }

  public get attachments(): Attachment[] {
    return this.props.attachments
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date | undefined | null {
    return this.props.updatedAt
  }

  static create(props: AnswerDetailsProps): AnswerDetails {
    return new AnswerDetails(props)
  }
}
