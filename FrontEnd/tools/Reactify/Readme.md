The idea is that we put all our svgs into ./assets, then run them through svgo and then reactify them. That can be do as follows

## Initial Setup

```
npm install -g svgo
```

## Running

```
cd to ./tools/Reactify
node _reactifyIcons.js
```
