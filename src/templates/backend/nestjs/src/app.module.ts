import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { validationSchema } from './config/validation-env-schema'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema,
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
