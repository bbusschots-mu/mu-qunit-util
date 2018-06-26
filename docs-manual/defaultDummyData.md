# Default Dummy Data

The set of default dummy data is defined as a local datastructure within the
`refreshDummyData()` function.

At the top level the data structure is organised by type. The list of types is
loosely based on the values returned by JavaScript's `typeof` operator. The
dummy data is grouped into the following types:

* `boolean`
* `number`
* `string`
* `array`
* `function`
* `error`
* `object` - dummy objects that are not arrays, functions, or errors.
* `other` - just `undefined` ATM.

Below types the dummy data is organised by *tag path*. A tag is a string with
no spaces or other punctuation, and a tag path is a string of tags separated by
dots. E.g. `integer.positive` is a tag path consisting of the tags `integer` and
`positive`.

The individual pieces of dummy data are represented as three-value arrays. The
first element in the array must be a description of the data as a string. The
second element must be an array of additional tags (beyond those included in
dummy data's the tag path). This array can be empty, but it must be present.
The third element of the array is the actual dummy data value.

The various functions for returning the dummy data query this data structure
based on both types and tags.

This datastructure should only be augmented with generic dummy data that is
relevant generally. Project-specific dummy data should be provided separately by
passing one or more data generators to the `refreshDummyData()` function.