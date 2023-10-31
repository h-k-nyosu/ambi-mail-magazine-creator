export function getValidContent(contentResponse: string, jobContent: string): string[] {
    const contents = contentResponse.split("\n");
    let validContent = [];
    for (const content of contents) {
        if (jobContent.replace(/\n/g, '').replace(/\s/g, '').includes(content)) {
            console.log("✅有効なコンテンツ: " + content);
            validContent.push(content);
        }
    }
    return validContent;
}