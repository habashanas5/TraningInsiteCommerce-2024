### Example

```jsx
<>
    <div>
        The following word "accessibility" should be readable on all platforms:
        <span style={{display: 'inline-block', background: '#eee', width: 110, height: '1.5em'}}>
            <strong>accessibility</strong>
        </span>
    </div>
    <br/>
    <div>
        The following word "assistive" should be readable only on assistive technologies:
        <span style={{display: 'inline-block', background: '#eee', width: 110, height: '1.5em'}}>
            <VisuallyHidden>assistive</VisuallyHidden>
        </span>
    </div>
</>
```
