module.exports = {
  name: 'craft',
  description: 'Hace que el bot craftee un objeto.',
  async execute(bot, username, args, baritonePlugin, Vec3) {
    const itemName = args[0];
    const count = args[1] ? parseInt(args[1], 10) : 1;

    if (!itemName) {
      return bot.whisper(username, 'Debes especificar el nombre del objeto a craftear. Uso: !craft <nombre_objeto> [cantidad]');
    }

    const item = bot.registry.itemsByName[itemName];
    if (!item) {
      return bot.whisper(username, `No conozco el objeto "${itemName}".`);
    }

    const recipes = bot.recipesFor(item.id, null, count);
    if (recipes.length === 0) {
      return bot.whisper(username, `No conozco ninguna receta para ${itemName} o no tengo los ingredientes.`);
    }

    const recipe = recipes[0]; // Tomar la primera receta disponible

    try {
      if (recipe.requiresTable) {
        bot.whisper(username, 'Necesito una mesa de crafteo. Buscando...');
        const craftingTable = bot.findBlock({
          matching: bot.registry.blocksByName.crafting_table.id,
          maxDistance: 64,
        });

        if (!craftingTable) {
          return bot.whisper(username, 'No encuentro ninguna mesa de crafteo cerca.');
        }

        bot.whisper(username, `Yendo a la mesa de crafteo en ${craftingTable.position.x}, ${craftingTable.position.y}, ${craftingTable.position.z}.`);
        await bot.ashfinder.goto(new baritonePlugin.goals.GoalBlock(craftingTable.position.x, craftingTable.position.y, craftingTable.position.z));
        
        // Open the crafting table
        const table = await bot.openContainer(craftingTable);
        await bot.craft.craft(recipe, count, table);
        table.close();
        bot.whisper(username, `He crafteado ${count} ${itemName}.`);
      } else {
        // Craft without a table (e.g., planks from logs)
        await bot.craft.craft(recipe, count);
        bot.whisper(username, `He crafteado ${count} ${itemName}.`);
      }
    } catch (err) {
      console.error('Error al craftear:', err);
      bot.whisper(username, `No pude craftear ${itemName}. Algo salió mal: ${err.message}`);
    }
  },
};
