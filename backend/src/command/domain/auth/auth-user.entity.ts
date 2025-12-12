import type { AuthUserRole } from '@prisma/client';
import type { PasswordHasher } from './password-hasher.interface';

type AuthUserProps = {
  id: string;
  email: string;
  passwordHash: string;
  role: AuthUserRole;
};

export class AuthUserEntity {
  private constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _passwordHash: string,
    private readonly _role: AuthUserRole,
  ) {}

  /**
   * エンティティのファクトリメソッド
   */
  static create(props: AuthUserProps): AuthUserEntity {
    return new AuthUserEntity(
      props.id,
      props.email,
      props.passwordHash,
      props.role,
    );
  }

  /**
   * パスワードの検証
   */
  async verifyPassword(
    rawPassword: string,
    hasher: PasswordHasher,
  ): Promise<boolean> {
    return hasher.compare(rawPassword, this._passwordHash);
  }

  // =================================================================
  // Getter (必要なものだけ公開する)
  // =================================================================
  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get role(): AuthUserRole {
    return this._role;
  }
}

