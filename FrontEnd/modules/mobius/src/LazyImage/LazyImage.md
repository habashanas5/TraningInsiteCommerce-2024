### Example

The file for the image below is fairly large, it should take some time to load (refresh the page to see the effect).
Clicking the button creates another instance of the same image, which will then load the asset from cache and render the
image without a fade-in.

```jsx
const Button = require('../Button').default;

const SampleImage = () => (
    <LazyImage
        width="400px"
        height="267px"
        src="https://branding.insitesoft.com/wp-content/uploads/2018/09/iStock-666559544-1.jpg"
        style={{ marginRight: '1rem' }}
    />
);

class Example extends React.Component {
    constructor() {
        this.state = { showClone: false }
        this.toggleClone = this.toggleClone.bind(this);
    }

    toggleClone() {
        this.setState((currentState) => ({ showClone: !currentState.showClone }));
    }

    render() {
        return (
            <>
                <header style={{ marginBottom: '1rem' }}>
                    <Button onClick={this.toggleClone}>Toggle Clone</Button>
                </header>
                <main>
                    <SampleImage />
                    { this.state.showClone && <SampleImage /> }
                </main>
            </>
        )
    }
}

<Example />
```

### Custom Placeholder

If you're unable to see the placeholder in the example below, try [throttling the network](https://css-tricks.com/throttling-the-network/).

```jsx
const style = {
    height: '100%',
    width: '100%',
    background: '#ccc',
    color: 'white',
    fontSize: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

<LazyImage
    placeholder={<div style={style}>loading</div>}
    width="400px"
    height="267px"
    src="https://branding.insitesoft.com/wp-content/uploads/2018/09/iStock-666559544-1.jpg"
/>
```

### Failed Source

If the source of an image fails to load an image, a placeholder icon and alt text will display.

```jsx
<LazyImage
    width="200px"
    height="180px"
    altText="A stylish human wearing a jaunty top hat."
    src="hat.com"
/>
```
