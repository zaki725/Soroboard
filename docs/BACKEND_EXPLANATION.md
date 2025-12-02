# バックエンド実装説明書

## 1. 設計思想

このバックエンドアプリケーションは、以下の設計思想に基づいて構築されています。

### 1.1 DDD（ドメイン駆動開発）とCQRS

**思想**: 書き込み（Command）と読み取り（Query）を分離し、それぞれに最適なアーキテクチャを適用する。

- **Command側**: DDDを用いて、ビジネスロジックをドメイン層に集約し、データの整合性を保つ
- **Query側**: Port-Adapterパターンに基づき、Prismaを直接使用して読み取り処理を最適化

**なぜこの思想か**:

- Command側でDDDを用いると、データ取得処理（`Get`）が複雑になりがち
- Query側でPrismaを直接使用することで、パフォーマンスを最適化
- 責務の分離により、保守性が向上

### 1.2 層の分離（Layered Architecture）

**思想**: 各層の責務を明確にし、依存関係を一方向にする。各層は「何をすべきか」と「何をすべきでないか」を明確に定義することで、保守性とテスタビリティを向上させる。

#### 各レイヤーの責務と設計思想

##### Controller層（HTTP層）

**責務**: HTTPリクエスト/レスポンスの処理のみ。ビジネスロジックは含まない。

**何をすべきか**:

- HTTPリクエストの受け取り（パラメータ、ボディ、クエリ）
- バリデーション（Zodスキーマによる型チェック）
- Application Serviceの呼び出し
- HTTPレスポンスの返却

**何をすべきでないか**:

- ビジネスロジックの実装
- データベースへの直接アクセス
- データの加工・変換（DTO変換は除く）

**なぜこの設計か**:

- Controllerは「HTTPの世界」と「アプリケーションの世界」の境界線
- ビジネスロジックをControllerに書くと、HTTPに依存したロジックになり、テストが困難になる
- バリデーションはControllerで完結させることで、不正なデータが下位層に流れるのを防ぐ

##### Application層（アプリケーションサービス層）

**責務**: ビジネスロジックの調整とトランザクション管理。複数のRepositoryやDAOを組み合わせて、ユースケースを実現する。

**Command側の責務**:

- Entityの作成（ファクトリメソッドを使用）
- Entityの取得（Repository経由）
- Entityの振る舞いメソッドの呼び出し
- Repositoryへの保存
- Query側のDAOを使用した表示用データの取得

**Query側の責務**:

- DAOの呼び出し
- データの加工（ページネーション、フィルタリング等）
- エラーハンドリング（NotFoundError等）

**何をすべきか**:

- 複数のRepository/DAOを組み合わせた処理
- トランザクション管理（必要に応じて）
- エラーハンドリングとログ出力

**何をすべきでないか**:

- ドメインロジックの実装（Entityに書く）
- データベースクエリの直接記述（Repository/DAOに書く）
- HTTP関連の処理（Controllerに書く）

**なぜこの設計か**:

- Application層は「ユースケース」を実現する層
- 複数のEntityやRepositoryを組み合わせる処理は、Application層で行う
- ドメインロジックをEntityに集約することで、ビジネスルールの変更が容易になる

##### Domain層（ドメイン層）

**責務**: ドメインロジックの実装。ビジネスルールを表現する。

**含まれるもの**:

- **Entity**: ドメインオブジェクト。ビジネスロジックを持つ
- **Repositoryインターフェース**: データアクセスの抽象化
- **Mapper**: EntityとPrisma型の変換

**Entityの責務**:

- ビジネスルールの実装（バリデーション、不変条件の保証）
- 振る舞いメソッドの提供（`changeEmail`、`updateProfile`等）
- 値オブジェクト（Value Object）の使用

**Value Object（値オブジェクト）の思想**:

- **VOは積極的に使うべき**: 特に「バリデーション」や「ルール」がある値は必ずVOにする
- **プリミティブ型強迫観念（Primitive Obsession）を避ける**: ドメインにとって意味のある値はVOにする
- **VOにすべき基準**:
  - 値に**「ルール」や「振る舞い」**がある場合（バリデーションが必要なもの、特定の形式があるもの）
  - 複数の値がセットで意味を持つもの（姓名、住所、お金など）
- **VOにしなくていい場合**:
  - 単なるフラグ（boolean）で、特別なルールがない場合
  - システム内部でしか使わない一時的なカウンタなど
  - 「説明文（description）」のように、文字数制限以外に特にルールがなく、ロジックも発生しないもの
- **VOの中にロジックを持たせる**: そのデータだけを使って完結する計算（`getFullName`、`isExpired`、`add(Money)`など）はVOに入れる
  - データ（姓・名）とそのデータを使ったロジック（フルネームを返す）は、近くにあるべき（高凝集）
  - ロジックをエンティティやサービスに書くと、コードが散らばる
- **エンティティを軽くする**: VOに細かいルールやロジックを任せることで、エンティティは「いつ、何をするか」という重要なビジネスフローの記述に集中できる
- **VOの特徴**:
  - 不変（Immutable）。値が変わる時は新しいVOを作る
  - 値が同じなら同じとみなす（値による等価性）
  - 自己完結する計算・フォーマットロジックを持つ
