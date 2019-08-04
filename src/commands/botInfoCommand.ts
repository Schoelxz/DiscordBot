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

        msgObject.reply("bot ready at: " + botClient.readyAt + "\n"
                    + "bot status: " + botClient.status
                    + "bot uptime: " + botClient.uptime);
    }
}