# Developer's Guide
This was from mobius, do we want to keep it? move this stuff into the main readme?

## Installation

Once cloned, install dependencies:
```
cd FrontEnd
npm install
lerna bootstrap
```

## Packages

[Lerna](https://lernajs.io/) was used to split this project into multiple packages.
Because of this, dependencies should be managed using Lerna instead of `npm install`.
You should familiarize yourself with Lerna's basic commands:

- `lerna bootstrap` installs all dependencies and link any cross-dependencies.
- `lerna add xyz` installs the xyz dependency into all @mobius packages.
- `lerna add xyz --scope=@insite/mobius` installs the xyz dependency into the @insite/mobius package.
- `lerna clean` removes the node_modules folder from all packages. Useful when manipulating package.json files manually, followed by a `lerna bootstrap`.

To learn more, consult the [Lerna readme](https://github.com/lerna/lerna/blob/master/README.md).

## styled-components

Mobius components are built and styled primarily using [styled-components](https://www.styled-components.com/), which is
essentially a factory for React components and their corresponding CSS. The syntax may seem a little strange at first,
but styled-components provides an efficient way to maintain your project's CSS and avoid collisions.

## Typescript

Because of compatibility issues in this project's tooling (mainly Typescript, react-styleguidist and styled-components),
Mobius components are being developed in JavaScript, with Typescript definitions created as needed.
