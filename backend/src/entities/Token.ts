import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNotFoundError } from '../utils';
import { User } from './User';

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
