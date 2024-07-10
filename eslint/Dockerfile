# docker build -t marcbachmann/eslint:9.6.0 .
FROM livingdocs/node:22
ENV NODE_PATH /eslint-drone-plugin/node_modules
WORKDIR /eslint-drone-plugin

ADD package*.json /eslint-drone-plugin
RUN npm ci --force && npm cache clean -f
ADD . /eslint-drone-plugin
USER node

ENTRYPOINT ["/eslint-drone-plugin/cli.js"]
