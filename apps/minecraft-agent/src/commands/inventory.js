module.exports = {
  name: 'inventory',
  description: 'Muestra el inventario del bot.',
  execute(bot, username, args) {
    const items = bot.inventory.items();
    if (items.length === 0) {
      return bot.whisper(username, 'Mi inventario está vacío. No necesito nada.');
    }

    const itemNames = items.map(item => `${item.name} x${item.count}`);
    const message = `En mi inventario tengo: ${itemNames.join(', ')}`;

    // El mensaje puede ser muy largo, así que lo dividimos si es necesario
    if (message.length > 250) {
        bot.whisper(username, 'Tengo demasiadas cosas para listarlas todas en un solo mensaje.');
        // Podríamos implementar paginación aquí en el futuro
    } else {
        bot.whisper(username, message);
    }
  },
};