- **エンティティとVOの責務の分け方**:
  - **VO**: 自己完結する計算・フォーマット（例：フルネーム結合、金額の加算、日付のフォーマット）
  - **Entity**: 状態変化・ドメインの調整（例：パスワード変更、申し込みステータスの更新）

**何をすべきか**:

- ビジネスルールの実装
- 不変条件の保証
- ドメインの概念を表現

**何をすべきでないか**:

- データベースへの直接アクセス（Repositoryインターフェースを使用）
- HTTP関連の処理
- フレームワークへの依存

**なぜこの設計か**:

- Entityは「ビジネスの心臓部」。ビジネスルールをEntityに集約することで、変更に強い設計になる
- RepositoryインターフェースをDomain層に置くことで、Infra層への依存を逆転させる（Dependency Inversion Principle）
- ファクトリメソッド（`static create`）を使うことで、Entityの作成を制御し、不変条件を保証する

##### Infra層（インフラストラクチャ層）

**責務**: 外部システム（データベース、外部API等）との連携。

**含まれるもの**:

- **Repository実装**: Repositoryインターフェースの実装
- **Prisma**: データベースアクセス

**Repositoryの責務**:

- Prismaを使ったデータベースアクセス
- EntityとPrisma型の変換（Mapperを使用）
- エラーハンドリング（Prismaのエラーコードをカスタムエラーに変換）

**何をすべきか**:

- データベースへのアクセス
- EntityとPrisma型の変換
- エラーハンドリングとログ出力

**何をすべきでないか**:

- ビジネスロジックの実装（Entityに書く）
- データの加工（Application層に書く）

**なぜこの設計か**:

- Repositoryは「データの永続化」のみを担当
- Mapperを使用することで、EntityとPrisma型を完全に分離
- Prismaのエラーコードをカスタムエラーに変換することで、上位層がPrismaに依存しない

##### DAO層（データアクセスオブジェクト層）

**責務**: Query側でのデータアクセス。複雑なクエリの構築とDTOへの変換。

**含まれるもの**:

- **DAO**: Prismaを使ったデータアクセス
- **DTO変換**: Prisma型からDTOへの変換

**DAOの責務**:

- Prismaを使った複雑なクエリの構築
- データのフィルタリング、ソート、ページネーション
- DTOへの変換（`fromQuery`メソッドを使用）

**何をすべきか**:

- データベースクエリの構築（WHERE句、JOIN、集計等）
- データの加工（フィルタリング、ソート、ページネーション）
- DTOへの変換

**何をすべきでないか**:

- ビジネスロジックの実装（Application層に書く）
- Entityの使用（Query側ではEntityを使わない）

**なぜこの設計か**:

- Query側は「読み取り専用」。パフォーマンスを最適化するため、Prismaを直接使用
- 複雑なクエリはDAO層に集約することで、保守性が向上
- DTO変換をDAO層で行うことで、Application層をシンプルに保つ

**依存関係**:

- **Command**: `controller` → `application` → `domain` ← `infra`
- **Query**: `controller` → `application` ← `dao`

### 1.3 モジュールの独立性

**思想**: 機能ごとにモジュールを分離し、依存関係を最小限に抑える。

- すべてのモジュールは`modules/`配下に配置
- Query/Commandごとにモジュールを分離
- 統合モジュールでQuery/Commandをまとめる

---

## 2. 技術スタック

- **NestJS**: フレームワーク
- **TypeScript**: 型安全性
- **Prisma**: ORM
- **PostgreSQL**: データベース
- **Zod**: バリデーション
- **Swagger**: APIドキュメント

---

## 3. ディレクトリ構成と配置ルール

```
src/
├── command/              # 書き込み・更新・削除処理
│   ├── application/      # アプリケーションサービス層
│   ├── controller/       # コントローラー層
│   ├── domain/           # ドメイン層（Entity、Repositoryインターフェース、Mapper）
│   ├── dto/              # DTO定義
│   ├── infra/            # インフラストラクチャ層（Repository実装）
│   ├── constants/        # 定数定義
│   └── types/            # 型定義
│
├── query/                # 読み取り専用API処理
│   ├── application/      # アプリケーションサービス層
│   ├── controller/       # コントローラー層
│   ├── dao/              # DAO（データアクセスオブジェクト）層
│   ├── dto/              # DTO定義
│   └── types/            # 型定義
│
├── modules/              # モジュール定義（NestJSモジュール）
│   └── {feature-name}/
│       ├── {feature}-query.module.ts
│       ├── {feature}-command.module.ts
│       └── {feature}.module.ts
│
├── common/               # 共通処理
│   ├── errors/           # エラー定義
│   ├── filters/          # フィルター（グローバル例外フィルター）
│   ├── interceptors/     # インターセプター（ロギング）
│   ├── pipes/            # パイプ（バリデーションパイプ）
│   ├── services/         # 共通サービス（TraceService）
│   └── utils/            # ユーティリティ関数
│
└── config/               # 設定（ロガーなど）
```

---

## 4. コーディング時の具体的な指針

### 4.1 各レイヤーの実装パターン

#### 処理の流れと各レイヤーの責務

