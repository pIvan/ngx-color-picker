# ngx-color-picker
> Pure Angular color picker library.


[![npm version](https://badge.fury.io/js/%40iplab%2Fngx-color-picker.svg)](https://www.npmjs.com/package/@iplab/ngx-color-picker)

# Demo
The demo is available [here](https://pivan.github.io/ngx-color-picker/). It currently showcases the Chrome, Sketch, Compact, Github and Swatches pickers, including `ColorPickerControl` actions and standalone usage.


# Description

- It's an Angular color picker
- The current `22.0.0` release requires Angular 22; the demo includes compatibility information for previous releases
- The demo application uses Angular 22 and standalone bootstrap
- No external dependency
- Simple to configure
- Easy to use


# Tested with

- Firefox (latest)
- Chrome (latest)
- Chromium (latest)
- Edge


## Use in an Angular application

```shell
npm install @iplab/ngx-color-picker
```

Use the following snippet inside your app module:
```typescript
import { ColorPickerModule } from '@iplab/ngx-color-picker';
...
...

@NgModule({
    imports: [
        BrowserModule,
        ColorPickerModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

The demo application itself uses standalone bootstrap with `bootstrapApplication`.

Use the following snippet inside your template:
```html
<chrome-picker color="#fff"></chrome-picker>
```

### Theming

Picker components expose CSS custom properties on their host element. This allows
the appearance to be customized without targeting internal component markup:

```scss
my-settings chrome-picker {
    --ngx-color-picker-surface: #202124;
    --ngx-color-picker-border: #4b4d52;
    --ngx-color-picker-border-radius: 8px;
    --ngx-color-picker-shadow: 0 8px 24px rgb(0 0 0 / 25%);
    --ngx-color-picker-divider: #4b4d52;
    --ngx-color-picker-input-color: #d7d9dc;
}
```

Available theme properties include
```
--ngx-color-picker-width,
--ngx-color-picker-surface,
--ngx-color-picker-border,
--ngx-color-picker-border-radius,
--ngx-color-picker-shadow,
--ngx-color-picker-divider,
--ngx-color-picker-control-border,
--ngx-color-picker-input-label-color,
--ngx-color-picker-input-color,
--ngx-color-picker-input-secondary-color,
--ngx-color-picker-input-border-color
--ngx-color-picker-pencil-color,
and
--ngx-color-picker-pointer-shadow.
```

## Developing

### Built With: 
- Angular
- RxJS

### Setting up Dev

This project uses Angular 22 and the Angular CLI.

```shell
git clone https://github.com/pIvan/ngx-color-picker.git
cd ngx-color-picker/
npm install
npm run start
```
Open "http://localhost:4200" in browser


## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](https://github.com/pIvan/ngx-color-picker/tags).

## Tests
```shell
git clone https://github.com/pIvan/ngx-color-picker.git
cd ngx-color-picker/
npm install
npm run test
```

## Contributing

### Want to help?

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our [contributing guide](https://github.com/pIvan/ngx-color-picker/blob/master/CONTRIBUTING.md) and then check out one of our [issues](https://github.com/pIvan/ngx-color-picker/issues).



## Licensing

ngx-color-picker is freely distributable under the terms of the [MIT license](https://github.com/pIvan/ngx-color-picker/blob/master/LICENSE).
