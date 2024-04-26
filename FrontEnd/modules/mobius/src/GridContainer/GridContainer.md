### Example

```jsx
const GridItem = require('../GridItem').default;

const style = { width: '100%', background: '#ccc', textAlign: 'center' };
const Emoji = () => <div style={style}>🌟</div>;

<section style={{ display: 'flex', width: '100%' }}>
    <GridContainer>
        <GridItem width={1}><Emoji /></GridItem>
        <GridItem width={1}><Emoji /></GridItem>
        <GridItem width={1}><Emoji /></GridItem>
        <GridItem width={1}><Emoji /></GridItem>
        <GridItem width={1}><Emoji /></GridItem>
        <GridItem width={1}><Emoji /></GridItem>
        <GridItem width={1}><Emoji /></GridItem>
        <GridItem width={1}><Emoji /></GridItem>
        <GridItem width={1}><Emoji /></GridItem>
        <GridItem width={1}><Emoji /></GridItem>
        <GridItem width={1}><Emoji /></GridItem>
        <GridItem width={1}><Emoji /></GridItem>
    </GridContainer>
</section>
```

### Nested Grids with custom CSS using the `css` and `offsetCss` prop

```jsx
const GridItem = require('../GridItem').default;
const css = require('styled-components/css');

const style = {
    width: '100%',
    height: '100%',
    background: 'rgba(200,200,200,.9)',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};
const Number = ({ children }) => <div style={style}>{children}</div>;

<section style={{ display: 'flex', width: '100%' }}>
    <GridContainer gap={5}>
        <GridItem width={1}><Number>1</Number></GridItem>
        <GridItem width={2}><Number>2</Number></GridItem>
        <GridItem width={3} offsetCss={css`background: tomato;`}><Number>3</Number></GridItem>
        <GridItem width={6}>
            <GridContainer gap={19} css={css`background: blue;`}>
                <GridItem width={1}><Number>1</Number></GridItem>
                <GridItem width={2}><Number>2</Number></GridItem>
                <GridItem width={3}><Number>3</Number></GridItem>
                <GridItem width={6}><Number>6</Number></GridItem>
                <GridItem width={5}><Number>5</Number></GridItem>
                <GridItem width={7}>
                    <GridContainer gap={1} css={css`background: red;`}>
                        <GridItem width={7}><Number>7</Number></GridItem>
                        <GridItem width={3}><Number>3</Number></GridItem>
                        <GridItem width={2}><Number>2</Number></GridItem>
                        <GridItem width={12}><Number>12</Number></GridItem>
                    </GridContainer>
                </GridItem>
            </GridContainer>
        </GridItem>
    </GridContainer>
</section>
```
