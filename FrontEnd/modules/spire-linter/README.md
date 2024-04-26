Adding a rule
- Modify ./index.js to add your new rule
- Modify ../.eslintrc.js to enforce the new rule

test run against file with
```bash
eslint [filePath]
```
see existing .test.js files for how to write jest tests for rules

Some useful things
- This is helpful for figuring out how to write a rule https://astexplorer.net/
  - First use https://www.typescriptlang.org/play/ to convert typescript to js, make sure to select react under config - jsx 
  - You'll have to convert your TSX into JS
- https://eslint.org/docs/developer-guide/working-with-rules
- https://eslint.org/docs/developer-guide/selectors



