import { Router } from 'itty-router';

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
router.get('/', async (request: Request) => {
	return new Response('Success');
});
