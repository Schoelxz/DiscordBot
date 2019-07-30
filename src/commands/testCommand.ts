import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class testCommand implements IBotCommand {

    readonly commandCall = "testCommand"

    help(): string {
        return "this command does nothing."
    }
    isThisCommand(command: string): boolean {
        return command === this.commandCall;
    }

    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void 
    {

        //Let us know it all went well!
        msgObject.channel.send("this is a test!");
    }
}