Etcher Architecture
===================

This document aims to serve as a high-level overview of how Etcher works,
specially oriented for contributors who want to understand the big picture.

Technologies
------------

This is a non exhaustive list of the major frameworks, libraries, and other
technologies used in Etcher that you should become familiar with:

- [Electron][electron]
- [NodeJS][nodejs]
- [Redux][redux]
- [ImmutableJS][immutablejs]
- [Sass][sass]
- [Mocha][mocha]
- [JSDoc][jsdoc]

Module architecture
-------------------

Instead of embedding all the functionality required to create a full-featured
image writer as a monolithic project, we try to hard to follow the ["lego block
approach"][lego-blocks].

This has the advantage of allowing other applications to re-use logic we
implemented for Etcher in their own project, even for things we didn't expect,
which leads to users benefiting from what we've built, and we're benefiting from
user's bug reports, suggestions, etc, as an indirect way to make Etcher better.

The fact that low-level details are scattered around many different modules can
make it challenging for a new contributor to wrap their heads around the
project as a whole, and get a clear high-level view of how things work or where
to submit their work or bug reports.

These are the main Etcher components, in a nutshell:

- [Drivelist](https://github.com/balena-io-modules/drivelist)

As the name implies, this module's duty is to detect the connected drives
uniformly in all major operating systems, along with valuable metadata, like if
a drive is removable or not, to prevent users from trying to write an image to
a system drive.

- [Etcher](https://github.com/balena-io/etcher)

This is the *"main repository"*, from which you're reading this from, which is
basically the front-end and glue for all previously listed projects.

Summary
-------

We always welcome contributions to Etcher as well as our documentation. If you
want to give back, but feel that your knowledge on how Etcher works is not
enough to tackle a bug report or feature request, use that as your advantage,
since fresh eyes could help unveil things that we take for granted, but should
be documented instead!

[lego-blocks]: https://github.com/sindresorhus/ama/issues/10#issuecomment-117766328
[exit-codes]: https://github.com/balena-io/etcher/blob/master/lib/shared/exit-codes.js
[gui-dir]: https://github.com/balena-io/etcher/tree/master/lib/gui
[electron]: http://electron.atom.io
[nodejs]: https://nodejs.org
[redux]: http://redux.js.org
[immutablejs]: http://facebook.github.io/immutable-js/
[sass]: http://sass-lang.com
[mocha]: http://mochajs.org
[jsdoc]: http://usejsdoc.org
