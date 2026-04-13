FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npx vite build

FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache nginx && mkdir -p /run/nginx /app/data
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/node_modules /app/node_modules
COPY api/ /app/api/
COPY bot/ /app/bot/
COPY src/ /app/src/
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
EXPOSE 80
CMD ["/app/entrypoint.sh"]
