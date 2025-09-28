/**
 * ResultCode definitions.
 * Each result code is a number. See comments for meaning.
 */

export type ResultCodeType = number 

export const RESULTCODE = {
  // Success and failure
  SUCCESS: 100, // muvaffaqiyatli (Successful)
  FAILED: 101, // muvaffaqiyatsiz (Failed)

  // User related
  USER_EXIST: 140, // User exist
  USER_NOT_EXIST: 141, // User is not exist

  // Company related
  COMPANY_NOT_EXIST: 142, // Company is not exist
  COMPANY_EXIST: 143, // Company is exist

  // Branch related
  BRANCH_NOT_EXIST: 144, // Branch is not exist
  BRANCH_EXIST: 145, // Branch is exist

  // Poster related
  POSTER_EXIST: 146, // Poster is exist
  POSTER_NOT_EXIST: 147, // Poster is not exist

  // Poster comment
  POSTER_COMMENT_NOT_EXIST: 148, // Poster comment is not exist
  POSTER_COMMENT_EXIST: 149, // Poster comment is exist

  // Poster feedback
  POSTER_FEEDBACK_EXIST: 150, // Poster feedback is exist
  POSTER_FEEDBACK_NOT_EXIST: 151, // Poster feedback is not exist

  // Promotion
  PROMOTION_EXIST: 152, // Promotion is exist
  PROMOTION_NOT_EXIST: 153, // Promotion is not exist

  // User password
  USER_PASSWORD_NOT_MATCHED: 154, // Password is not matched!

  // Not found / found
  NOT_FOUND: 155, // Not found!
  FOUND: 156, // Found!

  // Block user
  BLOCK_USER: 157, // User blocked!
  DELETE_USER: 158, // "User deleted!

  // Token related
  TOKEN_INVALID: 200, // Invalid token information.
  TOKEN_EXPIRED_TIME: 201, // This token is expired.
  TOKEN_UNSUPPORTED_JWT: 202, // Unsupported token information.

  // Login related
  LOGIN_INVALID_TOKEN: 250, // Token information cannot be verified.
  LOGIN_DUPLICATE: 251, // Duplicate login.
  LOGIN: 252, // Please log in first.
  LOGIN_INACTIVE: 253, // Please log in first.
  LOGIN_BANNED: 254, // User is banned. Access denied.
  PASSWORD_IS_NOT_MATCHED: 255, // Password is not matched

  // Phone verification
  VERIFY_PHONE_NUMBER_FAILED: 256, // The phone verification failed.

  // Authentication
  AUTHENTICATION_ERROR: 300, // Your authentication information cannot be verified.
  // PROMOTION_IS_NOT_REGISTRATED: 301, // The promotion is not registered for the users.
  INTERNAL_ERROR: 301, // Something went wrong on our end. We're working to fix it.
  SERVER_ERROR: 302, // A system error has occurred. Please contact your administrator.
  TOKEN_EMPTY: 360, // Empty token

  // Role
  ROLE_INVALID: 410, // Role is invalid
} as const 

/**
 * Get the ResultCode key by code.
 * @param code number
 * @returns keyof typeof RESULTCODE | undefined
 */
export function getResultByCode(
  code: number
): keyof typeof RESULTCODE | undefined {
  return (Object.keys(RESULTCODE) as (keyof typeof RESULTCODE)[]).find(
    key => RESULTCODE[key] === code
  ) 
}