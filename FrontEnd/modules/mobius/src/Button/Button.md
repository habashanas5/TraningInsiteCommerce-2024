### Example

```jsx

const Typography = require('../Typography').default;
const buttonPresentationProps = require('./presentationProps').default;

const Radio = ({ name, value, ...otherProps }) => (
    <label style={{ marginRight: 10 }}>
        <input type="radio" name={name} value={value} {...otherProps}/>
        {value}
    </label>
);

const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'custom'];
const sizeVariants = ['small', 'medium', 'large'];
const shapes = ['rectangle', 'rounded', 'pill'];
const buttonTypes = ['solid', 'outline'];
const hoverAnimations = [null, 'grow', 'shrink', 'float'];
const fieldsetStyle = { display: 'inline', border: '1px solid #ccc' };

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonType: 'solid',
            color: 'primary',
            hoverAnimation: null,
            hoverMode: 'darken',
            hoverStyle: null,
            activeMode: 'darken',
            activeStyle: null,
            shadow: false,
            shape: 'rectangle',
            sizeVariant: 'medium',
            size: null,
            typographyProps: buttonPresentationProps.typographyProps,
        }
        this.changeColor = this.changeColor.bind(this);
        this.changeButtonType = this.changeButtonType.bind(this);
        this.changeHoverAnimation = this.changeHoverAnimation.bind(this);
        this.changeHoverMode = this.changeHoverMode.bind(this);
        this.toggleHoverStyle = this.toggleHoverStyle.bind(this);
        this.changeActiveMode = this.changeActiveMode.bind(this);
        this.toggleActiveStyle = this.toggleActiveStyle.bind(this);
        this.toggleTypographyProps = this.toggleTypographyProps.bind(this);
        this.toggleShadow = this.toggleShadow.bind(this);
        this.changeShape = this.changeShape.bind(this);
        this.changeSizeVariant = this.changeSizeVariant.bind(this);
        this.customColor = React.createRef();
    }
    changeButtonType(e) {
        this.setState({ buttonType: e.target.value });
    }
    changeSizeVariant(e) {
        this.setState({ sizeVariant: e.target.value });
    }
    changeColor(e) {
        let color = e.target.value;
        if (e.target.value === 'custom') color = this.customColor.current.value;
        this.setState({ color });
    }
    changeHoverAnimation(e) {
        this.setState({ hoverAnimation: e.target.value || null });
    }
    changeHoverMode(e) {
        this.setState({ hoverMode: e.target.value });
    }
    changeActiveMode(e) {
        this.setState({ activeMode: e.target.value });
    }
    toggleHoverStyle(e) {
        if (this.state.hoverStyle) {
            this.setState({ hoverStyle: null });
        } else {
            this.setState({ hoverStyle: { transform: "scale(1.1) rotate(-5deg)", transition: 'all .2s ease', outline: 'none' } });
        }
    }
    toggleActiveStyle(e) {
        if (this.state.activeStyle) {
            this.setState({ activeStyle: null });
        } else {
            this.setState({ activeStyle: { transform: "scale(1.05) rotate(-2.5deg)", transition: 'all 0s ease', outline: 'none' } });
        }
    }
    toggleTypographyProps(e) {
        if (this.state.typographyProps === buttonPresentationProps.typographyProps) {
            this.setState({ typographyProps: { transform: 'uppercase', weight: 400 }});
        } else {
            this.setState({ typographyProps: buttonPresentationProps.typographyProps });
        }
    }
    toggleShadow(e) {
        this.setState(({ shadow }) => ({ shadow: !shadow }));
    }
    changeShape(e) {
        this.setState({ shape: e.target.value });
    }
    render() {
        return (
            <>
                <Typography variant="h3">Button Builder</Typography>
                <header style={{ marginBottom: 20 }}>
                    <fieldset style={fieldsetStyle}>
                        <legend>buttonType</legend>
                        {buttonTypes.map(buttonType => (
                            <Radio
                                name="type"
                                key={buttonType}
                                value={buttonType}
                                onChange={this.changeButtonType}
                                checked={this.state.buttonType === buttonType}
                            />
                        ))}
                    </fieldset>
                    <fieldset style={fieldsetStyle}>
                        <legend>shape</legend>
                        {shapes.map(shape => (
                            <Radio
                                name="shape"
                                key={shape}
                                value={shape || 'default'}
                                onChange={this.changeShape}
                                checked={this.state.shape === shape}
                            />
                        ))}
                    </fieldset>
                    <fieldset style={fieldsetStyle}>
                        <legend>Size Variant</legend>
                        {sizeVariants.map(sizeVariant => (
                            <Radio
                                name="sizeVariant"
                                key={sizeVariant}
                                value={sizeVariant}
                                onChange={this.changeSizeVariant}
                                checked={this.state.sizeVariant === sizeVariant}
                            />
                        ))}
                    </fieldset>
                    <fieldset style={fieldsetStyle}>
                        <legend>shadow</legend>
                        <input type="checkbox" onClick={this.toggleShadow}/>
                    </fieldset>
                    <fieldset style={fieldsetStyle}>
                        <legend>typographyProps</legend>
                        <input type="checkbox" onClick={this.toggleTypographyProps}/>
                        <code style={{ whiteSpace: 'pre', fontSize: '.75em' }}>
                            {`{ weight: 400,\ntransform: 'uppercase' }`}
                        </code>
                    </fieldset>
                    <fieldset style={fieldsetStyle}>
                        <legend>color</legend>
                        {colors.map(color => (
                            <Radio
                                name="color"
                                key={color}
                                value={color}
                                onChange={this.changeColor}
                                checked={colors.includes(this.state.color) ? this.state.color === color : color === 'custom'}
                            />
                        ))}
                        <input type="text" ref={this.customColor} onInput={this.changeColor} />
                    </fieldset>
                    <fieldset style={fieldsetStyle}>
                        <legend>hoverMode</legend>
                        <Radio
                            name="hoverMode"
                            value="darken"
                            onChange={this.changeHoverMode}
                            checked={this.state.hoverMode === 'darken'}
                        />
                        <Radio
                            name="hoverMode"
                            value="lighten"
                            onChange={this.changeHoverMode}
                            checked={this.state.hoverMode === 'lighten'}
                        />
                    </fieldset>
                    <fieldset style={fieldsetStyle}>
                        <legend>activeMode</legend>
                        <Radio
                            name="activeMode"
                            value="darken"
                            onChange={this.changeActiveMode}
                            checked={this.state.activeMode === 'darken'}
                        />
                        <Radio
                            name="activeMode"
                            value="lighten"
                            onChange={this.changeActiveMode}
                            checked={this.state.activeMode === 'lighten'}
                        />
                    </fieldset>
                    <fieldset style={fieldsetStyle}>
                        <legend>hoverAnimation</legend>
                        {hoverAnimations.map(hoverAnimation => (
                            <Radio
                                name="hoverAnimation"
                                key={hoverAnimation}
                                value={hoverAnimation || 'none'}
                                onChange={this.changeHoverAnimation}
                                checked={this.state.hoverAnimation === hoverAnimation}
                            />
                        ))}
                    </fieldset>
                    <fieldset style={fieldsetStyle}>
                        <legend>hoverStyle</legend>
                        <input type="checkbox" onClick={this.toggleHoverStyle}/>
                        <code style={{ whiteSpace: 'pre', fontSize: '.75em' }}>
                            {`{ transform: 'scale(1.1) rotate(-5deg)',\ntransition: 'all .2s ease',\noutline: 'none' }`}
                        </code>
                    </fieldset>
                    <fieldset style={fieldsetStyle}>
                        <legend>activeStyle</legend>
                        <input type="checkbox" onClick={this.toggleActiveStyle}/>
                        <code style={{ whiteSpace: 'pre', fontSize: '.75em' }}>
                            {`{ transform: 'scale(1.05) rotate(-2.5deg)',\ntransition: 'all 0s ease',\noutline: 'none' }`}
                        </code>
                    </fieldset>
                </header>
                <Button
                    buttonType={this.state.buttonType}
                    color={this.state.color}
                    hoverAnimation={this.state.hoverAnimation}
                    hoverMode={this.state.hoverMode}
                    hoverStyle={this.state.hoverStyle}
                    activeMode={this.state.activeMode}
                    activeStyle={this.state.activeStyle}
                    shadow={this.state.shadow}
                    shape={this.state.shape}
                    typographyProps={this.state.typographyProps}
                >
                    Button
                </Button>
            </>
        );
    }
}

<Example />
```

