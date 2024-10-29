export async function hashPassword(password: string) {
  // Encode the password to an ArrayBuffer
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Hash the password with SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", passwordBuffer);

  // Convert ArrayBuffer to Hex String for storage
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function comparePasswords(
  storedHash: string,
  newPassword: string
) {
  // Hash the new password
  const newHash = await hashPassword(newPassword);

  // Compare hashes in constant time
  return storedHash === newHash;
}
