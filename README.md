# electron-aria2

A simple Aria2 client built using Electron, built for fun (and some web development practice).

The current version is built with a set up of:

- TypeScript for application code and transpiling
- React components for the UI, Redux for data flow
- Webpack to pack everything referenced from [app.tsx](./app/app.tsx) to a single file `./public/js/bundle.js` with source map
- Electron for OS level functionalities (run with `electron .`)

## Usage

To run a development copy:

```shell
npm install
npm start
```

Assumes `aria2c` command to be available on platforms other than Windows or macOS.

## Known Issues & Future Improvements

See "Issues" and "Projects" sections. Earlier progress is recorded in [this Trello board](https://trello.com/b/TIozvNgr/electron-aria2).
