// utils/formatContent.ts
import fs from 'fs';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const formatAttractiveContent = async (validAttractiveContent: string[]): Promise<any> => {
    const formatSystemMessage = fs.readFileSync('src/prompts/formatAttractiveContent/0_system.txt', 'utf8');
    const formatUserMessage1 = fs.readFileSync('src/prompts/formatAttractiveContent/1_user.txt', 'utf8');
    const formatAssistantMessage1 = fs.readFileSync('src/prompts/formatAttractiveContent/1_assistant.txt', 'utf8');
    const formatUserMessage2 = fs.readFileSync('src/prompts/formatAttractiveContent/2_user.txt', 'utf8');
    const formatAssistantMessage2 = fs.readFileSync('src/prompts/formatAttractiveContent/2_assistant.txt', 'utf8');
    const formatUserMessage3 = fs.readFileSync('src/prompts/formatAttractiveContent/3_user.txt', 'utf8');
    const formatAssistantMessage3 = fs.readFileSync('src/prompts/formatAttractiveContent/3_assistant.txt', 'utf8');

    const formatAttractiveContentResponse = await openai.chat.completions.create({
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
                "content": validAttractiveContent.join('。')
            },
        ],
        temperature: 0,
        model: 'gpt-3.5-turbo',
    });

    return formatAttractiveContentResponse.choices[0]?.message.content;
}