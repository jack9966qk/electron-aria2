import * as hd from 'humanize-duration'

// `import * as filesize` also works, but reported as error by tslint
// `import filesize` passes lint, but triggers error at runtime
import fsize = require('filesize')
export const filesize = fsize.partial({ spacer: "" })

export const humanizeDuration = hd.humanizer({
    delimiter: "",
    spacer: "",
    largest: 2,
    round: true,
    language: "shortEn",
    languages: {
        shortEn: {
            y: () => 'y',
            mo: () => 'mo',
            w: () => 'w',
            d: () => 'd',
            h: () => 'h',
            m: () => 'm',
            s: () => 's',
            ms: () => 'ms',
        }
    }
})