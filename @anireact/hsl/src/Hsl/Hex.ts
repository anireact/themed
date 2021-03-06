import { clamp, map, padStart, round, size, toLower } from '@anireact/prelude';
import { A, Hsla, Rgba } from './Components';
import { hslToRgb, rgbToHsl } from './Derived';

export const hslToHex = (hsla: Hsla, compact = true, alpha = true): string => {
    const [r, g, b, a = 1 as A] = hslToRgb(hsla);

    const wide = map(alpha ? [r, g, b, a] : [r, g, b], x => {
        return toLower(padStart(round(clamp(0, x, 1) * 255).toString(16), 2, '0'));
    }).join('');

    const narrow = compact
        ? wide.replace(/^(.)\1(.)\2(.)\3(?:(.)\4)?$/u, ({}, r, g, b, a) => {
              return `${r}${g}${b}${a || ''}`;
          })
        : wide;

    return `#${narrow}`;
};

export const hexToHsl = (hex: string) => {
    const re = /^#?(?:([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?|([\da-f])([\da-f])([\da-f])([\da-f])?)$/u;

    const result = re.exec(toLower(hex));

    if (!result) return [0, 0, 0, 1] as Hsla;

    const r = result[1] || result[5];
    const g = result[2] || result[6];
    const b = result[3] || result[7];
    const a = result[4] || result[8];

    return rgbToHsl(map([r, g, b, a], x => parseInt(size(x) === 1 ? x + x : x, 16)) as Rgba);
};