```
HTTPリクエスト
  ↓
【Controller層】
  - HTTPリクエストの受け取り
  - バリデーション（Zodスキーマ）
  - Application Serviceの呼び出し
  ↓
【Application層】
  - ビジネスロジックの調整
  - Entityの操作（Command側）
  - Repository/DAOの呼び出し
  ↓
【Domain層（Command側のみ）】
  - Entityの振る舞いメソッド
  - ビジネスルールの実装
  ↓
【Infra層（Command側） / DAO層（Query側）】
  - データベースアクセス
  - Entity/DTOへの変換
  ↓
【Application層】
  - レスポンスの構築
  - エラーハンドリング
  ↓
【Controller層】
  - HTTPレスポンスの返却
```

#### ✅ Controller層の書き方

**責務**: HTTPリクエスト/レスポンスの処理のみ。ビジネスロジックは含まない。

**なぜこの書き方か**:

- Controllerは「HTTPの世界」と「アプリケーションの世界」の境界線
- バリデーションはControllerで完結させることで、不正なデータが下位層に流れるのを防ぐ
- Application Serviceの呼び出しのみを行うことで、ビジネスロジックへの依存を避ける

```typescript
// command/controller/user/user.controller.ts
import { Controller, Post, Put, Body, Param } from '@nestjs/common';
import { z } from 'zod';
import { UserService } from '../../application/user/user.service';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { createUserRequestSchema } from '../../dto/user/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createUserRequestSchema))
    dto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    // ✅ OK: 認証情報の取得（HTTP層の責務）
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    // ✅ OK: Application Serviceの呼び出しのみ
    return this.userService.create({
      email: dto.email,
      role: dto.role,
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      departmentId: dto.departmentId,
      userId,
    });
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ZodValidationPipe(z.string().min(1, 'ユーザーIDは必須です')),
    )
    id: string,
    @Body(new ZodValidationPipe(updateUserRequestBodySchema))
    body: Omit<UpdateUserRequestDto, 'id'>,
  ): Promise<UserResponseDto> {
    const userId = 'system';

    // ✅ OK: Application Serviceの呼び出しのみ
    return this.userService.update({
      id,
      email: body.email,
      role: body.role,
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender,
      departmentId: body.departmentId,
      userId,
    });
  }
}
```

**❌ Controllerでやってはいけないこと**:

```typescript
// ❌ NG: ビジネスロジックをControllerに書く
@Post()
async create(@Body() dto: CreateUserRequestDto) {
  // ❌ NG: バリデーションロジック
  if (!dto.email.includes('@')) {
    throw new BadRequestException('メールアドレスの形式が正しくありません');
  }

  // ❌ NG: データベースへの直接アクセス
  const existingUser = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });

  // ❌ NG: データの加工
  const userData = {
    ...dto,
    email: dto.email.toLowerCase(),
  };

  return this.userService.create(userData);
}
```

#### ✅ Application層の書き方（Command側）

**責務**: ビジネスロジックの調整とトランザクション管理。複数のRepositoryやDAOを組み合わせて、ユースケースを実現する。

**なぜこの書き方か**:

- Application層は「ユースケース」を実現する層
- Entityの作成はファクトリメソッドを使用することで、不変条件を保証
- Entityの振る舞いメソッドを使用することで、ビジネスロジックをEntityに集約
- Query側のDAOを使用することで、表示用データを取得（Command側ではEntityのみを扱う）

```typescript
// command/application/user/user.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { UserEntity } from '../../domain/user/user.entity';
import { UserDao } from '../../../query/dao/user/user.dao';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';

@Injectable()
export class UserService {
  constructor(
    @Inject(INJECTION_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userDao: UserDao, // Query側のDAOを使用
  ) {}

  async create(params: CreateParams): Promise<UserResponseDto> {
    // ✅ OK: Entityの作成（ファクトリメソッドを使用）
    // ビジネスロジックはEntityに集約されている
    const userEntity = UserEntity.create({
      email: params.email,
      role: params.role,
      firstName: params.firstName,
      lastName: params.lastName,
      gender: params.gender,
      departmentId: params.departmentId,
      createdBy: params.userId,
      updatedBy: params.userId,
    });

    // ✅ OK: Repositoryで保存（Entityをそのまま渡す）
    const created = await this.userRepository.create(userEntity);

    // ✅ OK: Query側のDAOを使って完全な情報を取得
    // Command側ではEntityのみを扱い、表示用データはQuery側のDAOを使用
    const userWithRelations = await this.userDao.findOne({ id: created.id });
    if (!userWithRelations) {
      throw new InternalServerError(
        'ユーザー情報の取得に失敗しました。データの整合性に問題があります。',
      );
    }

    return userWithRelations;
  }

  async update(params: UpdateParams): Promise<UserResponseDto> {
    // ✅ OK: RepositoryからEntityを取得
    const userEntity = await this.userRepository.findById(params.id);
    if (!userEntity) {
      throw new NotFoundError('ユーザー', params.id);
    }

    // ✅ OK: Entityの振る舞いメソッドを使用して更新
    // ビジネスロジック（値の変更チェック等）はEntity側で処理される
    userEntity.changeEmail({
      email: params.email,
      updatedBy: params.userId,
    });

    userEntity.changeRole({
      role: params.role,
      updatedBy: params.userId,
    });

    userEntity.updateProfile({
      firstName: params.firstName,
      lastName: params.lastName,
      gender: params.gender,
      updatedBy: params.userId,
    });

    userEntity.changeDepartment({
      departmentId: params.departmentId,
      updatedBy: params.userId,
    });

    // ✅ OK: Repositoryで保存（Entityをそのまま渡す）
    await this.userRepository.update(userEntity);

    // ✅ OK: Query側のDAOを使って最新の情報を取得
    const userWithRelations = await this.userDao.findOne({ id: params.id });
    if (!userWithRelations) {
      throw new InternalServerError(
        'ユーザー情報の取得に失敗しました。データの整合性に問題があります。',
      );
    }

    return userWithRelations;
  }
}
```

