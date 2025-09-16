module.exports = {
  name: 'stop',
  description: 'Detiene cualquier acción actual del bot (Baritone).',
  execute(bot, username, args) {
    bot.ashfinder.stop();
    bot.whisper(username, 'Deteniendo cualquier acción.');
  },
};
