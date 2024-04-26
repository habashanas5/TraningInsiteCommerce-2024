### Example

```jsx
const Moon = require('../Icons/Moon').default;
const Link = require('../Link').default;
const Typography = require('../Typography').default;

const Spacer = () => <div style={{display: 'inline-block', width: '40px'}} />;
const triggerLink = <Link as="span">this?</Link>

const longText = "To obtain a price quote, add this item to your cart and select 'Request a Quote' from the cart page. You can request a quote for multiple items.";

<>
    <Typography>What's this? </Typography><Tooltip text={longText} />
    <Spacer />
    <Typography>And this? </Typography><Tooltip iconProps={{src: Moon}} text="Night mode"/>
    <Spacer />
    <Typography>How about </Typography><Tooltip triggerComponent={triggerLink} text="custom trigger"/>
</>
```
