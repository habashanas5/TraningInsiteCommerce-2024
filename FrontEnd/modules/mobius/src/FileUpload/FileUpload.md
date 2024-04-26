### Example

```jsx
const Spacer = (props) => <div style={{ height: '25px'}} />;

<div style={{width: '450px'}}>
    <FileUpload label="Default" />
    <Spacer />
    <FileUpload label="Required" required placeholder="No file chosen"/>
    <Spacer />
    <FileUpload label="Disabled" disabled/>
    <Spacer />
    <FileUpload label="Small" sizeVariant="small" error="must be a jpg"/>
    <Spacer />
    <FileUpload label="Left label" labelPosition="left"/>
    <Spacer />
    <FileUpload label="No Button" hideButton hint="file upload hint"/>
    <Spacer />
    <FileUpload placeholder="no label"/>
</div>
```

### Customization

```jsx
const Upload = require('../Icons/Upload').default;
const Image = require('../Icons/Image').default;
const Spacer = (props) => <div style={{ height: '25px'}} />;

<div style={{width: '450px'}}>
    <FileUpload 
        label="Custom Button" 
        buttonProps={{
            variant: 'secondary',
            icon: {src: Image, position: 'left'}
        }} 
        iconProps={{src: false}}
        buttonText="New image" 
        border="underline"
    />
    <Spacer />
    <FileUpload label="Custom Icon" iconProps={{src: Upload}} border="rounded"/>
    <Spacer />
    <FileUpload 
        label="Function" 
        onFileChange={(event) => alert(`your file is called ${event.target.files[0].name}`)}
    />
</div>

```
