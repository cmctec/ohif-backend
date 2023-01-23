FROM node:16 as build

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install --pure-lockfile



COPY . .

RUN	npx prisma generate --schema src/prisma/schema.prisma
RUN	npx prisma generate --schema src/supabase/schema.prisma


EXPOSE 8888

RUN yarn  build

CMD ["make", "prod"]