import { networkInterfaces } from 'os';

export function getIPAddress() {
  const interfaces = networkInterfaces();
  let ipAddress;

  Object.keys(interfaces).forEach((iface) => {
    interfaces[iface].forEach((details) => {
      if (details.family === 'IPv4' && !details.internal) {
        ipAddress = details.address;
      }
    });
  });

  return ipAddress;
}
