module.exports = {
  name: 'status',
  description: 'Informa sobre el estado actual del bot.',
  execute(bot, username, args) {
    const health = bot.health;
    const food = bot.food;
    const position = bot.entity.position.floored();

    bot.whisper(username, `Estado actual: Salud: ${health}/20, Hambre: ${food}/20, Posición: (${position.x}, ${position.y}, ${position.z})`);
  },
};
