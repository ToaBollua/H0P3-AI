module.exports = {
  name: 'followme',
  description: 'Hace que el bot te siga usando Baritone.',
  execute(bot, username, args, baritonePlugin) {
    const target = bot.players[username]?.entity;
    if (!target) {
      return bot.whisper(username, 'No puedo verte. Asegúrate de estar en el mismo mundo.');
    }
    bot.whisper(username, `Siguiéndote, ${username}.`);
    bot.ashfinder.follow(target);
  },
};
