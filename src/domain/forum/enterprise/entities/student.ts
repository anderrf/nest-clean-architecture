import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Entity } from '../../../../core/entities/entity'

export interface StudentProps {
  name: string
}

export class Instructor extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityId) {
    return new Instructor(props, id)
  }

  get name() {
    return this.props.name
  }
}
