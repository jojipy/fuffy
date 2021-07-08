module.exports = {
    name: "ban",
    perms: 1,
    async execute(message, args, discord, successColor, errorColor, ms, config) {

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

        if (!member.bannable) {
            let embed = new discord.MessageEmbed()
                .setTitle(config.general.error.errorMessageTitle)
                .setDescription('Das darf Ich leider nicht tun. Sonst bekomme Ich wieder eine Strafe... :sob:')
                .setColor(errorColor);
            message.channel.send(embed);
            return;
        }

        if (!args[2]) {
            let embed = new discord.MessageEmbed()
                .setTitle(config.general.error.errorMessageTitle)
                .setDescription('Du hast die Länge des Bans vergessen!')
                .setColor(errorColor);
            message.channel.send(embed);
            return;
        }

        try {
            if (typeof ms(args[2]) === 'undefined') {
                throw 'error';
            }
        } catch (error) {
            let embed = new discord.MessageEmbed()
                .setTitle(config.general.error.errorMessageTitle)
                .setDescription('Zeiteinheiten fallen dir nicht leicht, oder? Du kannst folgende benutzen:\n\n**10s (Sekunden), 30m (Minuten), 12h (Stunden), 32d (Tage), 4w (Wochen), 1y (Jahre), 0 (Permanent).**')
                .setColor(errorColor);
            message.channel.send(embed);
            return;
        }

        if (!args[3]) {
            member.ban().then(() => {
                let embed = new discord.MessageEmbed()
                    .setTitle(config.general.error.successMessageTitle)
                    .setDescription('Dieser Benutzer wurde erfolgreich gebannt!')
                    .setColor(successColor);
                message.channel.send(embed);
            });
            setTimeout(() => {
                if (args[2] !== '0') {
                    message.guild.members.unban(member);
                }
            }, ms(args[2]));
            return;
        }
        
        let substr = args[0].length + args[1].length + args[2].length + 5;
        let msg = message.content.substring(substr);
        await member.send(msg);
        member.ban({ reason: msg + ` [Länge: ${args[2]}]` }).then(() => {
            let embed = new discord.MessageEmbed()
                .setTitle(config.general.error.successMessageTitle)
                .setDescription('Dieser Benutzer wurde erfolgreich gebannt!')
                .setColor(successColor);
            message.channel.send(embed);
        });
        setTimeout(() => {
            if (args[2] !== '0') {
                message.guild.members.unban(member);
            }
        }, ms(args[2]));
    }
}