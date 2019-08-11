import * as fs from 'fs';
import * as ConfigFile from "./config";
import * as Discord from 'discord.js';

const usersDataPath = "../userData";
//const usersDataPath = "T:/Workspace/Visual Studio Code/DiscordBotJS/userData"
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
    tmpUserData = userData;

    //JSON.stringify(text, null, pretty print formatting)
    fs.writeFileSync(usersDataPath + "/" + tmpUserData.userID + ".json", JSON.stringify(tmpUserData, null, 2));
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

//Creates new data if data does not exist. New data will only contain username.
export function GetJsonFromUser(userID : string) : IJsonUserData
{
    //Check if data exists
    if(fs.existsSync(usersDataPath + "/" + userID + ".json"))
    {
        let fileContent = fs.readFileSync(usersDataPath + "/" + userID + ".json", `utf8`);
        tmpUserData = JSON.parse(fileContent);
        return tmpUserData;
    }
    //Create new data for new user
    else
    {
        console.log("Creating new user data for: " + userID);
        tmpUserData.userName = userID;
        try 
        {
            fs.writeFileSync(usersDataPath + "/" + userID + ".json", JSON.stringify(tmpUserData));
        } 
        catch (exception) 
        {
            console.log("REEEEEEEEEEEEEEEEEEEEEEEE");
            console.error(exception);
        }
        
        let fileContent = fs.readFileSync(usersDataPath + "/" + userID + ".json", `utf8`);
        tmpUserData = JSON.parse(fileContent);
        return tmpUserData;
    }
}

export function UpdateUserMapList() : void
{
    console.log("Updating User Map List...");
    let sumFiles = fs.readdirSync(usersDataPath);
    
    for (let i = 0; i < sumFiles.length; i++) 
    {
        let file = fs.readFileSync(usersDataPath + "/" + sumFiles[i], "utf8");
        tmpUserData = JSON.parse(file);
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
