import * as Joi from 'joi'

// Enum simple con las claves de configuración
export enum ConfigKeys {
	NODE_ENV = 'NODE_ENV',
	PORT = 'PORT',
}

export const validationSchema = Joi.object({
	NODE_ENV: Joi.string()
		.valid('development', 'production', 'test')
		.default('development'),
	PORT: Joi.number().default(3000),
})
