# FROM dev as test

# COPY . .

# #RUN npm audit

# USER root

# RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin \
#     && trivy filesystem --exit-code 1 --no-progress --ignore-unfixed /app

# RUN [ "mocha", "--recursive", "test/http" ]
# RUN [ "mocha", "--recursive", "test/business" ]


################################
################################
################################

FROM node:16.15.1-slim as base

LABEL org.opencontainers.image.authors=devops@switch.com.uy
LABEL org.opencontainers.image.title="TEXTUM API dockerfile"
LABEL org.opencontainers.image.licenses=MIT
LABEL uy.com.textum.nodeversion=$NODE_VERSION

ENV APP_BASE_PATH /app
ENV APP_PORT 3000
ENV PATH ${APP_BASE_PATH}/node_modules/.bin:$PATH

EXPOSE ${APP_PORT}

WORKDIR ${APP_BASE_PATH}

COPY . .

################################STAGE prepare DEV################################

FROM base as prepare-dev

ENV NODE_ENV development
ENV PATH ${APP_BASE_PATH}/node_modules/.bin:$PATH

# Development Tools
RUN apt-get update -qq \
    && apt-get install -qy \ 
    ca-certificates \
    bzip2 \
    curl \
    libfontconfig \
    --no-install-recommends

RUN npm install && npm cache clean --force

################################STAGE INTERNAL DEV################################

FROM prepare-dev as dev

CMD ["nodemon", "--inspect=0.0.0.0", "./bin/www"]

################################STAGE prepare PROD ################################

FROM base as prepare

ENV NODE_ENV production
ENV TINI_VERSION v0.19.0

RUN chown -R node:node ${APP_BASE_PATH}

# Add Tini
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

RUN npm ci --only=${NODE_ENV}

USER node

ENTRYPOINT ["/tini", "--"]

################################STAGE PROD ################################

FROM prepare as prod

CMD ["node", "./bin/www"]