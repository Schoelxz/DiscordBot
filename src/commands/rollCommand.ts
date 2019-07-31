import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class rollCommand implements IBotCommand {

    readonly commandCall = "roll"

    help(): string {
        return "!roll [min] [max]"
    }
    isThisCommand(command: string): boolean {
        return command === this.commandCall;
    }

    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void 
    {
        if(args.length > 0)
        {
            for (let i = 0; i < args.length; i++) {
                const element = args[i];
                if(Number.parseInt(element))
                {
                }
                else
                {
                    msgObject.reply("Error: argument is not an integer: " + element);
                    return;
                }
            }
        }
        let result : number = 1337;
        let max : number = 100;
        let min : number = 0;
        if(args.length == 0)
        {
        }
        else if(args.length == 1)
        {
            max = Number.parseInt(args[0]);
            if(max < min)
            {
                let temp = max;
                max = min;
                min = temp;
            }
        }
        else if(args.length == 2)
        {
            max = Number.parseInt(args[0]);
            min = Number.parseInt(args[1]);
            if(max < min)
            {
                let temp = max;
                max = min;
                min = temp;
            }
        }
        else
        {
            msgObject.reply("Error: too many arguments...")
            return;
        }

        result = Math.floor(Math.random() * (max - min + 1) + min);

        msgObject.reply(" rolled between [" + min + "]-[" + max + "] and got " + result);
    }
}