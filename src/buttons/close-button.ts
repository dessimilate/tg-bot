import { Markup } from 'telegraf'

const {
	inlineKeyboard,
	button: { callback }
} = Markup

export const closeButton = () => {
	return inlineKeyboard([callback('Закрыть', 'close')], { columns: 1 })
}
