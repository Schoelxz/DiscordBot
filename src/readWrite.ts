import * as fs from 'fs';
import * as ConfigFile from "./config";
import * as Discord from 'discord.js';

const usersDataPath = "../MyDiscordBot/userData";
let botTokens: botTokens;
//let tmpUserData : IJsonUserData;

export let myMap = new Map();

export interface IJsonUserData
{
    userID: string;
    userName: string;
    songName?: string | undefined;
    playOnEntry?: boolean | undefined;
}

interface botTokens
{
    yoshinoToken: string;
}

export function AddJsonUserDataFile(user : Discord.User, userData: IJsonUserData): void
{
    let tmpUserData : IJsonUserData = userData;
    fs.writeFileSync(usersDataPath + "/" + user.id + ".json", JSON.stringify(tmpUserData, null, 2));
    console.log("Added JSON data for: " + userData.userName);
}

export function GetAllUsersJsonFileNames() : string[]
{
    return fs.readdirSync(usersDataPath);
}

export function GetAllFileNamesFromDir(directory : string) : string[]
{
    return fs.readdirSync(directory);
}

//Creates new data if data does not exist.
export function GetJsonFromUser(user : Discord.User) : IJsonUserData
{
    let userID : string = user.id;
    //Check if data exists
    if(fs.existsSync(usersDataPath + "/" + userID + ".json"))
    {
        let fileContent = fs.readFileSync(usersDataPath + "/" + userID + ".json", `utf8`);
        let tmpUserData : IJsonUserData = JSON.parse(fileContent);
        if(!RequiredDataIsFine(user, tmpUserData))
            SetRequiredUserData(user, tmpUserData);
        return tmpUserData;
    }
    //Create new data for new user
    else
    {
        console.log("Trying to get JSON -> Creating new user data for: " + user.username);
        let tmpUserData : IJsonUserData = SetRequiredUserData(user);
        AddJsonUserDataFile(user, tmpUserData);
        let fileContent = fs.readFileSync(usersDataPath + "/" + userID + ".json", `utf8`);
        tmpUserData = JSON.parse(fileContent);
        return tmpUserData;
    }
}

export function UpdateUserSongMapList(user : Discord.User) : void
{
    let sumFiles = fs.readdirSync(usersDataPath);
    
    for (let i = 0; i < sumFiles.length; i++) 
    {
        let file = fs.readFileSync(usersDataPath + "/" + sumFiles[i], "utf8");
        let tmpUserData : IJsonUserData = JSON.parse(file);
        if(!RequiredDataIsFine(user, tmpUserData))
            fs.writeFileSync(usersDataPath + "/" + sumFiles[i], JSON.stringify(tmpUserData, null, 2));
        myMap.set(tmpUserData.userID, tmpUserData.songName);
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
        if(!fs.existsSync(filePath))
        {
            fs.mkdirSync(filePath);
            console.warn("directory was created at: " + filePath);
        }
        fs.writeFileSync(filePath + fileName + fileSuffix, fileText);
        return true;
    }
    catch(exception)
    {
        console.error(exception);
        return false;
    }
}

//Returns true if required data is fine as it should be.
function RequiredDataIsFine(user : Discord.User, currentData : IJsonUserData) : boolean
{
    if(currentData.userID == user.id && currentData.userName == user.username)
    {
        return true;
    }
    else
        return false;
}

export function SetRequiredUserData(user : Discord.User, currentData? : IJsonUserData) : IJsonUserData
{
    if(currentData == undefined)
    {
        let tmpUserData : IJsonUserData = {userID: user.id, userName: user.username};
        return tmpUserData;
    }
    else
    {
        currentData.userName = user.username;
        currentData.userID = user.id;
        return currentData;
    }
}