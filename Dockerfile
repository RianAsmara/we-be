FROM oven/bun:1.0.25

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]
