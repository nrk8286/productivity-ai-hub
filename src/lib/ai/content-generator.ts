import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not defined");
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateContentOptions {
  topic: string;
  type: "blog" | "social" | "email" | "ad-copy";
  tone?: "professional" | "casual" | "friendly" | "authoritative";
  length?: "short" | "medium" | "long";
  targetAudience?: string;
}

export async function generateContent(options: GenerateContentOptions) {
  const {
    topic,
    type,
    tone = "professional",
    length = "medium",
    targetAudience = "remote teams and productivity enthusiasts",
  } = options;

  const prompts = {
    blog: `Write a comprehensive, SEO-optimized blog post about "${topic}". 
Target audience: ${targetAudience}.
Tone: ${tone}.
Length: ${length === "long" ? "2000-2500 words" : length === "medium" ? "1000-1500 words" : "500-800 words"}.

Include:
- Engaging introduction with a hook
- Clear section headers (H2, H3)
- Actionable tips and strategies
- Real-world examples
- Best practices
- Common pitfalls to avoid
- Conclusion with next steps

Use HTML formatting with <h2>, <h3>, <p>, <ul>, <ol>, <strong>, <em> tags.`,

    social: `Create engaging social media content about "${topic}".
Target audience: ${targetAudience}.
Tone: ${tone}.

Generate:
1. A compelling tweet (280 characters max)
2. A LinkedIn post (500 words max)
3. An Instagram caption with hashtags
4. A Facebook post

Make it shareable, include calls-to-action, and add relevant emojis.`,

    email: `Write a persuasive email about "${topic}".
Target audience: ${targetAudience}.
Tone: ${tone}.

Include:
- Attention-grabbing subject line
- Personal greeting
- Clear value proposition
- Supporting points or benefits
- Strong call-to-action
- Professional signature

Keep it concise and scannable.`,

    "ad-copy": `Create compelling ad copy for "${topic}".
Target audience: ${targetAudience}.
Tone: ${tone}.

Generate:
1. Headline (max 60 characters)
2. Description (max 150 characters)
3. Long-form ad copy (100-200 words)
4. 5 call-to-action options

Focus on benefits, create urgency, and be specific.`,
  };

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: length === "long" ? 4000 : length === "medium" ? 2500 : 1500,
      messages: [
        {
          role: "user",
          content: prompts[type],
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      return {
        success: true,
        content: content.text,
        usage: message.usage,
      };
    }

    return {
      success: false,
      error: "Unexpected response format",
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      success: false,
      error,
    };
  }
}

export async function improveContent(content: string, instructions: string) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Improve the following content based on these instructions: ${instructions}

Original content:
${content}

Provide the improved version maintaining the same format.`,
        },
      ],
    });

    const result = message.content[0];
    if (result.type === "text") {
      return {
        success: true,
        content: result.text,
      };
    }

    return {
      success: false,
      error: "Unexpected response format",
    };
  } catch (error) {
    console.error("Error improving content:", error);
    return {
      success: false,
      error,
    };
  }
}

export async function generateBlogPostIdeas(topic: string, count: number = 10) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Generate ${count} unique, SEO-optimized blog post titles about "${topic}" for remote teams and productivity enthusiasts.

Each title should be:
- Compelling and click-worthy
- Include relevant keywords
- 50-70 characters long
- Action-oriented or question-based

Format: Return as a numbered list.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      return {
        success: true,
        ideas: content.text.split("\n").filter((line) => line.trim()),
      };
    }

    return {
      success: false,
      error: "Unexpected response format",
    };
  } catch (error) {
    console.error("Error generating ideas:", error);
    return {
      success: false,
      error,
    };
  }
}
