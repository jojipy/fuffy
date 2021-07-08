module.exports = {
    name: 'ping',
    perms: 0,
    async execute(message, client, discord, successColor) {

        let calc = await message.channel.send('Wird berechnet...');
        calc.delete();
        let embed = new discord.MessageEmbed()
            .setTitle('**Pong!** :ping_pong:')
            .addField('**Latenz: **', `${calc.createdTimestamp - message.createdTimestamp}ms`)
            .addField('**API: **', `${Math.round(client.ws.ping)}ms`)
            .setColor(successColor);
        message.channel.send(embed);
    }
}