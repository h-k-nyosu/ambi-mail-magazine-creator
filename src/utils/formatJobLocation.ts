// utils/formatContent.ts
import fs from 'fs';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const formatSystemMessage = fs.readFileSync('src/prompts/formatJobLocation/0_system.txt', 'utf8');
const formatUserMessage1 = fs.readFileSync('src/prompts/formatJobLocation/1_user.txt', 'utf8');
const formatAssistantMessage1 = fs.readFileSync('src/prompts/formatJobLocation/1_assistant.txt', 'utf8');
const formatUserMessage2 = fs.readFileSync('src/prompts/formatJobLocation/2_user.txt', 'utf8');
const formatAssistantMessage2 = fs.readFileSync('src/prompts/formatJobLocation/2_assistant.txt', 'utf8');
const formatUserMessage3 = fs.readFileSync('src/prompts/formatJobLocation/3_user.txt', 'utf8');
const formatAssistantMessage3 = fs.readFileSync('src/prompts/formatJobLocation/3_assistant.txt', 'utf8');


export const formatJobLocation = async (validJobLocations: string[]): Promise<string> => {
    let retries = 0;
    let responseContent = '';

    while (retries < 3) {
        const response = await openai.chat.completions.create({
            messages: [
                {
                    "role": "system",
                    "content": formatSystemMessage
                },
                {
                    "role": "user",
                    "content": formatUserMessage1
                },
                {
                    "role": "assistant",
                    "content": formatAssistantMessage1
                },
                {
                    "role": "user",
                    "content": formatUserMessage2
                },
                {
                    "role": "assistant",
                    "content": formatAssistantMessage2
                },
                {
                    "role": "user",
                    "content": formatUserMessage3
                },
                {
                    "role": "assistant",
                    "content": formatAssistantMessage3
                },
                {
                    "role": "user",
                    "content": validJobLocations.join('\n')
                },
            ],
            model: 'gpt-3.5-turbo',
        });

        responseContent = response.choices[0]?.message.content || '';

        if (responseContent && responseContent.trim() !== '') {
            return responseContent
        }

        retries++;
    }

    return '';
}