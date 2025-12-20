export const INJECTION_TOKENS = {
  IRecruitYearRepository: Symbol('IRecruitYearRepository'),
  IUserRepository: Symbol('IUserRepository'),
  ISearchConditionRepository: Symbol('ISearchConditionRepository'),
  IAuthUserRepository: Symbol('IAuthUserRepository'),
  ITeacherRepository: Symbol('ITeacherRepository'),
  PasswordHasher: Symbol('PasswordHasher'),
} as const;
