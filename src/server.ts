import { Router, json } from 'itty-router';
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import commands from './commands';

// init itty-router
const router = Router();

// simple response to verify that the worker bot is running
router.get('/', async (request: Request) => {
	return new Response('Success');
});

// default route for all requests sent from Discord. JSON payload described here: https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
router.post('/', async (request: Request, env: Env) => {
	// check if the request is valid and if it is an interaction
    	const { isValid, interaction } = await verifyDiscordRequest(request, env);
    	if (!isValid || !interaction) {
    		return new Response('Bad request signature.', { status: 401 });
    	}

    	// used during the initial webhook handshake, required to configure the webhook
    	if (interaction.type === InteractionType.PING) {
    		return json({
    			type: InteractionResponseType.PONG,
    		});
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

// function to verify the discord request
async function verifyRequest(request: Request, env: Env) {
	const signature = request.headers.get('x-signature-ed25519');
	const timestamp = request.headers.get('x-signature-timestamp');
	const body = await request.text();

	// check if it valid and return bool
	const isValidRequest = signature && timestamp && verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
	if (!isValidRequest) {
		return { isValid: false };
	}
	return { interaction: JSON.parse(body), isValid: true };
}

// export server
const server = {
	verifyDiscordRequest: verifyDiscordRequest,
	fetch: async function (request: Request, env: Env) {
		return router.fetch(request, env)
	}
};
export default server;
