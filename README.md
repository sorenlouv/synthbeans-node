# synthbeans-node

A tool to generate predictable APM data making it easier to spot calculation errors in APM ui. 

**Install dependencies**

```
yarn
```

Create config `./elastic-apm-node.js`:

```js
module.exports = {
  serverUrl: 'apm-server-url',
  secretToken: 'abc',
};
```

**Run**

```
yarn start
```

## Examples

Two transaction groups:
 - 4000ms / 100tpm / 90% failure rate
 - 1000ms / 200 tpm / 30% failure rate

![image](https://user-images.githubusercontent.com/209966/134345085-de196821-6370-4e40-891a-31ddb55c5007.png)

----

![image](https://user-images.githubusercontent.com/209966/134345101-09201a4c-7cf9-4e77-ad18-6cbb8a17601c.png)

----

![image](https://user-images.githubusercontent.com/209966/134345062-d49d0872-8dd5-4623-9af8-0403c344fbd0.png)

## Credits

Heavily inspired by [synthbeans-python](https://github.com/elastic/synthbeans-python)
