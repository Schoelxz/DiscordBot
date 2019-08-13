import * as Discord from "discord.js";
import * as ConfigFile from "./config";
import { IBotCommand } from "./api";
import * as ReadWrite from "./readWrite";
import * as ExtraFunc from "./extraFunctions"
import { isNullOrUndefined } from "util";

const yoshinoBot: Discord.Client = new Discord.Client();
export let commands: IBotCommand[] = [];

let guild : Discord.Guild; //Should be guild 'Ett gött gäng'
const guildID : string = "234649966239285248"; //ID for 'Ett gött gäng'
let adminTextChannel: Discord.TextChannel;
let guildOwner : Discord.GuildMember;

//Start of index methods starts
{
    try
    {
        loadCommands(`${__dirname}/commands`)
    }
    catch(exception)
    {
        console.log("something something unable to find directory commands: " + `${__dirname}/commands`);
        console.log(exception);
    }

    startEventListeners();

    //bot.login(ConfigFile.config.token);
    yoshinoBot.login(ReadWrite.GetBotToken().yoshinoToken);
}
//end of index methods, done.

//Functions

function startEventListeners()
{
    yoshinoBot.on("ready", () => 
    {   
        console.log("Arguments passed: \n{");
        for (const iterator of process.argv) 
        {
            console.log(iterator);   
        }
        console.log("}");
        
        for (const itGuild of yoshinoBot.guilds) 
        {
            if(itGuild[1].id === guildID)
                guild = itGuild[1];
        }

        for(const channel of guild.channels)
        {
            if(channel[1].type != "text")
                continue;

            let txtChannel : Discord.TextChannel = channel[1] as Discord.TextChannel;
            fetchOldChannelMessages(txtChannel);
        }

        guildOwner = guild.owner;

        let swedishTimeDate = new Date().toLocaleString("sv-SE", {hour12: false});
        //Let us know that ther bot is online
        guild.owner.send("Hi " + guild.owner.nickname + ".\nI am now up and running! Time: " + swedishTimeDate);

        //start sending quotes every 1.5 hours.
        yoshinoBot.setInterval(sendRandomQuotes, (1000*60*60*1.5), "");

        console.log("Ready to go!");
    });

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
                + "\nCreated at: " + dMsg.createdAt);
        }
    });

    yoshinoBot.on("message", msg => 
    {
        //Ignore the message if it was sent by the bot
        if(msg.author.bot) 
            return;

        //Ignore messages that don't start with the prefix
        if(!msg.content.startsWith(ConfigFile.config.prefix)) {return;}

        msg.channel.startTyping();
        //msg.channel.send(`${msg.author.username} just used a command!`);
        handleCommand(msg);
        
        msg.channel.stopTyping(true);
    });

    yoshinoBot.on("voiceStateUpdate", (oldMember, newMember) => 
    {   
        if(newMember.user.id === yoshinoBot.user.id)
        {
            console.log("voiceStateUpdate: was bot");
            return;
        }

        //This makes sure only join (new) channel and leave channel works. No mute/deaf.
        if(oldMember.voiceChannel === newMember.voiceChannel)
        {
            console.log("voiceStateUpdate: is already in channel")
            return;
        }
        //Happens when leave channel.
        else if(isNullOrUndefined(newMember.voiceChannel))
        {
            console.log("voiceStateUpdate: left channel")
            return;
        }

        ReadWrite.UpdateUserSongMapList(newMember.user);

        console.log("voiceStateUpdate: " + "old: " + oldMember.user.username + " new: " + newMember.user.username);
        if(!ReadWrite.myMap.has(newMember.user.id))
        {
            console.log("Won't play sound: Member with no data. User: " + newMember.user.username)
            return;
        }
        else if(!ReadWrite.GetJsonFromUser(newMember.user).playOnEntry)
            console.log(newMember.user.username + " does not have playOnEntry as true. It is: " + ReadWrite.GetJsonFromUser(newMember.user).playOnEntry);
        else
            joinVoiceChannel(newMember);
    });

    yoshinoBot.on("error", error =>
    {
        const errorlogDir = "T:/MyDiscordBot/logs/errors/";
        let swedishTimeDate = new Date().toLocaleString("sv-SE", {hour12: false});
        try
        {
            guildOwner.send(error.name + ":\n" + error.message);
        }
        catch
        {
        }
        console.error("Error stack:[" + error.stack + "] end of stack.");
        console.error("Error name:[" + error.name + "]:\nError message:[" + error.message + "] end of message.");
        
        if(error.stack != undefined)
        {
            let stackError : string = error.stack as string;
            ReadWrite.WriteFile(
            "Error message:\n\n" + error.message + "\n\nError stack:\n\n" + stackError,
            errorlogDir,
            error.name +"_"+ swedishTimeDate,
            ".txt");
        }
        else
        {
            ReadWrite.WriteFile(
            "Error message:\n\n" + error.message,
            errorlogDir,
            error.name +"_"+ swedishTimeDate,
            ".txt");
        }
            
    });
}

