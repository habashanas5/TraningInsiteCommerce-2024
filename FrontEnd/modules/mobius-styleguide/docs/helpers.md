
*******
### Closures for Interpolation
Styling via `styled-components` allows for any style string passed as a tagged template literal to [adapt based on props via interpolation](https://www.styled-components.com/docs/basics#adapting-based-on-props). This works via passing a function with an argument of `props` to the `${placeholder}`. The `theme` object is always available as a prop in any styled component, or to any React component wrapped in the `withTheme` HOC from `styled-components`. Therefore a function can access the theme in any function interpolated within a `styled-components` component, regardless of its presence on the React component implementing the styled component. 

The following are examples of closures that allow for simplified access to props and theme variables within a `styled-components` tagged template literal. Their basic structure is 
```js static
// closure definition
const closureExample = (argument) => (props) => {
    /*function using `argument` to access a value within `props`*/
    return props[argument];
};

// closure usage
const ComponentExample = styled.div`
    background: ${closureExample('theme.colors.primary')};
`;

// this is the equivalent of 
const VerboseComponentExample = styled.div`
    background: ${(props) => props['theme.colors.primary']};
`;
```

**NOTE:** These functions should _not_ be used *within* a function in a tagged template literal as they are closures and return a function. If this is necessary they must be called as `getProp('arg')(props)`

*******
#### getProp
This function is a closure to allow you to arbitrarily access props. This helper function returns a function that can be used to access styling props passed from a parent component into a rendered child component, or to access theme values. 

> **@param** *{string}* `path` The path to extract from the object. If path starts with "theme" and returns undefined, getProp tries to get the value from the baseTheme.  
> **@param** *{\*}* `defaultValue` A value to return if the path is undefined.  
> **@return** *{function}* A function that accepts component props and attempts to access the value at the path defined in outer function argument.  

```js static
import getProp from '../../mobius/src//utilities/getProp';

const Example = styled.div`
    height: ${getProp('size', '40')}px;
    width: ${getProp('size', '40')}px;
    border-color: ${getProp('theme.focus.color', '#09f')};
    box-shadow: ${getProp('theme.shadows.2')};
    font-family: ${getProp('theme.typography.body.fontFamily')};
    transition: all ${getProp('theme.transition.duration.regular', '300')}ms ease-in-out;
`;
```

*******
#### getColor
This function is a closure to allow you to access a path within the color object of the theme. It will return a function that returns the following in preferential order:
* `theme.colors[path]`
* `theme.colors[path].main`
* `path`

> **@param** *{string}* `path` The path to extract from `theme.color`.  
> **@return** *{function}* A function that accepts component props and attempts to access the color defined in the function argument.  

```js static
import getColor from '../../mobius/src//utilities/getColor';

/* 
 * given a theme: 
 * { colors: {
 *    primary: { main: 'rebeccapurple' },
 *    common: { border: 'steelgray' }, 
 * }};
*/

const ExampleDiv = styled.div`
    background: ${getColor('primary') /* returns rebeccapurple */}; 
    color: ${getColor('#ffffff') /* returns #ffffff */};
    border: 1px solid ${getColor('common.border') /* returns steelgray */};
`;
```

*******
### Logical helpers

These helpers are not closures, and thus can be used within code or within `styled-components` interpolation functions.

*******
#### resolveColor
This function allows you to access a path within the color object of the theme. It will return the following in preferential order:
* `theme.colors[path]`
* `theme.colors[path].main`
* `path`

> **@param** *{string}* `color` The color to pull from the theme. (e.g. "primary")  
> **@param** *{object}* `theme` The theme object to pull the color from. Defaults to the baseTheme.  
> **@return** *{string}* The color.  

```js static
import resolveColor from '../../mobius/src//utilities/resolveColor';

const ExampleDiv = styled.div`
    background: ${({ error, theme }) => (error ? resolveColor('danger', theme) : null)};
`;

<ExampleDiv error={true} /> // The background of this div will be the 'danger' color or not based on the error prop.
```

*******
#### getContrastColor
Reaches into the theme to evaluate whether there is a contrast color defined for the color argument. It will return the following in preferential order:
* `theme.colors[path].contrast`
* `theme.colors[path]Contrast`
* `common.background` or `common.backgroundContrast` based on the darkness of the common colors and the darkness of the color resolved by the argument.

> **@param** *{string}* `color` The color to pull contrast color for from the theme. (e.g. "primary").  
> **@param** *{object}* `theme` The theme object to pull the color from. Defaults to the baseTheme.  
> **@return** *{string}* The color.   

```js
const css = require('styled-components').css;
const GridContainer = require('../../mobius/src//GridContainer').default;
const GridItem = require('../../mobius/src//GridItem').default;
const resolveColor = require('../../mobius/src//utilities/resolveColor.ts').default;
const getContrastColor = require('../../mobius/src//utilities/getContrastColor').default;
const Typography = require('../../mobius/src//Typography').default;
const TextField = require('../../mobius/src//TextField').default;
const Select = require('../../mobius/src//Select').default;
const Tooltip = require('../../mobius/src//Tooltip').default;

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            value: 'common.accent',
            backgroundColor: resolveColor('common.accent'),
            textColor: getContrastColor('common.accent'),
         };
        this.clearSelect = () => {
            this.setState({ value: 0 })
        };
        this.handleChange = (e) => {
            const colorValue = e.target.value;
            let backgroundColor;
            let textColor;
            if (colorValue === '') {
                backgroundColor = resolveColor('common.background');
                textColor = getContrastColor('common.background');
            } else {
                backgroundColor = resolveColor(colorValue);
                textColor = getContrastColor(colorValue);
            }
            this.setState({ value: colorValue, backgroundColor, textColor });
        };
    }

    render() {
        return (
            <>
                <GridContainer>
                    <GridItem width={[12,12,6,6,6]} css={css` display: block; `}>
                        <TextField 
                            label={<>{"Type a color "}<Tooltip text="Any css color value or theme color path. IE: 'text.disabled', 'rebeccapurple', 'rgba(255,213,114,0.2)', '#bababa'" /></>}
                            onChange={this.handleChange} 
                            value={this.state.value} 
                        />
                    </GridItem>
                    <GridItem width={[1,1,1,1,1]} css={css` display: block; padding-top: 40px; text-align: center;`}>
                        <Typography>or</Typography>
                    </GridItem>
                    <GridItem width={[11,11,5,5,5]} css={css` display: block; `}>
                        <Select 
                            label={<>{"Select a color "}<Tooltip text="A selection of theme values that will be accepted" /></>}
                            onChange={this.handleChange} 
                            value={this.state.value} 
                        >
                            <option key={0} value={0}></option>
                            <option key={1} value={'primary'}>primary</option>
                            <option key={2} value={'secondary'}>secondary</option>
                            <option key={3} value={'common.background'}>common.background</option>
                            <option key={4} value={'text.main'}>common.accent</option>
                            <option key={5} value={'text.accent'}>text.main</option>
                            <option key={6} value={'success'}>success</option>
                            <option key={7} value={'danger'}>danger</option>
                            <option key={8} value={'warning'}>warning</option>
                            <option key={9} value={'info'}>info</option>
                        </Select>
                    </GridItem>
                    <GridItem width={[12,12,12,12,12]} css={css` display: block;`}>
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            background: this.state.backgroundColor,
                            padding: '40px',
                            margin: '20px',
                            outline: '1px solid #dedede',
                            outlineOffset: '4px'
                        }}>
                            <Typography variant="p" color={this.state.textColor}>
                                Background color: <code>resolveColor('{this.state.value}')</code>
                            </Typography>
                            <div style={{ height: 50 }} />
                            <Typography variant="p" color={this.state.textColor}>
                                Text color: <code>getContrastColor('{this.state.value}')</code>
                            </Typography>
                        </div>
                    </GridItem>
                </GridContainer>
            </>
        );
    }
}

<Example />
```

*******
#### get
Implementation of [lodash's get method](https://lodash.com/docs/4.17.11#get).

> **@param** *{Object}* `object` The object to query.  
> **@param** *{string|number|(string|number)[]}* `path` The path of the property to get.  
> **@param** *{\*}* `defaultValue` The value returned for `undefined` resolved values.  

```js static

```

*******
#### breakpointMediaQueries
See [Responsive Design](#!/Responsive)
