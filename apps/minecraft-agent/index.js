
require('dotenv').config();
const mineflayer = require('mineflayer');
const baritonePlugin = require('@miner-org/mineflayer-baritone');
const { Vec3 } = require('vec3');

// Importar módulos de IA y comandos
const { getBotResponse } = require('./src/gemini/api');
const { loadConversation, addMessage, getConversation } = require('./src/memory/conversation');
const { handleCommand } = require('./src/command-handler');

// --- CONFIGURACIÓN DEL BOT (cargada desde .env) ---
const BOT_CONFIG = {
  host: process.env.SERVER_IP || 'localhost',
  port: parseInt(process.env.SERVER_PORT) || 25565,
  username: process.env.BOT_USERNAME || 'H0P3_Bot',
  version: process.env.MINECRAFT_VERSION || '1.20.1',
  auth: process.env.AUTH_MODE || undefined,
  loginTimeout: 15000 // 15 segundos de tiempo de espera para la conexión
};
// --------------------------------------------------

// Configuración global para la IA
global.currentApiMode = process.env.DEFAULT_AI_MODE || 'OLLAMA'; // OLLAMA o GEMINI



let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 300000; // 5 minutos
let isDying = false;

function createBot() {
  console.log('Iniciando bot...');
  const bot = mineflayer.createBot(BOT_CONFIG);

  // Cargar plugins
  bot.loadPlugin(baritonePlugin.loader);

  bot.on('login', () => {
    console.log(`Bot conectado a ${BOT_CONFIG.host}:${BOT_CONFIG.port}`);
    reconnectAttempts = 0; // Reiniciar contador en conexión exitosa
    console.log('Esperando a aparecer en el mundo...');
    loadConversation(); // Cargar historial de conversación
  });

  bot.on('spawn', () => {
    console.log('Bot ha aparecido en el mundo. ¡Listo!');
    console.log('H0P3 está en línea. Baritone activado.');

    // Configurar Baritone para que el chat controle los comandos
    

    
  });

  bot.on('death', () => {
    console.log('El bot ha muerto. Reapareciendo en 5 segundos...');
    isDying = true;
    setTimeout(() => {
      bot.respawn();
      isDying = false; // Reset after attempting respawn
    }, 5000); // Espera 5 segundos antes de reaparecer
  });

  // Manejador de comandos y chat con IA
  bot.on('chat', async (username, message) => {
    if (username === bot.username) return;

    // Permitir que Baritone controle sus propios comandos
    if (message.startsWith('#')) {
      const args = message.slice(1).trim().split(/ +/);
      const command = args.shift().toLowerCase();

      if (command === 'goto') {
        console.log(`Baritone command: goto ${args.join(' ')}`);
        if (args.length === 3) {
          const x = parseFloat(args[0]);
          const y = parseFloat(args[1]);
          const z = parseFloat(args[2]);
          if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
            bot.whisper(username, `Yendo a ${x}, ${y}, ${z}.`);
            bot.ashfinder.goto(new baritonePlugin.goals.GoalBlock(x, y, z));
            return;
          }
        }
        bot.whisper(username, 'Uso: #goto <x> <y> <z>');
      } else if (command === 'follow') {
        console.log(`Baritone command: follow ${args.join(' ')}`);
        const targetUsername = args[0];
        if (targetUsername) {
          const target = bot.players[targetUsername]?.entity;
          if (target) {
            bot.whisper(username, `Siguiendo a ${targetUsername}.`);
            bot.ashfinder.follow(target);
            return;
          } else {
            bot.whisper(username, `No puedo encontrar a ${targetUsername}.`);
          }
        }
        bot.whisper(username, 'Uso: #follow <nombre_usuario>');
      } else if (command === 'stop') {
        console.log(`Baritone command: stop`);
        bot.whisper(username, 'Deteniendo cualquier acción.');
        bot.ashfinder.stop();
        return;
      }
      // If it's a Baritone command but not recognized, or invalid args
      return;
    }

    // Intentar manejar como un comando. Si lo es, la función devuelve true.
    const isCommand = handleCommand(bot, username, message, baritonePlugin, Vec3);

    if (!isCommand) {
      // Si no es un comando, procesar con IA
      console.log(`Mensaje de ${username}: ${message}`);
      addMessage({ role: 'user', text: `${username} dice: ${message}` });

      const aiResponse = await getBotResponse(getConversation());
      if (aiResponse) {
        const cleanedAiResponse = aiResponse.replace(/^H0P3 responde: /, ''); // Remove prefix if present
        addMessage({ role: 'assistant', text: cleanedAiResponse });

        // Si la respuesta de la IA es un comando de Baritone, ejecutarlo
        if (cleanedAiResponse.startsWith('#')) {
          bot.whisper(username, cleanedAiResponse); // Baritone's chatControl will handle this
        } else {
          bot.whisper(username, cleanedAiResponse);
        }
      } else {
        bot.whisper(username, 'Lo siento, no pude generar una respuesta en este momento.');
      }
    }
  });

  bot.on('whisper', async (username, message) => {
    if (username === bot.username) return; // Ignore whispers from the bot itself

    // Handle whispered commands similar to chat commands
    // Permitir que Baritone controle sus propios comandos
    if (message.startsWith('#')) {
      const args = message.slice(1).trim().split(/ +/);
      const command = args.shift().toLowerCase();

      if (command === 'goto') {
        console.log(`Baritone command (whisper): goto ${args.join(' ')}`);
        if (args.length === 3) {
          const x = parseFloat(args[0]);
          const y = parseFloat(args[1]);
          const z = parseFloat(args[2]);
          if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
            bot.whisper(username, `Yendo a ${x}, ${y}, ${z}.`);
            bot.ashfinder.goto(new baritonePlugin.goals.GoalBlock(x, y, z));
            return;
          }
        }
        bot.whisper(username, 'Uso: #goto <x> <y> <z>');
      } else if (command === 'follow') {
        console.log(`Baritone command (whisper): follow ${args.join(' ')}`);
        const targetUsername = args[0];
        if (targetUsername) {
          const target = bot.players[targetUsername]?.entity;
          if (target) {
            bot.whisper(username, `Siguiendo a ${targetUsername}.`);
            bot.ashfinder.follow(target);
            return;
          } else {
            bot.whisper(username, `No puedo encontrar a ${targetUsername}.`);
          }
        }
        bot.whisper(username, 'Uso: #follow <nombre_usuario>');
      } else if (command === 'stop') {
        console.log(`Baritone command (whisper): stop`);
        bot.whisper(username, 'Deteniendo cualquier acción.');
        bot.ashfinder.stop();
        return;
      }
      // If it's a Baritone command but not recognized, or invalid args
      return;
    }

    // Intentar manejar como un comando. Si lo es, la función devuelve true.
    const isCommand = handleCommand(bot, username, message, baritonePlugin, Vec3);

    if (!isCommand) {
      // Si no es un comando, procesar con IA
      console.log(`Mensaje de ${username}: ${message}`);
      addMessage({ role: 'user', text: `${username} dice: ${message}` });

      const aiResponse = await getBotResponse(getConversation());
      if (aiResponse) {
        const cleanedAiResponse = aiResponse.replace(/^H0P3 responde: /, ''); // Remove prefix if present
        addMessage({ role: 'assistant', text: cleanedAiResponse });

        // Si la respuesta de la IA es un comando de Baritone, ejecutarlo
        if (cleanedAiResponse.startsWith('#')) {
          bot.whisper(username, cleanedAiResponse); // Baritone's chatControl will handle this
        } else {
          bot.whisper(username, cleanedAiResponse);
        }
      } else {
        bot.whisper(username, 'Lo siento, no pude generar una respuesta en este momento.');
      }
    }
  });


  bot.on('kicked', (reason, loggedIn) => {
    console.error('Bot ha sido expulsado:', reason);
    handleDisconnect();
  });

  bot.on('error', (err) => {
    console.error('Ocurrió un error:', err);
    if (err.message.includes('Invalid credentials')) {
        console.log('Error de autenticación. No se reintentará.');
        return;
    }
    handleDisconnect();
  });
  
  bot.on('end', (reason) => {
    console.log(`Bot desconectado: ${reason}`);
    handleDisconnect();
  });
}

function handleDisconnect() {
    if (isDying) {
        console.log('Bot desconectado mientras moría. Esperando respawn.');
        return; // Don't try to reconnect immediately, let respawn handle it
    }

    if (reconnectAttempts >= maxReconnectAttempts) {
        console.log('Se alcanzó el máximo de intentos de reconexión. Rindiéndose.');
        return;
    }
    reconnectAttempts++;
    console.log(`Intento de reconexión ${reconnectAttempts}/${maxReconnectAttempts} en ${reconnectDelay / 1000} segundos...`);
    setTimeout(createBot, reconnectDelay);
}

// Iniciar el bot por primera vez
createBot();
