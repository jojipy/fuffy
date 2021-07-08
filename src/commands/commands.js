module.exports = {
    name: 'commands',
    perms: 0,
    execute(client, discord, message) {

        let embed = new discord.MessageEmbed()
            .setTitle('**Commands**')
            .setDescription('**Info** \n **Ping** \n **Post**' +  client.commands.get());
        message.channel.send(embed);
    }
}