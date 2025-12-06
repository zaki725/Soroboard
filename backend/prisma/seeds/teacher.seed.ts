import { PrismaClient, TeacherRole } from '@prisma/client';

/**
 * Teacher マスタ作成用 seed
 */
export async function seedTeachers({ prisma }: { prisma: PrismaClient }) {
  const environment = process.env.NODE_ENV || 'development';
  if (environment === 'production') {
    throw new Error('本番環境で Teacher シードは実行できません。');
  }

  console.log('Teacher マスタ作成を開始...');

  // Schoolを取得
  const schools = await prisma.school.findMany({
    where: { isActive: true },
  });

  if (schools.length === 0) {
    throw new Error(
      '有効なSchoolが見つかりません。先にSchoolシードを実行してください。',
    );
  }

  const tanakaSchool = schools.find((s) => s.name === '田中そろばん教室');
  const satoSchool = schools.find((s) => s.name === '佐藤そろばん教室');
  const itoSchool = schools.find((s) => s.name === '伊藤そろばん教室');
  const yamamotoSchool = schools.find((s) => s.name === '山本そろばん教室');

  if (!tanakaSchool || !satoSchool || !itoSchool || !yamamotoSchool) {
    throw new Error('必要なSchoolが見つかりません。');
  }

  const teachers = [
    // 田中そろばん教室
    {
      email: 'tanaka@tanaka-soroban.example.com',
      roleInSchool: TeacherRole.OWNER,
      firstName: '太郎',
      lastName: '田中',
      hourlyRate: null,
      isActive: true,
      memo: null,
      schoolId: tanakaSchool.id,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      email: 'yamada@tanaka-soroban.example.com',
      roleInSchool: TeacherRole.STAFF,
      firstName: '花子',
      lastName: '山田',
      hourlyRate: 2500,
      isActive: true,
      memo: 'そろばん指導',
      schoolId: tanakaSchool.id,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      email: 'suzuki@tanaka-soroban.example.com',
      roleInSchool: TeacherRole.STAFF,
      firstName: '次郎',
      lastName: '鈴木',
      hourlyRate: 2200,
      isActive: true,
      memo: 'そろばん指導',
      schoolId: tanakaSchool.id,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      email: 'watanabe@tanaka-soroban.example.com',
      roleInSchool: TeacherRole.STAFF,
      firstName: '三郎',
      lastName: '渡辺',
      hourlyRate: 2000,
      isActive: false,
      memo: '7月から休み',
      schoolId: tanakaSchool.id,
      createdBy: 'system',
      updatedBy: 'system',
    },
    // 佐藤そろばん教室
    {
      email: 'sato@sato-soroban.example.com',
      roleInSchool: TeacherRole.OWNER,
      firstName: '一郎',
      lastName: '佐藤',
      hourlyRate: null,
      isActive: true,
      memo: null,
      schoolId: satoSchool.id,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      email: 'kobayashi@sato-soroban.example.com',
      roleInSchool: TeacherRole.STAFF,
      firstName: '美咲',
      lastName: '小林',
      hourlyRate: 2300,
      isActive: true,
      memo: 'そろばん指導',
      schoolId: satoSchool.id,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      email: 'kato@sato-soroban.example.com',
      roleInSchool: TeacherRole.STAFF,
      firstName: '健太',
      lastName: '加藤',
      hourlyRate: 2100,
      isActive: true,
      memo: 'そろばん指導',
      schoolId: satoSchool.id,
      createdBy: 'system',
      updatedBy: 'system',
    },
    // 伊藤そろばん教室
    {
      email: 'ito@ito-soroban.example.com',
      roleInSchool: TeacherRole.OWNER,
      firstName: '正雄',
      lastName: '伊藤',
      hourlyRate: null,
      isActive: true,
      memo: null,
      schoolId: itoSchool.id,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      email: 'yoshida@ito-soroban.example.com',
      roleInSchool: TeacherRole.STAFF,
      firstName: '由美',
      lastName: '吉田',
      hourlyRate: 2400,
      isActive: true,
      memo: 'そろばん指導',
      schoolId: itoSchool.id,
      createdBy: 'system',
      updatedBy: 'system',
    },
    // 山本そろばん教室
    {
      email: 'yamamoto@yamamoto-soroban.example.com',
      roleInSchool: TeacherRole.OWNER,
      firstName: '敏夫',
      lastName: '山本',
      hourlyRate: null,
      isActive: true,
      memo: null,
      schoolId: yamamotoSchool.id,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      email: 'matsumoto@yamamoto-soroban.example.com',
      roleInSchool: TeacherRole.STAFF,
      firstName: '智子',
      lastName: '松本',
      hourlyRate: 2200,
      isActive: true,
      memo: 'そろばん指導',
      schoolId: yamamotoSchool.id,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      email: 'inoue@yamamoto-soroban.example.com',
      roleInSchool: TeacherRole.STAFF,
      firstName: '大輔',
      lastName: '井上',
      hourlyRate: 2000,
      isActive: true,
      memo: '水金NG',
      schoolId: yamamotoSchool.id,
      createdBy: 'system',
      updatedBy: 'system',
    },
  ];

  for (const teacher of teachers) {
    await prisma.teacher.upsert({
      where: { email: teacher.email },
      update: {
        roleInSchool: teacher.roleInSchool,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        hourlyRate: teacher.hourlyRate,
        isActive: teacher.isActive,
        memo: teacher.memo,
        schoolId: teacher.schoolId,
        updatedBy: teacher.updatedBy,
      },
      create: teacher,
    });
  }

  console.log(`${teachers.length} 件の Teacher 作成完了`);
}

