import axios from "axios";
import { JSDOM } from "jsdom";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

      let data = {
        url,
        companyName,
        jobTitle,
        jobIncome,
        recruitmentReason: "",
        jobDetail: "",
        mustRequire: "",
        optionalRequire: "",
        employmentStatus: "",
        position: "",
        workingLocation: "",
        workingHours: "",
        textIncome: "",
        benefit: "",
        holiday: "",
        selectionProcess: "",
        companyDetail: "",
      };

      const dtElements = document.querySelectorAll("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dt");
      const ddElements = document.querySelectorAll("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd");

      for (let i = 0; i < dtElements.length; i++) {
        const title = dtElements[i]?.textContent || "";
        const content = ddElements[i]?.textContent || "";

        switch (title) {
          case "なぜ募集しているのか":
            data.recruitmentReason = content;
            break;
          case "どんな仕事か":
            data.jobDetail = content;
            break;
          case "求められるスキルは":
            const mustRequireMatch = content.match(/必須\s*-\s*(.*?)\s*歓迎/);
            const optionalRequireMatch = content.match(/歓迎\s*-\s*(.*)/);
            const mustRequire = mustRequireMatch && mustRequireMatch[1] ? mustRequireMatch[1].trim() : "";
            const optionalRequire = optionalRequireMatch && optionalRequireMatch[1] ? optionalRequireMatch[1].trim() : "";
            data.mustRequire = mustRequire;
            data.optionalRequire = optionalRequire;
            break;
          case "雇用形態は":
            data.employmentStatus = content;
            break;
          case "どんなポジション・役割か":
            data.position = content;
            break;
          case "どこで働くか":
            data.workingLocation = content;
            break;
          case "勤務時間は":
            data.workingHours = content;
            break;
          case "給与はどのくらい貰えるか":
            data.textIncome = content;
            break;
          case "待遇・福利厚生は":
            data.benefit = content;
            break;
          case "休日休暇は":
            data.holiday = content;
            break;
          case "どんな選考プロセスか":
            data.selectionProcess = content;
            break;
        }
      }

      const companyDetail = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--company > div.content.width_650 > dl:nth-child(2) > dd")?.textContent || "";
      data.companyDetail = companyDetail;

      return data;
    }),
});