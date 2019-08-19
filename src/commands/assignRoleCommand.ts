import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import { stringify } from "querystring";
import { isNullOrUndefined } from "util";

export default class assignRoleCommand implements IBotCommand {

    readonly commandCall = "role"

    help(msgObject : Discord.Message, botClient : Discord.Client): string
    {
        const message = "Adds a requested roll. e.g. !role Feeling the quote"
        const argMessage = "\nRemove role argument: -delete -remove -d -r"
        let rolesMessage = "";
        if(msgObject.guild != undefined)
        {
            rolesMessage = "\nRoles available to add: ";
            for (const role of msgObject.guild.roles) 
            {
                if(msgObject.guild.member(botClient.user).highestRole.position > role[1].position && role[1].name != "@everyone")
                    rolesMessage += "\n" + role[1].name;
            }
        }
        if(rolesMessage == "")
            return message + argMessage;
        else
            return message + argMessage + rolesMessage;
    }
    isThisCommand(command: string): boolean {
        return command === this.commandCall;
    }

    runCommand(args: string[], msgObject: Discord.Message, botClient: Discord.Client): void 
    {
        if(args.length == 0)
        {
            msgObject.reply("Error: No arguments. Try !role Feeling the quote")
            return;
        }
        if(isNullOrUndefined(msgObject.guild))
        {
            msgObject.reply("Error: This is not a guild, type inside a server-channel where i reside!");
            return;
        }
        let removeRoll : boolean = false;
        let allArguments : string = "";
        for (const arg of args) 
        {
            if(arg == "-r" || arg == "-d" || arg == "-remove" || arg == "-delete")
            {
                removeRoll = true;
                continue;
            }
                allArguments += arg + " ";
        }
        
        //let rolesTryingToBeAdded = new Array<string>();
        let roleMap = new Map<string, Discord.Role>();
        let roleToAddArray = new Array<string>();
        let roleNamesArray = new Array<string>();
        for (const role of msgObject.guild.roles) 
        {
            //console.log(allArguments.includes(role[1].name) + " " + role[1].name + " =? " + allArguments);
            if(allArguments.includes(role[1].name))
            {
                //rolesTryingToBeAdded.push(allArguments.substring(allArguments.indexOf(role[1].name), allArguments.lastIndexOf(role[1].name)));
                roleMap.set(role[0], role[1]);
            }
        }

        let unaddedRoles : string = "";
        for(const role of roleMap)
        {
            if(botClient.guilds.has(msgObject.guild.id))
            {
                let guild = botClient.guilds.get(msgObject.guild.id) as Discord.Guild;
                if(guild.member(botClient.user).highestRole.position > role[1].position)
                {
                    roleToAddArray.push(role[0]);
                    roleNamesArray.push(role[1].name);
                }
                else if(guild.member(botClient.user).highestRole.position <= role[1].position)
                {
                    unaddedRoles += role[1].name+"\n";
                    console.log(guild.member(botClient.user).highestRole.name + " " + guild.member(botClient.user).highestRole.position 
                    + " is a lower role than " + role[1].name + " " + role[1].position);
                }
            }
        }

        if(roleToAddArray.length == 0)
        {
            msgObject.reply("Error: No valid role to add found. Check your typing, or maybe the roll is too high in position.")
            if(unaddedRoles != "")
            {
                msgObject.reply("The following roles are too high in position: " + unaddedRoles);
            }
            return;
        }
        if(removeRoll)
            msgObject.guild.member(msgObject.author).removeRoles(roleToAddArray, "User requested to remove roles [" + roleNamesArray + "].")
            .then()
            .catch(console.error);
        else
            msgObject.guild.member(msgObject.author).addRoles(roleToAddArray, "User requested roles [" + roleNamesArray + "].")
            .then()
            .catch(console.error);

        if(removeRoll)
        {
            msgObject.author.send("Roles removed: " + roleNamesArray.join("\n"));
            if(unaddedRoles != "")
            {
                msgObject.author.send("The following roles are too high in position: " + unaddedRoles);
            }
        }
        else
        {
            msgObject.author.send("Roles added: " + roleNamesArray.join("\n"));
            if(unaddedRoles != "")
            {
                msgObject.author.send("The following roles are too high in position: " + unaddedRoles);
            }
        }
    }
}