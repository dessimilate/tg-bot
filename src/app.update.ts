import { Telegraf } from 'telegraf'
import {
	Action,
	InjectBot,
	Start,
	Update,
	Ctx,
	On,
	Message
} from 'nestjs-telegraf'
import { actionButtons } from './buttons/app.button'
import { Context } from './types/context.interface'
import { getDayInfo } from './utils/getDayInfo'
import { AppService } from './app.service'
import { wrongGroupButtons } from './buttons/wrong-group-button'
import { returnWeekSchedule } from './utils/returnWeekSchedule'
import { getDayOfTheWeek } from './utils/getDayOfTheWeek'
import { closeButton } from './buttons/close-button'
// import { ScheduleService } from './schedule/schedule.service'

@Update()
export class AppUpdate {
	constructor(
		@InjectBot() private readonly bot: Telegraf<Context>,
		private readonly appService: AppService
	) {}

	@Start()
	async startBot(@Ctx() ctx: Context) {
		if (ctx.session.needGroupEnter === undefined) {
			await ctx.reply('Введите вашу группу\nНапример: 24100')
		} else {
			await ctx.reply(getDayInfo(ctx.session.group).info, actionButtons())
		}
	}

	@Action('change-group')
	async getListToday(@Ctx() ctx: Context) {
		ctx.session.needGroupEnter = true
		await ctx.reply(
			'Введите вашу группу\nНапример: 24100',
			wrongGroupButtons(false)
		)
	}

	@Action('show-group-list')
	async getGroupList(@Ctx() ctx: Context) {
		const data = await this.appService.getSchedules()

		await ctx.reply(data.map(el => el.course).join('\n'), closeButton())
	}

	@Action('cancel-group-choice')
	async cancelGroupChoice(@Ctx() ctx: Context) {
		ctx.session.needGroupEnter = false
		ctx.deleteMessage(ctx.update.callback_query.message.message_id)
	}

	@Action('odd-week')
	async getOddSchedule(@Ctx() ctx: Context) {
		const data = await this.appService.getSchedules()

		const currentGroupSchedule = data.find(
			el => el.course === ctx.session.group
		).schedule.odd

		const text = returnWeekSchedule(currentGroupSchedule)

		await ctx.reply(text, closeButton())
	}

	@Action('even-week')
	async getEvenSchedule(@Ctx() ctx: Context) {
		const data = await this.appService.getSchedules()

		const currentGroupSchedule = data.find(
			el => el.course === ctx.session.group
		).schedule.even

		const text = returnWeekSchedule(currentGroupSchedule)

		await ctx.reply(text, closeButton())
	}

	@Action('today-list')
	async getTodaySchedule(@Ctx() ctx: Context) {
		const data = await this.appService.getSchedules()

		const currentGroupSchedule = Object.entries(
			data.find(el => el.course === ctx.session.group).schedule[
				getDayInfo().week % 2 ? 'odd' : 'even'
			]
		)

		const obj = currentGroupSchedule.find(el =>
			el[0].match(new RegExp(getDayInfo().dayOfWeek, 'i'))
		)

		let text: string

		if (obj) {
			text = returnWeekSchedule({ [obj[0]]: obj[1] })
		} else {
			text = `${getDayInfo().dayOfWeek}\nВыходной`
		}

		await ctx.reply(text, closeButton())
	}

	@Action('tomorrow-list')
	async getTomorrowSchedule(@Ctx() ctx: Context) {
		const data = await this.appService.getSchedules()

		const dayW = new Date().getDay()

		const currentGroupSchedule = Object.entries(
			data.find(el => el.course === ctx.session.group).schedule[
				(getDayInfo().week + (dayW === 0 ? 1 : 0)) % 2 ? 'odd' : 'even'
			]
		)

		const obj = currentGroupSchedule.find(el =>
			el[0].match(new RegExp(getDayOfTheWeek(dayW === 6 ? 0 : dayW + 1), 'i'))
		)

		let text: string

		if (obj) {
			text = returnWeekSchedule({ [obj[0]]: obj[1] })
		} else {
			text = `${getDayInfo().dayOfWeek}\nВыходной`
		}

		await ctx.reply(text, closeButton())
	}

	@Action('close')
	async close(@Ctx() ctx: Context) {
		const messageId = ctx.update.callback_query.message.message_id

		ctx.deleteMessage(messageId)
	}

	@On('text')
	async getGroup(@Message('text') message: string, @Ctx() ctx: Context) {
		const data = await this.appService.getSchedules()

		if (ctx.session.update_id === undefined) {
			ctx.session.update_id = ctx.update.update_id
		}

		if ([undefined, true].includes(ctx.session.needGroupEnter)) {
			const isRightGroup = data.some(el => el.course === message)

			if (isRightGroup) {
				ctx.session.group = message

				const needEnter = ctx.session.needGroupEnter
				await ctx.reply(
					`Группа ${needEnter === undefined ? 'задана' : 'изменена'}`
				)

				if (ctx.session.needGroupEnter === undefined) {
					ctx.session.needGroupEnter = false
					this.startBot(ctx)
				} else {
					ctx.session.needGroupEnter = false
				}
			} else {
				await ctx.reply(
					'Группа введена неправильно\nПопробуйте еще раз',
					wrongGroupButtons(true)
				)
			}
		}
	}
}
