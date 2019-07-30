import * as Discord from "discord.js";

export interface IBotCommand
{
    readonly commandCall : string;
    help(): string;
    isThisCommand(command: string): boolean;
    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void;
}