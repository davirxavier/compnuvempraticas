require('console-stamp')(console, '[dd/mm/yyyy HH:MM:ss.l]');
const { Client, Intents } = require('discord.js');
const http = require('axios');
const Conf = require('conf');
const config = new Conf();

const checkingInterval = parseInt(process.env.CHECKING_INTERVAL) || 20 * 60 * 1000;

const messages = {
    up: process.env.UP_MESSAGE || 'Moodle reviveu.',
    down: process.env.DOWN_MESSAGE || 'RIP Moodle.',
    pause: process.env.PAUSE_MESSAGE || 'Zzzzzz.',
    resume: process.env.RESUME_MESSAGE || 'Acordado.',
    channel: process.env.SET_CHANNEL_MESSAGE || 'Canal {arg}, positivo.'
};

const url = process.env.URL || 'https://httpbin.org/status/200';
const wasUpKey = 'wasUp';
const pausedKey = 'isPaused:';
const channelKey = 'channel_guild:';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]});
let currentInterval = undefined;

async function startUp() {
    stop();
    await check();
    currentInterval = setInterval(check, checkingInterval);
}

async function check() {
    console.log('Checking url...');
    return http.get(url, {timeout: 10000}).then(() => {
        console.log('Is up.');
        doSendMessage(true);
    }).catch(() => {
        console.log('Not up.')
        doSendMessage(false);
    });
}

async function doSendMessage(isUpNow) {
    let wasUp = await config.get(wasUpKey);
    if (wasUp == null) {
        wasUp = true;
    }

    const send = async (message) => {
        console.log(message)
        client.guilds.cache.forEach(g => {
            (async () => {
                try {
                    const cName = await config.get(channelKey + g.id);
                    const channel = g.channels.cache.find(c => c.name == cName);
                    if (cName && channel) {
                        channel.send(message);
                    } else {
                        const c = g.channels.cache.filter(c => c.type != 'GUILD_CATEGORY').first();
                        if (c && typeof c.send === 'function') {
                            c.send(message);
                        }
                    }

                    await config.set(wasUpKey, isUpNow);
                } catch(e) {
                    console.error(e);
                    await config.set(wasUpKey, null);
                }
            })();
        });
    };

    if (isUpNow && !wasUp) {
        await send(messages.up);
    } else if (!isUpNow && wasUp) {
        await send(messages.down);
    }
}

function stop() {
    if (currentInterval) {
        clearInterval(currentInterval);
    }
}

client.on('ready', () => {
    (async () => {
        if (!(await config.get(pausedKey))) {
            startUp();
        }
    })();
});

client.on('messageCreate', (mes) => {
    (async () => {
        try {
            if (mes.author.id !== client.user.id &&
                mes.mentions.has(client.user.id) &&
                mes.content) {
                const key = pausedKey + mes.guild.id;
                const isPaused = await config.get(key);
                const content = mes.content.replace(/<[^<>]*>/, '').trim().toLowerCase();

                if (content.startsWith('pause') && !isPaused) {
                    stop();
                    await config.set(key, true);

                    mes.channel.send(messages.pause);
                } else if (content.startsWith('resume') && isPaused) {
                    startUp();
                    await config.set(pausedKey, false);

                    mes.channel.send(messages.resume);
                } else if (content.startsWith('channel')) {
                    const cName = content.slice(7).trim();
                    await config.set(`${channelKey}${mes.guild.id}`, cName);

                    mes.channel.send(messages.channel.replace('{arg}', cName));
                }
            }
        } catch (e) {
            console.error(e);
        }
    })();
});

client.login('OTQwNzE1NjUwMTE1MDcyMDIx.GfkGvD.JG8QOPEd8zkg-fiMdm-h_XYkggAlIV_8rcAf8k');
