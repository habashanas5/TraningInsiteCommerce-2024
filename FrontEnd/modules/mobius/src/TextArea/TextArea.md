### Example

```jsx
const { css } = require('styled-components');
const Spacer = () => <div style={{ height: 50 }} />;
const longContent= `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus gravida magna sed sollicitudin. Donec pretium pellentesque nibh, sit amet feugiat quam feugiat vel. Mauris tristique metus id ligula placerat, quis auctor magna sodales. Nunc nisi urna, tincidunt nec ligula at, fringilla condimentum risus. Vivamus et sagittis quam, vel ullamcorper nisi. Cras sed metus lacinia, congue nibh in, congue velit. Sed euismod sem at dapibus luctus. Aliquam sit amet suscipit tortor. Cras malesuada justo id magna consectetur convallis nec tincidunt dui. Etiam at tellus vel erat tempor dignissim. Aliquam tempor auctor sem eget cursus. Phasellus ut finibus dolor. Etiam et sodales dolor.

Cras fermentum in risus ut dignissim. Quisque dapibus scelerisque eros eget convallis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris eu mattis nisi. Nunc urna libero, posuere pulvinar maximus id, mattis in urna. Suspendisse luctus justo eu sapien congue, ac eleifend purus euismod. Duis dapibus massa risus, ut pharetra enim tempor accumsan. Nulla euismod dapibus enim, sit amet efficitur leo eleifend non. Etiam blandit nulla tortor. Mauris quis dictum leo, vel venenatis nunc. Integer consequat lorem eu pharetra blandit. Phasellus facilisis dui nec est venenatis eleifend. Sed orci felis, vestibulum ut urna quis, semper porta diam.

Maecenas euismod mauris tortor, quis eleifend erat gravida accumsan. Etiam sit amet tempor lorem. Maecenas tempor faucibus pulvinar. Etiam eu blandit eros. Maecenas a nibh tempus, pharetra turpis sed, malesuada sem. Vivamus efficitur, magna a sollicitudin aliquet, magna massa imperdiet risus, a varius leo purus non lorem. Aenean diam felis, tristique non accumsan vel, cursus ac mi. Etiam vel scelerisque diam.

Curabitur ut congue massa. Mauris bibendum pharetra justo, vitae suscipit ipsum sodales sit amet. Phasellus rhoncus augue et lorem laoreet pellentesque. Nunc maximus luctus turpis. Aliquam neque elit, pulvinar sit amet lacus et, pharetra iaculis quam. Maecenas consequat nec orci eu cursus. Maecenas ultrices nibh nulla, in lobortis lacus volutpat eu. Phasellus id felis elit. Ut at tellus sit amet erat rhoncus euismod. Sed sit amet felis iaculis, laoreet est et, sollicitudin arcu. Vivamus ut nibh libero. Maecenas ut nibh ac risus lobortis scelerisque quis ac diam. Aenean ac felis blandit, rutrum neque quis, consectetur mauris.

Vivamus mollis posuere dictum. Suspendisse dictum aliquam interdum. Phasellus eleifend tellus id mi maximus ultricies. Vestibulum tristique diam nec lorem ullamcorper venenatis. Nunc ex ligula, dapibus nec finibus sit amet, euismod ac est. Cras sed ullamcorper lorem. Etiam consectetur laoreet porttitor. Aenean tristique risus sit amet nunc ultricies tristique. Donec eu tincidunt enim, sit amet luctus sem. Suspendisse ante dolor, tempor pharetra velit ornare, viverra efficitur lacus. Pellentesque et volutpat quam.`;


<>
    <TextArea placeholder="Type some long content" label="Description"/>
    <Spacer />
    <TextArea placeholder="Custom CSS" css={css`background: tomato; color: #fff;`} label="Description"/>
    <Spacer />
    <TextArea rows="10" label="Description" defaultValue={longContent} border="underline" />
    <Spacer />
    <TextArea required label="Description" error="Please enter more than 200 characters." border="rounded" />
    <Spacer />
    <TextArea sizeVariant="small" label="Small" value={longContent} readOnly disabled/>
</>
```
