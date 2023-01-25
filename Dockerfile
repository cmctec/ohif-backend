FROM node:16 as build

WORKDIR /app

COPY package*.json yarn.lock nest-cli.json ./
COPY yarn.lock nest-cli.json ./
COPY nest-cli.json ./
COPY Makefile ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./
COPY ./src ./src
COPY ./db ./db

RUN ls -a -l

RUN yarn install --pure-lockfile
RUN npx prisma generate --schema src/utilModules/prisma/schema.prisma
RUN	npx prisma generate --schema src/utilModules/supabase/schema.prisma

EXPOSE 8888

RUN yarn  build

CMD ["make", "prod"]