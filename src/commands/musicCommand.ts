import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import * as ReadWrite from "../readWrite";

export default class musicCommand implements IBotCommand {

    readonly commandCall = "play";

    help(): string 
    {
        let message2 : string = "";

        ReadWrite.GetAllFileNamesFromDir("T:/Sounds").forEach(element => 
        {
            let split_elem = element.split('.');
            if(split_elem[split_elem.length-1] == "wav")
            {
                message2 += element + "\n";
            }
        });

        return "This command makes the bot play a sound, the sound played depends on your argument." + "\n" + "All current songs:" + "\n" + message2;
    }
    isThisCommand(command: string): boolean 
    {
        return command === this.commandCall;
    }

    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void 
    {
        if(botClient.voiceConnections.size == 0)
        {
            msgObject.reply("Error: I am not in a voice channel right now. If you are in one, use !join and I'll be there!");
            return;
        }
        let path = "";

        for(const arg of args)
        {
            if(args.length == 1)
            {
                path = arg;
                console.log(path);
            }
            else
                msgObject.reply("Error: Too many arguments...")
        }

       const broadcast = botClient.createVoiceBroadcast();
       broadcast.playFile(`T:/Sounds/` + path);
        // Play sound in all voice connections that the client is in
        console.log("size of voice connections: " + botClient.voiceConnections.size);
        for (const connection of botClient.voiceConnections.values()) 
        {
            console.log("playing broadcast in: " + connection.channel.name);
            connection.playBroadcast(broadcast);
        }
    }
}

        /*
        const broadcast = botClient.createVoiceBroadcast();
        const streamOptions = {seek: 0, volume: 0.5, passes: 3};
        var voiceChannel = msgObject.member.voiceChannel;
        voiceChannel.join().then(connection => {

            const receiver = connection.createReceiver();
            const dispatcher = connection.playBroadcast(broadcast, streamOptions);
            broadcast.playFile(`T:/Sounds/` + path);
            dispatcher.on("end", end =>{
                broadcast.destroy();
            })

        }).catch(err => console.log(err));
        */