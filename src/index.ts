import * as Discord from "discord.js";
import * as ConfigFile from "./config";
import { IBotCommand } from "./api";
import * as ReadWrite from "./readWrite";
import { isNullOrUndefined } from "util";

const yoshinoBot: Discord.Client = new Discord.Client();
export let commands: IBotCommand[] = [];

let guild : Discord.Guild; //Should be guild 'Ett gött gäng'
const guildID : string = "234649966239285248"; //ID for 'Ett gött gäng'
let adminTextChannel: Discord.TextChannel;


try
{
    loadCommands(`${__dirname}/commands`)
}
catch(exception)
{
    console.log("something something unable to find directory commands: " + `${__dirname}/commands`);
    console.log(exception);
}

yoshinoBot.on("ready", () => 
{
    for (const itGuild of yoshinoBot.guilds) 
    {
        if(itGuild[1].id == guildID)
            guild = itGuild[1];
    }

    for(const channel of guild.channels)
    {
        if(channel[1].type != "text")
            continue;

        let txtChannel : Discord.TextChannel = channel[1] as Discord.TextChannel;
        fetchOldChannelMessages(txtChannel);
    }

    ReadWrite.UpdateUserMapList();
    //Let us know that ther bot is online
    guild.owner.send("Hi " + guild.owner.nickname + ".\nI am now up and running!");
    console.log("Ready to go!");
})
yoshinoBot.on("messageDelete", dMsg => 
{
    if(guild != null && guild != undefined)
    {
        let attachmentURLS : string = "";
        for (const attachment of dMsg.attachments) 
        {
            attachmentURLS += attachment[1].url;
        }
        
        guild.owner.send("Message has been deleted: " 
            + "\nAuthor: " + dMsg.author 
            + "\nMessage: " + dMsg.toString()
            + "\nAttachments: " + attachmentURLS
            + "\nCreated at: " + dMsg.createdAt.toUTCString()
            );
    }
})

yoshinoBot.on("message", msg => 
{
    //Ignore the message if it was sent by the bot
    if(msg.author.bot) {return;}

    //Ignore messages that don't start with the prefix
    if(!msg.content.startsWith(ConfigFile.config.prefix)) {return;}

    msg.channel.startTyping();
    //msg.channel.send(`${msg.author.username} just used a command!`);
    handleCommand(msg);
    
    msg.channel.stopTyping(true);
})

yoshinoBot.on("voiceStateUpdate", (oldMember, newMember) => 
{
    if(!(newMember.user.id === yoshinoBot.user.id)) //is bot?
    {
        console.log("voiceStateUpdate: " + "old: " + oldMember.user.username + " new: " + newMember.user.username);
        if(isNullOrUndefined(newMember.voiceChannel) || !ReadWrite.myMap.has(newMember.user.username))
        {
            console.log("Undefined channel or member without sound on bot join. User: " + newMember.user.username)
            return;
        }
        else if(!ReadWrite.GetJsonUserDataFromUser(newMember.user.username).playOnEntry)
            console.log(newMember.user.username + " does not have playOnEntry as true. It is: " + ReadWrite.GetJsonUserDataFromUser(newMember.user.username).playOnEntry);
        else
            joinVoiceChannel(newMember);
    }
    else
        console.log("voiceStateUpdate: was bot");

})

function joinVoiceChannel(guildMember : Discord.GuildMember)
{
    console.log("joinVoiceChannel start");
    console.log("voiceStateUpdate: " + guildMember.user.username);
    console.log("voice channel: " + guildMember.voiceChannel.name);

    let voiceChannel = guildMember.voiceChannel;
    
    console.log("song: " + ReadWrite.myMap.get(guildMember.user.username));

    const broadcast = yoshinoBot.createVoiceBroadcast();
    const streamOptions = {seek: 0, volume: 1, passes: 3};

    voiceChannel.join()
    .then(connection => 
        {
        const dispatcher = connection.playBroadcast(broadcast, streamOptions);
        broadcast.playFile(`T:/Sounds/` + ReadWrite.myMap.get(guildMember.user.username));
    })
    .catch(console.error);
  
    console.log("joinVoiceChannel end");
}

async function handleCommand(msg: Discord.Message)
{
    //Split the string into the command and all of the args
    let command = msg.content.split(" ")[0].replace(ConfigFile.config.prefix, "");
    let args = msg.content.split(" ").slice(1);

    for(const commandClass of commands)
    {
        try
        {
            //Check our command class is the correct one
            if(!commandClass.isThisCommand(command)) { continue; }

            for(const arg of args)
            {
                if(arg === "-h")
                {
                    await msg.reply(commandClass.help())
                    .then(sent => console.log(`Sent a reply to ${msg.author.username}`))
                    .catch(console.error);
                    return;
                }
            }

            //Pause execution whilst we run the command's code
            await commandClass.runCommand(args, msg, yoshinoBot);
        }
        catch(exception)
        {
            console.log(exception);
        }
    }
}

function loadCommands(commandsPath: string)
{
    console.log("Loading commands...");
    //Exit if there are no commands
    if(!ConfigFile.config.commands || (ConfigFile.config.commands as string[]).length === 0)
    {
        return;
    }

    //Loop through all of the commands in our config file
    for (const commandName of ConfigFile.config.commands as string[])
    {
        const commandsClass = require(`${commandsPath}/${commandName}`).default;

        const command = new commandsClass() as IBotCommand;

        commands.push(command);

    }

    console.log("Commands loaded!");
}

function fetchOldChannelMessages(channel : Discord.TextChannel)
{
    channel.fetchMessages()
  .then(messages => console.log(`Received ${messages.size} messages from channel ${channel.name}`))
  .catch(console.error);
}

yoshinoBot.login(ReadWrite.GetBotToken().yoshinoToken);
//bot.login(ConfigFile.config.token);