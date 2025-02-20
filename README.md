# Etcher

> Flash OS images to SD cards & USB drives, safely and easily.

Etcher is a powerful OS image flasher built with web technologies to ensure
flashing an SDCard or USB drive is a pleasant and safe experience. It protects
you from accidentally writing to your hard-drives, ensures every byte of data
was written correctly, and much more. It can also directly flash Raspberry Pi devices that support [USB device boot mode](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#usb-device-boot-mode).

[![Current Release](https://img.shields.io/github/release/balena-io/etcher.svg?style=flat-square)](https://balena.io/etcher)
[![License](https://img.shields.io/github/license/balena-io/etcher.svg?style=flat-square)](https://github.com/balena-io/etcher/blob/master/LICENSE)
[![Balena.io Forums](https://img.shields.io/discourse/https/forums.balena.io/topics.svg?style=flat-square&label=balena.io%20forums)](https://forums.balena.io/c/etcher)

---

[**Download**][etcher] | [**Support**][support] | [**Documentation**][user-documentation] | [**Contributing**][contributing] | [**Roadmap**][milestones]

## Supported Operating Systems

- Linux; most distros; Intel 64-bit.
- Windows 10 and later; Intel 64-bit.
- macOS 10.13 (High Sierra) and later; both Intel and Apple Silicon.

## Installers

Refer to the [downloads page][etcher] for the latest pre-made
installers for all supported operating systems.

## Packages

#### Debian and Ubuntu based Package Repository (GNU/Linux x86/x64)

Package for Debian and Ubuntu can be downloaded from the [Github release page](https://github.com/balena-io/etcher/releases/)

##### Install .deb file using apt

   ```sh
      sudo apt install ./balena-etcher_******_amd64.deb
   ```

##### Uninstall

   ```sh
      sudo apt remove balena-etcher
   ```

#### Redhat (RHEL) and Fedora-based Package Repository (GNU/Linux x86/x64)

##### Yum

Package for Fedora-based and Redhat can be downloaded from the [Github release page](https://github.com/balena-io/etcher/releases/)

1. Install using yum

```sh
   sudo yum localinstall balena-etcher-***.x86_64.rpm
```

#### Arch/Manjaro Linux (GNU/Linux x64)

Etcher is offered through the Arch User Repository and can be installed on both Manjaro and Arch systems. You can compile it from the source code in this repository using [`balena-etcher`](https://aur.archlinux.org/packages/balena-etcher/). The following example uses a common AUR helper to install the latest release:

```sh
yay -S balena-etcher
```

##### Uninstall

```sh
yay -R balena-etcher
```

#### WinGet (Windows)

This package is updated by [gh-action](https://github.com/vedantmgoyal2009/winget-releaser), and is kept up to date automatically.

```sh
winget install balenaEtcher #or Balena.Etcher
```

##### Uninstall

```sh
winget uninstall balenaEtcher
```

#### Chocolatey (Windows)

This package is maintained by [@majkinetor](https://github.com/majkinetor), and
is kept up to date automatically.

```sh
choco install etcher
```

##### Uninstall

```sh
choco uninstall etcher
```
#### Scoop (Windows (PowerShell))

This package is maintained by Scoop Extras Bucket, and is kept up to date automatically.

```sh
scoop bucket add extras ( scoop installs git for buckets control)
scoop update
scoop install etcher
```
 
 #### Scoop Update Etcher (2 Methods) (Windows (PowerShell))
 ```sh
 scoop update (for update repository in buckets)
 First Method (Updates Etcher Only): scoop update etcher
 Second Method (Updates All Scoop Packages including Extcher): scoop update *
 ```
 
##### Uninstall

```sh
scoop uninstall etcher
```

## Support

If you're having any problem, please [raise an issue][newissue] on GitHub, and
the balena.io team will be happy to help.

## License

Etcher is free software and may be redistributed under the terms specified in
the [license].

[etcher]: https://balena.io/etcher
[electron]: https://electronjs.org/
[electron-supported-platforms]: https://electronjs.org/docs/tutorial/support#supported-platforms
[support]: https://github.com/balena-io/etcher/blob/master/docs/SUPPORT.md
[contributing]: https://github.com/balena-io/etcher/blob/master/docs/CONTRIBUTING.md
[user-documentation]: https://github.com/balena-io/etcher/blob/master/docs/USER-DOCUMENTATION.md
[milestones]: https://github.com/balena-io/etcher/milestones
[newissue]: https://github.com/balena-io/etcher/issues/new
[license]: https://github.com/balena-io/etcher/blob/master/LICENSE
