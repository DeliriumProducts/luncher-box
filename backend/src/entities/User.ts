import { EntityError } from '../types';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, Unique } from 'typeorm';
import { Length, IsEmail, Matches } from 'class-validator';
import { EntityNotValidError, DuplicateEntityError, EntityNotFoundError } from '../utils';
import bcrypt from 'bcryptjs';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  @Length(1)
  name: string;

  @Column({ length: 255, unique: true })
  @IsEmail()
  email: string;

  @Column('text')
  @Matches(/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
    message:
      // tslint:disable-next-line
      'Password must contain at least 1 lowercase alphabetical character, 1 special symbol, 1 numeric character and be at least 8 characters long'
  })
  password: string;

  @Column()
  isVerified: boolean;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

export class UserNotFoundError extends EntityNotFoundError<User> {
  constructor() {
    super(User);
  }
}

export class UserNotValidError extends EntityNotValidError<User> {
  constructor(errors: EntityError) {
    super(User, errors);
  }
}

export class DuplicateUserError extends DuplicateEntityError<User> {
  constructor() {
    super(User);
  }
}