**❌ Application層でやってはいけないこと**:

```typescript
// ❌ NG: ビジネスロジックをApplication層に書く
async update(params: UpdateParams) {
  const userEntity = await this.userRepository.findById(params.id);

  // ❌ NG: ビジネスロジック（Entityに書くべき）
  if (params.email !== userEntity.email) {
    // メールアドレスの重複チェック
    const existingUser = await this.userDao.findOne({ email: params.email });
    if (existingUser) {
      throw new ConflictError('メールアドレスが既に使用されています');
    }
  }

  // ❌ NG: 直接プロパティを変更（Entityの振る舞いメソッドを使うべき）
  userEntity.email = params.email;
  userEntity.role = params.role;

  await this.userRepository.update(userEntity);
}
```

#### ✅ Application層の書き方（Query側）

**責務**: DAOの呼び出しとデータの加工。エラーハンドリング。

**なぜこの書き方か**:

- Query側は「読み取り専用」。パフォーマンスを最適化するため、Prismaを直接使用
- データの加工（ID文字列の変換等）はApplication層で行う
- エラーハンドリング（NotFoundError等）はApplication層で行う

```typescript
// query/application/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { UserDao } from '../../dao/user/user.dao';
import { UserResponseDto } from '../../dto/user/user-response.dto';
import { UserListResponseDto } from '../../dto/user/user-list-response.dto';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { splitIds } from '../../../common/utils/string.utils';
import type { UserRole, Gender } from '../../types/user.types';

@Injectable()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  async findOne({ id }: { id: string }): Promise<UserResponseDto> {
    // ✅ OK: DAOの呼び出し
    const user = await this.userDao.findOne({ id });

    // ✅ OK: エラーハンドリング（Application層の責務）
    if (!user) {
      throw new NotFoundError('ユーザー', id);
    }

    return user;
  }

  async findMany({
    page = 1,
    pageSize = 10,
    id,
    search,
    role,
    gender,
    departmentId,
  }: FindManyParams): Promise<UserListResponseDto> {
    // ✅ OK: データの加工（Application層の責務）
    // ID文字列を配列に変換（カンマ/スペース区切り対応）
    const ids = id ? splitIds(id) : undefined;

    // ✅ OK: DAOの呼び出し
    const { users, total } = await this.userDao.findMany({
      page,
      pageSize,
      ids,
      search,
      role,
      gender,
      departmentId,
    });

    // ✅ OK: レスポンスの構築（Application層の責務）
    return new UserListResponseDto({
      users,
      total,
      page,
      pageSize,
    });
  }
}
```

**❌ Application層でやってはいけないこと**:

```typescript
// ❌ NG: データベースクエリを直接記述（DAOに書くべき）
async findMany(params: FindManyParams) {
  // ❌ NG: Prismaを直接使用
  const users = await this.prisma.user.findMany({
    where: { role: params.role },
  });

  // ❌ NG: データの加工をアプリケーション側で行う（DB側で完結させるべき）
  const filteredUsers = users.filter((user) => user.email.includes('@'));

  return filteredUsers;
}
```

#### ✅ Repository層の書き方（Command側）

**責務**: データの永続化。EntityとPrisma型の変換。

**なぜこの書き方か**:

- Repositoryは「データの永続化」のみを担当
- Mapperを使用することで、EntityとPrisma型を完全に分離
- Entityを返すことで、上位層がPrismaに依存しない

```typescript
// command/infra/user/user.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { UserEntity } from '../../domain/user/user.entity';
import { UserMapper } from '../../domain/user/user.mapper';
import { CustomLoggerService } from '../../../config/custom-logger.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotFoundError } from '../../../common/errors/not-found.error';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    try {
      // ✅ OK: Mapperを使用してEntityからPrisma型に変換
      const data = await this.prisma.user.create({
        data: UserMapper.toPersistence(user),
      });

      // ✅ OK: Mapperを使用してPrisma型からEntityに変換
      return UserMapper.toDomain(data);
    } catch (error) {
      // ✅ OK: エラーハンドリングとログ出力（Repository層の責務）
      this.logger.error(error, undefined, 'UserRepository');
      throw error;
    }
  }

  async update(user: UserEntity): Promise<UserEntity> {
    try {
      if (!user.id) {
        throw new Error(getEntityIdRequired('User'));
      }

      // ✅ OK: Mapperを使用してEntityからPrisma型に変換
      const data = await this.prisma.user.update({
        where: { id: user.id },
        data: UserMapper.toUpdatePersistence(user),
      });

      // ✅ OK: Mapperを使用してPrisma型からEntityに変換
      return UserMapper.toDomain(data);
    } catch (error) {
      this.logger.error(error, undefined, 'UserRepository');

      // ✅ OK: Prismaのエラーコードをカスタムエラーに変換
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('ユーザー', user.id!);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<UserEntity | null> {
    try {
      // ✅ OK: Prismaを使ったデータベースアクセス
      const userData = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!userData) {
        return null;
      }

      // ✅ OK: Mapperを使用してPrisma型からEntityに変換
      return UserMapper.toDomain(userData);
    } catch (error) {
      this.logger.error(error, undefined, 'UserRepository');
      throw error;
    }
  }
}
```

