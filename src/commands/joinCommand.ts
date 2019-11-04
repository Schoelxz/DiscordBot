import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class joinCommand implements IBotCommand 
{

    readonly commandCall = "join"

    help(): string 
    {
        return "This command moves the bot to the voice channel you're currently in."
    }
    isThisCommand(command: string): boolean {
        return command === this.commandCall;
    }

    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void 
    {
        const broadcast = botClient.createVoiceBroadcast();
        const streamOptions = {seek: 0, volume: 1, passes: 3};
        const fileName = "yoshinoIsHere.wav";

        if(msgObject.guild == null || msgObject.guild == undefined)
        {
            console.log("guild failed: " + msgObject.guild);
            msgObject.reply("You have to type the command inside the server i reside in. Private messages won't work.")
            return;
        }

        if (msgObject.member.voiceChannel) 
        {
            if (!msgObject.guild.voiceConnection) 
            {
                msgObject.member.voiceChannel.join()
                    .then(connection => 
                {
                        //msgObject.reply("Successfully Joined!");
                        const dispatcher = connection.playBroadcast(broadcast, streamOptions);
                        broadcast.playFile(`../MyDiscordBot/sounds/` + fileName);
                });
            }
            else
            {
                console.log("voice connection failed: " + msgObject.guild.voiceConnection)
                msgObject.reply("voice connection failed..");
                return;
            }
        }
        else
        {
            console.log("voice channel failed: " + msgObject.member.voiceChannel);
            msgObject.reply("is not in a voice channel! Join a voice channel first, then try again!");
            return;
        }
    }


}