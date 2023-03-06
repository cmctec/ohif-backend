# example use make prisma or make dev
# this code generated schema.prisma and prisma types
# !!! DONT Used in prod
# recommended after migration "make sm"
dev:
	yarn start start:dev
# для миграций, js file отправить все sql file виде  DDL запроса
sm:
	yarn migrate
	yarn start:dev
# фиксит esLint
fixlint:
	yarn lint -- --fix
# DONT Used generated folder "test" with  "module" "controller" "service" 
gmod:
	npx nest g module organizations
	npx nest g controller organizations
	npx nest g service organizations
i:
	yarn install
pgGen: 
	npx prisma db pull --schema src/utilModules/prisma/schema.prisma
	npx prisma generate --schema src/utilModules/prisma/schema.prisma
spGen:
	npx prisma db pull --schema src/utilModules/supabase/schema.prisma
	npx prisma generate --schema src/utilModules/supabase/schema.prisma
prod:
	yarn migrate
	yarn build
	yarn start:prod
studio: 
	npx prisma studio --schema src/utilModules/prisma/schema.prisma