**❌ Repositoryでやってはいけないこと**:

```typescript
// ❌ NG: ビジネスロジックをRepositoryに書く
async create(user: UserEntity) {
  // ❌ NG: バリデーション（Entityに書くべき）
  if (!user.email.includes('@')) {
    throw new Error('メールアドレスの形式が正しくありません');
  }

  // ❌ NG: データの加工（Application層に書くべき）
  const userData = {
    ...user,
    email: user.email.toLowerCase(),
  };

  return this.prisma.user.create({ data: userData });
}

// ❌ NG: Prisma型を直接返す（Entityを返すべき）
async findById(id: string): Promise<User | null> {
  return this.prisma.user.findUnique({ where: { id } });
}
```

#### ✅ DAO層の書き方（Query側）

**責務**: データベースクエリの構築とDTOへの変換。データの加工（フィルタリング、ソート、ページネーション）はDB側で完結させる。

**なぜこの書き方か**:

- Query側は「読み取り専用」。パフォーマンスを最適化するため、Prismaを直接使用
- 複雑なクエリはDAO層に集約することで、保守性が向上
- データの加工（フィルタリング、ソート、ページネーション）はDB側で完結させることで、パフォーマンスを最適化
- DTO変換をDAO層で行うことで、Application層をシンプルに保つ

```typescript
// query/dao/user/user.dao.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';
import type { UserRole, Gender } from '../../types/user.types';
import { UserResponseDto } from '../../dto/user/user-response.dto';

@Injectable()
export class UserDao {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({ id }: { id: string }): Promise<UserResponseDto | null> {
    // ✅ OK: Prismaを使ったデータベースアクセス
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        interviewer: {
          select: { category: true },
        },
        department: {
          select: { id: true, name: true },
        },
      },
    });

    if (!user) {
      return null;
    }

    // ✅ OK: DTOのfromQueryメソッドを使用して変換
    return UserResponseDto.fromQuery(user);
  }

  async findMany({
    page = 1,
    pageSize = 10,
    ids,
    search,
    role,
    gender,
    departmentId,
  }: FindManyParams): Promise<{
    users: UserResponseDto[];
    total: number;
  }> {
    const skip = (page - 1) * pageSize;
    const where: Prisma.UserWhereInput = {};

    // ✅ OK: データの加工（フィルタリング）はDB側で完結
    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) where.role = role;
    if (gender) where.gender = gender;
    if (departmentId) where.departmentId = departmentId;

    // ✅ OK: データの加工（集計）はDB側で完結
    const [usersData, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          interviewer: { select: { category: true } },
          department: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    // ✅ OK: DTOのfromQueryメソッドを使用して変換
    const users = usersData.map((user) => UserResponseDto.fromQuery(user));

    return { users, total };
  }
}
```

**❌ DAOでやってはいけないこと**:

```typescript
// ❌ NG: データの加工をアプリケーション側で行う（DB側で完結させるべき）
async findMany(params: FindManyParams) {
  // ❌ NG: 全件取得してからフィルタリング
  const allUsers = await this.prisma.user.findMany();
  const filteredUsers = allUsers.filter((user) => user.role === params.role);

  // ❌ NG: アプリケーション側で集計
  const total = filteredUsers.length;

  // ❌ NG: アプリケーション側でページネーション
  const pagedUsers = filteredUsers.slice(
    (params.page - 1) * params.pageSize,
    params.page * params.pageSize,
  );

  return { users: pagedUsers, total };
}
```

### 4.2 バリデーションの書き方

#### ✅ DTOの定義（Zodスキーマ）

```typescript
// command/dto/user/user.dto.ts
import { z } from 'zod';

export const createUserRequestSchema = z.object({
  email: z.string().email('メールアドレスの形式が正しくありません'),
  role: z.enum(['user', 'admin', 'master'], {
    errorMap: () => ({ message: '権限は必須です' }),
  }),
  firstName: z.string().min(1, '名は必須です'),
  lastName: z.string().min(1, '姓は必須です'),
  gender: z.enum(['male', 'female', 'other']).nullable().optional(),
  departmentId: z.string().min(1, '部署IDは必須です'),
});

export type CreateUserRequestDto = z.infer<typeof createUserRequestSchema>;
```

#### ✅ Controllerでのバリデーション

```typescript
// command/controller/user/user.controller.ts
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@Post()
async create(
  @Body(new ZodValidationPipe(createUserRequestSchema))
  dto: CreateUserRequestDto,
): Promise<UserResponseDto> {
  // dtoは既にバリデーション済み
  return this.userService.create(dto);
}
```

#### ✅ エラーレスポンス

バリデーションエラーは自動的に以下の形式で返されます：

```json
{
  "statusCode": 400,
  "message": "バリデーションエラー",
  "details": [
    {
      "path": ["email"],
      "message": "メールアドレスの形式が正しくありません"
    }
  ]
}
```

### 4.3 エラーハンドリングの書き方

#### ✅ カスタムエラーの定義

