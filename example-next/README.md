# Tangled Next.js Example

```
------
next.config.js
------
{
  ...
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  }
}

```
