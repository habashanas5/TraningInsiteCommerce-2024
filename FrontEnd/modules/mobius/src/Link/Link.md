### Example

```jsx
const Typography = require('../Typography').default;
const User = require('../Icons/User').default;

<>
    <Link href="https://insitesoft.com" onClick={() => alert('hiya')}>
        Link Text
    </Link>
    <Typography variant="h4" style={{marginTop: 50}}>With Icon</Typography>
    <Link href="https://insitesoft.com" iconProps={{ src: User }}>
        Sign In
    </Link>
</>
```

### Hover Mode and Style
```jsx
const User = require('../Icons/User').default;

<>
    <Link href="https://insitesoft.com" hoverMode="darken">Darken</Link><br/>
    <Link href="https://insitesoft.com" hoverMode="lighten">Lighten</Link><br/>
    <Link href="https://insitesoft.com" hoverStyle={{ textDecoration: 'underline', color: 'red' }}>
        Custom hover style
    </Link><br/>
    <br/>
    <Link href="https://insitesoft.com" hoverMode="darken" iconProps={{ src: User }}>
        Sign In (darken)
    </Link><br/>
    <Link href="https://insitesoft.com" hoverMode="lighten" iconProps={{ src: User }}>
        Sign In (lighten)
    </Link><br/>
    <Link
        href="https://insitesoft.com"
        hoverStyle={{ background: 'yellow', textDecoration: 'underline', color: 'red' }}
        iconProps={{ src: User }}
    >
        Sign In (custom)
    </Link><br/>
</>
```
