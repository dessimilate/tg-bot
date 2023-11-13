import { getDayOfTheWeek } from './getDayOfTheWeek'

export const getDayInfo = (group?: string) => {
	const date = new Date()
	const firstDate = new Date(date.getFullYear(), 0)

	const firstJanDay = firstDate.getDay()

	const weekMs = 7 * 24 * 60 * 60 * 1000

	const fullWeekMs =
		date.getTime() -
		firstDate.getTime() -
		((firstJanDay === 0 ? 1 : firstJanDay === 1 ? 0 : 8 - firstJanDay) *
			weekMs) /
			7

	const week = Math.floor(fullWeekMs / weekMs + (firstJanDay === 1 ? 0 : 1))

	const dayWeek = `${date.getDate()}.${date.getMonth() + 1}`

	return {
		info: [
			`Сегодня ${getDayOfTheWeek(date.getDay())} ${dayWeek}`,
			`${week % 2 ? 'Нечетная' : 'Четная'} неделя`,
			`Введенная группа: ${group}`
		].join('\n'),
		week,
		dayOfWeek: getDayOfTheWeek(date.getDay())
	}
}
