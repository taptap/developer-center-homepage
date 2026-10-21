// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
import { FUNC_TYPE, OBJ_TYPE, UNKNOWN } from './constants';
import { has } from './utils';

export function rgxMapper(this: Record<string, string>, ua: string, arrays: any[]) {
  let i = 0;
  let j;
  let k;
  let p;
  let q;
  let matches;
  let match;

  // loop through all regexes maps
  while (i < arrays.length && !matches) {
    const regex = arrays[i]; // even sequence (0,2,4,..)
    const props = arrays[i + 1]; // odd sequence (1,3,5,..)
    j = k = 0;

    // try matching uastring with regexes
    while (j < regex.length && !matches) {
      matches = regex[j++].exec(ua);

      if (matches) {
        for (p = 0; p < props.length; p++) {
          match = matches[++k];
          q = props[p];
          // check if given property is actually array
          // eslint-disable-next-line valid-typeof -- Preserve constants used by the legacy mapper.
          if (typeof q === OBJ_TYPE && q.length > 0) {
            if (q.length === 2) {
              // eslint-disable-next-line valid-typeof -- Preserve legacy mapper comparison.
              if (typeof q[1] == FUNC_TYPE) {
                // assign modified match
                this[q[0]] = q[1].call(this, match);
              } else {
                // assign given value, ignore regex match
                this[q[0]] = q[1];
              }
            } else if (q.length === 3) {
              // check whether function or regex
              // eslint-disable-next-line valid-typeof -- Preserve constants used by the legacy mapper.
              if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                // call function (usually string mapper)
                this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
              } else {
                // sanitize match using given regex
                this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
              }
            } else if (q.length === 4) {
              this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
            }
          } else {
            this[q] = match || undefined;
          }
        }
      }
    }
    i += 2;
  }
}

export function strMapper(str: string, map: string[]) {
  for (const i in map) {
    // check if current value is array
    // eslint-disable-next-line valid-typeof -- Preserve constants used by the legacy mapper.
    if (typeof map[i] === OBJ_TYPE && map[i]!.length > 0) {
      for (let j = 0; j < map[i]!.length; j++) {
        if (has(map[i]![j]!, str)) {
          return i === UNKNOWN ? undefined : i;
        }
      }
    } else if (has(map[i]!, str)) {
      return i === UNKNOWN ? undefined : i;
    }
  }
  return str;
}
