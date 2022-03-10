import { REST } from '@discordjs/rest'
import { client } from '../..';
import config from '../../config';
import { Routes } from 'discord-api-types';

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(client.application.id, config.guild_id),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
        const commandsF = await client.guilds.cache.get(config.guild_id)?.commands.fetch();

        loadPermission(commandsF)
    } catch (error) {
        console.error(error);
    }
})();


async function loadPermission(commandsSlashL){
    commandsSlashL
    
}