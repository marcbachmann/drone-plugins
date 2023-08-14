# docker build -t marcbachmann/eslint:8.47.0 .
FROM livingdocs/node:20
ENV NODE_PATH /eslint-drone-plugin/node_modules
WORKDIR /eslint-drone-plugin

ADD package*.json /eslint-drone-plugin
RUN npm ci && npm cache clean -f
ADD . /eslint-drone-plugin
USER node

ENTRYPOINT ["/eslint-drone-plugin/cli.js"]
