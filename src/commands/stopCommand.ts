import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class stopCommand implements IBotCommand {

    readonly commandCall = "stop"

    help(): string {
        return "Stops the bot from playing whatever it is currently playing."
    }
    isThisCommand(command: string): boolean {
        return command === this.commandCall;
    }

    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void 
    {
        for (const broadcast of botClient.broadcasts) 
        {
            broadcast.destroy();
        }
    }
}