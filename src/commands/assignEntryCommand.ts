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
        if(args.length == 1)
        {
            if(args[0] == "true" || args[0] == "on" || args[0] == "t")
            {
                let userData = ReadWrite.GetJsonUserDataFromUser(msgObject.author.username);
                userData.playOnEntry = true;
                ReadWrite.AddJsonUserData(userData);
            }
            else if(args[0] == "false" || args[0] == "off" || args[0] == "f")
            {
                let userData = ReadWrite.GetJsonUserDataFromUser(msgObject.author.username);
                userData.playOnEntry = false;
                ReadWrite.AddJsonUserData(userData);
            }
            else
                msgObject.reply("Error: Unknown argument...");
        }
        else
            msgObject.reply("Error: Too many arguments...");
    }
    
}