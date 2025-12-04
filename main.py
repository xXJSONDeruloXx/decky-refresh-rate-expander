import os
import urllib.request
import ssl

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code repo
# and add the `decky-loader/plugin/imports` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky

# File paths
SCRIPT_DIR = os.path.expanduser("~/.config/gamescope/scripts/displays")
SCRIPT_FILE = os.path.join(SCRIPT_DIR, "valve.steamdeck.oled.expanded.lua")
SCRIPT_URL = "https://raw.githubusercontent.com/xXJSONDeruloXx/deck-refresh-rate-expander/main/valve.steamdeck.oled.expanded.lua"


class Plugin:
    async def install_refresh_rate(self) -> dict:
        """
        Install the expanded refresh rate script.
        Creates directory and downloads the lua script.
        Returns dict with success status and message.
        """
        try:
            # Create directory if it doesn't exist
            os.makedirs(SCRIPT_DIR, exist_ok=True)
            decky.logger.info(f"Created directory: {SCRIPT_DIR}")
            
            # Download the script using urllib (Python native)
            # Use unverified SSL context for GitHub raw content
            ssl_context = ssl.create_default_context()
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE
            
            with urllib.request.urlopen(SCRIPT_URL, context=ssl_context, timeout=30) as response:
                script_content = response.read()
            
            # Write the file
            with open(SCRIPT_FILE, 'wb') as f:
                f.write(script_content)
            
            decky.logger.info(f"Successfully installed refresh rate script to {SCRIPT_FILE}")
            return {"success": True, "message": "Refresh rate script installed successfully!"}
            
        except urllib.error.URLError as e:
            decky.logger.error(f"Download failed: {str(e)}")
            return {"success": False, "message": f"Download failed: {str(e)}"}
        except Exception as e:
            decky.logger.error(f"Installation failed: {str(e)}")
            return {"success": False, "message": f"Installation failed: {str(e)}"}

    async def uninstall_refresh_rate(self) -> dict:
        """
        Uninstall the expanded refresh rate script.
        Removes the lua script file.
        Returns dict with success status and message.
        """
        try:
            if os.path.exists(SCRIPT_FILE):
                os.remove(SCRIPT_FILE)
                decky.logger.info(f"Successfully removed {SCRIPT_FILE}")
                return {"success": True, "message": "Refresh rate script uninstalled successfully!"}
            else:
                decky.logger.info(f"Script file not found at {SCRIPT_FILE}")
                return {"success": True, "message": "Script was already uninstalled."}
                
        except Exception as e:
            decky.logger.error(f"Uninstallation failed: {str(e)}")
            return {"success": False, "message": f"Uninstallation failed: {str(e)}"}

    async def is_installed(self) -> bool:
        """Check if the refresh rate script is currently installed."""
        return os.path.exists(SCRIPT_FILE)

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        decky.logger.info("120 Hrtz Refresh Rate plugin loaded!")

    # Function called first during the unload process
    async def _unload(self):
        decky.logger.info("120 Hrtz Refresh Rate plugin unloaded!")
        pass

    # Function called after `_unload` during uninstall
    async def _uninstall(self):
        decky.logger.info("120 Hrtz Refresh Rate plugin uninstalled!")
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        pass
