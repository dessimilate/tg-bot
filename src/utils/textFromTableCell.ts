export const textFromTableCell = (cell: HTMLTableCellElement) => {
	return [...cell.querySelectorAll('p')]
		.map(p => p.querySelector('span').textContent.trim())
		.filter(Boolean)
		.join(' | ')
}
