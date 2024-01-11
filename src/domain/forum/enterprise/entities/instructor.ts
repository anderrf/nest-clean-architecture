import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Entity } from '../../../../core/entities/entity'

export interface InstructorProps {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueEntityId) {
    return new Instructor(props, id)
  }

  get name() {
    return this.props.name
  }
}
