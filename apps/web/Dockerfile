# Standalone Node build of the SvelteKit app (adapter-node).
# PUBLIC_* values are inlined into the client bundle at build time, so pass them as build args.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

ARG PUBLIC_CLERK_PUBLISHABLE_KEY=""
ARG PUBLIC_API_URL=""
ARG PUBLIC_YOUTUBE_TUTORIAL_URL=""
ENV PUBLIC_CLERK_PUBLISHABLE_KEY=$PUBLIC_CLERK_PUBLISHABLE_KEY \
    PUBLIC_API_URL=$PUBLIC_API_URL \
    PUBLIC_YOUTUBE_TUTORIAL_URL=$PUBLIC_YOUTUBE_TUTORIAL_URL \
    SVELTE_ADAPTER=node

RUN npm run build && npm prune --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build

USER node
EXPOSE 3000
CMD ["node", "build"]
