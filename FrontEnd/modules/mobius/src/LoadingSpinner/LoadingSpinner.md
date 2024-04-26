### Examples

```jsx
const Button = require('../Button').default;
const Spacer = () => <div style={{ width: 50 }} />;

<div style={{ display: 'flex' }}>
    <LoadingSpinner />
    <Spacer />
    <LoadingSpinner color="primary"/>
    <Spacer />
    <Button>
        <LoadingSpinner size={15} style={{ marginRight: 15 }}/>
        Loading
    </Button>
</div>
```
