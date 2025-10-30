import { loginSchema, signupSchema, passwordSchema, emailSchema } from '../auth'

describe('Auth Schemas', () => {
  describe('emailSchema', () => {
    it('should accept valid email addresses', () => {
      expect(emailSchema.parse('user@example.com')).toBe('user@example.com')
      expect(emailSchema.parse('TEST@EXAMPLE.COM')).toBe('test@example.com')
    })

    it('should reject invalid email addresses', () => {
      expect(() => emailSchema.parse('invalid')).toThrow()
      expect(() => emailSchema.parse('user@')).toThrow()
      expect(() => emailSchema.parse('@example.com')).toThrow()
    })

    it('should trim whitespace', () => {
      expect(emailSchema.parse('  user@example.com  ')).toBe('user@example.com')
    })

    it('should convert to lowercase', () => {
      expect(emailSchema.parse('User@Example.COM')).toBe('user@example.com')
    })
  })

  describe('passwordSchema', () => {
    it('should accept valid passwords', () => {
      expect(passwordSchema.parse('SecurePass123')).toBe('SecurePass123')
      expect(passwordSchema.parse('MyP@ssw0rd')).toBe('MyP@ssw0rd')
    })

    it('should reject passwords shorter than 8 characters', () => {
      expect(() => passwordSchema.parse('Pass123')).toThrow()
    })

    it('should reject passwords without uppercase letter', () => {
      expect(() => passwordSchema.parse('password123')).toThrow()
    })

    it('should reject passwords without lowercase letter', () => {
      expect(() => passwordSchema.parse('PASSWORD123')).toThrow()
    })

    it('should reject passwords without number', () => {
      expect(() => passwordSchema.parse('PasswordXyz')).toThrow()
    })
  })

  describe('loginSchema', () => {
    it('should accept valid login credentials', () => {
      const result = loginSchema.parse({
        email: 'user@example.com',
        password: 'SecurePass123',
      })
      expect(result.email).toBe('user@example.com')
      expect(result.password).toBe('SecurePass123')
    })

    it('should reject invalid email', () => {
      expect(() =>
        loginSchema.parse({
          email: 'invalid',
          password: 'SecurePass123',
        })
      ).toThrow()
    })

    it('should reject missing password', () => {
      expect(() =>
        loginSchema.parse({
          email: 'user@example.com',
          password: '',
        })
      ).toThrow()
    })
  })

  describe('signupSchema', () => {
    it('should accept valid signup data', () => {
      const result = signupSchema.parse({
        email: 'user@example.com',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      })
      expect(result.email).toBe('user@example.com')
      expect(result.password).toBe('SecurePass123')
    })

    it('should reject mismatched passwords', () => {
      expect(() =>
        signupSchema.parse({
          email: 'user@example.com',
          password: 'SecurePass123',
          confirmPassword: 'DifferentPass123',
        })
      ).toThrow('Passwords do not match')
    })

    it('should reject weak password', () => {
      expect(() =>
        signupSchema.parse({
          email: 'user@example.com',
          password: 'weak',
          confirmPassword: 'weak',
        })
      ).toThrow()
    })

    it('should reject invalid email', () => {
      expect(() =>
        signupSchema.parse({
          email: 'invalid',
          password: 'SecurePass123',
          confirmPassword: 'SecurePass123',
        })
      ).toThrow()
    })
  })
})
