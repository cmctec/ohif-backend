# https://gist.github.com/nzvtrk/cba2970b1df9091b520811e521d9bd44

FROM node:16.3.0-alpine AS build
WORKDIR /ohif/app/main

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --pure-lockfile

COPY . ./
RUN npx prisma generate --schema src/utilModules/prisma/schema.prisma
RUN	npx prisma generate --schema src/utilModules/supabase/schema.prisma
RUN yarn  build
# RUN ls -a -l


FROM node:16.3.0-alpine
WORKDIR /ohif/app/main

COPY --from=build /ohif/app/main/package.json /ohif/app/main/package.json
COPY --from=build /ohif/app/main/node_modules /ohif/app/main/node_modules

COPY --from=build /ohif/app/main/db /ohif/app/main/db

COPY --from=build /ohif/app/main/dist /ohif/app/main/dist
COPY --from=build /ohif/app/main/generated /ohif/app/main/generated


RUN ls -a -l

EXPOSE 3000
CMD ["yarn", "start:prod" ]