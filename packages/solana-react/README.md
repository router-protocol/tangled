The @solana-mobile/wallet-adapter-mobile package has a faulty package.json file. The types field is not pointing to the correct location. The correct path should be
`"types": "./lib/types/index.d.ts"`

The updated package.json file should look like this:

```json
    ...

    "browser": {
        "./lib/cjs/index.js": "./lib/cjs/index.browser.js",
        "./lib/esm/index.js": "./lib/esm/index.browser.js"
    },
    "exports": {
        "./package.json": "./package.json",
        ".": {
            "import": "./lib/esm/index.js",
            "require": "./lib/cjs/index.js",
            "types": "./lib/types/index.d.ts"   <---- Correct path
        }
    },

    ...
```
