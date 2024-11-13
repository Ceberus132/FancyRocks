import { Router, json } from 'itty-router';
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';

export interface Env {
	DISCORD_TOKEN: string;
	DISCORD_PUBLIC_KEY: string;
	DISCORD_APPLICATION_ID: string;
	VERSION: string;
	FancyRockImages: R2Bucket;
}

// init itty-router
const router = Router();

// simple response to verify that the worker bot is running
router.get('/', async () => {
	return new Response('Success');
});

// default route for all requests sent from Discord. JSON payload described here: https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
router.post('/', async (request: Request, env: Env) => {
	const { isValid, interaction } = await verifyRequest(request, env);
	if (!isValid) return new Response('Bad request signature.', { status: 401 });

	if (interaction.type === InteractionType.PING) {
		return json({ type: InteractionResponseType.PONG });
	}
});

// function to verify the discord request
async function verifyRequest(request: Request, env: Env) {
	const signature = request.headers.get('x-signature-ed25519');
	const timestamp = request.headers.get('x-signature-timestamp');
	const body = await request.text();
	// check for validity and send the interaction
	const isValid = signature && timestamp && await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
	return { isValid, interaction: isValid ? JSON.parse(body) : null };
}

// export server
const server = {
	fetch: async function (request: Request, env: Env) {
		return router.fetch(request, env)
	}
};
export default server;
