import * as Discord from "discord.js";
import * as Index from "../index";
import {IBotCommand} from "../api";

export default class helpCommand implements IBotCommand {

    readonly commandCall = "help"

    help(): string 
    {
        return "Prints all available commands."
    }
    isThisCommand(command: string): boolean 
    {
        return command === this.commandCall;
    }

    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void 
    {
        
        let commandCalls : string = "";
        for (let i = 0; i < Index.commands.length; i++) 
        {
            commandCalls += "!" + Index.commands[i].commandCall + "\n";
        }
        let replyA = "Available commands:\n" + commandCalls;
        let replyB = "Available args: -h (e.g. !help -h)"
        msgObject.reply(replyA + "\n" + replyB);
    }


}