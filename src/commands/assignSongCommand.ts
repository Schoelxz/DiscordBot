import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import * as ReadWrite from "../readWrite";

let tmpUserData : ReadWrite.IJsonUserData;

export default class assignSongCommand implements IBotCommand
{
    readonly commandCall = "assign"

    help(): string 
    {
        let message : string = "Assigns a song to you. For e.g. '!assign initialD.wav'" + "\n";
        let message2 : string = "";

        ReadWrite.GetAllFileNamesFromDir("T:/Sounds").forEach(element => 
        {
            message2 += element + "\n";
        });

        return message + "All current songs:" + "\n" + message2;
    }    

    isThisCommand(command: string): boolean 
    {
        return command === this.commandCall;
    }

    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void 
    {
        if(args.length == 1)
        {
            console.log("msgObject.author.username: " + msgObject.author.username);
            console.log("Clients song request: " + args[0]);

            if(ReadWrite.GetJsonUserDataFromUser(msgObject.author.username))
            {
                tmpUserData = ReadWrite.GetJsonUserDataFromUser(msgObject.author.username);
                tmpUserData = ReadWrite.ProcessStandardUserData(msgObject.author, tmpUserData);
                tmpUserData.songName = args[0];
            }
            else
            {
                tmpUserData = ReadWrite.ProcessStandardUserData(msgObject.author, tmpUserData);
                tmpUserData.songName = args[0];
            }

            ReadWrite.AddJsonUserData(tmpUserData);
            ReadWrite.myMap.set(msgObject.author.username, args[0]);
        }
        else
            msgObject.reply("Error: Argument fault..");
    }
}