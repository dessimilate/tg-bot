import { Module } from '@nestjs/common'
import { AppUpdate } from './app.update'
import { TelegrafModule } from 'nestjs-telegraf'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma.service'
import { Postgres } from '@telegraf/session/pg'
import { session } from 'telegraf'
import { ScheduleModule } from './schedule/schedule.module'
import { ScheduleModule as SModule } from '@nestjs/schedule'
import { AppService } from './app.service'

const store = Postgres({
	host: 'localhost',
	port: 7272,
	database: 'tg_kai_bot',
	user: 'postgres',
	password: 'dessimilate7272'
})

@Module({
	imports: [
		ConfigModule.forRoot(),
		SModule.forRoot(),
		TelegrafModule.forRoot({
			middlewares: [session({ store })],
			token: process.env.BOT_TOKEN
		}),
		ScheduleModule
	],
	providers: [AppUpdate, PrismaService, AppService]
})
export class AppModule {}
