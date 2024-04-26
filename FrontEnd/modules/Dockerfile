ARG COMMERCE_VERSION=5.0.7.1650
FROM registry.cloud.insitehq.net/spire/build-base:${COMMERCE_VERSION} as build

WORKDIR /app
COPY blueprints ./modules/blueprints/
COPY blueprints-shell ./modules/blueprints-shell/

RUN ["npm", "run", "eslint:blueprint"]

# Create the JS bundles for the application.
ARG BLUEPRINT=content-library
RUN npm run build || exit 1

ARG BLUEPRINT_NAME=content-library
RUN mkdir -p /app/modules/blueprints/${BLUEPRINT_NAME}/wwwroot/AppData/PageCreators \
  && mkdir -p /app/modules/blueprints/${BLUEPRINT_NAME}/wwwroot/AppData/PageTemplates \
  && mkdir -p /app/wwwroot/AppData/PageCreators/${BLUEPRINT_NAME} \
  && mkdir -p /app/wwwroot/AppData/PageTemplates/${BLUEPRINT_NAME} \
  && cp -a /app/modules/blueprints/${BLUEPRINT_NAME}/wwwroot/AppData/PageCreators/. /app/wwwroot/AppData/PageCreators/${BLUEPRINT_NAME}/ \
  && cp -a /app/modules/blueprints/${BLUEPRINT_NAME}/wwwroot/AppData/PageTemplates/. /app/wwwroot/AppData/PageTemplates/${BLUEPRINT_NAME}/

FROM registry.cloud.insitehq.net/spire/runtime-base:${COMMERCE_VERSION} AS runtime

WORKDIR /app

COPY --from=build /app/dist/. ./dist/
COPY --from=build /app/wwwroot/. ./wwwroot/
# ideally we wouldn't do this, but trying to get webpack to build startProduction.js wasn't working well because it requires dist/server
# if we go down that path again don't forget target: "node" in the webpack config. Ideally it would treat dist/server as an external
COPY --from=build /app/startProduction.package.json ./package.json
RUN ["npm", "install", "--unsafe-perm"]
COPY --from=build  /app/startProduction.js ./
COPY --from=build  /app/start.js ./

ENV ISC_ENABLE_COMPRESSION=true

CMD ["node", "./startProduction.js"]
