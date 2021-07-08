module.exports = {
    name: 'info',
    perms: 0,
    execute(successColor, message, discord, version) {

        let embed = new discord.MessageEmbed()
            .setTitle('**Informationen** :information_source:')
            .setDescription('**Entwickler:** \njojipy#0404\nMicmachd#6804\nveD#2690 \n\n**Version:** \n' + version)
            .setColor(successColor);
        message.channel.send(embed);
    }
}