export async function getColor() {
	// Array of the colours for the embeds
	const colours = ['FFB5E8', 'FF9CEE', 'FFCCF9', 'FCC2FF', 'F6A6FF', 'B28DFF', 'C5A3FF', 'd5aadd', 'ecd4ff', 'fbe4ff', 'dcd3ff', 'a79aff', 'b5b9ff', '97a2ff', 'afcbff', 'aff8db', 'c4faf8', '85e3ff', 'ace7ff', '6eb5ff', 'bffcc6', 'dbffd6', 'f3ffe3', 'e7ffac', 'ffffd1', 'ffc9de', 'ffabab', 'ffbebc', 'ffcbc1', 'fff5ba']
	// return random number and fetch the colour
	return colours[Math.floor(Math.random() * colours.length)]
}
