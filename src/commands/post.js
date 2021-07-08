module.exports = {
  name: "post",
  perms: 0,
  async execute(message, client, discord, successColor, errorColor, config) {

    let maxTime = config.post.maxTime;
    let filter = (m) => m.author.id === message.author.id;
    let embed = new discord.MessageEmbed()
      .setTitle("**:clipboard: Ich notiere mir deine Angaben!**")
      .setDescription(
        "Als erstes, schicke mir bitte einen Titel für dein Post!"
      )
      .addField("**Bsp:**", "Kawaii Fuchs x3")
      .setColor(successColor);
    message.channel.send(embed);
    message.channel
      .awaitMessages(filter, {
        max: 1,
        time: maxTime,
        errors: ["time"],
      })
      .then((receivedMessage) => {
        let title = receivedMessage.first().content;
        let embed = new discord.MessageEmbed()
          .setTitle("**:clipboard: Ich notiere mir deine Angaben!**")
          .setDescription("Notiert! Nun schicke mir bitte einen Link!")
          .addField("**Bsp:**", "https://www.youtube.com/watch?v=yzHFskza-G8")
          .setColor(successColor);
        message.channel.send(embed);
        message.channel
          .awaitMessages(filter, {
            max: 1,
            time: maxTime,
            errors: ["time"],
          })
          .then(async (receivedMessage) => {
            let link = receivedMessage.first().content;
            try {
              var url = new URL(link);
            } catch (error) {
              let embed = new discord.MessageEmbed()
                .setTitle(config.general.error.errorMessageTitle)
                .addField(
                  "**Hinweis:**",
                  "Du bist aber witzig; diesen Link gibt es gar nicht!"
                )
                .setColor(errorColor);
              message.channel.send(embed);
              return;
            }
            let guild = client.guilds.cache.get(config.post.postGuild);
            let channel = guild.channels.cache.get(config.post.postChannel);
            let embed = new discord.MessageEmbed()
              .setTitle(title)
              .setDescription(
                `**[Zum Post](${url})** (${url.hostname})\nGepostet von: ${message.author.username}`
              )
              .setColor(successColor);
            let msg = await channel.send(embed);
            msg.react(":upvote:");
            msg.react(":downvote:");
            let embedSuccess = new discord.MessageEmbed()
              .setTitle("**Hurra! Erfolg!**")
              .setDescription(
                `Du hast erfolgreich ein Post erstellt! Du kannst ihn in ${channel} finden!`
              )
              .setColor(successColor);
            message.channel.send(embedSuccess);
          })
          .catch(() => {
            let embed = new discord.MessageEmbed()
              .setTitle("**BOAH... du schreibst aber langsam!**")
              .setDescription("Ich habe wirklich besseres zu tun!")
              .setColor(errorColor);
            message.channel.send(embed);
          });
      })
      .catch(() => {
        let embed = new discord.MessageEmbed()
          .setTitle("**BOAH... du schreibst aber langsam!**")
          .setDescription("Ich habe wirklich besseres zu tun!")
          .setColor(errorColor);
        message.channel.send(embed);
      });
  },
};
