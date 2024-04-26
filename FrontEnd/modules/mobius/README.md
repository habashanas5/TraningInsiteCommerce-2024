# @insite/mobius

A collection of Mobius components, packaged for distribution.

## Create a New Component
```
npm run create YourComponentName
```

To add/remove files to the boilerplate, just add/remove `.template` files in the `/template` folder.

## Install

To install @insite/mobius into your project, you need access to this repository.
If you can read this, you probably already have access.
@insite/mobius is currently distributed directly from GitHub through the mobius-core branch of this repository.
You can install it via npm:
```
npm install git+https://github.com/InsiteSoftware/mobius.git#mobius-core
```
or
```
npm install git+ssh://git@github.com/InsiteSoftware/mobius.git#mobius-core
```

## Importing Components

Once installed, @insite/mobius components can be imported as any other JavaScript module:
```
import Button from '@insite/mobius/Button';
```

## NPM Deployment

To publish to NPM, run `npm run build` and then cd into the `build` directory and run `npm publish`.
