export const INJECTION_TOKENS = {
  IRecruitYearRepository: Symbol('IRecruitYearRepository'),
  IUserRepository: Symbol('IUserRepository'),
  ICompanyRepository: Symbol('ICompanyRepository'),
  IInterviewerRepository: Symbol('IInterviewerRepository'),
  ISearchConditionRepository: Symbol('ISearchConditionRepository'),
  IAuthUserRepository: Symbol('IAuthUserRepository'),
  ITeacherRepository: Symbol('ITeacherRepository'),
  PasswordHasher: Symbol('PasswordHasher'),
} as const;
