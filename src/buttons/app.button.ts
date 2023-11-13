import { Markup } from 'telegraf'

const {
	inlineKeyboard,
	button: { callback }
} = Markup

export const actionButtons = () => {
	return inlineKeyboard(
		[
			callback('Расписание на сегодня', 'today-list'),
			callback('Расписание на завтра', 'tomorrow-list'),
			callback('Нечетная неделя', 'odd-week'),
			callback('Четная неделя', 'even-week'),
			callback('Изменить группу', 'change-group')
		],
		{
			columns: 1,
			wrap: (_, i) => {
				switch (i) {
					case 0:
						return true
					case 1:
						return true
					case 2:
						return true
					case 3:
						return false
					case 4:
						return true
				}
			}
		}
	)
}
