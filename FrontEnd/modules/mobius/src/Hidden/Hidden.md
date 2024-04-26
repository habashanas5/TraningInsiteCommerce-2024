### Above or below
Text within the below boxes is hidden above or below various breakpoints. 
```jsx
const style = { 
    boxSizing: 'border-box',
    display: 'block', 
    width: '130px',
    height: '130px',
    background: '#ccc', 
    textAlign: 'center',
    margin: '8px',
    padding: '8px',
};
const Content = ({ children }) => <div style={style}>{children}</div>;

const Container = ({ children, direction = 'row' }) => <div style={{display: 'flex', flexDirection: direction, flexWrap: 'wrap'}}>{children}</div>;

<div style={{display: 'flex', justifyContent: 'flex-start'}}>
    <Container direction="column">
        <Content>
            <Hidden above="xs">
                If the screen is larger than xs size, I'm hidden.
            </Hidden>
        </Content> 
        <Content color="red">
            <Hidden above="sm">
                If the screen is larger than sm size, I'm hidden.
            </Hidden>
        </Content> 
        <Content>
            <Hidden above="md">
                If the screen is larger than md size, I'm hidden.
        </Hidden>
        </Content> 
        <Content>
            <Hidden above="lg">
                If the screen is larger than lg size, I'm hidden.
        </Hidden>
        </Content> 
    </Container>
    <Container direction="column">
        <Content>
            <Hidden below="sm">
                If the screen is smaller than sm size, I'm hidden.
        </Hidden>
        </Content> 
        <Content>
            <Hidden below="md">
                If the screen is smaller than md size, I'm hidden.
        </Hidden>
        </Content> 
        <Content>
            <Hidden below="lg">
                If the screen is smaller than lg size, I'm hidden.
        </Hidden>
        </Content> 
        <Content>
            <Hidden below="xl">
                If the screen is smaller than xl size, I'm hidden.
            </Hidden>
        </Content> 
    </Container>
</div>
```

### Ranges
Text within the below boxes is hidden between various breakpoints.
```jsx
const style = { 
    boxSizing: 'border-box',
    display: 'block', 
    width: '130px',
    height: '130px',
    background: '#ccc', 
    textAlign: 'center',
    margin: '8px',
    padding: '8px',
};
const Content = ({ children }) => <div style={style}>{children}</div>;

const Container = ({ children, direction = 'row' }) => <div style={{display: 'flex', flexDirection: direction, flexWrap: 'wrap'}}>{children}</div>;

    <Container>
        <Content>
            <Hidden below="sm" above="md"> 
                If the screen is between (inclusive) sm and md sizes, I'm visible.
            </Hidden>
        </Content>
        <Content>
            <Hidden below="sm" above="lg"> 
                If the screen is between (inclusive) sm and lg sizes, I'm visible.
            </Hidden>
        </Content>
        <Content>
            <Hidden below="md" above="md"> 
                I will only be visible when the screen is a md size.
            </Hidden>
        </Content>
        <Content>
            <Hidden below="md" above="lg"> 
                If the screen is between (inclusive) md and lg sizes, I'm visible.
            </Hidden>
        </Content>
    </Container>
```

### Practical Implementation
Displays three different things based on three breaks.
```jsx
const Typography = require('../Typography').default;

const style = (color) => ({ 
    boxSizing: 'border-box',
    border: `solid 4px ${color}`,
    display: 'block', 
    width: '180px',
    height: '180px',
    margin: '8px',
    padding: '8px',
    textAlign: 'center',
});
const Content = ({ children, color }) => <div style={style(color)}>{children}</div>;

<>
    <Hidden above='sm'> 
        <Content color='rebeccapurple'>
            <Typography variant="h2">Small</Typography>
        </Content>
    </Hidden>
    <Hidden below='md' above='md'> 
        <Content color='orangered'>
            <Typography variant="h2">Medium</Typography>
        </Content>
    </Hidden>
    <Hidden below='lg'> 
        <Content color='deeppink'>
            <Typography variant="h2">Large</Typography>
        </Content>
    </Hidden>
</>
```
