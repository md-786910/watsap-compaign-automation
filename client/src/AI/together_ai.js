import Together from "together-ai";
const together = new Together({
  apiKey: import.meta.env.VITE_TOGETHER_AI_API_KEY,
});

function enhancePrompt(userInput) {
  return `You are an AI assistant that enhances user queries. Improve clarity, add context, and optimize prompts for better responses.
  
  ### User's Input:
  "${userInput}"

  ### Enhanced Prompt:
  - Clearly define the goal of the response.
  - Add details and examples for better accuracy.
  - Specify output format (e.g., list, paragraphs, JSON).
  - Maintain a natural, engaging, and helpful tone.

  Now generate an improved version of the given user input.`;
}

async function enhancePromptCompletion(userPrompt, onLoadData, onError) {
  try {
    onLoadData("");
    // const prompt = `
    // You are an advanced AI prompt enhancer. Your task is to improve the given user prompt by making it more detailed, specific, and structured. Ensure the prompt provides clarity, context, and desired output format while avoiding ambiguity.
    // ### **User's Original Prompt:**
    // ${userPrompt}

    // ### **Enhanced Prompt:**
    // 1. **Context:** Provide background information to give AI better understanding.
    // 2. **Objective:** Clearly define what the user wants to achieve.
    // 3. **Details & Constraints:** Add specifics such as examples, tone, length, format, and any constraints.
    // 4. **Desired Output Format:** Specify the structure (e.g., list, table, paragraphs, JSON, etc.).
    // 5. **Creativity & Style (if needed):** Define if the response should be formal, casual, technical, creative, etc.

    // ### **Example Transformation:**
    // #### **User's Input:**
    // *"Write a story about a detective."*

    // #### **Enhanced Prompt:**
    // *"Write a 500-word detective mystery story set in 1920s London. The protagonist, Detective James Carter, must solve a murder case in a grand hotel. The story should have suspense, unexpected twists, and a satisfying resolution. Use a noir writing style with vivid descriptions."*

    // `;
    const prompt = enhancePrompt(userPrompt);
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      temperature: 0.7,
      top_p: 0.9,
      top_k: 50,
      repetition_penalty: 1.05,
      stream: true, // Enable streaming
    });

    if (!response || typeof response[Symbol.asyncIterator] !== "function") {
      throw new Error("Invalid response received from the API");
    }

    for await (const token of response) {
      const text = token?.choices?.[0]?.text || ""; // Ensure text fallback
      if (text) {
        onLoadData((prev) => prev + text);
      }
    }
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    if (onError) onError(error.message || "An unexpected error occurred.");
  }
}

export { enhancePromptCompletion };
