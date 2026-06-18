export default function typeWriter(
	text: string,
	onUpdate: (value: string) => void,
	speed = 75,
) {
	let i = 0
	let output = ''

	const write = () => {
		if (i < text.length) {
			output += text.charAt(i)
			onUpdate(output)
			i++
			setTimeout(write, speed)
		}
	}

	write()
}
