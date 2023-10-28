// utils/attractiveContent.ts
import fs from 'fs';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const getAttractiveContent = async (jobContent: string): Promise<any> => {
    const getAttractiveContentSystemMessage = fs.readFileSync('src/prompts/getAttractiveContent/0_system.txt', 'utf8');
    const getAttractiveContentUserMessage = fs.readFileSync('src/prompts/getAttractiveContent/1_user.txt', 'utf8');
    const getAttractiveContentAssistantMessage = fs.readFileSync('src/prompts/getAttractiveContent/1_assistant.txt', 'utf8');

    const attractiveContentResponse = await openai.chat.completions.create({
        messages: [
            {
                "role": "system",
                "content": getAttractiveContentSystemMessage
            },
            {
                "role": "user",
                "content": getAttractiveContentUserMessage
            },
            {
                "role": "assistant",
                "content": getAttractiveContentAssistantMessage
            },
            {
                "role": "user",
                "content": jobContent
            }
        ],
        temperature: 0,
        model: 'gpt-3.5-turbo-16k',
    });

    return attractiveContentResponse.choices[0]?.message.content;
}