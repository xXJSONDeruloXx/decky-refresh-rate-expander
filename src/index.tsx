import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  staticClasses,
  ConfirmModal,
  showModal
} from "@decky/ui";
import {
  callable,
  definePlugin,
  toaster,
} from "@decky/api"
import { useState, useEffect } from "react";
import { FaDisplay } from "react-icons/fa6";

// Backend callable functions
const installRefreshRate = callable<[], { success: boolean; message: string }>("install_refresh_rate");
const uninstallRefreshRate = callable<[], { success: boolean; message: string }>("uninstall_refresh_rate");
const isInstalled = callable<[], boolean>("is_installed");

function showRebootModal(action: "install" | "uninstall") {
  showModal(
    <ConfirmModal
      strTitle="Reboot Required"
      strDescription={`The refresh rate script has been ${action === "install" ? "installed" : "uninstalled"} successfully. Please reboot your Steam Deck to apply the changes.`}
      strOKButtonText="OK"
      bAlertDialog={true}
    />
  );
}

function Content() {
  const [installed, setInstalled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Check installation status on mount
  useEffect(() => {
    const checkInstallation = async () => {
      try {
        const status = await isInstalled();
        setInstalled(status);
      } catch (e) {
        console.error("Failed to check installation status:", e);
        setInstalled(false);
      }
    };
    checkInstallation();
  }, []);

  const handleInstall = async () => {
    setLoading(true);
    try {
      const result = await installRefreshRate();
      if (result.success) {
        setInstalled(true);
        showRebootModal("install");
      } else {
        toaster.toast({
          title: "Installation Failed",
          body: result.message
        });
      }
    } catch (e) {
      console.error("Install error:", e);
      toaster.toast({
        title: "Error",
        body: "An unexpected error occurred during installation."
      });
    }
    setLoading(false);
  };

  const handleUninstall = async () => {
    setLoading(true);
    try {
      const result = await uninstallRefreshRate();
      if (result.success) {
        setInstalled(false);
        showRebootModal("uninstall");
      } else {
        toaster.toast({
          title: "Uninstallation Failed",
          body: result.message
        });
      }
    } catch (e) {
      console.error("Uninstall error:", e);
      toaster.toast({
        title: "Error",
        body: "An unexpected error occurred during uninstallation."
      });
    }
    setLoading(false);
  };

  return (
    <PanelSection title="120Hz Refresh Rate">
      <PanelSectionRow>
        <div style={{ marginBottom: "10px", fontSize: "12px", color: "#b8bcbf" }}>
          {installed === null 
            ? "Checking status..." 
            : installed 
              ? "✓ Expanded refresh rates are installed" 
              : "✗ Expanded refresh rates are not installed"}
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={handleInstall}
          disabled={loading || installed === true}
        >
          {loading ? "Working..." : "Install 120Hz Support"}
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={handleUninstall}
          disabled={loading || installed === false}
        >
          {loading ? "Working..." : "Uninstall 120Hz Support"}
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin(() => {
  console.log("120 Hrtz Refresh Rate plugin initializing");

  return {
    name: "120 Hrtz Refresh Rate",
    titleView: <div className={staticClasses.Title}>120Hz Refresh Rate</div>,
    content: <Content />,
    icon: <FaDisplay />,
    onDismount() {
      console.log("120 Hrtz Refresh Rate plugin unloading");
    },
  };
});
