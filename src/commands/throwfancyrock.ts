import { InteractionResponseType } from 'discord-interactions';
import { InteractionType, APIBaseInteraction, APIChatInputApplicationCommandInteractionData, APIApplicationCommandInteractionDataUserOption } from 'discord-api-types/v10';
import { getRock } from '@lib/randomRock';
import { getColor } from '@lib/randomColor';

export const givefancyrock = {
	data: {
		name: 'throwfancyrock',
		description: 'Throw a fancy rock at someone >:D',
		options: [
			{
				name: 'user',
				description: 'The user you want to hit with a rock!',
				type: 6,
				required: true
			}
		]
	},
	execute: async (request: APIBaseInteraction<InteractionType.ApplicationCommand, APIChatInputApplicationCommandInteractionData>, env: Env) => {
		const { member, data } = request;
		// throw error if there's no member or options
		if (!member || !data?.options) {
			// TODO add extra e-mail
			throw new Error('Something went wrong while giving away rocks :d \n\n If this issue persists please contact me: [Coming soon™]')
		}
		const senderUserID = member.user.id;
		const receiverUserID = (data.options[0] as APIApplicationCommandInteractionDataUserOption).value;
		// get rock image & random color
		const [rock, color] = await Promise.all([getRock(env), getColor()]);
		// initialize form and append discord interaction response
		const form = new FormData();
		form.append('payload_json', JSON.stringify({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `||<@${receiverUserID}>||`,
				embeds: [
					{
						color: parseInt(color, 16),
						image: { url: 'attachment://rock.jpg' },
						description: `**<@${receiverUserID}>, <@${senderUserID}> threw a fancy rock after you :O**`,
					},
				],
				attachments: [
					{
						id: 0,
						description: "An image of a fancy rock",
						filename: "rock.jpg"
					}
				]
			}
		}));
		form.append('files[0]', rock.image);
		return form;
	}
}
