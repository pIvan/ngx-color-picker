# ngx-color-picker
> Pure Angular color picker library.


[![npm version](https://badge.fury.io/js/%40iplab%2Fngx-color-picker.svg)](https://www.npmjs.com/package/@iplab/ngx-color-picker)
[![Build Status](https://travis-ci.org/pIvan/ngx-color-picker.svg?branch=master)](https://travis-ci.org/pIvan/ngx-color-picker)

# Demo
more detailed instructions can be found
[here](https://pivan.github.io/ngx-color-picker/)


# Description

- It's an Angular color picker
- Compatible with Angular 5+ versions
- No external dependency
- Simple to configure
- Easy to use


# Tested with

- Firefox (latest)
- Chrome (latest)
- Chromium (latest)
- Edge
- IE11


## Installing / Getting started

```shell
npm install @iplab/ngx-color-picker --save
```

Use the following snippet inside your app module: 
```shell
import { ColorPickerModule } from '@iplab/ngx-color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
...
...

@NgModule({
    imports: [
        BrowserModule,
        ColorPickerModule,
        BrowserAnimationsModule // or use NoopAnimationsModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

Use the following snippet inside your template: 
```shell
<chrome-picker [(color)]="#fff"></chrome-picker>
```


## Developing

### Built With: 
- Angular
- RxJS

### Setting up Dev

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0.


[Angular CLI](https://github.com/angular/angular-cli) must be installed before building ngx-color-picker project.

```shell
npm install -g @angular/cli
```

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

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0.


[Angular CLI](https://github.com/angular/angular-cli) must be installed before testing ngx-color-picker project.

```shell
npm install -g @angular/cli
```


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
