Manual Testing
==============

This document describes a high-level script of manual tests to check for. We
should aim to replace items on this list with automated Spectron test cases.

Note that this should eventually be automated and move to the e2e tests.

Image Selection
---------------

- [ ] Cancel image selection dialog
- [ ] Select an unbootable image (without a partition table), and expect a
  sensible warning
- [ ] Attempt to select a ZIP archive with more than one image
- [ ] Attempt to select a tar archive (with any compression method)
- [ ] Change image selection
- [ ] Select a Windows image, and expect a sensible warning

Drive Selection
---------------

- [ ] Open the drive selection modal
- [ ] Switch drive selection
- [ ] Insert a single drive, and expect auto-selection
- [ ] Insert more than one drive, and don't expect auto-selection
- [ ] Insert a locked SD Card and expect a warning
- [ ] Insert a too small drive and expect a warning
- [ ] Put an image into a drive and attempt to flash the image to the drive
  that contains it
- [ ] Attempt to flash a compressed image (for which we can get the
  uncompressed size) into a drive that is big enough to hold the compressed
  image, but not big enough to hold the uncompressed version
- [ ] Enable "Unsafe Mode" and attempt to select a system drive
- [ ] Enable "Unsafe Mode", and if there is only one system drive (and no
  removable ones), don't expect autoselection

Image Support
-------------

Run the following tests with and without validation enabled:

- [ ] Flash an uncompressed image
- [ ] Flash a Bzip2 image
- [ ] Flash a XZ image
- [ ] Flash a ZIP image
- [ ] Flash a GZ image
- [ ] Flash a DMG image
- [ ] Flash an image whose size is not a multiple of 512 bytes
- [ ] Flash a compressed image whose size is not a multiple of 512 bytes
- [ ] Flash an archive whose image size is not a multiple of 512 bytes
- [ ] Flash an archive image containing a logo
- [ ] Flash an archive image containing a blockmap file
- [ ] Flash an archive image containing a manifest metadata file

Flashing Process
----------------

- [ ] Unplug the drive during flash or validation
- [ ] Click "Flash", cancel elevation dialog, and click "Flash" again
- [ ] Start flashing an image, try to close Etcher, cancel the application
  close warning dialog, and check that Etcher continues to flash the image

### Child Writer

- [ ] Kill the child writer process (i.e. with `SIGINT` or `SIGKILL`), and
  check that the UI reacts appropriately
- [ ] Close the application while flashing using the window manager close icon
- [ ] Close the application while flashing using the OS keyboard shortcut
- [ ] Close the application from the terminal using Ctrl-C while flashing
- [ ] Force kill the application (using a process monitor tool, etc)

In all these cases, the child writer process should not remain alive. Note that
in some systems you need to open your process monitor tool of choice with extra
permissions to see the elevated child writer process.

GUI
----

- [ ] Close application from the terminal using Ctrl-C while the application is
  idle
- [ ] Click footer links that take you to an external website
- [ ] Attempt to change image or drive selection while flashing
- [ ] Go to the settings page while flashing and come back
- [ ] Flash consecutive images without closing the application
- [ ] Remove the selected drive right before clicking "Flash"
- [ ] Minimize the application
- [ ] Start the application given no internet connection

Success Banner
--------------

- [ ] Click an external link on the success banner (with and without internet
  connection)

Elevation Prompt
----------------

- [ ] Flash an image as `root`/administrator
- [ ] Reject elevation prompt
- [ ] Put incorrect elevation prompt password
- [ ] Unplug the drive during elevation

Unmounting
----------

- [ ] Disable unmounting and flash an image
- [ ] Flash an image with a file system that is readable by the host OS, and
  check that is unmounted correctly

Analytics
---------

- [ ] Disable analytics, open DevTools Network pane or a packet sniffer, and
  check that no request is sent
- [ ] **Disable analytics, refresh application from DevTools (using Cmd-R or
  F5), and check that initial events are not sent to Amplitude**
