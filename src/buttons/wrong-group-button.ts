import { Markup } from 'telegraf'

const {
	inlineKeyboard,
	button: { callback }
} = Markup

export const wrongGroupButtons = (isShowList: boolean) => {
	return inlineKeyboard(
		isShowList
			? [
					callback('Показать список групп', 'show-group-list'),
					callback('Отменить выбор группы', 'cancel-group-choice')
			  ]
			: [callback('Отменить выбор группы', 'cancel-group-choice')],
		{ columns: 1 }
	)
}
