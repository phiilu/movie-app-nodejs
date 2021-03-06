FROM node:12 as build
RUN mkdir -p /app
WORKDIR /app
COPY tailwind.config.js postcss.config.js package.json package-lock.json tsconfig.json build.sh /app/
COPY src /app/src
RUN npm ci
RUN npm run build

FROM node:12-alpine
RUN mkdir -p /app
WORKDIR /app
COPY --from=build /app/dist .
COPY --from=build /app/node_modules node_modules

ENV NODE_ENV production

EXPOSE 5000
CMD ["node", "--require", "dotenv/config", "/app/index.js"]