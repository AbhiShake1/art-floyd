export { }

declare global {
  type UserRole = "buyer" | "artist" | "admin"

  interface UserPublicMetadata {
    role?: UserRole
    kycVerifiedAt?: Date
    tuition_type?: TuitionType
		courseId?: string
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface CustomJwtSessionClaims {
		metadata?: UserPublicMetadata
	}
}
