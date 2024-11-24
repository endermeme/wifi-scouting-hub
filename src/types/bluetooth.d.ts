interface Bluetooth {
  requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
}

interface RequestDeviceOptions {
  acceptAllDevices?: boolean;
  filters?: Array<{
    services?: BluetoothServiceUUID[];
    name?: string;
    namePrefix?: string;
    manufacturerId?: number;
    serviceDataUUID?: BluetoothServiceUUID;
  }>;
  optionalServices?: BluetoothServiceUUID[];
}

interface Navigator {
  bluetooth: Bluetooth;
}