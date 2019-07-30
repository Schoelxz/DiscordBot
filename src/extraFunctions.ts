import { isNullOrUndefined } from "util";
import * as Discord from "discord.js";

let guild : Discord.Guild;

export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

function CheckAndAddGuild(msg : Discord.Message)
{
    if(!isNullOrUndefined(guild))
    {
        if(msg.guild.available)
        {
            console.log("guild is available")
            guild = msg.guild;
        }
    }
    else
        console.log("guild is null or undefined")
}
