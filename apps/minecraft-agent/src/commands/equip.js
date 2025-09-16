module.exports = {
  name: 'equip',
  description: 'Hace que el bot se equipe un objeto.',
  async execute(bot, username, args) {
    const itemName = args[0];
    const destination = args[1] || 'hand'; // Por defecto, la mano

    if (!itemName) {
      return bot.whisper(username, 'Debes especificar qué objeto quieres que me equipe. Uso: !equip <objeto> [destino]');
    }

    const item = bot.inventory.items().find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
    if (!item) {
      return bot.whisper(username, `No encuentro "${itemName}" en mi inventario.`);
    }

    try {
      await bot.equip(item, destination);
      bot.whisper(username, `Me he equipado ${item.name} en ${destination}.`);
    } catch (err) {
      console.error(`Error al equipar el objeto: ${err.message}`);
      bot.whisper(username, `No me pude equipar eso. ${err.message}`);
    }
  },
};
