import { PrismaService } from '@/prisma.service'
import { ISchedule } from '@/types/main.type'
import { getLinks } from '@/utils/getLinks'
import { parseFromLink } from '@/utils/parseFromLink'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Cron, CronExpression } from '@nestjs/schedule'
import { format } from 'date-fns'

@Injectable()
export class ScheduleService {
	constructor(private prisma: PrismaService) {}

	@Cron(CronExpression.EVERY_10_MINUTES)
	private async setSchedules() {
		console.log(
			`\n****\n${format(new Date(), 'y.MM.dd HH:mm:ss')}\nstart of update`
		)

		const lessonsLinks = await getLinks('schedule')

		let data = []

		const getIndex = (ind: number) => 8 * Math.floor(ind / 4) + (ind % 4)

		for (let f = 0; getIndex(f) < lessonsLinks.length; f++) {
			const i = getIndex(f)

			const { coursesNames, dataTable } = await parseFromLink(lessonsLinks[i])

			const { dataTable: evenTable } = await parseFromLink(lessonsLinks[i + 4])

			data.push(
				coursesNames.reduce((res: ISchedule[], course, m) => {
					const courseSchedule: ISchedule = {
						course,
						schedule: {
							odd: {},
							even: {}
						}
					}

					const courseIndex = 1 + m * 2

					dataTable.forEach(row => {
						if (row[courseIndex + 1] && row[courseIndex]) {
							if (courseSchedule.schedule.odd[row[0]]) {
								courseSchedule.schedule.odd[row[0]].push([
									row[courseIndex],
									row[courseIndex + 1]
								])
							} else {
								courseSchedule.schedule.odd[row[0]] = [
									[row[courseIndex], row[courseIndex + 1]]
								]
							}
						}
					})

					evenTable.forEach(row => {
						if (row[courseIndex + 1] && row[courseIndex]) {
							if (courseSchedule.schedule.even[row[0]]) {
								courseSchedule.schedule.even[row[0]].push([
									row[courseIndex],
									row[courseIndex + 1]
								])
							} else {
								courseSchedule.schedule.even[row[0]] = [
									[row[courseIndex], row[courseIndex + 1]]
								]
							}
						}
					})

					return [...res, courseSchedule]
				}, [])
			)
		}

		data = data.flat()

		await this.prisma.schedule.upsert({
			where: { key: 'schedule' },
			create: {
				key: 'schedule',
				value: JSON.stringify(data, null, '\t')
			},
			update: { value: JSON.stringify(data, null, '\t') }
		})

		console.log('update completed\n****\n')
	}

	async getSchedules(): Promise<ISchedule[]> {
		const data = await this.prisma.schedule.findUnique({
			where: { key: 'schedule' }
		})

		return JSON.parse(data.value)
	}
}
