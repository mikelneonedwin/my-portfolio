import { adminAuth } from "@/lib/firebase-admin"

async function setAdminClaim(uid: string) {
  try {
    await adminAuth.setCustomUserClaims(uid, { admin: true })
    console.log("Admin claim set successfully")
  } catch (error) {
    console.error("Error setting admin claim:", error)
  }
}

// Usage:
// Replace 'USER_UID' with the UID of the user you want to make an admin
setAdminClaim("USER_UID")

