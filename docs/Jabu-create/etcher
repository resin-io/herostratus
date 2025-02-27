## Why is my drive not bootable?

Etcher copies images to drives byte by byte, without doing any transformation to the final device, which means images that require special treatment to be made bootable, like Windows images, will not work out of the box. In these cases, the general advice is to use software specific to those kind of images, usually available from the image publishers themselves. You can find more information [here](https://github.com/balena-io/etcher/blob/master/docs/USER-DOCUMENTATION.md#why-is-my-drive-not-bootable).

## How can I configure persistent storage?

Some programs, usually oriented at making GNU/Linux live USB drives, include an option to set persistent storage. This is currently not supported by Etcher, so if you require this functionality, we advise to fallback to [UNetbootin](https://unetbootin.github.io/).

## How do I flash Ubuntu ISOs

Ubuntu images (and potentially some other related GNU/Linux distributions) have a peculiar format that allows the image to boot without any further modification from both CDs and USB drives.
A consequence of this enhancement is that some programs, like parted get confused about the drive's format and partition table, printing warnings such as:

> /dev/xxx contains GPT signatures, indicating that it has a GPT table. However, it does not have a valid fake msdos partition table, as it should. Perhaps it was corrupted -- possibly by a program that doesn't understand GPT partition tables. Or perhaps you deleted the GPT table, and are now using an msdos partition table. Is this a GPT partition table? Both the primary and backup GPT tables are corrupt. Try making a fresh table, and using Parted's rescue feature to recover partitions.

> Warning: The driver descriptor says the physical block size is 2048 bytes, but Linux says it is 512 bytes.

All these warnings are safe to ignore, and your drive should be able to boot without any problems.
Refer to [the following message from Ubuntu's mailing list](https://lists.ubuntu.com/archives/ubuntu-devel/2011-June/033495.html) if you want to learn more.

## How do I run Etcher on Wayland?

The XWayland Server provides backwards compatibility to run any X client on Wayland, including Etcher.
This usually works out of the box on mainstream GNU/Linux distributions that properly support Wayland. If it doesn't, make sure the xwayland.so module is being loaded by declaring it in your [weston.ini](http://manpages.ubuntu.com/manpages/wily/man5/weston.ini.5.html):

```
[core]
modules=xwayland.so
```

## What are the runtime GNU/LINUX dependencies?

[This entry](https://github.com/balena-io/etcher/blob/master/docs/USER-DOCUMENTATION.md#runtime-gnulinux-dependencies) aims to provide an up to date list of runtime dependencies needed to run Etcher on a GNU/Linux system.

## How can I recover the broken drive?

Sometimes, things might go wrong, and you end up with a half-flashed drive that is unusable by your operating systems, and common graphical tools might even refuse to get it back to a normal state.
To solve these kinds of problems, we've collected [a list of fail-proof methods](https://github.com/balena-io/etcher/blob/master/docs/USER-DOCUMENTATION.md#recovering-broken-drives) to completely erase your drive in major operating systems.

## I receive "No polkit authentication agent found" error in GNU/Linux

Etcher requires an available [polkit authentication agent](https://wiki.archlinux.org/index.php/Polkit#Authentication_agents) in your system in order to show a secure password prompt dialog to perform elevation. Make sure you have one installed for the desktop environment of your choice.

## May I run Etcher in older macOS versions?

Etcher GUI is based on the [Electron](http://electron.atom.io/) framework, [which only supports macOS 10.10 and newer versions](https://github.com/electron/electron/blob/master/docs/tutorial/support.md#supported-platforms).

## Can I use the Flash With Etcher button on my site?

You can use the Flash with Etcher button on your site or blog, if you have an OS that you want your users to be able to easily flash using Etcher, add the following code where you want to button to be:

`<a href="https://efp.balena.io/open-image-url?imageUrl=<your image URL>"><img src="http://balena.io/flash-with-etcher.png" /></a>`
