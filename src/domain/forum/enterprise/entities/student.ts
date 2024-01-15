import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Entity } from '../../../../core/entities/entity'

export interface StudentProps {
  name: string
  email: string
  password: string
}

export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityId) {
    return new Student(props, id)
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }
}
