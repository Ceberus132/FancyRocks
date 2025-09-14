import { InteractionResponseType } from 'discord-interactions';
import { getColor } from '@lib/randomColor';

export const help = {
	data: {
		name: 'help',
		description: 'Get a list of all commands!',
	},
	execute: async (request: Request, env: Env) => {
		// get random colour
		const color = await getColor()
		// initialize form and append discord interaction response
		const form = new FormData();
		form.append('payload_json', JSON.stringify({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				embeds: [{
					color: parseInt(color, 16),
					title: 'Here a list of all commands :3',
					fields: [
						{
							name: '',
							value: '`/fancyrock` Get a fancy rock :D',
						},
						{
							name: '',
							value: '`/givefancyrock` Give someone a fancy rock ❤️️',
						},
						{
							name: '',
							value: '`/throwfancyrock` Throw a fancy rock after someone :d',
						},
						{
							name: '',
							value: '`/about` Get to know everything about the bot :3',
						},
						{
							name: '',
							value: '`/help` Get this list of all commands ✨',
						},
						{
							name: '',
							value: '`/invite` Invite this bot to all your servers >:D',
						},
					],
					footer: {
						icon_url: 'https://cdn.discordapp.com/app-icons/1226141852395372738/363dee8b64fd97d07095573017ce9ab1.png',
						text: `Fancy Rocks v${env.VERSION} | Made with ❤ by Ceberus132`
					}
				}],
			}
		}));
		return form;
	}
};
