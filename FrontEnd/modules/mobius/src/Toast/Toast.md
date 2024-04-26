
### Example

```jsx
const css = require('styled-components').css;
const Button = require('../Button').default;
const Toaster = require('./Toaster').default;
const ToasterContext = require('./ToasterContext').default;

    <Toaster>
        <ToasterContext.Consumer>
            {({addToast}) => (
                <>
                    <Button
                        shape='rounded'
                        css={css` margin-right: 10px; `}
                        color='success'
                        onClick={() => addToast({
                            body: 'Item(s) added to your cart!',
                            messageType: 'success',
                        })}
                    >
                        Success
                    </Button>
                    <Button
                        shape='rounded'
                        css={css` margin-right: 10px; `}
                        color='danger'
                        onClick={() => addToast({
                            body: `Unable to calculate charges due to invalid address. 
                            Please update your information. And make sure to save on the account. 
                            Because if you don't it'll really not work.`,
                            messageType: 'danger',
                            timeoutLength: 9000
                        })}
                    >
                        Danger
                    </Button>
                    <Button
                        shape='rounded'
                        css={css` margin-right: 10px; `}
                        color='info'
                        onClick={() => addToast({
                            body: 'List saved without name.',
                            messageType: 'info',
                        })}
                    >
                        Info
                    </Button>
                    <Button
                        shape='rounded'
                        css={css` margin-right: 10px; `}
                        color='warning'
                        onClick={() => addToast({
                            body: 'Your cart will expire in 48 hours.',
                            messageType: 'warning',
                        })}
                    >
                        Warning
                    </Button>
                </>
            )}
        </ToasterContext.Consumer>
    </Toaster>
```

### Customization

```jsx
const css = require('styled-components').css;
const Button = require('../Button').default;
const Icon = require('../Icon').default;
const UploadCloud = require('../Icons/UploadCloud').default;
const Mic = require('../Icons/Mic').default;
const Music = require('../Icons/Music').default;
const ToastText = require('./Toast').ToastText;
const Toaster = require('./Toaster').default;
const ToasterContext = require('./ToasterContext').default;

const music = <Icon src={Music} size={14}/>;
const toastChildren = (
        <ToastText>{music}Purple{music}rain,{music}purple{music}rain.{music}</ToastText>
);

<Toaster position="bottom-right" mobilePosition="top">
    <ToasterContext.Consumer>
        {({addToast}) => (
            <>
                <Button
                    shape='rounded'
                    css={css` margin-right: 10px; `}
                    color='purple'
                    icon={{src: Mic, position: 'right'}}
                    onClick={() => addToast({
                        children: toastChildren,
                        messageType: 'success',
                        iconProps: {src: UploadCloud, color: 'purple'},
                        cssOverrides: {toast: 'border-color: purple;'},
                    })}
                >
                    Custom Toast
                </Button>
            </>
        )}
    </ToasterContext.Consumer>
</Toaster>
```