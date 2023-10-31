import fs from 'fs';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const getJobSystemMessage = fs.readFileSync('src/prompts/getJobName/0_system.txt', 'utf8');
const getJobUserMessage1 = fs.readFileSync('src/prompts/getJobName/1_user.txt', 'utf8');
const getJobAssistantMessage1 = fs.readFileSync('src/prompts/getJobName/1_assistant.txt', 'utf8');
const getJobUserMessage2 = fs.readFileSync('src/prompts/getJobName/2_user.txt', 'utf8');
const getJobAssistantMessage2 = fs.readFileSync('src/prompts/getJobName/2_assistant.txt', 'utf8');

const getJobNameResponse = async (jobTitle: string): Promise<string> => {
    const response = await openai.chat.completions.create({
        messages: [
            {
                "role": "system",
                "content": getJobSystemMessage
            },
            {
                "role": "user",
                "content": getJobUserMessage1
            },
            {
                "role": "assistant",
                "content": getJobAssistantMessage1
            },
            {
                "role": "user",
                "content": getJobUserMessage2
            },
            {
                "role": "assistant",
                "content": getJobAssistantMessage2
            },
            {
                "role": "user",
                "content": jobTitle
            },
        ],
        model: 'gpt-3.5-turbo',
    });

    const responseContent = response.choices[0]?.message.content;

    if (!responseContent) {
        return '';
    }

    return responseContent;
}

export const getJobName = async (jobTitle: string, retryCount = 0): Promise<string> => {
    console.log("====getJobName function start====");
    const responseContent = await getJobNameResponse(jobTitle);
    console.log(`resppnseContent: ${responseContent}`);
    const jobTitleStripped = jobTitle.replace(/\s+/g, '');

    // 確認したjobTitleを配列に格納
    const validJobTitles = jobTitleStripped.includes(responseContent) ? [responseContent] : [];

    if (validJobTitles.length === 0 && retryCount < 3) {
        return getJobName(jobTitle, retryCount + 1);
    }

    console.log(`validJobTitles[0]: ${validJobTitles[0] || ''}`);

    return validJobTitles[0] || '';
}