### Implementation Notes
The TokenEx iFrame can be provided to the `TokenExFrame` component in order to provide peripheral form element styling and error visuals in the same pattern as other `FormField` elements. This includes label, hint, and error. These styles will be provided in accordance with the theme.

In order to provide styling directly to the TokenEx frame, a config object must be passed into the frame as outlined in the [TokenEx iFrame Styles documentation](https://docs.tokenex.com/?page=iframe#styling-the-iframe). A config object containing styles based on the components current configuration can be generated via the `generateTokenExFrameStyleConfig` function exported from `TokenExFrame/TokenExFrameStyleConfig`. 

### Examples
In these examples, a div is being styled using the config objects, in the manner described in [TokenEx iFrame Styles documentation](https://docs.tokenex.com/?page=iframe#styling-the-iframe).
```jsx
const styled = require('styled-components').default;
const baseTheme = require('../globals/baseTheme').default;
const CreditCard = require('../Icons/CreditCard').default;
const TextArea = require('../TextArea').default;
const { generateTokenExFrameStyleConfig } = require('./TokenExFrameStyleConfig');

/** 
 * NOTE: the iframe below represents a best-guess implementation of TokenEx iframe
 * based on the example at https://tokenexwebdemo.azurewebsites.net/
 */
const Container = ({ children }) => <div style={{ maxWidth: 400 }}>{children}</div>;
const Spacer = () => <div style={{ height: 20 }} />;

/** 
 * NOTE: If generating the config outside of the component, the baseTheme will be used by default
 * and no custom site themes applied. To correctly use it with theming, config should be generated
 * inside a component that provides theme using the `withTheme` HOC from `styled-components`.
 */
const configObj = generateTokenExFrameStyleConfig({theme: baseTheme});
const smallConfig = generateTokenExFrameStyleConfig({theme: baseTheme, sizeVariant: 'small'});
const styleConfig = JSON.stringify(configObj, undefined, 10);

const TheIframe = <iframe 
    src="/iframe.html" 
    style={{border: 0}}
    width="100%"
    height="100%"
/>;
const BaseDiv = styled.div([`${configObj.base} &:focus {${configObj.focus}}`]);
const ErrorDiv = styled.div([`${configObj.base} ${configObj.error}; outline: 0;`]);
const SmallBaseDiv = styled.div([`${smallConfig.base} &:focus {${smallConfig.focus}}`]);

<>
    <Container>
        <TokenExFrame 
            tokenExIFrameContainer={TheIframe} 
            label="Unstyled iframe"
        />
        <Spacer />
        <TokenExFrame 
            tokenExIFrameContainer={<BaseDiv tabIndex="0"/>} 
            label="Base styled frame"
            hint="it's your card, do what you want"
        />
        <Spacer />
        <TokenExFrame 
            tokenExIFrameContainer={<BaseDiv tabIndex="0"/>} 
            label="With Icon"
            iconProps={{src: CreditCard}}
        />
        <Spacer />
        <TokenExFrame 
            tokenExIFrameContainer={<ErrorDiv tabIndex="0"/>} 
            label="Error"
            error="Invalid card"
        />
        <Spacer />
        <TokenExFrame 
            disabled
            tokenExIFrameContainer={TheIframe} 
            label="Disabled"
        />
        <Spacer />
        <TokenExFrame 
            tokenExIFrameContainer={<BaseDiv tabIndex="0"/>} 
            label="Left Label"
            labelPosition="left"
        />
        <Spacer />
        <TokenExFrame 
            tokenExIFrameContainer={<SmallBaseDiv tabIndex="0"/>} 
            label="Small"
            sizeVariant="small"
        />
    </Container>
    <Spacer />
    <TextArea
        border="underline"
        disabled
        readOnly
        label="Styleconfig"
        rows={12}
        value={styleConfig}
    />
</>
```
