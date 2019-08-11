import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import * as ReadWrite from "../readWrite";

export default class themeCommand implements IBotCommand
{
    readonly commandCall = "entry"

    help(): string 
    {
        let message : string = "To play your assigned song when entering a voice channel. i.e. '!entry true' means a themesong will play, '!entry false' and it won't play.";
        return message;
    }    

    isThisCommand(command: string): boolean 
    {
        return command === this.commandCall;
    }

    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void 
    {
        if(!ReadWrite.myMap.has(msgObject.author.id))
        {
            console.log(msgObject.author + " is the one checked for mapping!")
            msgObject.reply("Error: no data found.")
            return;
        }
            
        if(args.length == 1)
        {
            if(args[0] == "true" || args[0] == "on" || args[0] == "t")
            {
                try
                {
                    let userData = ReadWrite.GetJsonFromUser(msgObject.author.id);
                    userData.playOnEntry = true;
                    ReadWrite.AddJsonUserData(userData);
                }
                catch(exception)
                {
                    console.error("assignEntryCommand went bad:")
                    console.error(exception);
                    msgObject.reply("Error: Something went wrong...")
                }
            }
            else if(args[0] == "false" || args[0] == "off" || args[0] == "f")
            {
                try
                {
                    let userData = ReadWrite.GetJsonFromUser(msgObject.author.id);
                    userData.playOnEntry = false;
                    ReadWrite.AddJsonUserData(userData);
                }
                catch(exception)
                {
                    console.error("assignSongCommand went bad:")
                    console.error(exception);
                    msgObject.reply("Error: Something went wrong...")
                }
            }
            else
                msgObject.reply("Error: Unknown argument...");
        }
        else
            msgObject.reply("Error: Too many arguments...");
    }
    
}