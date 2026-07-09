import crypto from "crypto";

/*
|--------------------------------------------------------------------------
| Secure Random Token Generator
|--------------------------------------------------------------------------
*/

export function generateSecureToken() {
  return crypto.randomBytes(32).toString("hex");
}

/*
|--------------------------------------------------------------------------
| Token Hashing
|--------------------------------------------------------------------------
|
| Raw tokens are NEVER stored.
|
| Database stores:
|
| SHA256(token)
|
|--------------------------------------------------------------------------
*/

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/*
|--------------------------------------------------------------------------
| OTP Generator
|--------------------------------------------------------------------------
*/

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/*
|--------------------------------------------------------------------------
| Hash OTP
|--------------------------------------------------------------------------
*/

export function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

/*
|--------------------------------------------------------------------------
| Secure Compare
|--------------------------------------------------------------------------
|
| Prevents timing attacks
|
|--------------------------------------------------------------------------
*/

export function secureCompare(
  valueA: string,

  valueB: string,
) {
  const bufferA = Buffer.from(valueA);

  const bufferB = Buffer.from(valueB);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    bufferA,

    bufferB,
  );
}

/*
|--------------------------------------------------------------------------
| Expiry Helper
|--------------------------------------------------------------------------
*/

export function createExpiry(minutes: number = 15) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

/*
|--------------------------------------------------------------------------
| Expiry Checker
|--------------------------------------------------------------------------
*/

export function isExpired(date: Date) {
  return date.getTime() < Date.now();
}
