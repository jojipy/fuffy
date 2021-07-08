module.exports = {
    name: "poll",
    perms: 1,
    async execute(client, message, ms, discord, errorColor, successColor, config) {

        let filter = (m) => m.author.id === message.author.id;
        var emojis;
        var title;
        var content;
        var time;

        let embed = new discord.MessageEmbed()
            .setTitle("**:clipboard: Ich notiere mir deine Angaben!**")
            .setDescription(
                'Als erstes, schicke mir bitte einen Titel für die Umfrage! Benutze "!!" für den default Titel.'
            )
            .addField("**Bsp:**", "Minecraft Umfrage!")
            .setColor(successColor);
        message.channel.send(embed);
        message.channel
            .awaitMessages(filter, {
                max: 1,
                time: 120000,
                errors: ["time"],
            })
            .then(async (receivedMessage) => {
                if (receivedMessage.first().content == "!!") {
                    title = "**Poll! :scroll:**";
                } else {
                    title = receivedMessage.first().content;
                }
                let embed = new discord.MessageEmbed()
                    .setTitle("**:clipboard: Ich notiere mir deine Angaben!**")
                    .setDescription(
                        "Jetzt schreibe bitte den Inhalt des Polls! Am besten schreibst du hier die Beschreibung hin."
                    )
                    .addField(
                        "**Bsp:**",
                        "In diesem Poll geht es darum, was wir in Minecraft demnächst spielen."
                    )
                    .setColor(successColor);
                message.channel.send(embed);

                message.channel
                    .awaitMessages(filter, {
                        max: 1,
                        time: 120000,
                        errors: ["time"],
                    })
                    .then(async (receivedMessage) => {
                        content = receivedMessage.first().content;
                        let embed = new discord.MessageEmbed()
                            .setTitle("**:clipboard: Ich notiere mir deine Angaben!**")
                            .setDescription(
                                'Jetzt, schicke mir Emojis, die du benutzen möchtest. Du kannst "1", "2", "3", oder "4" benutzen, um zu markieren, welche default Emojis du verwenden möchtest.'
                            )
                            .addField("**Bsp:**", ":sushi: :crab: 1")
                            .setColor(successColor);
                        message.channel.send(embed);

                        message.channel
                            .awaitMessages(filter, {
                                max: 1,
                                time: 120000,
                                errors: ["time"],
                            })
                            .then(async (receivedMessage) => {
                                emojis = receivedMessage.first().content.split(/ +/);

                                for (let i = 0; i < emojis.length; i++) {
                                    if (emojis[i] == "1") emojis[i] = "✅";
                                    if (emojis[i] == "2") emojis[i] = "❌";
                                    if (emojis[i] == "3") emojis[i] = config.poll.defaultEmojis[0];
                                    if (emojis[i] == "4") emojis[i] = config.poll.defaultEmojis[1];
                                    message
                                        .react(`${emojis[i]}`)
                                        .catch(() => {
                                            let embed = new discord.MessageEmbed()
                                                .setTitle(config.general.error.errorMessageTitle)
                                                .setDescription(
                                                    "Unbekannte Emojis wurden benutzt! Es werden nur die initalisierten Emojis benutzt. Diese Nachricht wird automatisch entfernt."
                                                )
                                                .addField("**Usage:**", "!poll <topic> <parameters>")
                                                .setColor(errorColor);
                                            message.channel.send(embed).then((msg) => {
                                                message.reactions.removeAll();
                                                msg.delete({
                                                    timeout: 20000
                                                });
                                            });
                                            return;
                                        })
                                        .then(() => {
                                            message.reactions.removeAll();
                                        });
                                }

                                let embed = new discord.MessageEmbed()
                                    .setTitle("**:clipboard: Ich notiere mir deine Angaben!**")
                                    .setDescription(
                                        'Möchtest du einen Timer für den Poll einstellen? Eingabemöglichkeiten: Xs, Xm, Xh, Xd, Xw, Xm, Xy, n'
                                    )
                                    .addField("**Bsp:**", "10h")
                                    .setColor(successColor);
                                message.channel.send(embed);

                                message.channel
                                    .awaitMessages(filter, {
                                        max: 1,
                                        time: 120000,
                                        errors: ["time"],
                                    })
                                    .then(async (receivedMessage) => {
                                        time = receivedMessage.first().content;

                                        if (time != "n") {
                                            try {
                                                if (typeof ms(time) === 'undefined') {
                                                    throw 'error';
                                                }
                                            } catch (error) {
                                                let embed = new discord.MessageEmbed()
                                                    .setTitle(config.general.error.errorMessageTitle)
                                                    .setDescription('Zeiteinheiten fallen dir nicht leicht, oder? Du kannst folgende benutzen:\n\n**10s (Sekunden), 30m (Minuten), 12h (Stunden), 32d (Tage), 4w (Wochen), 1y (Jahre), n und 0 (kein Timer).**')
                                                    .setColor(errorColor);
                                                message.channel.send(embed).then((msg) => {
                                                    msg.delete({
                                                        timeout: 20000
                                                    });
                                                });
                                                return;
                                            }
                                        }

                                        let guild = client.guilds.cache.get("598943777259782164"); //598943777259782164
                                        let channel = guild.channels.cache.get("716751148576538645"); 
                                        let current = new Date();
                                        let cDate = current.getDate() + '/' + (current.getMonth() + 1) + '/' + current.getFullYear();
                                        let cTime = current.getHours() + ":" + current.getMinutes();
                                        let dateTime = cDate + ' ' + cTime;
                                        let embed = new discord.MessageEmbed()
                                            .setTitle(title)
                                            .setDescription(content)
                                            .setColor(successColor)
                                            .setFooter(`Erstellt von ${message.author.username} | ${dateTime}`);
                                        let react = await channel.send(embed);
                                        for (var i = 0; i < emojis.length || i === emojis.length; i++) {
                                            react.react(`${emojis[i]}`).catch(() => {
                                                console.error;
                                            });
                                        }
                                        setTimeout(() => {
                                            if (time !== 'n' && time !== "0") {

                                                let emojiName = react.reactions.cache.map((item) => item._emoji.name);
                                                let emojiCount = react.reactions.cache.map((item) => item.count);
                                                console.log(message.author.toString())
                                                let embed = new discord.MessageEmbed()
                                                    .setTitle(title)
                                                    .setDescription(content + "\n\n**__Ergebnisse:__**")
                                                    .setColor(successColor)
                                                    .setFooter(`Erstellt von ${message.author.username} | ${dateTime}`)
                                                for (let i = 0; i < emojiName.length; i++) {
                                                    embed.addField(emojiName[i], "Anzahl: " + emojiCount[i])
                                                }
                                                channel.send(embed);
                                                react.delete();
                                            }
                                        }, ms(time));
                                    }).catch(() => {
                                        let embed = new discord.MessageEmbed()
                                            .setTitle("**BOAH... du schreibst aber langsam!**")
                                            .setDescription("Ich habe wirklich besseres zu tun!")
                                            .setColor(errorColor);
                                        message.channel.send(embed);
                                        return;
                                    });
                            })
                            .catch(() => {
                                let embed = new discord.MessageEmbed()
                                    .setTitle("**BOAH... du schreibst aber langsam!**")
                                    .setDescription("Ich habe wirklich besseres zu tun!")
                                    .setColor(errorColor);
                                message.channel.send(embed);
                                return;
                            });
                    })
                    .catch(() => {
                        let embed = new discord.MessageEmbed()
                            .setTitle("**BOAH... du schreibst aber langsam!**")
                            .setDescription("Ich habe wirklich besseres zu tun!")
                            .setColor(errorColor);
                        message.channel.send(embed);
                        return;
                    });
            })
            .catch((err) => {
                console.log(err)
                let embed = new discord.MessageEmbed()
                    .setTitle("**BOAH... du schreibst aber langsam!**")
                    .setDescription("Ich habe wirklich besseres zu tun!")
                    .setColor(errorColor);
                message.channel.send(embed);
                return;
            });
    },
};