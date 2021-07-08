module.exports = {
    name: "kick",
    perms: 1,
    async execute(message, args, discord, successColor, errorColor, config) {

        if (!args[1]) {
            let embed = new discord.MessageEmbed()
                .setTitle(config.general.error.errorMessageTitle)
                .setDescription('Hmm... eine Person anzugeben wäre nett. Ich kann nicht deine Gedanken lesen!')
                .setColor(errorColor);
            message.channel.send(embed);
            return;
        }

        let member = message.mentions.members.first();
        if (!member) {
            let embed = new discord.MessageEmbed()
                .setTitle(config.general.error.errorMessageTitle)
                .setDescription('Hast du dich vertippt, du baka? Diesen Benutzer gibt es nicht!')
                .setColor(errorColor);
            message.channel.send(embed);
            return;
        }

        if (!member.kickable) {
            let embed = new discord.MessageEmbed()
                .setTitle(config.general.error.errorMessageTitle)
                .setDescription('Das darf Ich leider nicht tun. Sonst bekomme Ich wieder eine Strafe... :sob:')
                .setColor(errorColor);
            message.channel.send(embed);
            return;
        }

        if (!args[2]) {
            member.kick();
            return;
        }
        
        let substr = args[0].length + args[1].length + 4;
        let msg = message.content.substring(substr);
        await member.send(msg);
        member.kick(msg).then(() => {
            let embed = new discord.MessageEmbed()
                .setTitle(config.general.error.successMessageTitle)
                .setDescription('Dieser Benutzer wurde erfolgreich gekickt!')
                .setColor(successColor);
            message.channel.send(embed);
        });
    }
}
