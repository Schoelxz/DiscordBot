import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class botInfoCommand implements IBotCommand {

    readonly statuses = "status number meaning: "
    + "\n" + "READY: 0"
    + "\n" + "CONNECTING: 1"
    + "\n" + "RECONNECTING: 2"
    + "\n" + "IDLE: 3"
    + "\n" + "NEARLY: 4"
    + "\n" + "DISCONNECTED: 5";

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

        msgObject.reply("bot ready at: " + botClient.readyAt
                    + "\nbot status: " + botClient.status
                    + "\nbot uptime: " + time);
    }
}