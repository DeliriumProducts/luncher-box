import bcrypt from 'bcryptjs';
import { IsEmail, Length, Matches, IsUrl } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityError } from '../types';
import { DuplicateEntityError, EntityNotFoundError, EntityNotValidError } from '../utils';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text')
  @Length(1)
  name: string;

  @Column({ length: 255, unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Matches(/^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/, {
    message:
      // tslint:disable-next-line
      'Password must contain at least 1 lowercase alphabetical character, 1 numeric character and be at least 8 characters long'
  })
  password: string;

  @Column()
  isVerified: boolean;

  /**
   * Hash password using bcrypt before inserting
   */
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 12);
  }

  /**
   * Check if the password matches with the one in the database
   * @param password
   */
  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

export class UserNotFoundError extends EntityNotFoundError<User> {
  constructor() {
    super('User');
  }
}

export class UserNotValidError extends EntityNotValidError<User> {
  constructor(errors: EntityError) {
    super('User', errors);
  }
}

export class DuplicateUserError extends DuplicateEntityError<User> {
  constructor() {
    super('User');
  }
}
