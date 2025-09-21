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
	const { isValid, interaction } = await server.verifyRequest(request, env);
	if (!isValid) return new Response('Bad request signature.', { status: 401 });

	if (interaction.type === InteractionType.PING) {
		console.log('FCK')
		return json({ type: 1 });
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
	console.log('verify?')
	const signature = request.headers.get('x-signature-ed25519');
  	const timestamp = request.headers.get('x-signature-timestamp');
	const body = await request.text();
	// check for validity and send the interaction
	const isValid = signature && timestamp && (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
	console.log(`valid?` + $isValid)
	if (!isValid) {
    	return { isValid: false };
	}
	return { interaction: JSON.parse(body), isValid: true };
}

// export server
const server = {
	verifyRequest,
	fetch: router.fetch,
};
export default server;
