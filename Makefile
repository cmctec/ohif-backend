# example use make prisma or make dev
# this code generated schema.prisma and prisma types
# !!! DONT Used in prod
# recommended after migration "make sm"
prisma: 
	npx prisma db pull
# this code generated prisma types
prismag: 
	npx prisma generate
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
	nest g module patients
	nest g controller patients
	nest g service patients
i:
	yarn install
two: 
	npx prisma db pull --schema src/utilModules/prisma/schema.prisma
	npx prisma db pull --schema src/utilModules/supabase/schema.prisma
	
	npx prisma generate --schema src/utilModules/prisma/schema.prisma
	npx prisma generate --schema src/utilModules/supabase/schema.prisma
prod:
	yarn migrate
	yarn build
	yarn start:prod
