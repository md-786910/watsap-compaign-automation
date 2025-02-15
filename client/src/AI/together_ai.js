import Together from "together-ai";
const together = new Together({
  apiKey: import.meta.env.VITE_TOGETHER_AI_API_KEY,
});

async function enhancePromptCompletion(userPrompt, onLoadData, onError) {
  try {
    onLoadData("");
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Enhance this prompt and write in max upto 200 words for watsapp: "${userPrompt}"`,
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
