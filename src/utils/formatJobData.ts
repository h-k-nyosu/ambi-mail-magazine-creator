// utils/formatJobData.ts

export function formatJobData(companyName: string, jobName: string, jobIncome: string, location: string, url: string, validAttractiveContent: string): string {
    return `▼${companyName}
  ${jobName}
￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
[ここがポイント］
${validAttractiveContent}

[年　収］${jobIncome}
[勤務地］${location}
${url}?MMID={MMID}`;
}