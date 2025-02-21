import { FirebaseAppError } from "firebase-admin/app";
import { FirebaseAuthError } from "firebase-admin/auth";
import { FirebaseDatabaseError } from "firebase-admin/database";
import { FirebaseFirestoreError } from "firebase-admin/firestore";
import { errorMessage } from "../shared";

export function serverErrorMessage(error: unknown): string {
  // TODO HANDLE ALL THESE
  /*
  * These errors occur on the server so they should be transformed
  * into a safe format that can be displayed to users without showing too much daetail
  * but accurately lets them know what went wrong
  */
  if(error instanceof FirebaseAuthError){

  }
  
  if (error instanceof FirebaseAppError) {

  }
    
  if(error instanceof FirebaseDatabaseError) {

  }
    
  if (error instanceof FirebaseFirestoreError) {

  }

  return errorMessage(error);
}