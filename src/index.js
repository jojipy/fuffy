// Requiring Modules
const discord = require("discord.js");
const client = new discord.Client();

const fs = require("fs");
const path = require("path");
require("dotenv").config();
const ms = require("ms");
const config = require("../config.json");
// ---

// Setting Basic Variables
const version = config.general.version;
const errorColor = config.general.error.errorColor;
const successColor = config.general.success.successColor;
const modroles = config.general.modroles;
client.commands = new discord.Collection();
// ---


(async (cmdDir = "commands", eventDir = "events") => {
  // Requiring Command Files and Command Functions
  let cmdFiles = fs.readdirSync(path.join(__dirname, cmdDir)).filter((file) => file.endsWith(".js"));
  cmdFiles.forEach((file) => {
    let cmd = require(path.join(__dirname, cmdDir, file));
    client.commands.set(cmd.name, cmd, cmd.perms);
  });
  // ---

  // Requiring and Executing Event Files
  let eventFiles = fs.readdirSync(path.join(__dirname, eventDir)).filter(file => file.endsWith('.js'));
  eventFiles.forEach((file) => {
    let event = require(path.join(__dirname, eventDir, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, config));
      console.log($args(event.execute))
    } else {
      client.on(event.name, (...args) => event.execute(...args, config, discord));
      console.log($args(event.execute))
    }
  });

  // Login & Setting Activity
  await client.login(process.env.TOKEN).then(() => {
    console.log(`${client.user.tag} has logged in!`);
  });
  client.user.setActivity(" mom | Version " + version, {
    type: "LISTENING",
  });
  // ---
})();

// Executes or Rejects Inserted Command
/*client.on("message", async (message) => {
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
            .setColor(errorColor);
          message.channel.send(embed);
        }
      } else {
        client.commands.get(args[0]).execute.apply(this, evalCommandArgs);
      }
    } catch (error) {
      let embed = new discord.MessageEmbed()
        .setTitle(config.general.error.errorMessageTitle)
        .addField("**Hinweis:**", "Gibt es diesen Command wirklich? :thinking:")
        .setColor(errorColor);
      message.channel.send(embed);
    }
  }
});*/
// ---

// Function to Retrieve Argument(s) of a Function
function $args(func) {
  return Function.toString
    .call(func)
    .replace(/[/][/].*$/gm, "")
    .replace(/\s+/g, "")
    .replace(/[/][*][^/*]*[*][/]/g, "")
    .split("){", 1)[0]
    .replace(/^[^(]*[(]/, "")
    .split(",")
    .filter(Boolean);
}
// ---