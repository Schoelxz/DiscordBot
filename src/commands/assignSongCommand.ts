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

            try
            {
                tmpUserData = ReadWrite.GetJsonFromUser(msgObject.author.id);
                tmpUserData = ReadWrite.ProcessStandardUserData(msgObject.author, tmpUserData);
                tmpUserData.songName = args[0];
    
                ReadWrite.AddJsonUserData(tmpUserData);
                ReadWrite.myMap.set(msgObject.author.id, args[0]);
                if(ReadWrite.myMap.has(msgObject.author.id))
                {
                    console.log(msgObject.author.username + " is now mapped!");
                }
                else
                {
                    console.log(msgObject.author.username + " is not mapped, very sad.")
                    ReadWrite.UpdateUserMapList();
                    if(ReadWrite.myMap.has(msgObject.author.id))
                    {
                        console.log(msgObject.author.username + " is now mapped!");
                    }
                    else
                    {
                        console.log(msgObject.author.username + " is not mapped, very sad.")
                    }
                }
                
            }
            catch(exception)
            {
                console.error("assignSongCommand went bad:")
                console.error(exception);
                msgObject.reply("Error: Something went wrong...")
            }
            
        }
        else
            msgObject.reply("Error: Argument fault..");
    }
}