migration-generate:
	npm run typeorm -- migration:generate ./src/migrations/${name} -d data-source.ts

migration-up:
	npm run typeorm -- migration:run -d data-source.ts

migration-down:
	npm run typeorm -- migration:revert -d data-source.ts