# 120 Hrtz Refresh Rate

Decky Loader plugin that installs or removes expanded refresh rate support for Steam Deck OLED.

It automates the process of enabling higher refresh rates on Steam Deck OLED by managing the required Lua script for gamescope.

## What it does

from [deck-refresh-rate-expander](https://github.com/xXJSONDeruloXx/deck-refresh-rate-expander).

- **Install**: Downloads `valve.steamdeck.oled.expanded.lua` to `~/.config/gamescope/scripts/displays/`
- **Uninstall**: Removes the lua script from that directory

A reboot is required after either action for changes to take effect.

## Development

### Dependencies

- Node.js v16.14+
- pnpm v9

```bash
sudo npm i -g pnpm@9
```

### Build

```bash
pnpm i
pnpm run build
```

### VSCode Tasks

Use the `setup`, `build`, and `deploy` tasks for streamlined development.

### Backend

Python backend handles file operations via `urllib` and `os` modules. No external dependencies required.
If your buildscript, makefile or any other build method does not place the binary files in the ``backend/out`` directory they will not be properly picked up during CI and your plugin will not have the required binaries included for distribution.

Example:  
In our makefile used to demonstrate the CI process of building and distributing a plugin backend, note that the makefile explicitly creates the `out` folder (``backend/out``) and then compiles the binary into that folder. Here's the relevant snippet.

```make
hello:
	mkdir -p ./out
	gcc -o ./out/hello ./src/main.c
```

The CI does create the `out` folder itself but we recommend creating it yourself if possible during your build process to ensure the build process goes smoothly.

Note: When locally building your plugin it will be placed into a folder called 'out' this is different from the concept described above.

The out folder is not sent to the final plugin, but is then put into a ``bin`` folder which is found at the root of the plugin's directory.  
More information on the bin folder can be found below in the distribution section below.

### Distribution

We recommend following the instructions found in the [decky-plugin-database](https://github.com/SteamDeckHomebrew/decky-plugin-database) on how to get your plugin up on the plugin store. This is the best way to get your plugin in front of users.
You can also choose to do distribution via a zip file containing the needed files, if that zip file is uploaded to a URL it can then be downloaded and installed via decky-loader.

**NOTE: We do not currently have a method to install from a downloaded zip file in "game-mode" due to lack of a usable file-picking dialog.**

Layout of a plugin zip ready for distribution:
```
pluginname-v1.0.0.zip (version number is optional but recommended for users sake)
   |
   pluginname/ <directory>
   |  |  |
   |  |  bin/ <directory> (optional)
   |  |     |
   |  |     binary (optional)
   |  |
   |  dist/ <directory> [required]
   |      |
   |      index.js [required]
   | 
   package.json [required]
   plugin.json [required]
   main.py {required if you are using the python backend of decky-loader: serverAPI}
   README.md (optional but recommended)
   LICENSE(.md) [required, filename should be roughly similar, suffix not needed]
```

Note regarding licenses: Including a license is required for the plugin store if your chosen license requires the license to be included alongside usage of source-code/binaries!

Standard procedure for licenses is to have your chosen license at the top of the file, and to leave the original license for the plugin-template at the bottom. If this is not the case on submission to the plugin database, you will be asked to fix this discrepancy.

We cannot and will not distribute your plugin on the Plugin Store if it's license requires it's inclusion but you have not included a license to be re-distributed with your plugin in the root of your git repository.
