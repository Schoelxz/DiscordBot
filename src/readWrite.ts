import * as fs from 'fs';
import * as ConfigFile from "./config";
import * as Discord from 'discord.js';

const usersDataPath = "../userData";
let botTokens: botTokens;
let tmpUserData : IJsonUserData;
export let myMap = new Map();

export interface IJsonUserData
{
    userID: string;
    userName: string;
    songName: string;
    playOnEntry: boolean;
}

interface botTokens
{
    yoshinoToken: string;
}

export function AddJsonUserData(userData: IJsonUserData): void
{
    console.log("Trying to Add JSON data for: " + userData.userName);
    userData = userData;

    fs.writeFile(usersDataPath + "/" + userData.userName + ".json", JSON.stringify(userData),  function(err) 
    {
        if (err) 
            return console.error(err);
        console.log("File written!");
    });
}

export function ProcessStandardUserData(user : Discord.User, userData: IJsonUserData) : IJsonUserData
{
    userData.userID = user.id;
    userData.userName = user.username;
    return userData;
}

export function GetAllUsersJsonFileNames() : string[]
{
    return fs.readdirSync(usersDataPath);
}

export function GetAllFileNamesFromDir(directory : string) : string[]
{
    return fs.readdirSync(directory);
}

export function GetJsonUserDataFromUser(clientUserName : string) : IJsonUserData
{
    let fileContent = fs.readFileSync(usersDataPath + "/" + clientUserName + ".json", `utf8`);
    tmpUserData = JSON.parse(fileContent);
    return tmpUserData;
}

export function UpdateUserMapList() : void
{
    console.log("Updating User Map List...");
    let sumFiles = fs.readdirSync(usersDataPath);
    
    for (let i = 0; i < sumFiles.length; i++) 
    {
        let file = fs.readFileSync(usersDataPath + "/" + sumFiles[i], "utf8");
        tmpUserData = JSON.parse(file);
        myMap.set(tmpUserData.userName, tmpUserData.songName);
    }
    console.log("Map List Updated!");
}

export function ReadFilePath(path : string): string
{
    return fs.readFileSync(path, `utf8`);
}

export function GetBotToken(): botTokens
{
    botTokens = JSON.parse(ReadFilePath(ConfigFile.config.tokenPath));
    return botTokens;
}

export function WriteFile(fileText : string, filePath : string, fileName : string, fileSuffix : string) : boolean
{
    try
    {
        fs.appendFileSync(filePath + fileName + fileSuffix, fileText);
        return true;
    }
    catch(exception)
    {
        console.error(exception);
        return false;
    }
}
