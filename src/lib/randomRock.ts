export async function getRock(env: Env) {
	const amount = await env.FancyRockImages.list();
	const number = Math.floor(Math.random() * amount.objects.length);
	// get image from r2 bucket
	const object = await env.FancyRockImages.get(`rock${number}.jpg`)
	if (!object) {
    // TODO add extra e-mail
    throw new Error('Could not find a rock image, please try again :d \n\n If this issue persists please contact me: [Coming soon™]')
	}
	const image = new File([await object.blob()], "rock.jpg", {type: 'image/jpg'})
	return { number, image }
}
