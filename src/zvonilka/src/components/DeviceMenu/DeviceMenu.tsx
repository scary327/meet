import { useRef, useEffect } from "react";

interface DeviceMenuItem {
  deviceId: string;
  label: string;
}

interface DeviceMenuProps {
  devices: DeviceMenuItem[];
  selectedDeviceId?: string;
  onSelectDevice: (deviceId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceMenu: React.FC<DeviceMenuProps> = ({
  devices,
  selectedDeviceId,
  onSelectDevice,
  isOpen,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full mb-2 bg-[var(--default-black)] border border-white rounded-lg py-2 min-w-[200px] max-h-[300px] overflow-y-auto z-50"
    >
      {devices.length === 0 ? (
        <div className="px-4 py-2 text-white text-sm">
          Устройства не найдены
        </div>
      ) : (
        devices.map((device) => (
          <button
            key={device.deviceId}
            onClick={() => {
              onSelectDevice(device.deviceId);
              onClose();
            }}
            className="w-full px-4 py-2 text-left text-white text-sm hover:bg-white/10 transition-colors"
            style={{
              backgroundColor:
                selectedDeviceId === device.deviceId
                  ? "rgba(255, 255, 255, 0.2)"
                  : undefined,
            }}
          >
            {device.label || `Устройство ${device.deviceId.slice(0, 8)}...`}
          </button>
        ))
      )}
    </div>
  );
};
