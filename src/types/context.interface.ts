import { Context as ContextT } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
export interface Context extends ContextT {
	session: {
		update_id: number
		group: string
		needGroupEnter: boolean
	}

	update: Update & {
		callback_query: {
			message: {
				message_id: number
			}
		}
	}
}
