import * as p from '@clack/prompts'
import colors from 'picocolors'
import { NestjsBuilderInit } from './frameworks/nestjs.init'
import { NestjsProjectExecutor } from './frameworks/nestjs.executor'
import { NestjsPredefinedProjectGenerator } from './frameworks/nestjs.executor'

enum Framework {
	Nestjs = 'nestjs',
	NestjsDefault = 'nestjs-default',
}

async function main(): Promise<void> {
	p.intro(colors.green('Lazy-stack-builder CLI!'))

	const framework = await p.select({
		message: 'Selecciona el framework que deseas usar:',
		options: [
			{ value: 'nestjs', label: 'NestJS' },
			{ value: 'nestjs-default', label: 'NestJS Default Template' },
		],
	})

	if (framework.toString() === Framework.Nestjs) {
		const builder = new NestjsBuilderInit()
		const answers = await builder.prompt()
		const executer = new NestjsProjectExecutor()
		await executer.execute(answers)

		p.outro(colors.green('¡Proyecto configurado exitosamente!'))
		return
	}

	if (framework.toString() === Framework.NestjsDefault) {
		const projectName = await p.text({
			message: '¿Cuál es el nombre del proyecto?',
			placeholder: 'Nombre del proyecto',
			validate: (value: string) =>
				value.length < 3
					? 'El nombre debe tener al menos 3 caracteres.'
					: undefined,
		})
		const packageManager = await p.select({
			message: 'Selecciona el gestor de paquetes que deseas usar:',
			options: [
				{ value: 'npm', label: 'NPM' },
				{ value: 'yarn', label: 'Yarn' },
				{ value: 'pnpm', label: 'PNPM' },
			],
		})
		const generator = new NestjsPredefinedProjectGenerator()
		await generator.generate({
			projectName: projectName as string,
			packageManager: packageManager as string,
		})
		p.outro(
			colors.green('¡Proyecto NestJS Default Template generado exitosamente!'),
		)
		return
	}

	p.outro(colors.yellow('¡Gracias por usar Lazy-stack-builder CLI!'))
}

main().catch((error: Error) => {
	p.outro(colors.red(`Ocurrió un error: ${error.message}`))
	process.exit(1)
})
