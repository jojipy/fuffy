module.exports = {
    name: 'cc',
    perms: 1,
    execute(args, discord, message, errorColor, config) {

        if (!args[1]) {
            let embed = new discord.MessageEmbed()
                .setTitle(config.general.error.errorMessageTitle)
                .setDescription(
                    "Beep Boop... Null Nachrichten gelöscht, weil du keine Anzahl angegeben hast."
                )
                .setColor(errorColor);
            message.channel.send(embed);
        } else {
            if (args[1] + 1 > 100){
                let embed = new discord.MessageEmbed()
                    .setTitle(config.general.error.errorMessageTitle)
                    .setDescription(
                        "Du kannst nicht mehr als 99 Nachrichten löschen"
                    )
                .setColor(errorColor);
                message.channel.send(embed);
            } else {
                message.channel.bulkDelete(args[1]);
            }
            
        }
    }
}