```typescript
// common/errors/not-found.error.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { getResourceNotFound } from '../constants/not-found-error';

export class NotFoundError extends HttpException {
  constructor(resourceName: string, id: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: getResourceNotFound(resourceName, id),
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
```

#### ✅ Repositoryでのエラーハンドリング

```typescript
// command/infra/user/user.repository.ts
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CustomLoggerService } from '../../../config/custom-logger.service';
import { NotFoundError } from '../../../common/errors/not-found.error';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async update(user: UserEntity): Promise<UserEntity> {
    try {
      const data = await this.prisma.user.update({
        where: { id: user.id },
        data: UserMapper.toUpdatePersistence(user),
      });
      return UserMapper.toDomain(data);
    } catch (error) {
      this.logger.error(error, undefined, 'UserRepository');

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('ユーザー', user.id!);
      }
      throw error;
    }
  }
}
```

#### ✅ グローバル例外フィルター

```typescript
// common/filters/global-exception.filter.ts
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { CustomLoggerService } from '../../config/custom-logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (status >= 500) {
        this.logger.error(exception, undefined, 'GlobalExceptionFilter');
      } else if (status >= 400) {
        this.logger.warn(
          JSON.stringify(exceptionResponse),
          'GlobalExceptionFilter',
        );
      }

      return response.status(status).json(exceptionResponse);
    }

    // 予期しないエラー
    this.logger.error(exception, undefined, 'GlobalExceptionFilter');
    return response.status(500).json({
      statusCode: 500,
      message: '予期せぬエラーが発生しました',
      error: 'Internal Server Error',
    });
  }
}
```

### 4.4 Value Object（値オブジェクト）の書き方

**思想**: VOは積極的に使うべき。特に「バリデーション」や「ルール」がある値は必ずVOにする。VOの中にロジックを持たせることで、エンティティを軽くし、コードの散在を防ぐ。

**実装例**:

```typescript
// command/domain/value-objects/user-name.vo.ts
import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';

/**
 * 姓と名をセットで扱うValue Object
 */
export class UserName {
  private constructor(
    private readonly firstName: string,
    private readonly lastName: string,
  ) {
    if (!firstName || !lastName) {
      throw new DomainError(REQUIRED_FIELD('姓名'));
    }
  }

  /**
   * ファクトリメソッド
   */
  static create(props: { firstName: string; lastName: string }): UserName {
    return new UserName(props.firstName, props.lastName);
  }

  /**
   * 必須のファクトリメソッド
   */
  static createRequired(props: {
    firstName: string;
    lastName: string;
  }): UserName {
    return new UserName(props.firstName, props.lastName);
  }

  get firstNameValue(): string {
    return this.firstName;
  }

  get lastNameValue(): string {
    return this.lastName;
  }

  // ✅ ロジックはVOに持たせる（計算プロパティ）
  get fullName(): string {
    return `${this.lastName} ${this.firstName}`;
  }

  // ✅ 「表示用」のロジックを持たせてもいい
  get formalName(): string {
    return `${this.lastName} ${this.firstName} 様`;
  }

  // ✅ イニシャルを返すロジックとかもここ
  get initials(): string {
    return `${this.lastName[0]}.${this.firstName[0]}`;
  }

  /**
   * 値による等価性の比較
   */
  equals(other: UserName | null): boolean {
    if (other === null) return false;
    return (
      this.firstName === other.firstName && this.lastName === other.lastName
    );
  }

  toString(): string {
    return this.fullName;
  }
}
```

**エンティティで使う**:

```typescript
// command/domain/user/user.entity.ts
import { UserName } from '../value-objects/user-name.vo';

export class UserEntity {
  // エンティティはプリミティブを持たず、VOを持つ
  private _userName: UserName;

  private constructor(props: UserProps) {
    this._userName = UserName.createRequired({
      firstName: props.firstName,
      lastName: props.lastName,
    });
    // ...
  }

  // エンティティはVOのメソッドを呼ぶだけ（委譲）
  get name(): string {
    return this._userName.fullName;
  }

  get formalName(): string {
    return this._userName.formalName;
  }

  get initials(): string {
    return this._userName.initials;
  }
}
```

**なぜこの書き方か**:

- **高凝集**: データ（姓・名）とそのデータを使ったロジック（フルネームを返す）が近くにある
- **コードの散在を防ぐ**: ロジックをエンティティやサービスに書くと、同じロジックが複数箇所に散らばる
- **エンティティを軽くする**: VOに細かいルールやロジックを任せることで、エンティティは重要なビジネスフローに集中できる
- **テスト容易性**: VOのロジックは独立してテストできる

### 4.5 EntityとMapperの書き方

#### ✅ Entityの定義

```typescript
// command/domain/user/user.entity.ts
export class UserEntity {
  private constructor(private props: UserProps) {}

  // ファクトリメソッド（static create）
  static create(
    props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): UserEntity {
    return new UserEntity({
      ...props,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    });
  }

  // 振る舞いメソッド
  changeEmail({
    email,
    updatedBy,
  }: {
    email: string;
    updatedBy: string;
  }): void {
    if (this.props.email === email) {
      return; // 変更がない場合は何もしない
    }
    this.props.email = email;
    this.props.updatedBy = updatedBy;
  }

  changeRole({ role, updatedBy }: { role: UserRole; updatedBy: string }): void {
    if (this.props.role === role) {
      return;
    }
    this.props.role = role;
    this.props.updatedBy = updatedBy;
  }

  // getter
  get id(): string | undefined {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }
}
```

