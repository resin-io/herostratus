Publishing Etcher
=================

This is a small guide to package and publish Etcher to all supported operating
systems.

Release Types
-------------

Etcher supports **pre-release** and **final** release types as does Github. Each is
published to Github releases.
The release version is generated automatically from the commit messasges.

Signing
-------

### OS X

1. Get our Apple Developer ID certificate for signing applications distributed
outside the Mac App Store from the balena.io Apple account.

2. Install the Developer ID certificate to your Mac's Keychain by double
clicking on the certificate file.

The application will be signed automatically using this certificate when
packaging for OS X.

### Windows

Since 2023, Microsoft requires all signing key to be store on hardware modules.
Because of this, we now use a cloud-hsm product to sign Etcher.
The required keys are set by balena operation on the Github CI.

The application will be signed automatically using the proper procss when
packaging for Windows.

Packaging
---------

Run the following command on each platform:

```sh
npm run make
```

This will produce all targets (eg. zip, dmg) specified in forge.config.ts for the
host platform and architecture.

The resulting artifacts can be found in `out/make`.


Publishing to Cloudfront
---------------------

We currently don't publish GNU/Linux Debian or Fedora packages.

Publishing to Homebrew Cask
---------------------------

1. Update [`Casks/etcher.rb`][etcher-cask-file] with the new version and
   `sha256`

2. Send a PR with the changes above to
   [`caskroom/homebrew-cask`][homebrew-cask]

Announcing
----------

[etcher-cask-file]: https://github.com/caskroom/homebrew-cask/blob/master/Casks/balenaetcher.rb
[homebrew-cask]: https://github.com/caskroom/homebrew-cask
[github-releases]: https://github.com/balena-io/etcher/releases

Updating EFP / Success-Banner
-----------------------------
Etcher Featured Project is automatically run based on an algorithm which promoted projects from the balena marketplace which have been contributed by the community, the algorithm prioritises projects which give users the best experience. Editing both EFP and the Etcher Success-Banner can only be done by someone from balena, instruction are on the [Etcher-EFP repo (private)](https://github.com/balena-io/etcher-efp)
