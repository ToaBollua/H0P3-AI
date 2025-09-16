module.exports = {
  name: 'players',
  description: 'Lista los jugadores conectados.',
  execute(bot, username, args) {
    const playerNames = Object.keys(bot.players);
    if (playerNames.length === 0) {
      return bot.whisper(username, 'No hay nadie más aquí. Qué paz.');
    }
    bot.whisper(username, `Jugadores en línea: ${playerNames.join(', ')}`);
  },
};