#### ✅ Mapperの定義

```typescript
// command/domain/user/user.mapper.ts
import { User } from '@prisma/client';
import { UserEntity } from './user.entity';

export class UserMapper {
  // Prisma型からEntityに変換
  static toDomain(data: User): UserEntity {
    return new UserEntity({
      id: data.id,
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      departmentId: data.departmentId,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  // EntityからPrismaの保存用データ形式に変換（id、createdAt、updatedAtは含めない）
  static toPersistence(entity: UserEntity): {
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    gender: Gender | null;
    departmentId: string;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      email: entity.email,
      role: entity.role,
      firstName: entity.firstName,
      lastName: entity.lastName,
      gender: entity.gender,
      departmentId: entity.departmentId,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  // EntityからPrismaの更新用データ形式に変換（id、createdAtは含めない、updatedAtは自動管理）
  static toUpdatePersistence(entity: UserEntity): {
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    gender: Gender | null;
    departmentId: string;
    updatedBy: string;
  } {
    return {
      email: entity.email,
      role: entity.role,
      firstName: entity.firstName,
      lastName: entity.lastName,
      gender: entity.gender,
      departmentId: entity.departmentId,
      updatedBy: entity.updatedBy,
    };
  }
}
```

### 4.5 DTOの書き方

#### ✅ Command側のDTO（リクエスト）

```typescript
// command/dto/user/user.dto.ts
import { z } from 'zod';

export const createUserRequestSchema = z.object({
  email: z.string().email('メールアドレスの形式が正しくありません'),
  role: z.enum(['user', 'admin', 'master']),
  firstName: z.string().min(1, '名は必須です'),
  lastName: z.string().min(1, '姓は必須です'),
  gender: z.enum(['male', 'female', 'other']).nullable().optional(),
  departmentId: z.string().min(1, '部署IDは必須です'),
});

export type CreateUserRequestDto = z.infer<typeof createUserRequestSchema>;
```

#### ✅ Query側のDTO（レスポンス）

```typescript
// query/dto/user/user-response.dto.ts
import { User } from '@prisma/client';
import { UserEntity } from '../../../command/domain/user/user.entity';

export class UserResponseDto {
  constructor({
    id,
    email,
    role,
    firstName,
    lastName,
    gender,
    departmentId,
    createdAt,
    updatedAt,
    isInterviewer,
    departmentName,
  }: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    gender: Gender | null;
    departmentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    isInterviewer: boolean;
    departmentName: string | null;
  }) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.departmentId = departmentId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isInterviewer = isInterviewer;
    this.departmentName = departmentName;
  }

  // Command側のEntityからDTOを作成
  static fromEntity(user: UserEntity): UserResponseDto {
    user.ensureId();
    return new UserResponseDto({
      id: user.id!,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      departmentId: user.departmentId,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      isInterviewer: false,
      departmentName: null,
    });
  }

  // Query側のDAOから取得したデータからDTOを作成
  static fromQuery(
    user: User & {
      interviewer: { category: string } | null;
      department: { id: string; name: string } | null;
    },
  ): UserResponseDto {
    return new UserResponseDto({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      departmentId: user.departmentId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isInterviewer: user.interviewer !== null,
      departmentName: user.department?.name ?? null,
    });
  }
}
```

### 4.6 モジュールの書き方

#### ✅ Query側モジュール

```typescript
// modules/user/user-query.module.ts
import { Module } from '@nestjs/common';
import { UserController } from '../../query/controller/user/user.controller';
import { UserService } from '../../query/application/user/user.service';
import { UserDao } from '../../query/dao/user/user.dao';

@Module({
  controllers: [UserController],
  providers: [UserService, UserDao],
  exports: [UserDao], // Command側で使用するためにexport
})
export class UserQueryModule {}
```

#### ✅ Command側モジュール

```typescript
// modules/user/user-command.module.ts
import { Module } from '@nestjs/common';
import { UserQueryModule } from './user-query.module';
import { UserController } from '../../command/controller/user/user.controller';
import { UserService } from '../../command/application/user/user.service';
import { UserRepository } from '../../command/infra/user/user.repository';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';

@Module({
  imports: [UserQueryModule], // Query側のDAOを使用するためにimport
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: INJECTION_TOKENS.IUserRepository,
      useClass: UserRepository,
    },
    UserRepository,
  ],
})
export class UserCommandModule {}
```

#### ✅ 統合モジュール

```typescript
// modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserQueryModule } from './user-query.module';
import { UserCommandModule } from './user-command.module';

@Module({
  imports: [UserQueryModule, UserCommandModule],
})
export class UserModule {}
```

### 4.7 ロギングの書き方

#### ✅ ログの出力方法

```typescript
import { CustomLoggerService } from '../config/custom-logger.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(params: CreateParams): Promise<UserResponseDto> {
    try {
      // 処理
      this.logger.log('ユーザーを作成しました', 'UserService');
    } catch (error) {
      this.logger.error(error, undefined, 'UserService');
      throw error;
    }
  }
}
```

#### ✅ ログの形式

すべてのログは以下のJSON形式で出力されます：

```json
{
  "traceId": "01KAYWZQY4BDMP31RCX6GRWV7D",
  "timestamp": "2025-11-26T01:38:28.422Z",
  "level": "LOG",
  "context": "UserService",
  "message": "ユーザーを作成しました"
}
```

