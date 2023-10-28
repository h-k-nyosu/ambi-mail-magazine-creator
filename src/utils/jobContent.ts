// utils/jobContent.ts
import { JobData } from "../server/api/routers/job";

export function formatJobContent(job: JobData): string {
    return "求人タイトル\n " + job.jobTitle + "\n\n" +
        "なぜ募集しているのか\n " + job.recruitmentReason + "\n\n" +
        "どんな仕事か\n " + job.jobDetail + "\n\n" +
        "求められるスキルは\n " + job.mustRequire + "\n\n" +
        "雇用形態は\n " + job.employmentStatus + "\n\n" +
        "どこで働くか\n " + job.workingLocation + "\n\n" +
        "勤務時間は\n " + job.workingHours + "\n\n" +
        "給与はどのくらい貰えるのか\n " + job.textIncome + "\n\n" +
        "待遇福利厚生は\n " + job.benefit + "\n\n" +
        "休日休暇は\n " + job.holiday + "\n\n" +
        "どんな選考プロセスか\n " + job.selectionProcess + "\n\n" +
        "事業内容と会社の特長\n " + job.companyDetail;
}