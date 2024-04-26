### Example

```jsx
const Icon = require('../Icon').default;
const Search = require('../Icons/Search').default;
const css = require('styled-components').css

const customCss = css`
    margin-left: 20px;
`

<section style={{ display: 'flex' }}>
    <span>Not clickable</span>
    <Clickable onClick={() => alert('clicked!')} css={customCss}>
        <span>OnClick</span>
    </Clickable>
    <Clickable href="https://www.insitesoft.com" target="_blank" css={customCss}>
        <span>href</span>
    </Clickable>
    <Clickable href="https://www.insitesoft.com" target="_blank" onClick={() => alert('clicked!')} css={customCss}>
        <span>OnClick &amp; href</span>
    </Clickable>
    <Clickable onClick={() => alert('clicked!')} aria-label="Emoji example" css={customCss}>
        <Icon src={Search} />
    </Clickable>
</section>
```

### Extensibility
To modify the css of a certain instance of the component, pass your styles to the `css` property of the component.

The clickable can also be extended by theme. The theme surfaces a `focus` object through which 
focus outline attributes can be set, as well as a `defaultProps` object for the Clickable component.


```jsx
const css = require('styled-components').css
const ThemeProvider = require('../ThemeProvider').default;

const customCss = css` margin-left: 20px;`

<section style={{ display: 'flex' }}>

    <ThemeProvider theme={{focus: {color: 'grey', style: 'dashed', width: '1px'}}}>
        <Clickable onClick={() => {}}>
            <span>Themed with focus object</span>
        </Clickable>
    </ThemeProvider>
    <ThemeProvider theme={{clickable: { defaultProps: {css: css` &:hover {
        background-color: azure;
    } `}}}}>
        <Clickable onClick={() => {}} css={customCss} mergeCss>
            <span>Themed with default CSS </span>
        </Clickable>
    </ThemeProvider>
    <Clickable onClick={() => {}} css={css`
        border: 1px solid transparent;
        border-bottom: 1px solid red;
        transition: all .2s ease-in-out;
        margin-left: 20px;
        &:focus {
            border: 1px solid red;
            outline: none;
        }
        &:hover {
            color: red;
        }
    `}>
        <span>Instance overrides</span>
    </Clickable>
</section>
```
