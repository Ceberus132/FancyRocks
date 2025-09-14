import commands from './commands';

interface Command {
	name: string;
	description: string;
}
// get the discord token and app id if available, throw and error if they are not found
const { DISCORD_TOKEN: token, DISCORD_APPLICATION_ID: appID } = process.env;
if (!token || !appID) throw new Error('DISCORD_TOKEN and DISCORD_APPLICATION_ID environment variables are required.');
// url to register the commands in discords backend v10
const url = `https://discord.com/api/v10/applications/${appID}/commands`;
const commandData = commands.map(({ data }) => data) as Command[];
// send the data to discord and check if the command is registered successfully or not
try {
	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bot ${token}`
		},
		body: JSON.stringify(commandData)
	});

	if (response.ok) {
		const data = (await response.json()) as {name:string}[];
		console.log(`Successfully registered ${data.length} commands: ${data.map(cmd => cmd.name).join(', ')}`);
	} else {
		const errorText = `Error registering commands ${response.url}: ${response.status} ${response.statusText}\n\n${await response.text()}`;
		console.error(errorText);
	}
} catch (e) {
	console.error(`Request failed: ${e}`)
}
