|**Warning**: This code is behind the current state of the `dev` branch. If you want the current code, please build it yourself.|
|---|

# bibliothek

a few utility functions I won't use but wrote anyway lol.

## Installation

You can install the library with `npm install bibliothek` or `yarn add bibliothek` (prefered).  
Then you can import the library in your project:

```typescript
import * as lib from "bibliothek";

// your code goes here...
```

Or when using CommonJS:

```javascript
const lib = require("bibliothek");

// your code goes here...
```

## Building for Developers

1. you need to clone the repository: `git clone git@github.com:avolgha/bibliothek.git`
2. then you need to install the dependencies: `yarn`
3. now optionally, you can build the project with `yarn package`

Happy coding :)

> We added a script aswell, that helps us to build the release-ready bundles
> with copy right headers.  
> It is available via `yarn prepareRelease`.
>
> Now, it will generate two files in the `scripts/` directory, that can be
> uploaded as release assets.

### Code Style

We use 4 spaces of indentation in _all_ files.
To format, we run `prettier` with options specified in `.vscode/settings.json`.

Source files have to be included in `src/` directory, except added type
declarations.

## Support

If you want to contact me or you have a problem, you can write me
on Discord (`Marius#0686`) or write me an email: `avolgha@gmail.com`.
