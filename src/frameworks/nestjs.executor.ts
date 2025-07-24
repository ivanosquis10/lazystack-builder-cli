import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import colors from 'picocolors'
import type { NestjsPromptResult } from './nestjs.init'

const biomePackageManager = {
	npm: 'npm i -D -E @biomejs/biome',
	yarn: 'yarn add -D -E @biomejs/biome',
	pnpm: 'pnpm add -D -E @biomejs/biome',
}

const biomeInitCommand = {
	npm: 'npx @biomejs/biome init',
	yarn: 'yarn exec biome init',
	pnpm: 'pnpm exec biome init',
}

export class NestjsProjectExecutor {
	async execute({
		projectName,
		wantsBiome,
		packageManager,
	}: Pick<
		NestjsPromptResult,
		'projectName' | 'wantsBiome' | 'packageManager'
	>) {
		// 1. Crear carpeta si no existe
		if (!fs.existsSync(projectName)) {
			fs.mkdirSync(projectName)
			console.log(colors.green(`Carpeta '${projectName}' creada.`))
		} else {
			console.log(colors.yellow(`La carpeta '${projectName}' ya existe.`))
		}

		// 2. Inicializar proyecto NestJS
		try {
			console.log(colors.cyan('Inicializando proyecto NestJS...'))

			execSync(
				`npx @nestjs/cli new ${projectName} --package-manager=${packageManager} --skip-git --skip-install`,
				{ stdio: 'inherit' },
			)
			console.log(colors.green('Proyecto NestJS creado.'))
		} catch (err) {
			console.error(colors.red('Error al crear el proyecto NestJS:'), err)
			return
		}

		// 3. Instalar Biome si aplica
		if (wantsBiome) {
			try {
				console.log(colors.cyan('Instalando Biome...'))
				execSync(biomePackageManager[packageManager], {
					cwd: path.resolve(projectName),
					stdio: 'inherit',
				})
				console.log(colors.green('Biome instalado.'))
				// Opcional: crear un archivo de configuración básico
				execSync(biomeInitCommand[packageManager])

				// const biomeConfigPath = path.join(projectName, 'biome.json')
				// if (!fs.existsSync(biomeConfigPath)) {
				// 	fs.writeFileSync(
				// 		biomeConfigPath,
				// 		JSON.stringify(
				// 			{
				// 				$schema: 'https://biomejs.dev/schemas/1.4.1/schema.json',
				// 				linter: { enabled: true },
				// 				formatter: { enabled: true },
				// 			},
				// 			null,
				// 			2,
				// 		),
				// 	)
				// 	console.log(colors.green('Archivo biome.json creado.'))
				// }
			} catch (err) {
				console.error(colors.red('Error al instalar Biome:'), err)
			}
		}
	}
}
