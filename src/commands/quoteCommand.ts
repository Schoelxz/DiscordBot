import * as Discord from "discord.js";
import {sendRandomQuotes} from "../index";
import {IBotCommand} from "../api";

export default class quoteCommand implements IBotCommand {

    readonly commandCall = "quote"

    help(): string {
        return "This command sends a quote from a random selection."
    }
    isThisCommand(command: string): boolean {
        return command === this.commandCall;
    }

    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void 
    {
        sendRandomQuotes(msgObject.channel.id);
    }
}