-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin', 'master');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "InterviewerCategory" AS ENUM ('フロント', '現場社員');

-- CreateEnum
CREATE TYPE "SelectionPeriod" AS ENUM ('SI', 'MAIN');

-- CreateEnum
CREATE TYPE "SelectionType" AS ENUM ('INTERVIEW_DISCUSSION', 'INTERVIEW');

-- CreateEnum
CREATE TYPE "SelectionStage" AS ENUM ('FIRST', 'SECOND', 'THIRD', 'FINAL', 'BEFORE_OFFER');

-- CreateEnum
CREATE TYPE "EducationType" AS ENUM ('大学院', '大学', '短期大学', '専門学校', '高等学校', 'その他');

-- CreateEnum
CREATE TYPE "UniversityRankLevel" AS ENUM ('S', 'A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('オンライン', '対面', 'オンライン_対面');

-- CreateEnum
CREATE TYPE "TeacherRole" AS ENUM ('OWNER', 'STAFF');

-- CreateEnum
CREATE TYPE "AuthUserRole" AS ENUM ('TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "recruit_years" (
    "recruit_year" INTEGER NOT NULL,
    "display_name" TEXT NOT NULL,
    "theme_color" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "recruit_years_pkey" PRIMARY KEY ("recruit_year")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT,
    "email" TEXT,
    "website_url" TEXT,
    "recruit_year_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "student_no" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "first_name_kana" TEXT NOT NULL,
    "last_name_kana" TEXT NOT NULL,
    "birth_date" DATE,
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "joined_at" TIMESTAMPTZ NOT NULL,
    "left_at" TIMESTAMPTZ,
    "note" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role_in_school" "TeacherRole" NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "hourly_rate" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "memo" TEXT,
    "school_id" TEXT NOT NULL,
    "auth_user_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "job_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "universities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "faculties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deviation_values" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "deviation_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_ranks" (
    "id" TEXT NOT NULL,
    "rank" "UniversityRankLevel" NOT NULL,
    "university_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "university_ranks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "gender" "Gender",
    "department_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviewers" (
    "category" "InterviewerCategory" NOT NULL,
    "user_id" TEXT NOT NULL,
    "university_id" TEXT,
    "faculty_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "interviewers_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "educational_backgrounds" (
    "id" TEXT NOT NULL,
    "education_type" "EducationType" NOT NULL,
    "graduation_year" INTEGER,
    "graduation_month" INTEGER,
    "interviewer_id" TEXT NOT NULL,
    "university_id" TEXT,
    "faculty_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "educational_backgrounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "selection_processes" (
    "id" TEXT NOT NULL,
    "stage" "SelectionStage" NOT NULL,
    "order" INTEGER NOT NULL,
    "selection_period" "SelectionPeriod" NOT NULL,
    "selection_type" "SelectionType" NOT NULL,
    "recruit_year_id" INTEGER NOT NULL,
    "job_category_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "selection_processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_masters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "LocationType" NOT NULL,
    "recruit_year_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "event_masters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "notes" TEXT,
    "event_master_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_interviewers" (
    "event_id" TEXT NOT NULL,
    "interviewer_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "event_interviewers_pkey" PRIMARY KEY ("event_id","interviewer_id")
);

-- CreateTable
CREATE TABLE "outbox" (
    "id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ,

    CONSTRAINT "outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_conditions" (
    "id" TEXT NOT NULL,
    "form_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url_params" TEXT NOT NULL,
    "recruit_year_id" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "search_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "AuthUserRole" NOT NULL DEFAULT 'TEACHER',
    "last_login_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,

    CONSTRAINT "auth_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "sid" TEXT NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_recruit_year_id_key" ON "companies"("name", "recruit_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "schools_name_key" ON "schools"("name");

-- CreateIndex
CREATE INDEX "students_school_id_idx" ON "students"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_email_key" ON "teachers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_auth_user_id_key" ON "teachers"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_categories_name_key" ON "job_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "universities_name_key" ON "universities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "faculties_name_university_id_key" ON "faculties"("name", "university_id");

-- CreateIndex
CREATE UNIQUE INDEX "deviation_values_faculty_id_key" ON "deviation_values"("faculty_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "selection_processes_recruit_year_id_order_key" ON "selection_processes"("recruit_year_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "selection_processes_recruit_year_id_stage_selection_period__key" ON "selection_processes"("recruit_year_id", "stage", "selection_period", "selection_type", "job_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_name_key" ON "locations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "search_conditions_form_type_recruit_year_id_name_key" ON "search_conditions"("form_type", "recruit_year_id", "name");

-- CreateIndex
CREATE INDEX "session_expire_idx" ON "session"("expire");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_recruit_year_id_fkey" FOREIGN KEY ("recruit_year_id") REFERENCES "recruit_years"("recruit_year") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculties" ADD CONSTRAINT "faculties_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deviation_values" ADD CONSTRAINT "deviation_values_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_ranks" ADD CONSTRAINT "university_ranks_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviewers" ADD CONSTRAINT "interviewers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviewers" ADD CONSTRAINT "interviewers_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "universities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviewers" ADD CONSTRAINT "interviewers_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educational_backgrounds" ADD CONSTRAINT "educational_backgrounds_interviewer_id_fkey" FOREIGN KEY ("interviewer_id") REFERENCES "interviewers"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educational_backgrounds" ADD CONSTRAINT "educational_backgrounds_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "universities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educational_backgrounds" ADD CONSTRAINT "educational_backgrounds_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selection_processes" ADD CONSTRAINT "selection_processes_recruit_year_id_fkey" FOREIGN KEY ("recruit_year_id") REFERENCES "recruit_years"("recruit_year") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selection_processes" ADD CONSTRAINT "selection_processes_job_category_id_fkey" FOREIGN KEY ("job_category_id") REFERENCES "job_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_masters" ADD CONSTRAINT "event_masters_recruit_year_id_fkey" FOREIGN KEY ("recruit_year_id") REFERENCES "recruit_years"("recruit_year") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_event_master_id_fkey" FOREIGN KEY ("event_master_id") REFERENCES "event_masters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_interviewers" ADD CONSTRAINT "event_interviewers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_interviewers" ADD CONSTRAINT "event_interviewers_interviewer_id_fkey" FOREIGN KEY ("interviewer_id") REFERENCES "interviewers"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_conditions" ADD CONSTRAINT "search_conditions_recruit_year_id_fkey" FOREIGN KEY ("recruit_year_id") REFERENCES "recruit_years"("recruit_year") ON DELETE CASCADE ON UPDATE CASCADE;
