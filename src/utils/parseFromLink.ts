import axios from 'axios'
import { parseToHtml } from './parseToHtml'
import { textFromTableCell } from './textFromTableCell'
import { textFromTableCells } from './textFromTableCells'

export const parseFromLink = async (link: string) => {
	const { data: googleDocs } = await axios.get<string>(link)

	let tableRows: HTMLTableCellElement[][] = [
		...parseToHtml(googleDocs).querySelectorAll('tr')
	].map(el => [...el.querySelectorAll('td')])

	const tableWidth = tableRows[0].reduce((res, el) => res + el.colSpan, 0)

	const coursesNames = textFromTableCells(tableRows[0].slice(1)).map(
		course => course.match(/\d+/)[0]
	)

	tableRows.splice(0, 1)

	const dataTable: (string | undefined)[][] = [...Array(tableRows.length)].map(
		_ => [...Array(tableWidth)]
	)

	tableRows.forEach((row, j) => {
		row.forEach(el => {
			let k: number

			const cellText = textFromTableCell(el)

			const cellHeight = el.rowSpan

			const cellWidth = el.colSpan

			for (k = 0; k < dataTable[j].length; k++) {
				if (dataTable[j][k] === undefined) {
					dataTable[j][k] = cellText
					break
				}
			}

			if (cellHeight > 1) {
				for (let n = 0; n < cellHeight - 1; n++) {
					dataTable[j + n + 1][k] = cellText
				}
			}

			if (cellWidth > 1) {
				for (let n = 0; n < cellWidth - 1; n++) {
					dataTable[j][k + n + 1] = cellText
				}
			}
		})
	})

	return {
		dataTable,
		coursesNames
	}
}