### Variants
``` jsx
const css = require('styled-components').css;

<>
    <Button variant="primary">Primary Button Variant</Button>
    <Button variant="secondary" css={css` margin-left: 10px; `}>Secondary Button Variant</Button>
    <Button variant="tertiary" css={css` margin-left: 10px; `}>Tertiary Button Variant</Button>
</>
```

### Options
```jsx
const css = require('styled-components').css;
const { ButtonIcon } = require('./Button');
const Icon = require('../Icon').default;
const Typography = require('../Typography').default;
const User = require('../Icons/User').default;
const Search = require('../Icons/Search').default;
const MapPin = require('../Icons/MapPin').default;
const File = require('../Icons/File').default;

const Container = ({ children }) => (
    <div style={{ margin:'30px 0', display:'flex', alignItems:'center' }}>{children}</div>
);
const style = { marginLeft: 50 };

<>
    <Typography variant="h4">Color &amp; Type</Typography>
    <Container>
        <Button color="primary">Primary Solid</Button>
        <Button disabled style={style}>Disabled</Button>
        <Button color="primary" buttonType="outline" style={style}>Primary Outline</Button>
        <Button disabled buttonType="outline" style={style}>Disabled</Button>
    </Container>
    <Container>
        <Button color="secondary">Secondary Solid</Button>
        <Button disabled style={style}>Disabled</Button>
        <Button color="secondary" buttonType="outline" style={style}>Secondary Outline</Button>
        <Button disabled buttonType="outline" style={style}>Disabled</Button>
    </Container>
    <Typography variant="h4">Shape</Typography>
    <Container>
        <Button>Default</Button>
        <Button shape="rounded" style={style}>Rounded</Button>
        <Button shape="pill" style={style}>Pill</Button>
    </Container>
    <Typography variant="h4">Shadow</Typography>
    <Container>
        <Button shadow>Shadow</Button>
    </Container>
    <Typography variant="h4">Color</Typography>
    <Container>
        <Button color="#17A2B8">#17A2B8</Button>
    </Container>
    <Typography variant="h4">Size Variant</Typography>
    <Container>
        <Button sizeVariant="small">Small</Button>
        <Button sizeVariant="medium" style={style}>Medium</Button>
        <Button sizeVariant="large" style={style}>Large</Button>
    </Container>
    <Typography variant="h4">Size</Typography>
    <Container>
        <Button size={64} shape="pill" typographyProps={{ size: 30 }} css={css` padding: 0 1em; `}>64</Button>
    </Container>
    <Typography variant="h4">Typography</Typography>
    <Container>
        <Button typographyProps={{ transform: 'uppercase', italic: true }}>Button Text</Button>
    </Container>
    <Typography variant="h4">Icon</Typography>
    <Typography variant="p">
        Please note, when passing an icon as a child of a button, in order for it to receive styling from the button, it must be passed as a `ButtonIcon` as imported from the `Button` component.
    </Typography>
    <Container>
        <Button sizeVariant="small" variant="primary" disabled icon={{ src: User, position: 'left' }}>Small</Button>
        <Button sizeVariant="medium" variant="secondary" icon={{ src: MapPin, position: 'right' }} style={style}>Medium</Button>
        <Button sizeVariant="large" icon={{ src: File, position: 'left' }} style={style}>Large</Button>
        <Button size={45} style={style} variant="secondary" shape="pill" css={css` padding: 0 1em; `}>
            <ButtonIcon src={Search} color="danger"/>
        </Button>
        <Button size={45} style={style} variant="secondary" shape="pill" css={css` padding: 0 1em; `}>
            <Icon src={Search} color="danger" />
        </Button>
    </Container>
    <Typography variant="h4">Hover Animation</Typography>
    <Container>
        <Button hoverAnimation="grow">Grow</Button>
        <Button hoverAnimation="shrink" style={style}>Shrink</Button>
        <Button hoverAnimation="float" style={style}>Float</Button>
    </Container>
    <Typography variant="h4">Hover Mode &amp; Style</Typography>
    <Container>
        <Button hoverMode="darken">Darken</Button>
        <Button hoverMode="lighten" style={style}>Lighten</Button>
        <Button hoverStyle={{
            boxShadow: '0 5px 5px #ccc',
            background: '#ffc107',
            borderColor: '#ffc107',
            transition: 'all .2s ease'
        }} style={style}>
            Custom
        </Button>
        <Button hoverMode="darken" buttonType="outline" style={style}>Darken</Button>
        <Button hoverMode="lighten" buttonType="outline" style={style}>Lighten</Button>
        <Button hoverStyle={{
            boxShadow: '0 5px 5px #ddd, inset 0 5px 5px #ddd',
            textShadow: '0 5px 5px #ddd',
            color: '#ffc107',
            borderColor: '#ffc107',
            transition: 'all .2s ease'
        }} buttonType="outline" style={style}>
            Custom
        </Button>
    </Container>
</>
```
