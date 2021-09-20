# next-page-budget

Simple CLI, that lets you define your per page maximum size for JS in Next.js applications.

## Configuration

`next-page-budget` looks for configuration in the following order:
* `nextPageBudget` key in `package.json`
* `.next-page-budget.json`
* `.next-page-budget`
* `.next-page-budget.js`
* `.next-page-budget.cjs`

```json
{
  "compression": "gz",
  "pages": {
    "/auth": { "limit": "300 kB", "compression": "brotli" },
    "/profile": "500 kB"
  }
}
```

Compression can be:
* `gzip` or `gz` for gzip
* `brotli` or `br` for brotli
* `none` - without compression

When `compression` is not specified, `gzip` is used. Page's `compression` overwrites common setting.

## Run

In your Next.js project add new script to `package.json`:
```json
{
  "scripts": {
    "check-size": "next-page-budget"
  }
}
```

And then build your Next.js application:
```bash
node run-script build
node run-script check-size
```

## TODO

- [ ] Documentation
- [ ] Code style and linter
- [ ] Tests

## License

```
The MIT License

Copyright (c) 2021 Vitaly Baev <ping@baev.dev>, baev.dev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
