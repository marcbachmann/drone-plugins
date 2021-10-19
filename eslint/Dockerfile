# docker build -t marcbachmann/eslint:8.0.1 .
FROM livingdocs/node:16
USER node
ENV NODE_PATH /eslint-drone-plugin/node_modules
WORKDIR /eslint-drone-plugin

ADD package*.json /eslint-drone-plugin
RUN npm ci && npm cache clean -f
ADD . /eslint-drone-plugin

ENTRYPOINT ["/eslint-drone-plugin/cli.js"]
