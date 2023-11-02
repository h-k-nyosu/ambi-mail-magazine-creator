import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { formatAttractiveContent } from "~/utils/formatAttractiveContent";
import { formatJobData } from "~/utils/formatJobData";
import { formatJobLocation } from "~/utils/formatJobLocation";
import { getAttractiveContent } from "~/utils/getAttractiveContent";
import { getJobLocation } from "~/utils/getJobLocation";
import { getJobName } from "~/utils/getJobName";
import { formatJobContent } from "~/utils/jobContent";

const JobDataSchema = z.object({
    url: z.string(),
    companyName: z.string(),
    jobTitle: z.string(),
    jobIncome: z.string(),
    recruitmentReason: z.string(),
    jobDetail: z.string(),
    mustRequire: z.string(),
    optionalRequire: z.string(),
    employmentStatus: z.string(),
    position: z.string(),
    workingLocation: z.string(),
    workingHours: z.string(),
    textIncome: z.string(),
    benefit: z.string(),
    holiday: z.string(),
    selectionProcess: z.string(),
    companyDetail: z.string(),
});

export type JobData = z.infer<typeof JobDataSchema>;

export type NewsletterContent = {
    newsletterId: number;
    mailContent: string;
    contents: {
        companyName: string;
        url: string;
        jobEvidence: {
            companyName: string;
            jobName: string;
            income: string;
        }[];
        attractivePoints: string[];
        jobLocationEvidence: string[];
    }[];
};


export const magazineRouter = createTRPCRouter({
    fetchContent: publicProcedure
        .input(z.object({ id: z.number() }))
        .query<NewsletterContent>(async ({ input, ctx }) => {
            const newsletter = await ctx.db.newsletter.findUnique({
                where: { id: input.id },
                include: {
                    Job: {
                        select: {
                            companyName: true,
                            jobName: true,
                            attractiveContent: true,
                            income: true,
                            location: true,
                            url: true,
                            JobEvidence: {
                                select: {
                                    companyName: true,
                                    jobName: true,
                                    income: true,
                                }
                            },
                            JobAttractiveEvidence: {
                                select: {
                                    attractivePoint: true
                                }
                            },
                            JobLocationEvidence: {
                                select: {
                                    location: true
                                }
                            }
                        }
                    }
                }
            });

            if (!newsletter) {
                throw new Error("Newsletter not found");
            }

            const mailContent = newsletter.Job.map(job => {
                const jobContent = formatJobData(job.companyName, job.jobName, job.income, job.location, job.url, job.attractiveContent);
                return jobContent;
            }).join('\n\n\n');

            const contents = newsletter.Job.map(job => ({
                companyName: job.companyName,
                url: job.url,
                jobEvidence: job.JobEvidence.map(je => ({
                    companyName: je.companyName,
                    jobName: je.jobName,
                    income: je.income,
                })),
                attractivePoints: job.JobAttractiveEvidence.map(ap => ap.attractivePoint),
                jobLocationEvidence: job.JobLocationEvidence.map(jle => jle.location),
            }));

            return {
                newsletterId: input.id,
                mailContent: mailContent,
                contents: contents
            };
        }),
    fetchList: publicProcedure
        .query<Array<{ id: number, companyName: string }>>(async ({ ctx }) => {
            const newsletters = await ctx.db.newsletter.findMany({
                include: {
                    Job: {
                        select: {
                            companyName: true,
                        }
                    }
                }
            });

            const result = newsletters.map(newsletter => ({
                id: newsletter.id,
                companyName: newsletter.Job.map(job => job.companyName).join(', ')
            }));

            console.log(`result: ${result}`)

            return result;
        }),
    createContent: publicProcedure
        .input(JobDataSchema.extend({ newsletterId: z.number().optional().default(-1) }))
        .mutation<Promise<{ newsletterId: number, jobId: number, companyName: string, attractivePoints: string[] }>>(async ({ input, ctx }) => {

            // 求人情報の整形
            const jobContent = formatJobContent(input);

            // 職種名の抽出・存在するかのシステムチェック
            const jobName = await getJobName(input.jobTitle);
            console.log(`🔥 jobName: ${jobName}`);

            // 勤務地の抽出・存在するかのシステムチェックと、整形
            const validJobLocations = await getJobLocation(input.workingLocation)
            console.log(`✅ validJobLocations: ${validJobLocations}`);
            const jobLocation = await formatJobLocation(validJobLocations)
            console.log(`🔥 jobLocation: ${jobLocation}`);

            // ここがポイントの抽出・存在するかのシステムチェックと、整形
            const validAttractiveContents = await getAttractiveContent(jobContent);
            console.log(`✅ validAttractiveContents: ${validAttractiveContents}`);
            const attractiveContent = await formatAttractiveContent(validAttractiveContents);
            console.log(`🔥 attractiveContent: ${attractiveContent}`);

            // データベースに保存
            // まだnewsletterIdを未作成の時のみデータをCREATEする
            let newsletterId;
            console.log("newsletterをcreateします。db: " + ctx.db.newsletter)
            if (input.newsletterId === -1) {
                const newsletter = await ctx.db.newsletter.create({});
                newsletterId = newsletter.id;
            } else {
                newsletterId = input.newsletterId;
            }

            console.log("jobをcreateします。db: " + ctx)
            const job = await ctx.db.job.create({
                data: {
                    companyName: input.companyName,
                    jobName: jobName,
                    attractiveContent: attractiveContent,
                    income: input.jobIncome,
                    location: jobLocation,
                    url: input.url,
                    newsletterId: newsletterId,
                },
            });

            // JobEvidenceを作成
            await ctx.db.jobEvidence.create({
                data: {
                    jobId: job.id,
                    companyName: input.companyName,
                    jobName: jobName,
                    income: input.jobIncome,
                },
            });

            for (const validAttractiveContent of validAttractiveContents) {
                // JobAttractiveEvidenceを作成
                await ctx.db.jobAttractiveEvidence.create({
                    data: {
                        jobId: job.id,
                        attractivePoint: validAttractiveContent,
                    },
                });
            }

            for (const validJobLocation of validJobLocations) {
                // JobAttractiveEvidenceを作成
                await ctx.db.jobLocationEvidence.create({
                    data: {
                        jobId: job.id,
                        location: validJobLocation,
                    },
                });
            }

            return {
                newsletterId: newsletterId,
                jobId: job.id,
                companyName: input.companyName,
                attractivePoints: validAttractiveContents,
                jobLocations: validJobLocations
            };
        }),
});