import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Text Processing
export async function processText(text: string, task: 'classify' | 'summarize' | 'translate') {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: getSystemPrompt(task) },
        { role: 'user', content: text },
      ],
    });

    return {
      modality: 'text',
      task,
      result: response.choices[0].message.content,
      tokens: response.usage?.total_tokens || 0,
    };
  } catch (error: any) {
    throw new Error(`Text processing error: ${error?.message || 'Unknown error'}`);
  }
}

// Image Processing
export async function processImage(imageUrl: string, task: 'caption' | 'analyze' | 'generate') {
  try {
    if (task === 'generate') {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: imageUrl,
        size: '1024x1024',
      });
      return { modality: 'image', task, result: response.data[0].url };
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: getImagePrompt(task) },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
    });

    return {
      modality: 'image',
      task,
      result: response.choices[0].message.content,
    };
  } catch (error: any) {
    throw new Error(`Image processing error: ${error?.message || 'Unknown error'}`);
  }
}

// Audio Processing
export async function processAudio(audioFile: File, task: 'transcribe' | 'analyze') {
  try {
    if (task === 'transcribe') {
      const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: audioFile,
      });
      return { modality: 'audio', task, result: response.text };
    }

    // For analysis, transcribe first then analyze
    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: audioFile,
    });

    const analysis = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'Analyze this audio transcript for sentiment, key topics, and action items.' },
        { role: 'user', content: transcription.text },
      ],
    });

    return {
      modality: 'audio',
      task,
      transcription: transcription.text,
      analysis: analysis.choices[0].message.content,
    };
  } catch (error: any) {
    throw new Error(`Audio processing error: ${error?.message || 'Unknown error'}`);
  }
}

// Multi-Modal Search
export async function multiModalSearch(query: string, modalities: string[]) {
  try {
    const results: any[] = [];

    for (const modality of modalities) {
      switch (modality) {
        case 'text':
          const textResult = await processText(query, 'classify');
          results.push(textResult);
          break;
        case 'image':
          const imageResult = await processImage(query, 'analyze');
          results.push(imageResult);
          break;
      }
    }

    return { query, modalities, results };
  } catch (error: any) {
    throw new Error(`Multi-modal search error: ${error?.message || 'Unknown error'}`);
  }
}

function getSystemPrompt(task: string): string {
  switch (task) {
    case 'classify': return 'Classify the following text into categories.';
    case 'summarize': return 'Summarize the following text concisely.';
    case 'translate': return 'Translate the following text to English.';
    default: return 'Process the following text.';
  }
}

function getImagePrompt(task: string): string {
  switch (task) {
    case 'caption': return 'Provide a detailed caption for this image.';
    case 'analyze': return 'Analyze this image in detail.';
    default: return 'Describe this image.';
  }
}