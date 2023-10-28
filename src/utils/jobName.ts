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

export const getJobNameResponse = async (jobTitle: string) => {
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
        temperature: 0,
        model: 'gpt-3.5-turbo',
    });

    return response.choices[0]?.message.content
}
