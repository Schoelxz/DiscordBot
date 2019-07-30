import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class joinCommand implements IBotCommand {

private readonly _command = "join"

    help(): string 
    {
        return "This command moves the bot to the voice channel your currently in."
    }
    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): void {

        //Let us know it all went well!
        msgObject.channel.send("it worked!");

        if (msgObject.member.voiceChannel) {
            if (!msgObject.guild.voiceConnection) {
                msgObject.member.voiceChannel.join()
                    .then(connection => {
                        msgObject.reply("Successfully Joined!");
                });
            }
            else
            {
                console.log("voice connection failed: " + msgObject.guild.voiceConnection)
                msgObject.reply("voice connection failed..");
            }
        }
        else
        {
            console.log("voice channel failed: " + msgObject.member.voiceChannel);
            msgObject.reply("is not in a voice channel!");
        }
    }


}