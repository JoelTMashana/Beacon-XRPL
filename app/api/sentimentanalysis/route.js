import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

export async function GET() {
    const taggingPrompt = ChatPromptTemplate.fromTemplate(
        `Extract the desired information from the following passage.
      
      Only extract the properties mentioned in the 'Classification' function.
      
      Passage:
      {input}
      `
    );
    
    const classificationSchema = z.object({
      sentiment: z.string().describe("The sentiment of the text"),
      helpfulness: z
        .number()
        .int()
        .min(0)
        .max(1)
        .describe("How relevant the text is on a scale from 0 to 1"),
      language: z.string().describe("The language the text is written in"),
    });
    
    const llm = new ChatOpenAI({
      temperature: 0,
      model: "gpt-3.5-turbo-0125",
    });
    
    const llmWithStructuredOutput = llm.withStructuredOutput(classificationSchema, {
      name: "extractor",
    });
    
    const taggingChain = taggingPrompt.pipe(llmWithStructuredOutput);

    // Collect messages and format them as a single string
    const messages = [
      { id: 1, sender: "Alice", text: "Really need some advice on how to survive Freshers' Week!" },
      { id: 2, sender: "Bob", text: "Keep it simple. Make sure you go to the introductory sessions, meet new people, and join a few societies that interest you." },
      { id: 3, sender: "Alice", text: "That makes sense. What about managing the workload?" },
      { id: 4, sender: "Bob", text: "Don’t stress too much yet. Focus on getting organised, keep track of your schedule, and don’t be afraid to ask for help if you need it." },
      { id: 5, sender: "Alice", text: "Thanks! Any tips on balancing social life and studies?" },
      { id: 6, sender: "Bob", text: "Yes, prioritise your time. Enjoy the social events but also set aside study time. Find a good balance early on." }
    ];
    
    const inputText = messages.map(msg => `${msg.sender}: ${msg.text}`).join(" ");

    try {
      const result = await taggingChain.invoke({ input: inputText });
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }
}

