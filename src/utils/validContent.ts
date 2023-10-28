// utils/validContent.ts

export function getValidAttractiveContent(attractiveContentResponse: string, jobContent: string): string[] {
    const attractiveContents = attractiveContentResponse.split("\n");
    let validAttractiveContent = [];
    for (const content of attractiveContents) {
        if (jobContent.replace(/\n/g, '').replace(/\s/g, '').includes(content)) {
            console.log("✅魅力的な文章の抜粋: " + content);
            validAttractiveContent.push(content);
        }
    }
    return validAttractiveContent;
}