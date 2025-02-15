import showToast from "./Toast";

// services/openaiService.js
export const generateStreamedPrompt = async (prompt, onData, onError) => {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    return showToast("OpenAI API key is not defined.", "error");
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        stream: true, // Enable streaming
      }),
    });

    if (!response.ok) {
      return showToast(
        "Error: " + response.status + " - " + response.statusText,
        "error"
      );
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonString = line.replace("data: ", "").trim();
          if (jsonString === "[DONE]") return;

          try {
            const parsed = JSON.parse(jsonString);
            const text = parsed.choices[0]?.delta?.content || "";
            accumulatedText += text;
            onData(accumulatedText); // Update UI as chunks arrive
          } catch (error) {
            showToast("Error parsing JSON: " + error.message, "error");
            // console.error("Error parsing JSON:", error);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error streaming data:", error);
    showToast("Error streaming data " + error.message, "error");
    onError(error);
  }
};
