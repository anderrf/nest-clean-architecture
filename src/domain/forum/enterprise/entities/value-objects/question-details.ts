import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Attachment } from '../attachment'
import { Slug } from './slug'
import { ValueObject } from '@/core/entities/value-object'

export interface QuestionDetailsProps {
  questionId: UniqueEntityId
  authorId: UniqueEntityId
  author: string
  title: string
  content: string
  slug: Slug
  attachments: Attachment[]
  bestAnswerId?: UniqueEntityId | null
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  public get questionId(): UniqueEntityId {
    return this.props.questionId
  }

  public get authorId(): UniqueEntityId {
    return this.props.authorId
  }

  public get author(): string {
    return this.props.author
  }

  public get title(): string {
    return this.props.title
  }

  public get content(): string {
    return this.props.content
  }

  public get slug(): Slug {
    return this.props.slug
  }

  public get attachments(): Attachment[] {
    return this.props.attachments
  }

  public get bestAnswerId(): UniqueEntityId | null | undefined {
    return this.props.bestAnswerId
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date | undefined | null {
    return this.props.updatedAt
  }

  static create(props: QuestionDetailsProps): QuestionDetails {
    return new QuestionDetails(props)
  }
}
