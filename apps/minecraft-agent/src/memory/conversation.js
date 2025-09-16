const fs = require('fs');
const path = require('path');

// Usar una ruta absoluta para el archivo de conversación
const conversationFile = path.join(__dirname, '..', '..', 'conversation.jsonl');
const compressThreshold = 20;

let conversationLog = [];

function loadConversation() {
  if (fs.existsSync(conversationFile)) {
    try {
      const lines = fs.readFileSync(conversationFile, 'utf-8').split('\n').filter(Boolean);
      conversationLog = lines.map(line => JSON.parse(line));
      console.log('Historial cargado:', conversationLog.length, 'mensajes');
    } catch (err) {
      console.error('Error al cargar historial:', err);
    }
  }
}

function appendToConversationFile(entry) {
  try {
    fs.appendFileSync(conversationFile, JSON.stringify(entry) + '\n', 'utf-8');
  } catch (err) {
    console.error('Error al hacer append al historial:', err);
  }
}

function addMessage(entry) {
  // Asegurarse de que el texto guardado sea solo el contenido del mensaje
  let cleanText = entry.text;
  if (entry.role === 'user') {
      cleanText = entry.text.split(' dice: ')[1] || entry.text;
  } else if (entry.role === 'assistant') {
      cleanText = entry.text.split(' H0P3 responde: ')[1] || entry.text;
  }

  conversationLog.push({ role: entry.role, text: cleanText });
  appendToConversationFile({ role: entry.role, text: cleanText });

  if (conversationLog.length > 20) {
    conversationLog.shift();
  }
}

/*
async function compressConversation(ai) {
  if (conversationLog.length < compressThreshold) return;

  const summarizePrompt = 'Resume la discusión brevemente en 50 palabras o menos para usar como contexto futuro.';
  const fullText = conversationLog.map(e => e.text).join('\n');
  const prompt = `${summarizePrompt}\n${fullText}`;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (response && response.text) {
      const summary = `Resumen: ${response.text()}`;
      const summaryEntry = { role: 'system', text: summary };
      conversationLog = [summaryEntry];
      // Sobrescribir el archivo con el resumen
      fs.writeFileSync(conversationFile, JSON.stringify(summaryEntry) + '\n', 'utf-8');
      console.log('Historial comprimido y guardado.');
    }
  } catch (error) {
    console.error('Error al comprimir historial:', error);
  }
}
*/

function getConversation() {
    return conversationLog;
}

module.exports = {
  loadConversation,
  addMessage,
  getConversation,
};
