import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class botInfoCommand implements IBotCommand {

    readonly statuses = "status number meaning: "
    + "\nREADY: 0"
    + "\nCONNECTING: 1"
    + "\nRECONNECTING: 2"
    + "\nIDLE: 3"
    + "\nNEARLY: 4"
    + "\nDISCONNECTED: 5";

    readonly commandCall = "info"

    help(): string {
        return this.statuses;
    }
    isThisCommand(command: string): boolean {
        return command === this.commandCall;
    }

    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void 
    {
        //TODO print y m d aswell, not just h m s.ms
        //slice removes yyyy-mm-dd
        var time = new Date(botClient.uptime).toISOString().slice(11, -1);

        msgObject.reply("I was ready at: " + botClient.readyAt.toLocaleString("sv-SE", {hour12: false})
                    + "\nmy status: " + botClient.status
                    + "\nmy uptime: " + time);
    }
}