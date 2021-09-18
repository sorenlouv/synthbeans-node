# synthbeans-node

**Install dependencies**
```
yarn
```

Create config `./elastic-apm-node.js`:
```js
module.exports = {
  serviceName: 'my-service',
  secretToken: 'abc',
  serverUrl: 'apm-server-url',
};
```

**Run**
```
yarn start
```
