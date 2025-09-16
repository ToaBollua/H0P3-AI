module.exports = {
  name: 'help',
  description: 'Muestra la lista de comandos disponibles.',
  execute(bot, username, args, commands) {
    let helpMessage = 'Comandos disponibles: ';
    const commandList = Object.keys(commands).map(key => `!${key}`);
    helpMessage += commandList.join(', ');
    helpMessage += '. También puedes usar los comandos de Baritone (ej: #goto, #mine, #follow).';
    bot.whisper(username, helpMessage);
  },
};
