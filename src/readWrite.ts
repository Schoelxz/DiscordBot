import * as fs from 'fs';
import * as ConfigFile from "./config";
import * as Discord from 'discord.js';

const usersDataPath = "../userData";
let botTokens: botTokens;
let tmpUserData : IJsonUserData;

export let myMap = new Map();

export interface IJsonUserData
{
    userID?: string;
    userName?: string;
    songName?: string;
    playOnEntry?: boolean;
}

interface botTokens
{
    yoshinoToken: string;
}

export function AddJsonUserData(userData: IJsonUserData): void
{
    console.log("Trying to Add JSON data for: " + userData.userName);
    tmpUserData = userData;
    CheckAndDefineData(tmpUserData);
    fs.writeFileSync(usersDataPath + "/" + tmpUserData.userID + ".json", JSON.stringify(tmpUserData, null, 2));
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
    try
        {
        //Check if data exists
        if(fs.existsSync(usersDataPath + "/" + userID + ".json"))
        {
            let fileContent = fs.readFileSync(usersDataPath + "/" + userID + ".json", `utf8`);
            tmpUserData = JSON.parse(fileContent);
            CheckAndDefineData(tmpUserData);
            return tmpUserData;
        }
        //Create new data for new user
        else
        {
            console.log("Creating new user data for: " + userID);
            tmpUserData.userID = userID;
            AddJsonUserData(tmpUserData);
            let fileContent = fs.readFileSync(usersDataPath + "/" + userID + ".json", `utf8`);
            tmpUserData = JSON.parse(fileContent);
            return tmpUserData;
        }
    }
    catch(exception)
    {
        //TODO could change this catch return to undefined, and make this function be able to return undefined aswell.
        console.error("Error in readWrite in GetJsonFromUser: ");
        console.error(exception);
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
        //console.log(CheckAndDefineData(tmpUserData) + " for " + tmpUserData.userName);
        if(CheckAndDefineData(tmpUserData))
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

/*
Returns false if the data is as it should be.
Returns true if the data has been changed in some way i.e. defined.
*/
function CheckAndDefineData(currentData : IJsonUserData) : boolean
{
    let dataBeforeCheck : string = JSON.stringify(currentData, null, 2);

    if(currentData.userID == undefined || currentData.userID == "")
        currentData.userID = "NoID";
    if(currentData.userName == undefined || currentData.userName == "")
        currentData.userName = "NoName"
    if(currentData.songName == undefined || currentData.songName == "")
        currentData.songName = "NoSong";
    if(currentData.playOnEntry == undefined)
        currentData.playOnEntry = false;

    let dataAfterCheck : string = JSON.stringify(currentData, null, 2);
    
    if(dataBeforeCheck == dataAfterCheck)
        return false;
    else
        return true;
}