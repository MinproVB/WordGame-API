const { Client } = require('discord.js');
const fs = require('fs');

const wordgames = require('../wordgame.json');
//const regex = /(?:> \*\*Type\*\*: (.+)\s+)(?:> \*\*Blague\*\*: (.+)\s+)(?:> \*\*Réponse\*\*: (.+)\s+)(?:> ▬+)/im

const adminUsers = [
  '485327445722136578',
];
const jokeRole = '777201132782616608';

const suggestsChannel = '777060073591537695';
const logsChannel = '777060127420710913';

const prefix = '/';

const bot = new Client({
  partials: ['MESSAGE', 'REACTION'],
});

bot.on('ready', () => {
  console.log(`${bot.user.tag} connecté !`);

  bot.user.setActivity(`les ${wordgames.length} jeux de mots`, {
    type: 'WATCHING',
  });
  setInterval(() => {
    bot.user.setActivity(`les ${wordgames.length} jeux de mots`, {
      type: 'WATCHING',
    })
}, 24 * 60 * 60 * 1000)
})

bot.on('message', async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
    
    if(message.channel.id == suggestsChannel && command === "wordgame") {
        const channel = message.guild.channels.cache.get(logsChannel);

        const wordgame = message.content.slice(prefix.length + command.length).trim();

        if(wordgame.length <= 5) {
            return channel.send({embed: {
                author: {
                    name: message.author.username,
                    icon_url: message.author.displayAvatarURL({format: 'png'})
                },
                title: 'Invalide',
                description: 'Votre jeu de mot est trop petit',
                color: '#ff7b25'
            }})
        }

        message.channel.send({embed: {
            author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL({format: 'png'})
            },
            title: '**Nouveau jeux de mots : **',
            description: wordgame,
            color: '#ff7b25'
        }}).then(sentMessage => {
            sentMessage.react("⬆️");
            sentMessage.react("⬇️");
            sentMessage.react("✅");
        });

        fs.readFile(__dirname + '/../wordgame-notvalid.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            obj = JSON.parse(data); //now it an object
            obj.push({author: message.author.username, wordgame: wordgame}); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile(__dirname + '/../wordgame-notvalid.json', json, 'utf8', () => {
                message.member.roles.add(jokeRole);
                message.delete();
            }); // write it back 
        }});
    }
});
  

bot.login(process.env.discord_token);