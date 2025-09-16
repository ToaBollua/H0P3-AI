module.exports = {
  name: 'drop',
  description: 'Hace que el bot suelte un objeto de su inventario.',
  async execute(bot, username, args) {
    const itemName = args[0];
    const amount = args[1] ? parseInt(args[1], 10) : 1;

    if (itemName && itemName.toLowerCase() === 'all') {
      // Drop all items
      const itemsToDrop = bot.inventory.items();
      if (itemsToDrop.length === 0) {
        return bot.whisper(username, 'Mi inventario está vacío. No hay nada que soltar.');
      }
      bot.whisper(username, 'Soltando todos los objetos del inventario...');
      try {
        for (const item of itemsToDrop) {
          await bot.tossStack(item);
        }
        return bot.whisper(username, 'He soltado todos los objetos.');
      } catch (err) {
        console.error('Error al soltar todos los objetos:', err);
        return bot.whisper(username, 'No pude soltar todos los objetos. Algo salió mal.');
      }
    }

    if (!itemName) {
      // If no item name is provided, drop the item in hand
      const heldItem = bot.heldItem;
      if (!heldItem) {
        return bot.whisper(username, 'No tengo nada en la mano para soltar.');
      }
      try {
        await bot.tossStack(heldItem); // tossStack drops the entire stack
        return bot.whisper(username, `He soltado ${heldItem.count} de ${heldItem.name} de mi mano.`);
      } catch (err) {
        console.error('Error al soltar el objeto de la mano:', err);
        return bot.whisper(username, 'No pude soltar el objeto de la mano. Algo salió mal.');
      }
    }

    if (isNaN(amount)) {
      return bot.whisper(username, 'La cantidad debe ser un número.');
    }

    try {
      const item = bot.inventory.items().find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
      if (!item) {
        return bot.whisper(username, `No tengo ningún objeto que se llame así. Revisa tu ortografía.`);
      }

      await bot.toss(item.type, null, amount);
      bot.whisper(username, `He soltado ${amount} de ${item.name}.`);
    } catch (err) {
      console.error('Error al soltar el objeto:', err);
      bot.whisper(username, 'No pude soltar el objeto. Algo salió mal.');
    }
  },
};
