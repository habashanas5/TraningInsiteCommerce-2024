### Example

```jsx
const DataTable = require('../DataTable').default;

class IntermittentLoader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: true };
        this.toggleLoader = () => {
            this.setState(({ loading })  => ({ loading: !loading }));
        }
    }

    componentDidMount() {
        setInterval(this.toggleLoader, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.toggleLoader);
    }

    render() {
        return (
            <LoadingOverlay loading={this.state.loading} spinnerProps={{ color: 'primary' }}>
                {this.props.children}
            </LoadingOverlay>
        );
    }
}

<IntermittentLoader>
    <DataTable
        headers={['Row #', 'Item #', 'QTY', 'U/M', 'Reason']}
        rows={[
            [1, 111111, 1, 'Each', 'Product not found.'],
            [32, 222222, 22, 'Case', 'Product not found.'],
            [81, 333333, 333, '', 'Product not found.']
        ]}
    />
</IntermittentLoader>
```
