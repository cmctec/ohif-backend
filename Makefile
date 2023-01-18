# example use make prisma or make dev
# this code generated schema.prisma and prisma types
# !!! DONT Used in prod
# recommended after migration "make sm"
prisma: 
	npx prisma db pull
	npx prisma generate
# this code generated prisma types
prismag: 
	npx prisma generate
dev:
	yarn start start:dev
# для миграций, js file отправить все sql file виде  DDL запроса
sm:
	yarn start migrate
	yarn start start:dev
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