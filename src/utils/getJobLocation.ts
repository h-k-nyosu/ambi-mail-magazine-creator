import fs from 'fs';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const getJobLocationResponse = async (location: string): Promise<string> => {
    const getJobLocationSystemMessage = fs.readFileSync('src/prompts/getJobLocation/0_system.txt', 'utf8');
    const getJobLocationUserMessage_1 = fs.readFileSync('src/prompts/getJobLocation/1_user.txt', 'utf8');
    const getJobLocationAssistantMessage_1 = fs.readFileSync('src/prompts/getJobLocation/1_assistant.txt', 'utf8');
    const getJobLocationUserMessage_2 = fs.readFileSync('src/prompts/getJobLocation/2_user.txt', 'utf8');
    const getJobLocationAssistantMessage_2 = fs.readFileSync('src/prompts/getJobLocation/2_assistant.txt', 'utf8');
    const getJobLocationUserMessage_3 = fs.readFileSync('src/prompts/getJobLocation/3_user.txt', 'utf8');
    const getJobLocationAssistantMessage_3 = fs.readFileSync('src/prompts/getJobLocation/3_assistant.txt', 'utf8');

    const response = await openai.chat.completions.create({
        messages: [
            {
                "role": "system",
                "content": getJobLocationSystemMessage
            },
            {
                "role": "user",
                "content": getJobLocationUserMessage_1
            },
            {
                "role": "assistant",
                "content": getJobLocationAssistantMessage_1
            },
            {
                "role": "user",
                "content": getJobLocationUserMessage_2
            },
            {
                "role": "assistant",
                "content": getJobLocationAssistantMessage_2
            },
            {
                "role": "user",
                "content": getJobLocationUserMessage_3
            },
            {
                "role": "assistant",
                "content": getJobLocationAssistantMessage_3
            },
            {
                "role": "user",
                "content": `## 勤務地に関する雑多な情報\n${location}`
            }
        ],
        model: 'gpt-3.5-turbo',
    });

    const responseContent = response.choices[0]?.message.content;

    if (!responseContent) {
        return '';
    }

    return responseContent;
}

export const getJobLocation = async (location: string, retryCount = 0): Promise<string[]> => {
    console.log("====getJobLocation function start====")
    console.log("location: " + location)
    const responseContent = await getJobLocationResponse(location);
    console.log(`responseContent: ${responseContent}`)

    const responseLines = responseContent.split('\n');
    const locationStripped = location.replace(/\s+/g, '');

    // 確認したjobContentを配列に格納
    const validJobLocations = responseLines.filter(line => locationStripped.includes(line));
    console.log(`validJobLocations: ${validJobLocations}`)

    if (validJobLocations.length === 0 && retryCount < 3) {
        return getJobLocation(location, retryCount + 1);
    }

    return validJobLocations;
}