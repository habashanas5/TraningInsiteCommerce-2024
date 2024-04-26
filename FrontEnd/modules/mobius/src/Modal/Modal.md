### Basic Implementation

```jsx
const css = require('styled-components').css;
const Button = require('../Button').default;
const Typography = require('../Typography').default;

const logTargetValue = (e) => console.log(e.target.value)
class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({open: true});
    }

    closeModal() {
        this.setState({open: false});
    }

    render() {
        return (
            <>
                <Button onClick={this.openModal} shape="pill">Open Modal</Button>
                <Modal
                    isOpen={this.state.open}
                    handleClose={this.closeModal}
                    headline="I'm a pretty basic modal"
                    contentLabel="the basic modal">
                    <Typography variant="p">I'm a normal and pretty basic paragraph of text.</Typography>
                    <div style={{textAlign: 'right'}}>
                        <Button onclick={this.closeModal} css={css` margin-right: 10px; `} onClick={this.closeModal}>Okay</Button>
                        <Button variant="outline" color="secondary" onClick={this.closeModal}>Cancel</Button>
                    </div>
                </Modal>
            </>
        )
    }
}

<Example/>
```

### Implementation Examples

```jsx
const { keyframes, css } = require('styled-components');
const Button = require('../Button').default;
const Clickable = require('../Clickable').default;
const Radio = require('../Radio').default;
const RadioGroup = require('../RadioGroup').default;
const Select = require('../Select').default;
const TextField = require('../TextField').default;
const Typography = require('../Typography').default;

const logTargetValue = (e) => console.log(e.target.value)
class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({open: true});
    }

    closeModal() {
        this.setState({open: false});
    }

    render() {
        return (
            <>
                <Button onClick={this.openModal} css={ css` margin: 10px 10px 0 0; `}>{this.props.buttonText}</Button>
                <Modal
                    isOpen={this.state.open}
                    handleClose={this.closeModal}
                    headline={this.props.buttonText}
                    contentLabel="example modal"
                    sizeVariant="small"
                    buttons={[]}
                    {...this.props}>
                    {this.props.children}
                    {this.props.closeButtonInBody && <Button onClick={this.closeModal} sizeVariant="small" variant="outline" 
                    css={css` margin-bottom: 20px; `}
                    >
                        Close modal
                    </Button>}
                </Modal>
            </>
        )
    }
}
<>
    <Example 
        isCloseable={true} 
        buttonText={"Nested modals"}
    >
        <Typography variant="p">This modal has a button that opens another modal on top of itself</Typography>
        <Example buttonText="Child modal" sizeVariant="large" isCloseable={true}>
            <Typography variant="p">I'm a child modal</Typography>
        </Example>
    </Example>
    <Example 
        isCloseable 
        buttonText={"Long body"}
    >
        <Typography variant="h5">This modal has a scrolling body</Typography>
        <Typography variant="p">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur molestie, nibh in vehicula ultricies, nisi ante pretium quam, id consectetur dolor erat vitae nisi. Integer ultrices metus at dapibus aliquet. Vestibulum at odio iaculis, vulputate ex sed, hendrerit nulla. Vestibulum auctor nisi vel diam eleifend cursus. Etiam pellentesque aliquet ultricies. Nullam scelerisque sapien enim, at placerat velit vulputate non. Integer euismod dolor eget accumsan sollicitudin. Suspendisse potenti. Etiam tincidunt hendrerit enim, eu vehicula lorem. Mauris nec nulla id lectus pellentesque fermentum. Pellentesque eros ipsum, tempor fermentum maximus sed, interdum eget turpis.
        </Typography>
        <Typography variant="p">
        Aenean dapibus lacus suscipit dui elementum fermentum. Etiam at ipsum eu leo ullamcorper porttitor nec non dui. Donec commodo convallis massa a ullamcorper. Etiam vulputate ex nisi, id finibus metus auctor volutpat. Quisque non dui vitae sem suscipit condimentum. Aliquam efficitur pellentesque ex quis suscipit. Cras consequat, ante ac volutpat mattis, neque lorem elementum augue, a efficitur elit neque non ipsum. Nam bibendum vitae sapien rutrum scelerisque. Vivamus ac arcu nec neque venenatis blandit. Nulla facilisi. Pellentesque ligula ipsum, venenatis in nisi vel, mollis dapibus lacus. Proin eu varius nibh, non ultricies metus. Integer ut dolor mauris. Curabitur condimentum efficitur tortor fringilla vehicula. Aliquam placerat justo magna, id ullamcorper massa auctor vel.
        </Typography>
        <Typography variant="p">
        Cras interdum erat venenatis, vulputate magna vitae, rutrum est. Mauris faucibus velit felis, eu semper augue imperdiet sit amet. Etiam ac ultrices dolor. Maecenas dolor lacus, vulputate ac lobortis at, ultricies id sapien. Praesent pharetra tortor non elit congue, at placerat lorem rutrum. Nullam eleifend, ipsum sit amet pulvinar rhoncus, leo odio feugiat ante, vitae finibus ante ligula id sapien. Quisque id ultricies felis. Vivamus lobortis fermentum pretium. Sed a ornare erat. Cras convallis urna ut ante viverra dapibus. Nullam ut ex nisi.
        </Typography>
        <Typography variant="p">
        Maecenas facilisis ac nisi et efficitur. Aenean commodo sagittis nisi, in pellentesque nibh efficitur a. Nam sagittis velit in sapien scelerisque dapibus. Praesent lobortis, velit ut feugiat tincidunt, lectus dui fermentum odio, nec dapibus metus urna eu tellus. Quisque ac eros ullamcorper, sodales ante sit amet, varius eros. Morbi ut tortor tortor. Sed ac ullamcorper leo. Nullam iaculis velit ac purus sollicitudin laoreet. Maecenas vehicula facilisis felis id ornare. Vivamus maximus lacus eget rhoncus vehicula. In a dapibus sapien.
        </Typography>
        <Typography variant="p">
        Pellentesque pharetra justo vitae lectus suscipit, id tincidunt mauris vestibulum. Aliquam in mattis lacus. Donec vel odio quis elit cursus iaculis non in nulla. Vestibulum elementum metus felis, a ultricies ex malesuada id. Curabitur cursus neque id tortor pharetra pretium. Sed facilisis, nunc quis facilisis tincidunt, odio augue efficitur tellus, eget scelerisque mauris leo ut ante. Quisque varius augue non est efficitur, nec mollis est ornare. Nullam eleifend urna et nibh rutrum, ultrices posuere quam dignissim. Morbi quis magna ut sem posuere consequat. Maecenas luctus, mauris id congue aliquam, risus ipsum varius ante, vitae placerat nibh elit non purus. Etiam finibus vestibulum orci vel pretium. Suspendisse non dignissim dui. Aenean pretium, massa id maximus tincidunt, quam magna scelerisque nibh, non auctor sapien purus nec diam. Cras mauris nulla, tempor sed ante eu, mattis bibendum sapien. Aenean bibendum orci vitae nulla volutpat eleifend. Mauris placerat enim mauris, nec rutrum quam auctor vulputate.
        </Typography>
    </Example>
    <Example buttonText="With focusable children">
        <Clickable href="#">focusable link</Clickable>
        <div style={{ height: 20 }} />
        <TextField label="Name that song" hint="Hint: it was in that one movie"/>
        <Select
            label="Select the best one"
            required
            placeholder="Select"
            hint="Hint: it's the best option"
            onChange={logTargetValue}
            selectedIndex={1}>
            <option key={0} value={0}>Select</option>
            <option key={1} value={1}>apple</option>
            <option key={2} value={2}>bananas</option>
            <option key={3} value={3}>cherries</option>
        </Select>
        <RadioGroup
            label="Choose one"
            name="movie-2"
            onChangeHandler={logTargetValue}
            value="Blade Runner"
        >
            <Radio>Blade Runner</Radio>
            <Radio>Toy Story</Radio>
        </RadioGroup>
        <div style={{ height: 50 }} />
        <Button onClick={() => {}} css={css` margin-right: 10px; `}>focusable</Button>
        <Button onClick={() => {}}>and another</Button>
    </Example>
    <Example 
        isCloseable 
        buttonText={"Closeable"}
    >
        <Typography variant="p">This modal is fully closeable</Typography>
    </Example>
    <Example 
        isCloseable={false} 
        buttonText={"Not Closeable"}
        closeButtonInBody={true}
    >
        <Typography variant="p">This modal cannot be closed by the usual methods.</Typography>
    </Example>
    <Example 
        isCloseable={false} 
        buttonText={"Overlay only Close"}
        closeOnOverlayClick={true}
    >
        <Typography variant="p">This modal can be closed by clicking on the overlay, but doesn't have a close button and can't be closed with the escape key</Typography>
    </Example>
    <Example 
        isCloseable={true} 
        buttonText={"Only Close Button"}
        closeOnOverlayClick={false}
        closeOnEsc={false}
    >
        <Typography variant="p">This modal has a close button but cannot be closed by other means</Typography>
    </Example>
    <Example 
        isCloseable={true} 
        buttonText={"Customized Styles"}
        cssOverrides={{
            overlay: 'background-color: rgba(128,0,128, 0.4);',
            modalTitle: 'background-color: #9ee5df;',
            modalContent: 'color: purple;',
            headlineTypography: 'margin-bottom: 0; border-bottom: 1px solid purple;',
            titleButton: 'background: purple; border: none; height: 45px; svg {color: white;}'
        }}
        transition={{
            enabled: true,
            length: 700,
            overlayEntryKeyframes: keyframes(['from { margin-left: -1000px; } to { margin-left: 0px; }']),
            overlayExitKeyframes: keyframes(['from { margin-right: 0px; } to { margin-right: -1000px; }']),
            scrimEntryKeyframes: keyframes(['from { opacity: 0; } to { opacity: 1; }']),
            scrimExitKeyframes: keyframes(['from { opacity: 1; } to { opacity: 0; }']),
        }}
    >
        <Typography variant="p">Look how beautiful I am!</Typography>
    </Example>
</>
```

### SizeVariants and Size

```jsx
const css = require('styled-components').css;
const Button = require('../Button').default;
const Typography = require('../Typography').default;

const logTargetValue = (e) => console.log(e.target.value)
class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({open: true});
    }

    closeModal() {
        this.setState({open: false});
    }

    render() {
        let sizeVariant = this.props.name;
        let sizeProp = null;
        if (this.props.pixelSize) {
            sizeVariant = null;
            sizeProp = this.props.pixelSize;
        }
        return (
            <>
                <Button onClick={this.openModal} css={css` margin-right: 10px; `}>{this.props.name}</Button>
                <Modal
                    isOpen={this.state.open}
                    handleClose={this.closeModal}
                    sizeVariant={sizeVariant}
                    size={sizeProp}
                    headline={this.props.name}
                    isCloseable
                    contentLabel="example modal">
                    <Typography variant="p">{this.props.name} {this.props.pixelSize && 'wide'} paragraph of text full of fancy exciting things. Wow, I love it.</Typography>
                    {this.props.children}
                </Modal>
            </>
        )
    }
}
<>
    <Example name="small"></Example>
    <Example name="medium"></Example>
    <Example name="large"></Example>
    <Example name="238px" pixelSize={238} ></Example>
</>
```