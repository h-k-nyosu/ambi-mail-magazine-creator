import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { formatJobData } from "~/utils/formatJobData";

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
    fetchNewsletterContent: publicProcedure
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
});