### Examples

Icon provides a React component wrapper to render source svgs either from a url or from those offered by mobius as [icons](#/Resources?id=icons).

```jsx
const Typography = require('../Typography').default;

const ShoppingCart = require('../Icons/ShoppingCart').default;
const MapPin = require('../Icons/MapPin').default;
const User = require('../Icons/User').default;
const ChevronLeft = require('../Icons/ChevronLeft').default;
const Search = require('../Icons/Search').default;
const X = require('../Icons/X').default;
const ChevronsDown = require('../Icons/ChevronsDown').default;
const HelpCircle = require('../Icons/HelpCircle').default;
const Users = require('../Icons/Users').default;

const Container = ({ children }) => (
    <div style={{ margin:'30px 0', display:'flex', alignItems:'center' }}>{children}</div>
);
const style = { marginLeft: 50 };

<>
    <Typography variant="h4">Header</Typography>
    <Container>
        <Icon src={ShoppingCart} color="primary" />
        <Icon src={MapPin} color="primary" size={18} style={style} />
        <Icon src={User} color="primary" size={18} style={style} />
    </Container>
    <Typography variant="h4">Navigational</Typography>
    <Container>
        <Icon src={ChevronLeft} size={18} />
        <Icon src={Search} size={18} style={style} />
        <Icon src={X} size={18} style={style} />
    </Container>
    <Typography variant="h4">Miscellany</Typography>
    <Container>
        <Icon src={ChevronsDown} size={42} />
        <Icon src={HelpCircle} color="secondary" size={18} style={style} />
        <Icon src={Users} color="secondary" size={18} style={style} />
    </Container>
</>
```

### Color
```jsx
const ShoppingCart = require('../Icons/ShoppingCart').default;

<>
    <Icon src={ShoppingCart} color="primary" />
    <Icon src={ShoppingCart} color="#363636" style={{ marginLeft: 50 }} />
</>
```

### Size
```jsx
const ShoppingCart = require('../Icons/ShoppingCart').default;

<div style={{ display: 'flex', alignItems: 'center' }}>
    <Icon src={ShoppingCart} color="primary" size={64} />
    <Icon src={ShoppingCart} color="primary" size={15} style={{ marginLeft: 50 }} />
</div>
```
### Fully Customizable
You may customize the Icon and target the child svg, through the `css` property. By default, these custom styles override styles found on the `theme` object. If you would like the theme to be combined with your custom styles, add the property `mergeCss={true}` to the component.
```jsx
const ShoppingCart = require('../Icons/ShoppingCart').default;
const css = require('styled-components').css

<div style={{ display: 'flex', alignItems: 'center' }}>
    <Icon src={ShoppingCart} color="primary" size={42} css={css`padding: 10px; border-radius: 50%; color: #fff;background: green;`} />
</div>
```

### Load icon from URL
```jsx
<Icon src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" size={100} />
```
