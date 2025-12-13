import { Email, UserName } from '../value-objects';

interface TeacherProps {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
}

export class TeacherEntity {
  readonly id?: string;
  private _email: Email;
  private _userName: UserName;

  private constructor(props: TeacherProps) {
    this.id = props.id;
    this._email = Email.createRequired(props.email);
    this._userName = UserName.createRequired({
      firstName: props.firstName,
      lastName: props.lastName,
    });
  }

  static create(props: TeacherProps): TeacherEntity {
    return new TeacherEntity(props);
  }

  get firstName(): string {
    return this._userName.firstNameValue;
  }

  get lastName(): string {
    return this._userName.lastNameValue;
  }
}

