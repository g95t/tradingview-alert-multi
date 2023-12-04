const { networkInterfaces } = require('os');

function getIPAddress() {
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

module.exports = getIPAddress;
