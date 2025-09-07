import { InteractionResponseType } from 'discord-interactions';
import { getColor } from '@lib/randomColor';
import { countRocks } from '@lib/countRocks';
import { json } from 'itty-router';

export const about = {
	data: {
		name: 'about',
		description: 'Get Information about the bot :D',
	},
	execute: async (request: Request, env: Env) => {
		// get stone count & random colour
		const [rocks, color] = await Promise.all([countRocks(env), getColor()]);
		// initialize form and append discord interaction response
		const form = new FormData();
		form.append('payload_json', JSON.stringify({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				embeds: [{
					color: parseInt(color, 16),
					title: 'Get to know everything about the bot :3',
					thumbnail: {
						url: 'https://cdn.discordapp.com/app-icons/1226141852395372738/363dee8b64fd97d07095573017ce9ab1.png'
					},
					fields: [
						{
							name: `Currently serving ${rocks} rocks 🗿`,
							value: '',
						},
						{
							name: '------------------------------',
							value: '',
						},
						{
							name: 'Support this project ❤️',
							value: 'https://patreon.com/ceberus132 \n',
						},
						{
							name: '------------------------------',
							value: '',
						},
						{
							name: 'Add the bot to your server! 🚀',
							value: '[Invite me to all of your servers!](https://discord.com/oauth2/authorize?client_id=1226141852395372738&permissions=2147534912&scope=bot+applications.commands) \n',
						},
						{
							name: '------------------------------',
							value: '',
						},
						{
							name: 'Take a look at the Roadmap to see what\'s yet to come! 🌌',
							value: '[Watch what the bot will do in the future!](https://github.com/users/Ceberus132/projects/2/views/1) \n',
						},
						{
							name: '------------------------------',
							value: '',
						},
						{
							name: 'Follow the bot on X (formerly twitter) to get the latest news :D',
							value: 'https://twitter.com/FancyRocksBot \n',
						},
						{
							name: '------------------------------',
							value: '',
						},
						{
							name: 'Check out the Changelog on the Bots Website! :o',
							value: 'https://fancyrocks.ceberus132.gg/ \n',
						},
					],
					footer: {
						icon_url: 'https://cdn.discordapp.com/app-icons/1226141852395372738/363dee8b64fd97d07095573017ce9ab1.png',
						text: `Fancy Rocks v${env.VERSION} | Made with ❤ by Ceberus132`
					}
				}]
			}
		}));
		return form;
	}
};
