import {UserEntity} from 'src/app/user/entities/user.entity';
import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';

@Entity({name: 'token'})
export class TokenEntity {
  static readonly BEARER_LENGTH: number = 200;
  @PrimaryColumn({
    name: 'bearer',
    length: TokenEntity.BEARER_LENGTH,
    unique: true,
  })
  bearer!: string;

  @Column({name: 'expires_at', type: 'timestamp'})
  expiresAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.tokens)
  @JoinColumn({name: 'id_user'})
  user?: UserEntity;
}
