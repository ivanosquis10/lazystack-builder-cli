import * as p from '@clack/prompts'
import colors from 'picocolors'
import { NestjsBuilderInit } from './frameworks/nestjs.init'
import { NestjsProjectExecutor } from './frameworks/nestjs.executor'

enum Framework {
	Nestjs = 'nestjs',
	Express = 'express',
}

async function main(): Promise<void> {
	p.intro(colors.green('Bienvenido al CLI BUILDER of frameworks!'))

	const framework = await p.select({
		message: 'Selecciona el framework que deseas usar:',
		options: [{ value: 'nestjs', label: 'NestJS' }],
	})

	if (framework.toString() === Framework.Nestjs) {
		const builder = new NestjsBuilderInit()
		const answers = await builder.prompt()
		const executer = new NestjsProjectExecutor()
		await executer.execute(answers)

		p.outro(colors.green('¡Proyecto configurado exitosamente!'))
		return
	}

	p.outro(colors.yellow('¡Gracias por usar el Clack CLI! Hasta luego.'))
}

main().catch((error: Error) => {
	p.outro(colors.red(`Ocurrió un error: ${error.message}`))
	process.exit(1)
})
