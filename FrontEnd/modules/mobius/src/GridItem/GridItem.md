### Example

```jsx
const GridContainer = require('../GridContainer').default;

const style = { width: '100%', background: '#ccc', textAlign: 'center' };
const Content = ({ children }) => <div style={style}>{children}</div>;

<section style={{ display: 'flex', width: '100%' }}>
    <GridContainer gap={8}>
        <GridItem width={12}><Content>12</Content></GridItem>
        <GridItem width={1}><Content>1</Content></GridItem>
        <GridItem width={11}><Content>11</Content></GridItem>
        <GridItem width={2}><Content>2</Content></GridItem>
        <GridItem width={10}><Content>10</Content></GridItem>
        <GridItem width={3}><Content>3</Content></GridItem>
        <GridItem width={9}><Content>9</Content></GridItem>
        <GridItem width={4}><Content>4</Content></GridItem>
        <GridItem width={8}><Content>8</Content></GridItem>
        <GridItem width={5}><Content>5</Content></GridItem>
        <GridItem width={7}><Content>7</Content></GridItem>
        <GridItem width={6}><Content>6</Content></GridItem>
        <GridItem width={6}><Content>6</Content></GridItem>
    </GridContainer>
</section>
```

### Vertical Alignment
```jsx
const GridContainer = require('../GridContainer').default;

const style = { width: '100%', background: '#ccc', textAlign: 'center' };
const Content = ({ children }) => <div style={style}>{children}</div>;
const BigGreenBox = () => <div style={{ width: '100%', height: 100, background: 'lightgreen' }}/>;

<section style={{ display: 'flex', width: '100%' }}>
    <GridContainer gap={8}>
        <GridItem width={6}><BigGreenBox /></GridItem>
        <GridItem width={2} align="top"><Content>top</Content></GridItem>
        <GridItem width={2} align="middle"><Content>middle</Content></GridItem>
        <GridItem width={2} align="bottom"><Content>bottom</Content></GridItem>
    </GridContainer>
</section>
```

### Responsive Grid Widths

To see this feature in action, resize the browser window or activate Responsive Mode in the browser's developer tools.

```jsx
const GridContainer = require('../GridContainer').default;

const style = { width: '100%', background: '#ccc', textAlign: 'center' };
const Emoji = () => <div style={style}>💥</div>;

/**
 * This sets each GridItem in the example to be 12 columns wide at the lowest screen width (mobile).
 * GridItems get narrower as the screen gets wider, matching each breakpoint defined in the theme.
 */
const breakpoints = [12, 6, 4, 2, 1];

<section style={{ display: 'flex', width: '100%', marginTop: 10 }}>
    <GridContainer gap={8}>
        <GridItem width={breakpoints}><Emoji /></GridItem>
        <GridItem width={breakpoints}><Emoji /></GridItem>
        <GridItem width={breakpoints}><Emoji /></GridItem>
        <GridItem width={breakpoints}><Emoji /></GridItem>
        <GridItem width={breakpoints}><Emoji /></GridItem>
        <GridItem width={breakpoints}><Emoji /></GridItem>
        <GridItem width={breakpoints}><Emoji /></GridItem>
        <GridItem width={breakpoints}><Emoji /></GridItem>
        <GridItem width={breakpoints}><Emoji /></GridItem>
        <GridItem width={breakpoints}><Emoji /></GridItem>
        <GridItem width={breakpoints}><Emoji /></GridItem>
        <GridItem width={breakpoints}><Emoji /></GridItem>
    </GridContainer>
</section>
```
