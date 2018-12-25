import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from 'typeorm';
import { User } from './User';
import { EntityNotFoundError } from '../utils';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}

export class TokenNotFoundError extends EntityNotFoundError<Token> {
  constructor() {
    super(Token);
  }
}
