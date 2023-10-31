// utils/attractiveContent.ts
import fs from 'fs';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const getAttractiveContentResponse = async (jobContent: string): Promise<string> => {
    const getAttractiveContentSystemMessage = fs.readFileSync('src/prompts/getAttractiveContent/0_system.txt', 'utf8');
    const getAttractiveContentUserMessage = fs.readFileSync('src/prompts/getAttractiveContent/1_user.txt', 'utf8');
    const getAttractiveContentAssistantMessage = fs.readFileSync('src/prompts/getAttractiveContent/1_assistant.txt', 'utf8');

    const response = await openai.chat.completions.create({
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
        model: 'gpt-3.5-turbo-16k',
    });

    const responseContent = response.choices[0]?.message.content;

    if (!responseContent) {
        return '';
    }

    return responseContent;
}

export const getAttractiveContent = async (jobContent: string, retryCount = 0): Promise<string[]> => {
    const responseContent = await getAttractiveContentResponse(jobContent);
    const responseLines = responseContent.split('\n');
    const jobContentStripped = jobContent.replace(/\s+/g, '');

    // 確認したjobContentを配列に格納
    const validAttractiveContent = responseLines.filter(line => jobContentStripped.includes(line));

    if (validAttractiveContent.length === 0 && retryCount < 3) {
        return getAttractiveContent(jobContent, retryCount + 1);
    }

    return validAttractiveContent;
}