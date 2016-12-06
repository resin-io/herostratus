#!/bin/bash

###
# Copyright 2016 resin.io
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
###

set -u
set -e
set -x

function check_dep() {
  if ! command -v $1 2>/dev/null 1>&2; then
    echo "Dependency missing: $1" 1>&2
    exit 1
  fi
}

OS=$(uname)
if [[ "$OS" != "Linux" ]]; then
  echo "This script is only meant to be run in GNU/Linux" 1>&2
  exit 1
fi

check_dep upx
check_dep wget

function usage() {
  echo "Usage: $0"
  echo ""
  echo "Options"
  echo ""
  echo "    -n <application name>"
  echo "    -d <application description>"
  echo "    -p <application package>"
  echo "    -r <application architecture>"
  echo "    -b <application binary name>"
  echo "    -i <application icon (.png)>"
  echo "    -o <output>"
  exit 1
}

ARGV_APPLICATION_NAME=""
ARGV_DESCRIPTION=""
ARGV_PACKAGE=""
ARGV_ARCHITECTURE=""
ARGV_BINARY=""
ARGV_ICON=""
ARGV_OUTPUT=""

while getopts ":n:d:p:r:b:i:o:" option; do
  case $option in
    n) ARGV_APPLICATION_NAME="$OPTARG" ;;
    d) ARGV_DESCRIPTION="$OPTARG" ;;
    p) ARGV_PACKAGE="$OPTARG" ;;
    r) ARGV_ARCHITECTURE="$OPTARG" ;;
    b) ARGV_BINARY="$OPTARG" ;;
    i) ARGV_ICON="$OPTARG" ;;
    o) ARGV_OUTPUT="$OPTARG" ;;
    *) usage ;;
  esac
done

if [ -z "$ARGV_APPLICATION_NAME" ] \
  || [ -z "$ARGV_DESCRIPTION" ] \
  || [ -z "$ARGV_PACKAGE" ] \
  || [ -z "$ARGV_ARCHITECTURE" ] \
  || [ -z "$ARGV_BINARY" ] \
  || [ -z "$ARGV_ICON" ] \
  || [ -z "$ARGV_OUTPUT" ]
then
  usage
fi

TEMPORARY_DIRECTORY=$(mktemp -d)
OUTPUT_FILENAME="$ARGV_APPLICATION_NAME-linux-$ARGV_ARCHITECTURE.AppImage"

# Create AppDir
APPDIR_PATH=$TEMPORARY_DIRECTORY/${OUTPUT_FILENAME%.*}.AppDir
APPDIR_ICON_FILENAME=icon
rm -rf "$APPDIR_PATH"
mkdir -p "$APPDIR_PATH/usr/bin"

cat >"$APPDIR_PATH/$ARGV_APPLICATION_NAME.desktop" <<EOF
[Desktop Entry]
Name=$ARGV_APPLICATION_NAME
Exec=$ARGV_BINARY.wrapper
Comment=$ARGV_DESCRIPTION
Icon=$APPDIR_ICON_FILENAME
Type=Application
EOF

cp "$ARGV_ICON" "$APPDIR_PATH/$APPDIR_ICON_FILENAME.png"
cp -rf "$ARGV_PACKAGE"/* "$APPDIR_PATH/usr/bin"

# Compress binaries
upx -9 "$APPDIR_PATH/usr/bin/$ARGV_BINARY"

# upx fails with an error if .so are not executables
chmod +x "$APPDIR_PATH"/usr/bin/*.so*

# UPX fails for some reason with some other so libraries
# other than libnode.so in the x86 build
if [ "$ARGV_ARCHITECTURE" == "x86" ]; then
  upx -9 "$APPDIR_PATH"/usr/bin/libnode.so

else
  upx -9 "$APPDIR_PATH"/usr/bin/*.so*
fi

# Generate AppImage
rm -f "$ARGV_OUTPUT"

APPIMAGES_TAG=6
APPIMAGES_GITHUB_RELEASE_BASE_URL=https://github.com/probonopd/AppImageKit/releases/download/$APPIMAGES_TAG
APPIMAGEASSISTANT_PATH=$TMPDIR/AppImageAssistant.AppImage

./scripts/build/download-tool.sh -x \
  -u "https://raw.githubusercontent.com/probonopd/AppImageKit/$APPIMAGES_TAG/desktopintegration" \
  -c "bf321258134fa1290b3b3c005332d2aa04ca241e65c21c16c0ab76e892ef6044" \
  -o "$APPDIR_PATH/usr/bin/$ARGV_BINARY.wrapper"

if [ "$ARGV_ARCHITECTURE" == "x64"  ]; then
  APPIMAGES_ARCHITECTURE="x86_64"
  APPRUN_CHECKSUM=28b9c59facd7d0211ef5d825cc00873324cc75163902c48e80e34bf314c910c4
  APPIMAGEASSISTANT_CHECKSUM=e792fa6ba1dd81de6438844fde39aa12d6b6d15238154ec46baf01da1c92d59f
elif [ "$ARGV_ARCHITECTURE" == "x86"  ]; then
  APPIMAGES_ARCHITECTURE="i686"
  APPRUN_CHECKSUM=44a56d8a654891030bab57cee4670550ed550f6c63aa7d82377a25828671088b
  APPIMAGEASSISTANT_CHECKSUM=0faade0c009e703c221650e414f3b4ea8d03abbd8b9f1f065aef46156ee15dd0
else
  echo "Invalid architecture: $ARGV_ARCHITECTURE" 1>&2
  exit 1
fi

./scripts/build/download-tool.sh -x \
  -u "$APPIMAGES_GITHUB_RELEASE_BASE_URL/AppRun_$APPIMAGES_TAG-$APPIMAGES_ARCHITECTURE" \
  -c "$APPRUN_CHECKSUM" \
  -o "$APPDIR_PATH/AppRun"

./scripts/build/download-tool.sh -x \
  -u "$APPIMAGES_GITHUB_RELEASE_BASE_URL/AppImageAssistant_$APPIMAGES_TAG-$APPIMAGES_ARCHITECTURE.AppImage" \
  -c "$APPIMAGEASSISTANT_CHECKSUM" \
  -o "$APPIMAGEASSISTANT_PATH"

$APPIMAGEASSISTANT_PATH "$APPDIR_PATH" "$(dirname "$ARGV_OUTPUT")/$OUTPUT_FILENAME"
rm -rf "$APPDIR_PATH"

# Package AppImage inside a Zip to preserve the execution permissions
pushd "$(dirname "$ARGV_OUTPUT")"
zip "$(basename "$ARGV_OUTPUT")" "$OUTPUT_FILENAME"
rm -f "$OUTPUT_FILENAME"
popd
