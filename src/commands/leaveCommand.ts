import * as Discord from "discord.js";
import * as ExtraF from "../extraFunctions";
import {IBotCommand} from "../api";

export default class leaveCommand implements IBotCommand 
{
    readonly commandCall = "leave";

    help(): string 
    {
        return "Makes the bot leave the voice channel its in.";
    }
    isThisCommand(command: string): boolean {
        return command === this.commandCall;
    }

    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void 
    {
        if(botClient.voiceConnections.first() != null || botClient.voiceConnections.first() != undefined)
        {
            const broadcast = botClient.createVoiceBroadcast();
            const streamOptions = {seek: 0, volume: 1, passes: 3};
            const fileName = "yoshinoGoodbye.wav";

            if(msgObject.guild == null || msgObject.guild == undefined)
            {
                if(msgObject.member.voiceChannel == null || msgObject.member.voiceChannel == undefined)
                {
                console.log("guild: [" + msgObject.guild + "] voicechannel: [" + msgObject.member.voiceChannel + "]");
                return;
                }
                return;
            }

            const dispatcher = botClient.voiceConnections.first().playBroadcast(broadcast, streamOptions);
            broadcast.playFile("T:/Sounds/" + fileName);
            LeaveChannelAfterDelay(botClient, 2000);
        }
        else
            console.log("!leave called but bot was not in a voicechannel!");
    }
}

async function LeaveChannelAfterDelay(botClient: Discord.Client, ms : number)
{
    await ExtraF.delay(ms);
    botClient.voiceConnections.first().disconnect();
}