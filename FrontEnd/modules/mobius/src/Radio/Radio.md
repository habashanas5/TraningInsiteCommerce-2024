### Example

```jsx
const css = require('styled-components').css;
const GridContainer = require('../GridContainer').default;
const GridItem = require('../GridItem').default;
const RadioGroup = require('../RadioGroup').default;
const Typography = require('../Typography').default;

const logTargetValue = e => { console.log(e.target.value); };

<GridContainer>
    <GridItem width={[12,12,6,6,6]} css={css` display: block; `}>
        <Typography variant="h4">Default</Typography>
        <RadioGroup label="Choose one" name="movie-2" onChangeHandler={logTargetValue} value="Blade Runner">
            <Radio>Blade Runner</Radio>
            <Radio>Toy Story</Radio>
        </RadioGroup>
    </GridItem>
    <GridItem width={[12,12,6,6,6]} css={css` display: block; `}>
        <Typography variant="h4">Horizontal</Typography>
        <RadioGroup horizontal={true} label="Choose one" name="movie-2" onChangeHandler={logTargetValue} value="Blade Runner">
            <Radio>Blade Runner</Radio>
            <Radio>Toy Story</Radio>
        </RadioGroup>
    </GridItem>
    <GridItem width={[12,12,6,6,6]} css={css` display: block; `}>
        <Typography variant="h4">Disabled</Typography>
        <RadioGroup label="Choose one" name="movie-3" value="Blade Runner">
            <Radio disabled>Blade Runner</Radio>
            <Radio disabled>Toy Story</Radio>
        </RadioGroup>
    </GridItem>
</GridContainer>
```

### Smaller Size

```jsx
const css = require('styled-components').css;
const GridContainer = require('../GridContainer').default;
const GridItem = require('../GridItem').default;
const RadioGroup = require('../RadioGroup').default;
const Typography = require('../Typography').default;

const logTargetValue = e => { console.log(e.target.value); };

<GridContainer>
    <GridItem width={[12,12,6,6,6]} css={css` display: block; `}>
        <Typography variant="h4">Default</Typography>
        <RadioGroup sizeVariant="small" label="Choose one" name="movie-4" onChangeHandler={logTargetValue} value="Blade Runner">
            <Radio>Blade Runner</Radio>
            <Radio>Toy Story</Radio>
        </RadioGroup>
    </GridItem>
    <GridItem width={[12,12,6,6,6]} css={css` display: block; `}>
        <Typography variant="h4">Disabled</Typography>
        <RadioGroup sizeVariant="small" label="Choose one" name="movie-5" value="Blade Runner">
            <Radio disabled>Blade Runner</Radio>
            <Radio disabled>Toy Story</Radio>
        </RadioGroup>
    </GridItem>
</GridContainer>
```

### Controlled RadioGroup
The value and handler are shared between these `RadioGroup` and `Select` components.

```jsx
const css = require('styled-components').css;
const GridContainer = require('../GridContainer').default;
const GridItem = require('../GridItem').default;
const RadioGroup = require('../RadioGroup').default;
const Select = require('../Select').default;

const options = ['Blade Runner', 'Toy Story', 'Short Circuit'];

class ControlledRadioGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 'Toy Story' }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    render() {
        return (
            <GridContainer>
                <GridItem width={[12,12,6,6,6]} css={css` display: block; `}>
                    <RadioGroup label="Controlled Radio" name="movie-1" onChangeHandler={this.handleChange} value={this.state.value}>
                        {options.map(option => <Radio key={option}>{option}</Radio>)}
                    </RadioGroup>
                </GridItem>
                <GridItem width={[12,12,6,6,6]} css={css` display: block; `}>
                    <Select label="Controlled Select" onChangeHandler={this.handleChange} value={this.state.value} cssOverrides={{formField: 'margin-bottom: 20px;'}}>
                        {options.map(option => <option key={option} value={option}>{option}</option>)}
                    </Select>
                </GridItem>
            </GridContainer>
        );
    }
}

<ControlledRadioGroup />
```

### Style Extensibility

```jsx
const css = require('styled-components').css;
const ThemeProvider = require('../ThemeProvider').default;
const RadioGroup = require('../RadioGroup').default;
const globalTheme = require('../globals/baseTheme').default;

const Spacer = () => <div style={{ height: 50 }} />;
const logTargetValue = e => { console.log(e.target.value); };

const theme={
    ...globalTheme,
    fieldSet: {
        defaultProps: {
            sizeVariant: 'small',
            color: 'primary'
        }
    },
    radio: {
        defaultProps: {
            color: 'secondary',
        }
    }
};

<ThemeProvider theme={theme}>
    <RadioGroup name="movie-8" onChangeHandler={logTargetValue}>
        <Radio checked color="primary" typographyProps={{color: 'blue'}}>Blue Crush</Radio>
    </RadioGroup>
    <RadioGroup name="movie-7" onChangeHandler={logTargetValue}>
        <Radio checked>Blade Runner</Radio>
    </RadioGroup>
    <RadioGroup name="movie-6" onChangeHandler={logTargetValue}>
        <Radio checked color="orange" typographyProps={{css: css`background-color: red;`}}>Toy Story</Radio>
    </RadioGroup>
</ThemeProvider>
```
