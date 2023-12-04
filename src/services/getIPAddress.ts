import { Request } from 'express';

export function getIPAddress(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for'];
  let clientIP: string;

  if (forwardedFor) {
    if (typeof forwardedFor === 'string') {
      clientIP = forwardedFor;
    } else if (Array.isArray(forwardedFor)) {
      clientIP = forwardedFor[0];
    } else {
      clientIP = req.ip;
    }
  } else {
    clientIP = req.ip;
  }

  return clientIP;
}
