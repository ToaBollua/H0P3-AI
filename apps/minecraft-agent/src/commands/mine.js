module.exports = {
  name: 'mine',
  description: 'Hace que el bot mine un tipo de bloque específico.',
  async execute(bot, username, args, baritonePlugin, Vec3) {
    const blockName = args[0];
    if (!blockName) {
      return bot.whisper(username, 'Debes especificar el tipo de bloque a minar. Uso: !mine <nombre_bloque>');
    }

    const blockType = bot.registry.blocksByName[blockName];
    if (!blockType) {
      return bot.whisper(username, `No conozco el bloque "${blockName}".`);
    }

    bot.whisper(username, `Buscando ${blockName}...`);
    const block = bot.findBlock({
      matching: blockType.id,
      maxDistance: 64,
    });

    if (!block) {
      return bot.whisper(username, `No encuentro ningún ${blockName} cerca.`);
    }

    try {
      bot.whisper(username, `Yendo a minar ${blockName} en ${block.position.x}, ${block.position.y}, ${block.position.z}.`);
      console.log(`[MINE COMMAND] Attempting to goto block at ${block.position.x}, ${block.position.y}, ${block.position.z}`);
      await bot.ashfinder.goto(new baritonePlugin.goals.GoalExact(new Vec3(block.position.x, block.position.y, block.position.z)));
      console.log(`[MINE COMMAND] Arrived at block. Attempting to dig.`);

      // Find and equip the best tool for the block
      const bestTool = bot.inventory.findInventoryItem(item => {
        if (!item.name.includes('pickaxe') && !item.name.includes('axe') && !item.name.includes('shovel')) {
          return false;
        }
        // More sophisticated logic could go here to find the *best* tool
        // based on efficiency, durability, etc. For now, just find any suitable tool.
        return true;
      });

      if (bestTool) {
        console.log(`[MINE COMMAND] Equipping ${bestTool.name}.`);
        await bot.equip(bestTool, 'hand');
      } else {
        return bot.whisper(username, 'No tengo ninguna herramienta adecuada (pico, hacha, pala) en mi inventario.');
      }

      const distance = bot.entity.position.distanceTo(block.position);
      if (distance > 4) { // Mineflayer's default digging range is 4 blocks
        return bot.whisper(username, 'Estoy demasiado lejos del bloque para minar.');
      }

      console.log(`[MINE COMMAND] Starting dig of ${blockName} at ${block.position.x}, ${block.position.y}, ${block.position.z}`);
      console.log(`[MINE COMMAND] Starting manual dig of ${blockName}.`);

      // Start swinging arm
      bot.swingArm('right');

      // Poll the block until it breaks or timeout
      const startTime = Date.now();
      const timeout = 10000; // 10 seconds timeout
      let blockBroken = false;

      while (Date.now() - startTime < timeout) {
        const currentBlock = bot.blockAt(block.position);
        if (currentBlock.type === 0) { // Type 0 is air
          blockBroken = true;
          break;
        }
        await bot.waitForTicks(5); // Wait a bit before checking again
      }

      // Stop swinging arm
      bot.swingArm('left'); // Stop swinging

      if (blockBroken) {
        console.log(`[MINE COMMAND] Successfully mined ${blockName} manually.`);
        bot.whisper(username, `He minado ${blockName}.`);
      } else {
        console.log(`[MINE COMMAND] Manual dig of ${blockName} timed out or failed.`);
        bot.whisper(username, `No pude minar ${blockName} manualmente. El bloque no se rompió a tiempo.`);
      }
    } catch (err) {
      console.error('Error al minar el bloque:', err);
      bot.whisper(username, `No pude minar ${blockName}. Algo salió mal: ${err.message}`);
    }
  },
};
