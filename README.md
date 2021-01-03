# Paintbobs [![CircleCI](https://circleci.com/gh/torbjorv/paintbobs/tree/master.svg?style=svg)](https://circleci.com/gh/torbjorv/paintbobs/tree/master)

<div>
  <iframe id="inlineFrameExample"
      title="Inline Frame Example"
      width="300"
      height="200"
      src="https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik">
  </iframe>
</div>

### Deployments
[Prod](https://torbjorv.github.io/paintbobs) | 
[Dev](https://torbjorv.github.io/paintbobs/versions/latest) | 
[All](https://github.com/torbjorv/paintbobs/blob/gh-pages/versions/versions.md)


## How
init: 
    - texture = blank
loop:
    - render twirled texture + paint into 1024x1024 framebuffer
    - render framebuffer onto quad in final scene
    - copy framebuffer into texture

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
