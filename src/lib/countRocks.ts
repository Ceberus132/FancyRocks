export async function countRocks(env: Env) {
	// TODO improve once there are more than 1000 images
	const amount = await env.FancyRockImages.list();
	return amount.objects.length
}
