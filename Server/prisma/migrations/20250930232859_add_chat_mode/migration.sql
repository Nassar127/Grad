-- CreateEnum
CREATE TYPE "public"."ChatMode" AS ENUM ('MedicalQuestions', 'ConditionExplainer', 'StudyRecommender');

-- AlterTable
ALTER TABLE "public"."Chat" ADD COLUMN     "mode" "public"."ChatMode" NOT NULL DEFAULT 'MedicalQuestions';
