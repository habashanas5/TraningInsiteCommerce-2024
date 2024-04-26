### Example

```jsx
const Typography = require('../Typography').default;

const Spacer = ({height}) => <div style={{ height: 50 }} />;
const Container = ({ children }) => <div style={{ maxWidth: 400 }}>{children}</div>;

const children = [
            <option key={0} value={0}>Select</option>,
            <option key={1} value={1}>apple</option>,
            <option key={2} value={2}>bananas</option>,
            <option key={3} value={3}>cherries</option>,
];
const logValue = (e) => { console.log(options[e.target.value - 1]); };

<>
    <Container>
        <Typography variant="h4">Default</Typography>
        <Select
            label="Select the best one"
            required
            placeholder="Select"
            hint="Hint: it's the best option"
            onChange={logValue}
        >
            {children}
        </Select>
    </Container>
    <Spacer />
    <Container>
        <Typography variant="h4">Error</Typography>
        <Select
            label="Select the best one"
            required
            onChange={logValue}
            error="This is a required field"
        >
            {children}
        </Select>
    </Container>
    <Spacer />
    <Container>
        <Typography variant="h4">Disabled</Typography>
        <Select
            label="Select the best one"
            required
            placeholder="Select"
            onChange={logValue}
            disabled
        >
            {children}
        </Select>
    </Container>
</>
```

### Visual alternatives

```jsx
const Typography = require('../Typography').default;

const Spacer = ({height}) => <div style={{ height: 30 }} />;
const Container = ({ children }) => <div style={{ maxWidth: 400 }}>{children}</div>;

const children = [
            <option key={0} value={0}>Select</option>,
            <option key={1} value={1}>Johnny appleseed traveled the continent planting this type of tree</option>,
            <option key={2} value={2}>bananas</option>,
            <option key={3} value={3}>cherries</option>,
];
const logValue = (e) => { console.log(options[e.target.value - 1]); };

<>
    <Container>
        <Typography variant="h4">Small size variant</Typography>
        <Select
            sizeVariant="small"
            label="Select the best one"
            required
            placeholder="Select"
            hint="Hint: it's the best option"
            onChange={logValue}
        >
            {children}
        </Select>
    </Container>
    <Spacer />
    <Container>
        <Typography variant="h4">Left Label</Typography>
        <Select
            sizeVariant="small"
            label="Select the best one"
            required
            onChange={logValue}
            error="This is a required field"
            labelPosition="left"
        >
            {children}
        </Select>
    </Container>
    <Spacer />
    <Container>
        <Select
            label="Yum"
            border="underline"
            hint="Choose one you like"
            onChange={logValue}
            labelPosition="left"
        >
            {children}
        </Select>
    </Container>
    <Spacer />
    <Container>
        <Select
            label="Best Fruit"
            border="rounded"
            onChange={logValue}
            labelPosition="left"
        >
            {children}
        </Select>
    </Container>
</>
```

### Controlled Input

```jsx
const Button = require('../Button').default;
const Typography = require('../Typography').default;

const Spacer = () => <div style={{ width: 50 }} />;
const children = [
            <option key={0} value={0}>Select</option>,
            <option key={1} value={1}>apple</option>,
            <option key={2} value={2}>bananas</option>,
            <option key={3} value={3}>cherries</option>,
];

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.clearSelect = () => {
            this.setState({ value: 0 })
        };
        this.handleChange = (e) => {
            this.setState({ value: e.target.value });
        };
    }

    render() {
        return (
            <div style={{ display: 'flex' }}>
                <Select onChange={this.handleChange} placeholder="Select" value={this.state.value}>
                    {children}
                </Select>
                <Spacer/>
                <Typography style={{ whiteSpace: 'nowrap' }}>Value: {this.state.value}</Typography>
                <Spacer/>
                <Button onClick={this.clearSelect}>CLEAR</Button>
            </div>
        );
    }
}

<Example />
```
