import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import * as ReadWrite from "../readWrite";

export default class musicCommand implements IBotCommand {

private readonly _command = "play"

    help(): string 
    {

        let message2 : string = "";

        ReadWrite.GetAllFileNamesFromDir("T:/Sounds").forEach(element => 
        {
            message2 += element + "\n";
        });

        return "This command makes the bot play a sound, the sound played depends on your argument." + "\n" + "All current songs:" + "\n" + message2;
    }
    isThisCommand(command: string): boolean 
    {
        return command === this._command;
    }

    runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): void 
    {
        let path = "";

        for(const arg of args)
        {
            if(args.length == 1)
            {
                path = arg;
                console.log(path);
            }
            else
                path = "HateItHateIt.wav";
        }

        var voiceChannel = msgObject.member.voiceChannel;
        voiceChannel.join().then(connection => {

            const dispatcher = connection.playFile(`T:/Sounds/` + path);
            dispatcher.on("end", end => 
            {
                //voiceChannel.leave();
            })


        }).catch(err => console.log(err));

    }
}