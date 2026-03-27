# docker build -t marcbachmann/eslint:9.35.0 .
FROM livingdocs/node:24
WORKDIR /eslint-drone-plugin

ADD package*.json /eslint-drone-plugin
RUN npm ci --force && npm cache clean -f && ln -s //eslint-drone-plugin/node_modules /node_modules
ADD . /eslint-drone-plugin
USER node

ENTRYPOINT ["node", "/eslint-drone-plugin/cli.js"]
