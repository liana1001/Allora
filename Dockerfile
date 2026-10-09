FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps ./apps
COPY packages ./packages
COPY tsconfig.base.json .
RUN npm ci
RUN npm run build --workspace=@allora/api

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
EXPOSE 4000
CMD ["node", "apps/api/dist/server.js"]
