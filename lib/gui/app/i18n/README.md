# i18n

## How it was done

Using the open-source lib [i18next](https://www.i18next.com/).

## How to add your own language

Use the locale codes mentioned in [the link](https://www.science.co.il/language/Locale-codes.php),
and we support styles as `fr`, `de`, `es-ES` and `pt-BR`. Replace all following `xx` with your locale code.

1. Go to `lib/gui/app/i18n`, copy a `.ts` file (preferably `en.ts`) and change its name to `xx.ts`.

2. Once done, go to `lib/gui/app/i18n.ts` and
   1. add a line of `import xx_translation from './i18n/xx'` after the already-added imports,
   2. add `xx: xx_translation` in the `resources` section of `i18next.init()` function and
   3. add `xx` to the `supportedLocales` array.

3. Now go to `lib/shared/catalina-sudo/` and
   1. copy the `sudo-askpass.osascript-en.js` file, change its name to `sudo-askpass.osascript-xx.js` and
   2. edit the `'balenaEtcher needs privileged access in order to flash disks.\n\nType your password to allow this.'`
   line and those `Ok`s and `Cancel`s to your own language.

4. If, your language has several variations when they are used in several countries/regions, such as `zh-CN` and `zh-TW`
   , or `pt-BR` and `pt-PT`, edit the `langParser()` in the `lib/gui/app/i18n.ts` file to meet your need.
   
5. Make a commit, and then a pull request on GitHub.
