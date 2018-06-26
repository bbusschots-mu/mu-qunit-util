# @maynoothuniversity/mu-qunit-util

A universal module which provides utilities for use within
[QUnit](http://qunitjs.com/) test suites for
[Maynooth University](https://www.maynoothuniversity.ie/) (MU) JavaScript
projects.

This module is public purely so it can be used within MU's open source projects.
While it's free for anyone to use, it's not designed to be universally useful.

API Documentation is available at
[bbusschots-mu.github.io/mu-qunit-util](https://bbusschots-mu.github.io/mu-qunit-util/).

## Incorporation into Test Suite

This module can be used both from the CLI and in-browser.

### QUnit CLI (via NodeJS)

Install the module:

```
npm install --save-dev @maynoothuniversity/mu-qunit-util
```

To make this module available as `u` within the test suite add
`u:./node_modules/@maynoothuniversity/mu-qunit-util` to the `-d` flag for the
`qunit` binary.

The following is an example Node test script from `package.json`:

```
"test": "./node_modules/.bin/qunit -c SomeModule:./src/SomeModule.js -d is:./node_modules/is_js _:./node_modules/lodash u:./node_modules/@maynoothuniversity/mu-qunit-util -t ./test/tests.js"
```

### QUnit Web Interface

To use the module within QUnit's web interface include the version of the
module in the `build` folder into the page before including the test suite. This
will publish the module to the global variable `muQUnitUtil`. If the test suite
is expecting the module with a shorter alias like `u` that shoudl be done using
a separate script tag.

```
<script src="../node_modules/@maynoothuniversity/mu-qunit-util/build/muQUnitUtil.js"></script>
<script>
  const util = muQUnitUtil;
</script>
```