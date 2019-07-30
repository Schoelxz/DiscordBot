import * as fs from 'fs';
import * as ConfigFile from "./config";

const dataPath = "../userData";

interface myUser
{
    userName: string;
    songName: string;
}

interface botTokens
{
    yoshinoToken: string;
}

let botTokens: botTokens;

//var fileContent;
let myData : myUser;
export let myMap = new Map();

//let userSongData: UserToSong = JSON.parse(`{"ID": 0, "userName": "Schoel", "songName": "initialD.wav"}`)

export function AddJsonUserData(discordClient : string, songRequest : string)
{
    console.log("Trying to Add JSON data for: " + discordClient);
    myData = {
        userName: discordClient,
        songName: songRequest
    }

    let asdf = fs.writeFile(dataPath + "/" + discordClient + ".json", JSON.stringify(myData),  function(err) 
    {
        if (err) 
        {
            return console.error(err);
        }
        console.log("File written!");
    });

}

export function GetAllUsersJsonFileNames() : string[]
{
    return fs.readdirSync(dataPath);
}

export function GetAllFileNamesFromDir(directory : string) : string[]
{
    return fs.readdirSync(directory);
}

export function GetJsonDataSongFromUser(discordClient : string) : string
{
    let userData : myUser;
    userData = 
    {
        userName: "",
        songName: ""
    }

    let fileContent = fs.readFileSync(dataPath + "/" + discordClient + ".json", `utf8`);

    userData = JSON.parse(fileContent);
        console.log("returning songname: " + userData.songName + " from user " + userData.userName);
        myMap.set(userData.userName, userData.songName);
        return userData.songName;
}

export function UpdateUserMapList() : void
{
    console.log("Updating User Map List...");
    let sumFiles = fs.readdirSync(dataPath);
    
    for (let i = 0; i < sumFiles.length; i++) 
    {
        let userData : myUser;
        let file = fs.readFileSync(dataPath + "/" + sumFiles[i], "utf8");
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
        {
            return console.error(err);
        }
        console.log("File created!");
    });
}