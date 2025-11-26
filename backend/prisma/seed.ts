import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/user.seed';
import { seedRecruitYears } from './seeds/recruit-year.seed';
import { seedCompanies } from './seeds/company.seed';
import { seedDepartments } from './seeds/department.seed';
import { seedUniversities } from './seeds/university.seed';
import { seedFaculties } from './seeds/faculty.seed';
import { seedDeviationValues } from './seeds/deviation-value.seed';
import { seedLocations } from './seeds/location.seed';

// DATABASE_URLが未設定の場合はデフォルト値を設定
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://postgres:postgres@localhost:5433/app?schema=public';
  console.log(
    `DATABASE_URL環境変数を設定しました: ${process.env.DATABASE_URL}`,
  );
}

const prisma = new PrismaClient();

async function main() {
  console.log('データベースのシードを開始...\n');

  try {
    // 依存関係の順序で実行
    // RecruitYearはマスタデータなので先に作成
    await seedRecruitYears({ prisma });
    console.log('');

    // Departmentはマスタデータなので先に作成
    await seedDepartments({ prisma });
    console.log('');

    // Locationはマスタデータなので先に作成
    await seedLocations({ prisma });
    console.log('');

    // Universityはマスタデータなので先に作成
    await seedUniversities({ prisma });
    console.log('');

    // FacultyはUniversityに依存するので後に作成
    await seedFaculties({ prisma });
    console.log('');

    // DeviationValueはFacultyに依存するので後に作成
    await seedDeviationValues({ prisma });
    console.log('');

    // Userを後で作成
    await seedUsers({ prisma });
    console.log('');

    // Companyを後で作成（RecruitYearに依存）
    await seedCompanies({ prisma });
    console.log('');

    console.log('すべてのシードが正常に完了しました！');
  } catch (error) {
    console.error('シード実行中にエラーが発生しました:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
