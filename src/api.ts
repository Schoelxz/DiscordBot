import * as Discord from "discord.js";

export interface IBotCommand
{
    readonly commandCall : string;
    help(msgObject : Discord.Message, botClient: Discord.Client): string;
    isThisCommand(command: string): boolean;
    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void;
}