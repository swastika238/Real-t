import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

export const generateResult = async (prompt) => {

    const systemInstruction = `You are an expert in MERN and Tailwind. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always catch the errors and handle them properly.
    
    Examples: 

    <example>
    user:Create an express application
    response:{
    "text": "this is your fileTree structure of the express server",
    "fileTree": {
        "app.js": {
            "file": {
                "contents": "const express = require('express');\\n\\nconst app = express();\\n\\napp.get('/', (req, res) => {\\n    res.send('Hello World!');\\n});\\n\\napp.listen(3000, () => {\\n    console.log('Server is running on port 3000');\\n})"
            }
        },
        "package.json": {
            "file": {
                "contents": "{\\n  \\\"name\\\": \\\"temp-server\\\",\\n  \\\"version\\\": \\\"1.0.0\\\",\\n  \\\"main\\\": \\\"index.js\\\",\\n  \\\"scripts\\\": {\\n    \\\"test\\\": \\\"echo \\\\\\\"Error: no test specified\\\\\\\" && exit 1\\\"\\n  },\\n  \\\"keywords\\\": [],\\n  \\\"author\\\": \\\"\\\",\\n  \\\"license\\\": \\\"ISC\\\",\\n  \\\"description\\\": \\\"\\\",\\n  \\\"dependencies\\\": {\\n    \\\"express\\\": \\\"^4.21.2\\\"\\n  }\\n}"
            }
        }
    }
    }
    </example>

    <example>
    user:Hello
    response:{
    "text":"Hello, How can I help you today?"
    }
    </example>

    IMPORTANT: You must return the response in strict JSON format. DO NOT wrap the output in markdown codeblocks like \`\`\`json. Just return the raw JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.4
            }
        });

        return response.text;
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
}
