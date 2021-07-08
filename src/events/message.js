module.exports = {
    name: 'message',
    execute(message, config, discord) {

        if (message.author.bot) return;
        const prefix = config.general.prefix;
        const args = message.content.substring(prefix.length).split(/ +/);
        if (message.content.startsWith(prefix)) {
            try {
                let commandArgs = $args(client.commands.get(args[0]).execute);
                let evalCommandArgs = [];
                for (let i = 0; i < commandArgs.length; i++) {
                    evalCommandArgs.push(eval(commandArgs[i]));
                }
                if (client.commands.get(args[0]).perms > 0) {
                    var perms = false;
                    modroles.forEach((role) => {
                        if (message.member.roles.cache.has(role)) perms = true;
                    });
                    if (perms === true) {
                        client.commands.get(args[0]).execute.apply(this, evalCommandArgs);
                    } else {
                        let embed = new discord.MessageEmbed()
                            .setTitle(config.general.error.errorMessageTitle)
                            .addField(
                                "**Hinweis:**",
                                "Dir fehlen Berechtigungen, um diesen Command auszuführen!"
                            )
                            .setColor(config.general.error.errorColor);
                        message.channel.send(embed);
                    }
                } else {
                    client.commands.get(args[0]).execute.apply(this, evalCommandArgs);
                }
            } catch (error) {
                let embed = new discord.MessageEmbed()
                    .setTitle(config.general.error.errorMessageTitle)
                    .addField("**Hinweis:**", "Gibt es diesen Command wirklich? :thinking:")
                    .setColor(config.general.error.errorColor);
                message.channel.send(embed);
            }
        }
    },
};