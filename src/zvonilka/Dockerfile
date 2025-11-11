FROM node:20-alpine AS zvonilka-deps

WORKDIR /home/zvonilka/

COPY ./src/zvonilka/package.json ./package.json
COPY ./src/zvonilka/package-lock.json ./package-lock.json

RUN npm install

COPY .dockerignore ./.dockerignore
COPY ./src/zvonilka/ .

### ---- Front-end builder image ----
FROM zvonilka-deps AS zvonilka

WORKDIR /home/zvonilka

FROM zvonilka-deps AS zvonilka-dev

WORKDIR /home/zvonilka

EXPOSE 3000

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Tilt will rebuild zvonilka target so, we dissociate zvonilka and zvonilka-builder
# to avoid rebuilding the app at every changes.
FROM zvonilka AS zvonilka-builder

WORKDIR /home/zvonilka

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ---- Front-end image ----
FROM nginxinc/nginx-unprivileged:alpine3.21 AS zvonilka-production

USER root
RUN apk update && apk upgrade libssl3 libcrypto3 libxml2>=2.12.7-r2 libxslt>=1.1.39-r2 libexpat>=2.7.2-r0

USER nginx

# Un-privileged user running the application
ARG DOCKER_USER
USER ${DOCKER_USER}

COPY --from=zvonilka-builder \
    /home/zvonilka/dist \
    /usr/share/nginx/html

COPY ./src/zvonilka/default.conf /etc/nginx/conf.d
COPY ./docker/files/usr/local/bin/entrypoint /usr/local/bin/entrypoint

ENTRYPOINT [ "/usr/local/bin/entrypoint" ]

CMD ["nginx", "-g", "daemon off;"]
