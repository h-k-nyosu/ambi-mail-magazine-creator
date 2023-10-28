import axios from "axios";
import { JSDOM } from "jsdom";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getAttractiveContent } from "~/utils/attractiveContent";
import { formatAttractiveContent } from "~/utils/formatAttractiveContent";
import { formatJobData } from "~/utils/formatJobData";
import { formatWorkingLocation } from "~/utils/formatWorkingLocation";
import { formatJobContent } from "~/utils/jobContent";
import { getJobNameResponse } from "~/utils/jobName";
import { getValidAttractiveContent } from "~/utils/validContent";

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
  contents: {
    companyName: string;
    content: string;
    excerpts: string[];
  }[];
};


export const jobRouter = createTRPCRouter({
  fetchData: publicProcedure
    .input(z.object({ url: z.string() }))
    .query<JobData>(async ({ input }) => {
      console.log("Fetching URL:", input.url);
      const res = await axios.get(input.url);
      const dom = new JSDOM(res.data);
      const document = dom.window.document;

      const url = input.url;
      const companyName = document.querySelector("#descBase > div > div.descUnit.descUnit--main > div.jobTypeSet.width_650 > div.jobType > span")?.textContent || "";
      const jobTitle = document.querySelector("#descBase > div > div.descUnit.descUnit--main > div.mainArea > div > h1")?.textContent || "";
      const jobIncome = document.querySelector("#descBase > div > div.descUnit.descUnit--main > div.jobTypeSet.width_650 > div.jobIncome > span.data")?.textContent || "";
      const recruitmentReason = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(2)")?.textContent || "";
      const jobDetail = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(4)")?.textContent || "";
      const mustRequire = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(6) > div:nth-child(1) > span.text")?.textContent || "";
      const optionalRequire = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(6) > div:nth-child(2) > span.text")?.textContent || "";
      const employmentStatus = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(8)")?.textContent || "";
      const position = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(10)")?.textContent || "";
      const workingLocation = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(12)")?.textContent || "";
      const workingHours = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(14)")?.textContent || "";
      const textIncome = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(16)")?.textContent || "";
      const benefit = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(18)")?.textContent || "";
      const holiday = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(20)")?.textContent || "";
      const selectionProcess = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(22)")?.textContent || "";
      const companyDetail = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--company > div.content.width_650 > dl:nth-child(2) > dd")?.textContent || "";

      return {
        url,
        companyName,
        jobTitle,
        jobIncome,
        recruitmentReason,
        jobDetail,
        mustRequire,
        optionalRequire,
        employmentStatus,
        position,
        workingLocation,
        workingHours,
        textIncome,
        benefit,
        holiday,
        selectionProcess,
        companyDetail,
      };
    }),

  createContent: publicProcedure
    .input(JobDataSchema.extend({ newsletterId: z.number().optional().default(-1) }))
    .mutation<Promise<{ newsletterId: number, jobId: number, companyName: string, excerpt: string[] }>>(async ({ input, ctx }) => {

      const jobContent = formatJobContent(input);
      const jobName = await getJobNameResponse(input.jobTitle);
      const jobLocation = formatWorkingLocation(input.workingLocation)

      // jobNameが存在している場合、処理を続ける
      if (jobName) {
        console.log(jobName)
        const attractiveContentResponse = await getAttractiveContent(jobContent);

        // attractiveContentが存在している場合、処理を続ける
        if (attractiveContentResponse) {
          let validAttractiveContents = getValidAttractiveContent(attractiveContentResponse, jobContent);

          //TODO: validAttractiveContentが存在しない場合、retry処理をする
          if (validAttractiveContents[0] && validAttractiveContents[0].length > 30) {
            validAttractiveContents = [validAttractiveContents[0]];
          } else {
            validAttractiveContents = validAttractiveContents.slice(0, 2);
          }

          const formattedAttractiveContentResponse = await formatAttractiveContent(validAttractiveContents);
          const formattedJobData = formatJobData(input.companyName, jobName, input.jobIncome, jobLocation, input.url, formattedAttractiveContentResponse);

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
              url: input.url,
              companyName: input.companyName,
              content: formattedJobData,
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
              location: jobLocation,
            },
          });

          const excerpts: string[] = [];
          for (const validAttractiveContent of validAttractiveContents) {
            // JobAttractiveEvidenceを作成
            await ctx.db.jobAttractiveEvidence.create({
              data: {
                jobId: job.id,
                attractivePoint: validAttractiveContent,
              },
            });
            excerpts.push(validAttractiveContent);
          }

          return {
            newsletterId: newsletterId,
            jobId: job.id,
            companyName: input.companyName,
            excerpt: excerpts
          };
        }
      }
      // 期待される型を返すためのデフォルト値を返す
      return {
        newsletterId: -1,
        jobId: 0,
        companyName: "",
        excerpt: []
      };
    }),

  fetchNewsletterContent: publicProcedure
    .input(z.object({ id: z.number() }))
    .query<NewsletterContent>(async ({ input, ctx }) => {
      const newsletter = await ctx.db.newsletter.findUnique({
        where: { id: input.id },
        include: {
          Job: {
            select: {
              companyName: true,
              content: true,
              JobEvidence: {
                select: {
                  companyName: true,
                  jobName: true,
                  income: true,
                  location: true
                }
              },
              JobAttractiveEvidence: {
                select: {
                  attractivePoint: true
                }
              }
            }
          }
        }
      });

      if (!newsletter) {
        throw new Error("Newsletter not found");
      }

      const contents = newsletter.Job.map(job => ({
        companyName: job.companyName,
        content: job.content,
        jobEvidence: job.JobEvidence.map(je => ({
          companyName: je.companyName,
          jobName: je.jobName,
          income: je.income,
          location: je.location
        })),
        attractivePoints: job.JobAttractiveEvidence.map(ja => ja.attractivePoint)
      }));

      return {
        newsletterId: input.id,
        contents: contents
      };
    }),
});