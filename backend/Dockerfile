# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
# Copy seeder if needed, or other src files if runtime depends on them
COPY --from=builder /app/src ./src 

ENV PORT=5000
EXPOSE 5000

CMD ["npm", "start"]
