# Docker for dummies
# use this to build the example blueprint. Exclude the two build args to build content-library
#   docker build . -f .\Dockerfile --build-arg BLUEPRINT=blueprints/example --build-arg BLUEPRINT_NAME=example -t spire
# use this to run the built image, the site will run at http://localhost:3000, and your website domainNames needs to include host.docker.internal
#   docker run --rm -p 3000:3000 -e "ISC_API_URL=http://host.docker.internal" spire
# stopping a running container
#   docker ps
#   docker stop {containerId}
# troubleshooting - you can use the final image name, like spire from above, or any of the images creating during the build, they look like ---> XXXXXXXXXXXXX
#   docker run -it {imagename} /bin/sh

# Command to build the base site with automatic Node/Linux image update:
#   docker build --pull .

# A maintained LTS release is appropriate for production usage.  For Node, these are typically even-numbered major releases.
# "Current" versions should be periodically tested for early warning of compatibility problems.
# The run-time version (near the end of this file) can be different but should generally be kept the same.

# To test/run the customer blueprint process
# Ensure you are using Linux container mode
# Replace 1.0.0.0 with a proper version number if you desire

# Build runtime-base image - do this once for a given version number
# BASH
#   DOCKER_BUILDKIT=1 && docker build --pull --target=runtime-base . -t registry.cloud.insitehq.net/spire/runtime-base:1.0.0.0
# Powershell
#   $env:DOCKER_BUILDKIT=1; docker build --pull --target=runtime-base . -t registry.cloud.insitehq.net/spire/runtime-base:1.0.0.0

# To build the build-base image - do this each time you change base code
# BASH
#   DOCKER_BUILDKIT=1 && docker build --pull --memory 4g --target=build-base . -t registry.cloud.insitehq.net/spire/build-base:1.0.0.0
# Powershell
#   $env:DOCKER_BUILDKIT=1; docker build --pull --memory 4g --target=build-base . -t registry.cloud.insitehq.net/spire/build-base:1.0.0.0

# Run the actual blueprints docker file - this must execute from within the modules directory
#   cd modules
#   docker build . -f .\Dockerfile --build-arg BLUEPRINT=blueprints/example --build-arg BLUEPRINT_NAME=example --build-arg COMMERCE_VERSION=1.0.0.0 -t spire-blueprint
#   docker run --rm -p 3000:3000 -e "ISC_API_URL=http://host.docker.internal" spire-blueprint
ARG BUILD_BASE="build-base"

ARG RUNTIME_BASE="runtime-base"

ARG NODE_BASE_IMAGE="node:12-alpine"

FROM $NODE_BASE_IMAGE AS build-base

# These files rarely change and are the minimum required for `npm install`.
WORKDIR /app
COPY ./episerver-platform-navigation-v0.8.7-rebrand-v2.tgz ./package.json ./package-lock.json ./validateLockFile.js ./
# spire linter needs to exist on disk when we use npm ci
COPY ./modules/spire-linter ./modules/spire-linter

RUN ["npm", "ci", "--unsafe-perm"]

RUN ["npm", "run", "test:spire-linter"]

# Most branches will not change Mobius, so do the minimum required work to run its tests so the layer can be cached.
COPY ./babel.config.js ./constants.d.ts ./tsconfig.base.json ./
COPY ./modules/client-framework/src/Logger.ts ./modules/client-framework/src/

# We need the tsconfig.paths.json file to run the tests. Running it here won't get the blueprint paths setup, but it will get rerun later.
COPY ./config/webpack/ ./config/webpack/
RUN ["npm", "run", "setupTsconfigPaths"]

COPY ./modules/mobius/ ./modules/mobius
RUN ["npm", "run", "test:mobius"]

# Linter configuration change occasionally.
COPY ./.eslintignore ./.eslintrc.js ./.eslintrc-blueprint.js ./.stylelintrc ./.prettierrc  ./

# These files will change frequently, so useful caching is limited to different build arguments.
COPY ./modules/ ./modules/

# Tests, ESLint and Stylelint results don't vary by extension path but require all code to be present.
RUN ["npm", "test"]
RUN ["npm", "run", "eslint"]
RUN ["npm", "run", "prettier:check"]
RUN ["npm", "run", "stylelint"]

# Copy this to get creators and other static files into the base build image.
COPY ./wwwroot/ ./wwwroot/
COPY ./config/spire_routes.json ./config/
# We need these files available on build for the blueprints/Dockerfile
COPY /startProduction.package.json /startProduction.js /start.js ./

# This stage has to match the build stage in modules/blueprints/Dockerfile
FROM $BUILD_BASE AS build

##########################################################################################
# Most things below this are currently copied (and changed slightly) into ./modules/blueprints/Dockerfile
# you will probably need to make any changes there as well
##########################################################################################

WORKDIR /app
COPY ./modules/blueprints ./modules/blueprints/

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

FROM $NODE_BASE_IMAGE AS runtime-base
# This is just here for automation so we can push our runtime-base image to the registry as it evolves

# This stage has to match the runtime stage in modules/blueprints/Dockerfile
FROM $RUNTIME_BASE AS runtime

WORKDIR /app

COPY --from=build /app/dist/. ./dist/
COPY --from=build /app/wwwroot/. ./wwwroot/
# ideally we wouldn't do this, but trying to get webpack to build startProduction.js wasn't working well because it requires dist/server
# if we go down that path again don't forget target: "node" in the webpack config. Ideally it would treat dist/server as an external
COPY /startProduction.package.json ./package.json
COPY /startProduction.js /start.js ./
RUN ["npm", "install", "--unsafe-perm"]

ARG BUILD_INFO=None
# Valid values for compression are `true` and `false, with `true` (the default) indicating to compress HTTP content.
ENV ISC_ENABLE_COMPRESSION=true

USER node
CMD ["node", "./startProduction.js"]
