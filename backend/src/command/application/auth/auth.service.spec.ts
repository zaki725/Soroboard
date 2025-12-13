import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import type { IAuthUserRepository } from '../../domain/auth/auth-user.repository.interface';
import type { PasswordHasher } from '../../domain/auth/password-hasher.interface';
import { AuthUserEntity } from '../../domain/auth/auth-user.entity';
import { UnauthorizedError } from '../../../common/errors/unauthorized.error';

describe('AuthService', () => {
  let service: AuthService;
  let repository: IAuthUserRepository;
  let passwordHasher: PasswordHasher;

  beforeEach(async () => {
    const mockRepository: IAuthUserRepository = {
      findByEmail: jest.fn(),
    };

    const mockPasswordHasher: PasswordHasher = {
      compare: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: INJECTION_TOKENS.IAuthUserRepository,
          useValue: mockRepository,
        },
        {
          provide: INJECTION_TOKENS.PasswordHasher,
          useValue: mockPasswordHasher,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<IAuthUserRepository>(
      INJECTION_TOKENS.IAuthUserRepository,
    );
    passwordHasher = module.get<PasswordHasher>(
      INJECTION_TOKENS.PasswordHasher,
    );
  });

  describe('login', () => {
    it('正常系: 正しい認証情報でログイン成功', async () => {
      const authUser = AuthUserEntity.create({
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: '$2b$10$hashedPassword',
        role: 'TEACHER',
      });

      const findByEmailSpy = jest
        .spyOn(repository, 'findByEmail')
        .mockResolvedValue(authUser);

      const compareSpy = jest
        .spyOn(passwordHasher, 'compare')
        .mockResolvedValue(true);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toMatchObject({
        id: authUser.id,
        email: authUser.email,
        role: authUser.role,
      });
      expect(findByEmailSpy).toHaveBeenCalledWith('test@example.com');
      expect(compareSpy).toHaveBeenCalledWith(
        'password123',
        authUser.passwordHash,
      );
    });

    it('異常系: ユーザーが存在しない場合にUnauthorizedErrorを投げる', async () => {
      const findByEmailSpy = jest
        .spyOn(repository, 'findByEmail')
        .mockResolvedValue(null);

      jest.spyOn(passwordHasher, 'compare').mockResolvedValue(false);

      await expect(
        service.login({
          email: 'notfound@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedError);

      expect(findByEmailSpy).toHaveBeenCalledWith('notfound@example.com');
    });

    it('異常系: パスワードが間違っている場合にUnauthorizedErrorを投げる', async () => {
      const authUser = AuthUserEntity.create({
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: '$2b$10$hashedPassword',
        role: 'TEACHER',
      });

      const findByEmailSpy = jest
        .spyOn(repository, 'findByEmail')
        .mockResolvedValue(authUser);

      const compareSpy = jest
        .spyOn(passwordHasher, 'compare')
        .mockResolvedValue(false);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedError);

      expect(findByEmailSpy).toHaveBeenCalledWith('test@example.com');
      expect(compareSpy).toHaveBeenCalledWith(
        'wrong-password',
        authUser.passwordHash,
      );
    });

    it('異常系: タイミング攻撃対策として、ユーザーが存在しない場合でもcompareが呼ばれる', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);

      const compareSpy = jest
        .spyOn(passwordHasher, 'compare')
        .mockResolvedValue(false);

      await expect(
        service.login({
          email: 'notfound@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedError);

      // タイミング攻撃対策: ユーザーが存在しない場合でもダミーハッシュでcompareが呼ばれる
      expect(compareSpy).toHaveBeenCalledWith(
        'password123',
        expect.stringContaining('$2b$10$'),
      );
    });
  });
});

