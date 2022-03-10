import { client } from "../..";
import { Collection } from "discord.js";
import fs from 'fs'

const commands = []
client.commands = new Collection();

const admcmd = fs.readdirSync(`./commands/admcmd`).filter(file => file.endsWith(`.js`));

