const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const OLLAMA_API_URL = 'http://localhost:11434/api/chat';
const OLLAMA_MODEL_NAME = 'phi3';
const GEMINI_MODEL_NAME = 'gemini-1.5-flash';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getOllamaResponse(conversationLog) {
    console.log('Intentando obtener respuesta de Ollama (modo chat)...');

    // Formatear el log para el endpoint /api/chat de Ollama
    const messages = conversationLog.map(entry => ({
        role: entry.role, // 'user' o 'assistant'
        content: entry.text
    }));

    // Añadir el prompt del sistema al principio de la conversación
    messages.unshift({
        role: 'system',
        content: process.env.PROMPT
    });

    try {
        const response = await axios.post(OLLAMA_API_URL, {
            model: OLLAMA_MODEL_NAME,
            messages: messages,
            stream: false
        });

        // La respuesta de /api/chat está en response.data.message.content
        if (response.data && response.data.message && response.data.message.content) {
            console.log('Respuesta de Ollama (chat) exitosa.');
            return response.data.message.content;
        } else {
            console.log('Ollama (chat) no devolvió una respuesta válida.', response.data);
            return null;
        }
    } catch (error) {
        console.error("Error al llamar a la API de Ollama (chat):", error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error("Ollama no está corriendo o no es accesible.");
        }
        return null;
    }
}

async function getGeminiResponse(conversationLog) {
    console.log('Intentando obtener respuesta de Gemini...');
    // Formatear el log para Gemini: array de objetos { role, parts: [{ text }] }
    const contents = conversationLog.map(entry => {
        return {
            role: entry.role === 'user' ? 'user' : 'model', // Gemini usa 'user' y 'model'
            parts: [{ text: entry.text }]
        };
    });

    // Usar GEMINI_PROMPT si existe, de lo contrario, usar PROMPT
    const geminiSystemPrompt = process.env.GEMINI_PROMPT || process.env.PROMPT;
    const systemInstruction = { parts: [{ text: geminiSystemPrompt }] };

    try {
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });
        const chat = model.startChat({
            history: contents,
            systemInstruction: systemInstruction // Usar el prompt de sistema de Gemini
        });

        const result = await chat.sendMessage('');
        const response = await result.response;

        if (response && response.text) {
            console.log('Respuesta de Gemini exitosa.');
            return response.text();
        }
         else {
            console.log('Gemini no devolvió una respuesta válida.', response);
            return null;
        }
    } catch (error) {
        console.error("Error al llamar a la API de Gemini:", error.message);
        return null;
    }
}

async function getBotResponse(conversationLog) { // Ahora recibe el log completo
    let response = null;

    if (global.currentApiMode === 'OLLAMA') {
        response = await getOllamaResponse(conversationLog);
        if (response) {
            return response;
        }
        console.log('Ollama no pudo responder.');
    } else if (global.currentApiMode === 'GEMINI') {
        response = await getGeminiResponse(conversationLog);
        if (response) {
            return response;
        }
        console.log('Gemini no pudo responder.');
    }

    return "Lo siento, H0P3 no pudo generar una respuesta en este momento. Ninguna API respondió.";
}

module.exports = {
    getBotResponse,
};
