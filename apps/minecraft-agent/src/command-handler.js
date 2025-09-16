const fs = require('fs');
const path = require('path');

const commands = {};
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, 'commands', file));
  commands[command.name] = command;
}

function handleCommand(bot, username, message, baritonePlugin, Vec3) {
  const prefix = '!';
  if (!message.startsWith(prefix)) return false;

  const args = message.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = commands[commandName];

  if (!command) return false;

  try {
    // The help command needs access to the list of commands
    if (command.name === 'help') {
        command.execute(bot, username, args, commands);
    } else if (command.name === 'mine' || command.name === 'collect' || command.name === 'craft') {
        command.execute(bot, username, args, baritonePlugin, Vec3);
    } else if (command.name === 'followme') {
        command.execute(bot, username, args, baritonePlugin);
    } else if (command.name === 'stop') {
        command.execute(bot, username, args);
    } else {
        command.execute(bot, username, args);
    }
    return true;
  } catch (error) {
    console.error(`Error ejecutando el comando ${commandName}:`, error);
    bot.chat('Hubo un error al intentar ejecutar ese comando.');
    return true;
  }
}

module.exports = { handleCommand };
