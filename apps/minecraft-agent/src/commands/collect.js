module.exports = {
  name: 'collect',
  description: 'Hace que el bot recoja un tipo de objeto específico del suelo.',
  async execute(bot, username, args, baritonePlugin, Vec3) {
    const itemName = args[0];
    if (!itemName) {
      return bot.whisper(username, 'Debes especificar el tipo de objeto a recoger. Uso: !collect <nombre_objeto>');
    }

    bot.whisper(username, `Buscando ${itemName} en el suelo...`);

    const itemEntity = bot.nearestEntity((entity) => {
      return (
        entity.name === 'item' &&
        entity.metadata[8] && // Check if metadata[8] exists (item stack data)
        entity.metadata[8].present && // Check if the item stack is present
        entity.metadata[8].value.item.name.toLowerCase().includes(itemName.toLowerCase())
      );
    });

    if (!itemEntity) {
      return bot.whisper(username, `No encuentro ningún ${itemName} cerca en el suelo.`);
    }

    try {
      bot.whisper(username, `Yendo a recoger ${itemName} en ${itemEntity.position.x}, ${itemEntity.position.y}, ${itemEntity.position.z}.`);
      await bot.ashfinder.goto(new baritonePlugin.goals.GoalExact(new Vec3(itemEntity.position.x, itemEntity.position.y, itemEntity.position.z)));
      bot.whisper(username, `He recogido ${itemName}.`);
    } catch (err) {
      console.error('Error al recoger el objeto:', err);
      bot.whisper(username, `No pude recoger ${itemName}. Algo salió mal: ${err.message}`);
    }
  },
};
