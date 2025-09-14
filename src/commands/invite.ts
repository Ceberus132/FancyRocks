import { InteractionResponseType } from 'discord-interactions';
import { getRock } from '@lib/randomRock';
import { getColor } from '@lib/randomColor';

export const invite = {
	data: {
		name: 'invite',
		description: 'Invite this bot to all your servers!',
	},
	execute: async (request: Request, env: Env) => {
		// get rock & random colour code
		const [rock, color] = await Promise.all([getRock(env), getColor()]);
		// get discord invite url
		const appId = env.DISCORD_APPLICATION_ID;
		const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${appId}&permissions=2147534912&scope=bot+applications.commands`;
		// initialize form and append discord interaction response
		const form = new FormData()
		form.append('payload_json', JSON.stringify({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				embeds: [{
					color: parseInt(color, 16),
					image: {
						url: 'attachment://rock.jpg'
					},
					title: 'Spread fancy rocks to every server you are in!',
					description: `Use this link [to invite me to your servers](${INVITE_URL})`
				}],
				attachments: [{
					"id": 0,
					"description": "image of a butterful rock",
					"filename": "rock.jpg"
				}]
			},
		}))
		form.append('files[0]', rock.image)
		return form
	},
};