### 4.8 データベースクエリの書き方

#### ✅ データ加工はDB側で完結させる

```typescript
// ✅ OK: データベースでフィルタリング
const users = await this.prisma.user.findMany({
  where: {
    role: 'admin',
    createdAt: { gte: new Date('2024-01-01') },
  },
});

// ❌ NG: アプリケーションでフィルタリング
const allUsers = await this.prisma.user.findMany();
const adminUsers = allUsers.filter((user) => user.role === 'admin');
```

#### ✅ 集計はDB側で完結させる

```typescript
// ✅ OK: データベースで集計
const total = await this.prisma.user.count({
  where: { role: 'admin' },
});

// ❌ NG: アプリケーションで集計
const users = await this.prisma.user.findMany();
const total = users.length;
```

### 4.9 日付操作の書き方

#### ✅ 必ずDateUtilを使用する

```typescript
import {
  getCurrentDate,
  formatDateToISOString,
} from '../common/utils/date.utils';

// ✅ OK: DateUtilを使用
const now = getCurrentDate();
const isoString = formatDateToISOString();

// ❌ NG: 直接Dateを使用
const now = new Date();
const isoString = new Date().toISOString();
```

### 4.10 エラーメッセージの書き方

#### ✅ 必ず定数から取得する

```typescript
import { REQUIRED_FIELD, getEntityIdRequired } from '../common/constants';

// ✅ OK: 定数から取得
throw new Error(REQUIRED_FIELD('email'));
throw new Error(getEntityIdRequired('User'));

// ❌ NG: 文字列リテラル
throw new Error('emailは必須です');
throw new Error('UserのIDは必須です');
```

---

## 5. 実装時のチェックリスト

### Controller実装時

- [ ] `@Controller`デコレータを使用しているか
- [ ] `ZodValidationPipe`でバリデーションしているか
- [ ] 適切なHTTPメソッド（GET、POST、PUT、DELETE）を使用しているか
- [ ] レスポンス型を明示しているか

### Service実装時

- [ ] `@Injectable`デコレータを使用しているか
- [ ] コンストラクタで依存性注入しているか
- [ ] Command側ではEntityのファクトリメソッドを使用しているか
- [ ] Command側ではQuery側のDAOを使用しているか
- [ ] エラーハンドリングでログを出力しているか

### Repository実装時

- [ ] Repositoryインターフェースを実装しているか
- [ ] Mapperを使用してEntityとPrisma型を変換しているか
- [ ] エラーハンドリングでログを出力しているか
- [ ] Prismaのエラーコード（P2025等）を適切に処理しているか

### DAO実装時

- [ ] `@Injectable`デコレータを使用しているか
- [ ] Prismaを直接使用しているか
- [ ] データ加工（フィルタリング、集計）はDB側で完結しているか
- [ ] DTOの`fromQuery`メソッドを使用しているか

### Entity実装時

- [ ] コンストラクタは`private`か
- [ ] ファクトリメソッド（`static create`）を実装しているか
- [ ] 振る舞いメソッドを実装しているか
- [ ] getterでプロパティにアクセスしているか

### Mapper実装時

- [ ] `toDomain`メソッドを実装しているか
- [ ] `toPersistence`メソッドを実装しているか（id、createdAt、updatedAtは含めない）
- [ ] `toUpdatePersistence`メソッドを実装しているか（id、createdAtは含めない）

### DTO実装時

- [ ] Command側のDTOにはZodスキーマを定義しているか
- [ ] Query側のDTOには`fromEntity`と`fromQuery`メソッドを実装しているか
- [ ] エラーメッセージは定数から取得しているか

---

## 6. よくある間違いと正しい実装

### ❌ 間違い: ServiceでEntityをnewする

```typescript
// ❌ NG
const userEntity = new UserEntity({ ... });
```

### ✅ 正しい: ファクトリメソッドを使用

```typescript
// ✅ OK
const userEntity = UserEntity.create({ ... });
```

### ❌ 間違い: RepositoryでPrisma型を返す

```typescript
// ❌ NG
async create(user: UserEntity): Promise<User> {
  return this.prisma.user.create({ ... });
}
```

### ✅ 正しい: Entityを返す

```typescript
// ✅ OK
async create(user: UserEntity): Promise<UserEntity> {
  const data = await this.prisma.user.create({
    data: UserMapper.toPersistence(user),
  });
  return UserMapper.toDomain(data);
}
```

### ❌ 間違い: アプリケーションでデータ加工

```typescript
// ❌ NG
const allUsers = await this.prisma.user.findMany();
const adminUsers = allUsers.filter((user) => user.role === 'admin');
```

### ✅ 正しい: DB側でデータ加工

```typescript
// ✅ OK
const adminUsers = await this.prisma.user.findMany({
  where: { role: 'admin' },
});
```

---

## 7. まとめ

このバックエンドアプリケーションは、以下の設計思想に基づいて構築されています：

1. **DDDとCQRS**: Command側でDDD、Query側でPort-Adapterパターン
2. **層の分離**: 各層の責務を明確にし、依存関係を一方向に
3. **モジュールの独立性**: 機能ごとにモジュールを分離

これらの思想に従って実装することで、保守性が高く、スケーラブルなアプリケーションを実現できます。
