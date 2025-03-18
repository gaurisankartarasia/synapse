// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { NextResponse } from 'next/server';
// import { instruction } from './inst';

// export async function POST(request: Request) {
//   try {
//     const { prompt } = await request.json();
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
//     const model = genAI.getGenerativeModel({
//       model: 'gemini-2.0-flash',
//       systemInstruction: instruction,
//     });

//     const result = await model.generateContentStream(prompt);

//     const stream = new ReadableStream({
//       async start(controller) {
//         for await (const chunk of result.stream) {
//           const text = chunk.text();
//           controller.enqueue(new TextEncoder().encode(text)); // Encode the text
//         }
//         controller.close();
//       },
//     });

//     return new NextResponse(stream, {
//       headers: { 'Content-Type': 'text/plain; charset=utf-8' }, // Set the correct content type
//     });
//   } catch (error) {
//     console.error('Error generating content:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }




import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { instruction } from './inst';

export async function POST(request: Request) {
  try {
    const { prompt, model = 'gemini-2.0-flash' } = await request.json();
    
    // Validate model parameter
    const validModels = ['gemini-2.0-flash-lite', 'gemini-1.5', 'gemini-1.5-pro'];
    const selectedModel = validModels.includes(model) ? model : 'gemini-2.0-flash';
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    
    const modelInstance = genAI.getGenerativeModel({
      model: selectedModel,
      systemInstruction: instruction,
    });
    
    const result = await modelInstance.generateContentStream(prompt);
    
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(new TextEncoder().encode(text)); // Encode the text
        }
        controller.close();
      },
    });
    
    return new NextResponse(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }, // Set the correct content type
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}