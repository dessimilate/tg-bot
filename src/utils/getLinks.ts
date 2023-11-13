import axios from 'axios'
import { parseToHtml } from './parseToHtml'

export const getLinks = async (type: 'schedule' | 'session') => {
	const { data: kaiHtml } = await axios.get<string>(
		'https://alf-kai.ru/расписание/'
	)

	const tables = parseToHtml(kaiHtml).querySelectorAll('table')

	const lessonsLinks = (table: HTMLTableElement): any[] => {
		return [...table.querySelectorAll('a')].map(el => el.href)
	}

	switch (type) {
		case 'schedule':
			return lessonsLinks(tables[0])
		case 'session':
			return lessonsLinks(tables[1])
	}
}
