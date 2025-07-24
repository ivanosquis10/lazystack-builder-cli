import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import colors from 'picocolors'
import fsExtra from 'fs-extra'

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
				// execSync(biomeInitCommand[packageManager])

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

				// 4. Eliminar archivos de ESLint y Prettier
				const filesToRemove = [
					'.eslintrc.js',
					'.eslintrc.json',
					'.eslintignore',
					'.prettierrc',
					'.prettierrc.js',
					'.prettierrc.json',
					'.prettierignore',
				]

				for (const file of filesToRemove) {
					const filePath = path.join(projectName, file)
					if (fs.existsSync(filePath)) {
						fs.rmSync(filePath)
						console.log(colors.yellow(`Archivo ${file} eliminado.`))
					}
				}

				// 5. Eliminar dependencias de ESLint y Prettier del package.json
				const pkgPath = path.join(projectName, 'package.json')
				if (fs.existsSync(pkgPath)) {
					const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
					const deps = [
						'eslint',
						'@nestjs/eslint-plugin',
						'@typescript-eslint/eslint-plugin',
						'@typescript-eslint/parser',
						'prettier',
						'eslint-config-prettier',
						'eslint-plugin-prettier',
					]
					for (const dep of deps) {
						if (pkg.devDependencies ?? pkg.devDependencies[dep]) {
							delete pkg.devDependencies[dep]
						}
						if (pkg.dependencies ?? pkg.dependencies[dep]) {
							delete pkg.dependencies[dep]
						}
					}
					fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
					console.log(
						colors.yellow(
							'Dependencias de ESLint y Prettier eliminadas de package.json.',
						),
					)
				}
			} catch (err) {
				console.error(colors.red('Error al instalar Biome:'), err)
			}
		}
	}
}

export class NestjsPredefinedProjectGenerator {
	async generate({
		projectName,
		packageManager,
	}: {
		projectName: string
		packageManager: string
	}) {
		// const templateDir = path.resolve(__dirname, '../templates/backend/nestjs')
		const templateDir = path.resolve(
			process.cwd(),
			'src/templates/backend/nestjs',
		)
		const targetDir = path.resolve(process.cwd(), projectName)

		// 1. Copiar el template completo
		if (fs.existsSync(targetDir)) {
			throw new Error(`La carpeta '${projectName}' ya existe.`)
		}
		await fsExtra.copy(templateDir, targetDir)
		console.log(colors.green(`Proyecto NestJS copiado a '${projectName}'.`))

		// 2. Renombrar archivos .hbs a su nombre real (por ejemplo, package.json.hbs -> package.json)
		const filesToRename = [
			'package.json.hbs',
			'tsconfig.json.hbs',
			'tsconfig.build.json.hbs',
		]
		for (const file of filesToRename) {
			const src = path.join(targetDir, file)
			if (fs.existsSync(src)) {
				const dest = src.replace(/\.hbs$/, '')
				await fsExtra.move(src, dest, { overwrite: true })
			}
		}

		// 3. Instalar dependencias
		console.log(colors.cyan('Instalando dependencias...'))
		execSync(`${packageManager} install`, { cwd: targetDir, stdio: 'inherit' })
		console.log(colors.green('Dependencias instaladas.'))

		// 4. Mensaje final
		console.log(
			colors.green(
				'¡Proyecto NestJS predefinido generado exitosamente con Biome!',
			),
		)
	}
}
