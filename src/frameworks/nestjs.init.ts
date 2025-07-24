import { setTimeout } from 'node:timers/promises'
import * as p from '@clack/prompts'
import colors from 'picocolors'

export type PackageManager = 'npm' | 'yarn' | 'pnpm'

export type NestjsPromptResult = {
	projectName: string
	orm: string
	wantsBiome: boolean
	packageManager: PackageManager
}

export class NestjsBuilderInit {
	async prompt(): Promise<NestjsPromptResult> {
		// Paso 2: Nombre del proyecto
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

		// Paso 3: Selección de ORM
		const orm = await p.select({
			message: 'Selecciona el ORM que deseas usar:',
			options: [
				{ value: 'sequelize', label: 'Sequelize' },
				{ value: 'drizzle', label: 'Drizzle' },
				{ value: 'typeorm', label: 'TypeORM' },
				{ value: 'prisma', label: 'Prisma' },
			],
		})

		// Paso 4: ¿Deseas agregar Biome?
		const wantsBiome = await p.confirm({
			message: '¿Deseas agregar Biome al proyecto?',
			initialValue: true,
		})

		await setTimeout(500)

		// Resumen de las selecciones
		p.note(
			colors.cyan(
				`Resumen de tu configuración:\n` +
					`Proyecto NestJS: Sí\n` +
					`Nombre: ${projectName.toString()}\n` +
					`ORM: ${orm.toString()}\n` +
					`Agregar Biome: ${wantsBiome ? 'Sí' : 'No'}`,
			),
			'Configuración seleccionada',
		)

		return {
			projectName: projectName as string,
			orm: orm as string,
			wantsBiome: Boolean(wantsBiome),
			packageManager: packageManager as PackageManager,
		}
	}
}
