import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Bluetooth } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BluetoothDevice {
  id: string;
  name: string | null;
  rssi?: number;
}

const BluetoothScanner = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const requestPermissions = async () => {
    try {
      // Request Bluetooth permissions
      const permissionStatus = await navigator.permissions.query({ name: 'bluetooth' as PermissionName });
      
      if (permissionStatus.state === 'denied') {
        throw new Error('Bluetooth permission denied');
      }

      // Request location permission (required for Android)
      if ('geolocation' in navigator) {
        await navigator.geolocation.getCurrentPosition(() => {});
      }

      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Permission Error",
        description: "Please enable Bluetooth and Location permissions",
      });
      return false;
    }
  };

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setDevices([]);

      // Check permissions first
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      if (!navigator.bluetooth) {
        throw new Error("Bluetooth not supported");
      }

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: []
      });

      if (device) {
        setDevices(prev => [...prev, {
          id: device.id,
          name: device.name,
        }]);
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to scan Bluetooth devices",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Bluetooth className="h-6 w-6" />
            Bluetooth Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={startScanning} 
              disabled={isScanning}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                "Scan for Devices"
              )}
            </Button>

            <div className="space-y-2">
              {devices.length > 0 ? (
                devices.map((device) => (
                  <Card key={device.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{device.name || "Unknown Device"}</h3>
                        <p className="text-sm text-gray-500">ID: {device.id}</p>
                      </div>
                      {device.rssi && (
                        <span className="text-sm text-gray-500">
                          Signal: {device.rssi} dBm
                        </span>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  {isScanning ? "Searching for devices..." : "No devices found"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BluetoothScanner;