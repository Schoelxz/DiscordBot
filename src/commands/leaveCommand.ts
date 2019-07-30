import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class leaveCommand implements IBotCommand 
{

private readonly _command = "leave";

    help(): string 
    {
        return "Makes the bot leave the voice channel its in.";
    }
    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): void 
    {
        msgObject.member.voiceChannel.leave();
    }


}