async function joinVoiceChannel(guildMember : Discord.GuildMember)
{
    const voiceChannel = guildMember.voiceChannel;
    const broadcast = yoshinoBot.createVoiceBroadcast();
    const streamOptions = {seek: 0, volume: 0.5, passes: 3};
    
    voiceChannel.join()
        .then(connection => 
        {
            const receiver = connection.createReceiver();
            const dispatcher = connection.playBroadcast(broadcast, streamOptions);
            console.log("volumeDecibels: " + dispatcher.volumeDecibels);
            broadcast.playFile(`T:/Sounds/` + ReadWrite.myMap.get(guildMember.user.id));
            console.log("Played sound at channel: " + guildMember.voiceChannel.name + " " + ReadWrite.myMap.get(guildMember.user.id));
        })
        .catch(console.error);
}

async function printStuff(connection : Discord.VoiceConnection)
{
    while(!connection.speaking)
        console.log(connection.dispatcher.time);
    while(connection.speaking)
        console.log("volumeDecibels: " + connection.dispatcher.volumeDecibels);
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
            if(!commandClass.isThisCommand(command))
              continue;

            for(const arg of args)
                if(arg === "-h")
                {
                    await msg.reply(commandClass.help())
                    .then(sent => console.log(`Sent a reply to ${msg.author.username}`))
                    .catch(console.error);
                    return;
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
        return;
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

export function sendRandomQuotes(textChannelID : string)
{
    if(textChannelID == "" || isNullOrUndefined(textChannelID))
    {
        textChannelID = "609212232311504896";
    }
    const quotesPath = "T:/MyDiscordBot/pictures/inspirobot quotes/";
    const allQuotesName = ReadWrite.GetAllFileNamesFromDir(quotesPath);
    if(allQuotesName.length == 0)
    {
        console.error("Error: Could not find any quotes or files.");
        return;
    }
    if(!yoshinoBot.channels.has(textChannelID))
    {
        console.error("Error: Could not send quote, textchannel does not exist");
        return;
    }
        
    const textChannel : Discord.TextChannel = yoshinoBot.channels.get(textChannelID) as Discord.TextChannel;
    let randomNumber : number = Math.floor(Math.random() * (allQuotesName.length - 1));

    if (randomNumber > (allQuotesName.length -1) || randomNumber < 0)
        randomNumber = 0;

    let tries : number = 0;
    while(!allQuotesName[randomNumber].endsWith(".jpg"))
    {
        if(tries > 10)
            return;

        tries++;
        randomNumber = Math.floor(Math.random() * (allQuotesName.length - 1));
        if (randomNumber > (allQuotesName.length -1) || randomNumber < 0)
            randomNumber = 0;
        console.log("quote not a jpg, num of tries: " + tries);
    }

    let randomQuote : string = quotesPath + allQuotesName[randomNumber];

    textChannel.send({
        files: [{
          attachment: randomQuote,
          name: allQuotesName[randomNumber]
        }]
      })
        .then(sent => console.log("sent a random quote"))
        .catch(console.error);
}
