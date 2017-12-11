# Budget Home

A small app to follow our home budget. Based on VUE 2.0 and Quasar with graphCool and google auth.

## Build Setup
``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ quasar dev

# build for production with minification
$ quasar build
```

## GraphCool setup
You need an account at graphCool. In the serverGraphQL directory:
``` bash
gc deploy
```
and follow the directions, choose the server to deploy. At the end of the process, several address are given. Copy the simple API address: "https://api.graph.cool/simple/v1/__YOUR_GRAPHCOOL_CRENDENTIAL__". It will be needed at the next step.

## Need additional files
Two files are needed for the configuration: /src/constants/googleCredentials.js
``` javascript
export default function () {
  if (DEV) {
    // this code block gets executed only in Dev mode
    return '__YOUR_DEV_CREDENTIAL__.apps.googleusercontent.com'
  }
  if (PROD) {
    // this code block gets executed only in Production mode
    return '__YOUR_PROD_CREDENTIAL__.apps.googleusercontent.com'
  }
}
```
and /src/constants/graphCoolURI.js:
```
export const graphCoolURI = 'https://api.graph.cool/simple/v1/__YOUR_GRAPHCOOL_CRENDENTIAL__'
```



