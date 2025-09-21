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
router.post('/interaction', async (request: Request, env: Env) => {
	const { isValid, interaction } = await verifyRequest(request, env);
	if (!isValid) return new Response('Bad request signature.', { status: 401 });

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

// function to verify the discord request
async function verifyRequest(request: Request, env: Env) {
	const signature = request.headers.get('X-Signature-Ed25519');
	const timestamp = request.headers.get('X-Signature-Timestamp');
	const body = await request.text();
	// check for validity and send the interaction
	const isValid = signature && timestamp && verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
	if (!isValid) {
		return res.status(401).end('Bad request signature');
	}
	return { interaction: JSON.parse(body), isValid: true };
}

// export server
const server = {
	fetch: async function (request: Request, env: Env) {
		return router.fetch(request, env)
	}
};
export default server;
