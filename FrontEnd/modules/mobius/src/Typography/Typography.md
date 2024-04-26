### Example

```jsx
<>
    <Typography variant="h1">h1 Type Heading</Typography>
    <Typography variant="h2">h2 Type Heading</Typography>
    <Typography variant="h3">h3 Type Heading</Typography>
    <Typography variant="h4">h4 Type Heading</Typography>
    <Typography variant="h5">h5 Type Heading</Typography>
    <Typography variant="h6">h6 Type Heading</Typography>
    <Typography>Body text lorem ipsum</Typography>
</>
```

### Ellipsis

When the `ellipsis` attribute is used, the `title` attribute will be set to the text content of the component when it overflows its own bounds.

```jsx
const red = { background: 'hsl(0, 100%, 92%)' };
const green = { background: 'hsl(120, 90%, 85%)' };
const bounds = {
    display: 'inline-block',
    width: '12em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    verticalAlign: 'text-bottom'
};
<table>
    <tbody>
        <tr>
            <td>Unbounded, no ellipsis:</td>
            <td>
                <Typography style={red}>
                    Hover me - nothing happens.
                </Typography>
            </td>
        </tr>
        <tr>
            <td>Bounded, no ellipsis:</td>
            <td>
                <Typography style={{...red, ...bounds}}>
                    Hover me - nothing happens.
                </Typography>
            </td>
        </tr>
        <tr>
            <td>Unbounded, with ellipsis:</td>
            <td>
                <Typography ellipsis style={red}>
                    Hover me - nothing happens.
                </Typography>
            </td>
        </tr>
        <tr>
            <td>Bounded, with ellipsis:</td>
            <td>
                <Typography ellipsis style={{...green, ...bounds}}>
                    Hover me - Now you can read this really long piece of text!
                </Typography>
            </td>
        </tr>
    </tbody>
</table>
```

### Options

```jsx
const style = { marginLeft: 50 };
const Spacer = () => <div style={{display: 'block', height: '32px'}} />;

<div style={{display: 'grid', gridGap: 20}}>
    <section>
        <Typography variant="h4">Size</Typography>
        <div>
            <Typography size={15}>15 pixels</Typography>
            <Typography size={29} style={style}>29 pixels</Typography>
            <Typography size="72px" style={style}>72 pixels</Typography>
        </div>
    </section>
    <section>
        <Typography variant="h4" lineHeight={2}>Line Height</Typography>
        <div style={{display: 'flex', justifyContent: 'flex-start'}}>
            <Typography as="p" lineHeight={1.5} style={{ maxWidth: 340 }}>
                1.5 - Body paragraph text, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>
            <Typography as="p" lineHeight={2} style={{ maxWidth: 340, marginLeft: 50 }}>
                2 - Body paragraph text, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>
        </div>
    </section>
    <section>
        <Typography variant="h4" lineHeight={2}>Color</Typography>
        <div style={{display: 'flex'}}>
            <Typography color="primary">primary (from baseTheme)</Typography>
            <Typography color="#17A2B8" style={style}>#17A2B8 (CSS value)</Typography>
            <Typography color="palevioletred" style={style}>palevioletred (CSS value)</Typography>
        </div>
    </section>
    <section>
        <Typography variant="h4" lineHeight={2}>Weight</Typography>
        <div style={{display: 'flex'}}>
            <Typography weight={300}>300 weight</Typography>
            <Typography weight={400} style={style}>400 weight</Typography>
            <Typography weight={600} style={style}>600 weight</Typography>
            <Typography weight={700} style={style}>700 weight</Typography>
            <Typography weight={800} style={style}>800 weight</Typography>
        </div>
    </section>
    <section>
        <Typography variant="h4" lineHeight={2}>Italic</Typography>
        <div style={{display: 'flex'}}>
            <Typography>Normal</Typography>
            <Typography italic style={style}>Italic</Typography>
        </div>
    </section>
    <section>
        <Typography variant="h4" lineHeight={2}>Underline</Typography>
        <div style={{display: 'flex'}}>
            <Typography>Normal</Typography>
            <Typography underline style={style}>Underline</Typography>
        </div>
    </section>
    <section>
        <Typography variant="h4" lineHeight={2}>Transform</Typography>
        <div style={{display: 'flex'}}>
            <Typography>Normal</Typography>
            <Typography transform="uppercase" style={style}>uppercase</Typography>
        </div>
    </section>
    <section>
        <Typography variant="h4" lineHeight={2}>Font Family</Typography>
        <div style={{display: "flex"}}>
            <Typography size="18px" fontFamily="sans-serif">sans-serif</Typography>
            <Typography size="18px" fontFamily="Verdana, sans-serif" style={style}>Verdana, sans-serif</Typography>
            <Typography size="18px" fontFamily={"\"Open Sans\", Verdana, sans-serif"} style={style}>"Open sans", Verdana, sans-serif</Typography>
        </div>
        <Spacer />
        <div style={{display: "flex"}}>
            <Typography size="18px" fontFamily="serif">Serif</Typography>
            <Typography size="18px" fontFamily="Times, serif" style={style}>Times, serif</Typography>
            <Typography size="18px" fontFamily={"\"Lora\", Times, serif"} style={style}>"Lora", Times, serif</Typography>
        </div>
        <Spacer />
        <div style={{display: "flex"}}>
            <Typography size="18px" fontFamily="fantasy">Fantasy</Typography>
            <Typography size="18px" fontFamily="cursive" style={style}>Cursive</Typography>
            <Typography size="18px" fontFamily="monospace" style={style}>monospace</Typography>
        </div>
    </section>
</div>
```

### `as` versus `variant`

In a nutshell, `variant` defines the _style_ of the Typography component, while `as` defines the _type of DOM element_
to be rendered. Variants are defined in the theme and will render the equivalent DOM element when `as` is not defined.
The caveat here is that, if a variant is also the valid name for a DOM element (e.g. _body_), it is **necessary** to
define the `as` prop to avoid improper/invalid HTML.

```jsx
<Typography variant="h6">
    This renders as an &lt;h6&gt; element.
</Typography>
<Typography variant="h5" as="h6">
    This looks like an &lt;h5&gt;, but <em></em> really an &lt;h6&gt; element.
</Typography>
<Typography variant="body" as="div">
    Without <em>as="div"</em>, this would render as a &lt;body&gt;.
</Typography>
```
