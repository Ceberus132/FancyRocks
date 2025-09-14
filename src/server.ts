import { Router, json } from 'itty-router';
import { InteractionResponseType, InteractionType, verifyKeyMiddleware } from 'discord-interactions';
import commands from './commands';

// init itty-router
const router = Router();

// simple response to verify that the worker bot is running
router.get('/', async (request: Request) => {
	return new Response('Success');
});

// default route for all requests sent from Discord. JSON payload described here: https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
router.post('/', verifyKeyMiddleware('4a8811927e54c4c14570b44f10df5e543e4a041e2258d96812fab372365055db'), async (request: Request, env: Env) => {
	if (interaction.type === InteractionType.PING) {
		return json({ type: InteractionResponseType.PONG });
	}
	// catch all application (Slash) commands
	if (interaction.type === InteractionType.APPLICATION_COMMAND) {
		// find the command the user tries to execute and throw an error if it's not found
		const command = commands.find(cmd => cmd.data.name.toLowerCase() === interaction.data.name.toLowerCase());
		if (!command) return json({error: 'Unknown Command'}, {status: 400})
		// try to execute the command, throw error on failure
		try {
			const response = await command.execute(interaction, env)
			return new Response(response)
		} catch (e) {
			return json({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					embeds: [{
						color: parseInt('ff8700', 16),
						interaction: 'Something went wrong!',
						description: `${e}`
					}]
				}
			})
		}
	}
});

router.all('*', () => new Response('Not Found.', { status: 404 }));

// export server
const server = {
	fetch: async function (request: Request, env: Env) {
		return router.fetch(request, env)
	}
};
export default server;
