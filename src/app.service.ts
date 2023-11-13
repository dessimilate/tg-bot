import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { PrismaService } from './prisma.service'
import { ISchedule } from './types/main.type'

@Injectable()
export class AppService {
	constructor(private prisma: PrismaService) {}

	async getSchedules(): Promise<ISchedule[]> {
		const data = await this.prisma.schedule.findUnique({
			where: { key: 'schedule' }
		})

		return JSON.parse(data.value)
	}
}
