import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class helpCommand implements IBotCommand {

private readonly _command = "help"

    help(): string 
    {
        return "Prints all available commands."
    }
    isThisCommand(command: string): boolean 
    {
        return command === this._command;
    }

    runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): void 
    {
        var replyA = "Available commands: help, join, leave, play, assign";
        var replyB = "Available args: -h (e.g. !help -h)"
        msgObject.reply(replyA + "\n" + replyB);
    }


}