### Example

```jsx
const Container = ({ children }) => <div style={{ maxWidth: 400 }}>{children}</div>;
const generateListItem = (name) => <span>{name}</span>;

const options = [
    {optionText: 'red', searchString: 'rouge reed redd read'},
    {optionText: 'orange', searchString: 'orag', disabled: true},
    {optionText: 'orangered', searchString: 'orag'},
    {optionText: 'yellow', searchString: 'yelloe yeallow', disabled: true},
    {optionText: 'green', searchString: 'gren grreen grren'},
    {optionText: 'blue'},
    {optionText: 'indigo', searchString: 'jean'},
    {optionText: 'violet', searchString: 'purple'},
];

<Container>
    <DynamicDropdown 
        options={options}
        cssOverrides={{dropdownWrapper: "margin-bottom: 25px;"}}
    />
    <DynamicDropdown 
        options={options}
        border="underline"
        cssOverrides={{dropdownWrapper: "margin-bottom: 25px;"}}
        />
    <DynamicDropdown
        options={options}
        selected="violet"
        sizeVariant="small"
    />
</Container>
```

### Controlled

```jsx
const {basicList} = require('./optionsLists.ts');
const Typography = require('../Typography').default;
const Button = require('../Button').default;

const Spacer = () => <div style={{ width: 50 }} />;

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 'orange' };
        this.clearSelect = () => {
            this.setState({ value: '' })
        };
        this.handleSelectionChange = (value) => {
            this.setState({ value });
        };
    }

    render() {
        return (
            <div style={{ display: 'flex' }}>
                <DynamicDropdown 
                    options={basicList}
                    selected={this.state.value}
                    onSelectionChange={this.handleSelectionChange}
                />
                <Spacer/>
                <Typography style={{ whiteSpace: 'nowrap' }}>Value: {this.state.value || 'empty'}</Typography>
                <Spacer/>
                <Button onClick={this.clearSelect}>CLEAR</Button>
            </div>
        );
    }
}

<Example />
```

### Custom Filter
This custom filter dynamic drop down uses a custom filter that is case-sensitive and only returns values that match from the beginning of the string.

It also has CSS overrides to grant you full control of styling.

By default, your CSS overrides, replace the theme CSS. 

If you would like to merge the your CSS with the theme, simply pass in `mergeCss={true}` or `mergeCss`.

```jsx
const {basicList} = require('./optionsLists.ts');
const Container = ({ children }) => <div style={{ maxWidth: 400 }}>{children}</div>;

const filter = () => (
    { optionText, searchString },
    input
) => {
    return optionText.substr(0, input.length) === input;
};  

<Container>
    <DynamicDropdown 
        label="Custom filter" 
        options={basicList} 
        filterOption={filter()} 
        cssOverrides={{
            option: css`
                display: flex;
                align-items: center;
                height: 30px;
                background: #222;
                color: #fff;
                text-transform: capitalize;
            `,
        }}
    />
    <DynamicDropdown label="Standard filter" options={basicList} />
</Container>
```

### Long list
```jsx
const {thousandWordsOptions} = require('./optionsLists.ts');
const Container = ({ children }) => <div style={{ maxWidth: 400 }}>{children}</div>;

<Container>
    <DynamicDropdown options={thousandWordsOptions}/>
</Container>
```

### Complex Rendering
```jsx
const {colors} = require('./optionsLists.ts');
const Icon = require('../Icon').default;
const Typography = require('../Typography').default;
const Box = require('../Icons/Box').default;
const ChevronDown = require('../Icons/ChevronDown').default;
const Trash2 = require('../Icons/Trash2').default;
const Clock = require('../Icons/Clock').default;
const FileText = require('../Icons/FileText').default;
const MoreHorizontal = require('../Icons/MoreHorizontal').default;
const User = require('../Icons/User').default;

const icons = [Box, ChevronDown, Trash2, Clock, FileText, MoreHorizontal, User];

const options = colors.map((color, index) => {
    return {
        optionText: color,
        optionValue: index,
        rowChildren: (<div key={color}>
            <Icon src={icons[index]} color={color}/>
            <Typography color={color}>{color}</Typography>
        </div>)
    }
})

const Container = ({ children }) => <div style={{ maxWidth: 400 }}>{children}</div>;

<Container>
    <DynamicDropdown options={options} selected={3}/>
</Container>
```

### Asynchronous
**Please note:** this is a rough asynchronous implementation. The dynamic dropdown component does not handle caching, debouncing, clearing in flight requests in favor of more recent requests, and other business-logic considerations of asynchronous searching. These data considerations should be handled by the parent component based on the use case in question.  
```jsx
const {thousandWordsOptions} = require('./optionsLists.ts');
const Typography = require('../Typography').default;
const Button = require('../Button').default;

const initalOptions = thousandWordsOptions.slice(0,5)

const createFilter = (inputValue) => ({optionText}) => {
    return optionText.indexOf(inputValue) > -1;
};

const pseudoFetchOptions = inputValue => {
    return new Promise(resolve => {
        return setTimeout(() => {
            resolve(thousandWordsOptions.filter(createFilter(inputValue)));
        }, 1000);
    });
}

const Spacer = () => <div style={{ width: 50 }} />;

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            inputValue: '', 
            isLoading: false,
            loadedOptions: initalOptions,
        };
        this.handleInputChange = (e) => {
            const inputValue = e.target.value;
            if (inputValue === '') {
                this.setState({
                    inputValue: null,
                    loadedOptions: initalOptions
                })
            } else {
                this.setState({
                    loadedOptions: [],
                    inputValue,
                    isLoading: true,
                }, () => pseudoFetchOptions(inputValue).then((newOptions) => {
                    this.setState({
                        loadedOptions: newOptions,
                        isLoading: false,
                    });
                }));
            }
        };
    }

    render() {
        return (
            <div style={{ display: 'flex' }}>
                <DynamicDropdown 
                    isLoading={this.state.isLoading}
                    onInputChange={this.handleInputChange}
                    options={this.state.loadedOptions}
                    moreOption={<Typography color="primary">search for more</Typography>}
                />
                <Spacer/>
                <Typography style={{ whiteSpace: 'nowrap' }}>input: {this.state.inputValue || 'empty'}</Typography>
                <Spacer/>
                <Typography style={{ whiteSpace: 'nowrap' }}>results: {this.state.loadedOptions.length}</Typography>
            </div>
        );
    }
}

<Example />
```
