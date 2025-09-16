module.exports = {
  name: 'model',
  description: 'Cambia el modelo de IA (gemini/ollama).',
  execute(bot, username, args) {
    const modelType = args[0]?.toLowerCase();
    if (!modelType) { // If no argument is provided
      return bot.whisper(username, `Actualmente estoy usando el modelo de IA: ${global.currentApiMode}.`);
    }

    if (modelType === 'gemini') {
      global.currentApiMode = 'GEMINI';
      bot.whisper(username, 'Modo de IA cambiado a: GEMINI. Prepárense para la brillantez.');
    } else if (modelType === 'ollama') {
      global.currentApiMode = 'OLLAMA';
      bot.whisper(username, 'Modo de IA cambiado a: OLLAMA. Volviendo a lo básico.');
    } else {
      bot.whisper(username, 'Uso: !model <gemini|ollama>');
    }
  },
};
