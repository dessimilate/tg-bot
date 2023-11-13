export const returnWeekSchedule = (schedule: { [key: string]: string[][] }) => {
	const arr = []

	for (const [key, value] of Object.entries(schedule)) {
		arr.push([key, value.map(el => el.join('\n')).join('\n\n')].join('\n'))
	}

	return arr.join('\n\n\n')
}
