import * as fs from 'fs';
import * as ConfigFile from "./config";

const usersDataPath = "../userData";
let botTokens: botTokens;
let myData : myUser;
export let myMap = new Map();

export interface myUser
{
    userName: string;
    songName: string;
    playOnEntry: boolean;
}

interface botTokens
{
    yoshinoToken: string;
}

export function AddJsonUserSongData(discordClient : string, songRequest : string): void
{
    console.log("Trying to Add JSON data for: " + discordClient);

    if(fs.readFileSync(usersDataPath + "/" + discordClient + ".json"))
    {
        console.log(discordClient + " have data.");
        let file = fs.readFileSync(usersDataPath + "/" + discordClient + ".json", 'utf8');
        let existingData : myUser = JSON.parse(file);
        existingData.songName = songRequest;
        myData = existingData;
    }
    else
    {
        console.log(discordClient + " has no data, adding new data..");
        myData.userName = discordClient;
        myData.songName = songRequest;
        myData.playOnEntry = true;
    }

    fs.writeFile(usersDataPath + "/" + discordClient + ".json", JSON.stringify(myData),  function(err) 
    {
        if (err) 
            return console.error(err);
        console.log("File written!");
    });
}

export function AddJsonUserData(userData: myUser): void
{
    console.log("Trying to Add JSON data for: " + userData.userName);
    myData = userData;

    fs.writeFile(usersDataPath + "/" + myData.userName + ".json", JSON.stringify(myData),  function(err) 
    {
        if (err) 
            return console.error(err);
        console.log("File written!");
    });
}

export function GetAllUsersJsonFileNames() : string[]
{
    return fs.readdirSync(usersDataPath);
}

export function GetAllFileNamesFromDir(directory : string) : string[]
{
    return fs.readdirSync(directory);
}

export function GetJsonUserDataFromUser(discordClient : string) : myUser
{
    let userData : myUser;
    let fileContent = fs.readFileSync(usersDataPath + "/" + discordClient + ".json", `utf8`);
    userData = JSON.parse(fileContent);
    return userData;
}

export function UpdateUserMapList() : void
{
    console.log("Updating User Map List...");
    let sumFiles = fs.readdirSync(usersDataPath);
    
    for (let i = 0; i < sumFiles.length; i++) 
    {
        let userData : myUser;
        let file = fs.readFileSync(usersDataPath + "/" + sumFiles[i], "utf8");
        userData = JSON.parse(file);
        myMap.set(userData.userName, userData.songName);
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

function ReadFolderPath(path : string): string
{
    var allFiles : string = "";

    fs.readdir(path, (err, files) => 
    {
        if(err)
        {
            allFiles = "error... no files?";
        }
        files.forEach(file => 
        {
          console.log(file);
          allFiles += file + "\n";

        });
    });

    return allFiles;
}

function WriteFilePath(path : string, data : string): void
{
    fs.writeFile(path, data,  function(err) 
    {
        if (err) 
            return console.error(err);
        console.log("File created!");
    });
}

