import { InteractionResponseType } from 'discord-interactions';
import { getRock } from '@lib/randomRock';
import { getColor } from '@lib/randomColor';

export const fancyrock = {
	data: {
		name: 'fancyrock',
		description: 'Get a fancy Rock!',
	},
	execute: async (request: Request, env: Env) => {
		// get rock image & random color
		const [rock, color] = await Promise.all([getRock(env), getColor()]);
		// initialize form and append discord interaction response
		const form = new FormData();
		form.append('payload_json', JSON.stringify({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				embeds: [{
					color: parseInt(color, 16),
					image: { url: 'attachment://rock.jpg' },
					title: 'Here have a fancy rock :D'
				}],
				attachments: [{
					id: 0,
					description: 'An image of a fancy rock',
					filename: 'rock.jpg'
				}]
			}
		}));
		form.append('files[0]', rock.image);
		return form;
	}
}
