import { loginSchema, signupSchema, emailSchema, passwordSchema } from '../auth-forms'

describe('Auth Validation Schemas', () => {
  describe('emailSchema', () => {
    it('accepts valid email addresses', () => {
      expect(emailSchema.parse('user@example.com')).toBe('user@example.com')
      expect(emailSchema.parse('TEST@EXAMPLE.COM')).toBe('test@example.com')
      expect(emailSchema.parse('  user+tag@example.co.uk  ')).toBe('user+tag@example.co.uk')
    })

    it('rejects invalid email addresses', () => {
      expect(() => emailSchema.parse('invalid')).toThrow()
      expect(() => emailSchema.parse('user@')).toThrow()
      expect(() => emailSchema.parse('@example.com')).toThrow()
      expect(() => emailSchema.parse('user@.com')).toThrow()
    })

    it('rejects empty email', () => {
      expect(() => emailSchema.parse('')).toThrow()
    })

    it('rejects emails exceeding max length', () => {
      const longEmail = 'a'.repeat(250) + '@example.com'
      expect(() => emailSchema.parse(longEmail)).toThrow()
    })

    it('normalizes email to lowercase', () => {
      expect(emailSchema.parse('User@Example.COM')).toBe('user@example.com')
    })

    it('trims whitespace', () => {
      expect(emailSchema.parse('  user@example.com  ')).toBe('user@example.com')
    })
  })

  describe('passwordSchema', () => {
    it('accepts valid strong passwords', () => {
      expect(passwordSchema.parse('ValidPassword123')).toBe('ValidPassword123')
      expect(passwordSchema.parse('MyP@ssw0rd')).toBe('MyP@ssw0rd')
      expect(passwordSchema.parse('SecurePass1')).toBe('SecurePass1')
    })

    it('rejects passwords shorter than 8 characters', () => {
      expect(() => passwordSchema.parse('Short1')).toThrow()
      expect(() => passwordSchema.parse('Ab12')).toThrow()
    })

    it('rejects passwords without uppercase letter', () => {
      expect(() => passwordSchema.parse('validpassword123')).toThrow()
      expect(() => passwordSchema.parse('password123')).toThrow()
    })

    it('rejects passwords without lowercase letter', () => {
      expect(() => passwordSchema.parse('VALIDPASSWORD123')).toThrow()
      expect(() => passwordSchema.parse('PASSWORD123')).toThrow()
    })

    it('rejects passwords without number', () => {
      expect(() => passwordSchema.parse('ValidPassword')).toThrow()
      expect(() => passwordSchema.parse('MyPassword')).toThrow()
    })

    it('rejects empty password', () => {
      expect(() => passwordSchema.parse('')).toThrow()
    })

    it('allows special characters in password', () => {
      expect(passwordSchema.parse('MyP@ssw0rd!#$')).toBe('MyP@ssw0rd!#$')
      expect(passwordSchema.parse('Pass_word1')).toBe('Pass_word1')
    })
  })

  describe('loginSchema', () => {
    it('accepts valid login credentials', () => {
      const data = { email: 'user@example.com', password: 'Password123' }
      expect(loginSchema.parse(data)).toEqual({
        email: 'user@example.com',
        password: 'Password123',
      })
    })

    it('accepts weak password on login (user may have forgotten requirements)', () => {
      const data = { email: 'user@example.com', password: 'anypassword' }
      expect(loginSchema.parse(data)).toEqual({
        email: 'user@example.com',
        password: 'anypassword',
      })
    })

    it('rejects invalid email', () => {
      expect(() =>
        loginSchema.parse({ email: 'invalid', password: 'Password123' }),
      ).toThrow()
    })

    it('rejects empty password', () => {
      expect(() =>
        loginSchema.parse({ email: 'user@example.com', password: '' }),
      ).toThrow()
    })

    it('rejects empty email', () => {
      expect(() =>
        loginSchema.parse({ email: '', password: 'Password123' }),
      ).toThrow()
    })

    it('normalizes email to lowercase', () => {
      const data = { email: 'USER@EXAMPLE.COM', password: 'Password123' }
      const result = loginSchema.parse(data)
      expect(result.email).toBe('user@example.com')
    })
  })

  describe('signupSchema', () => {
    it('accepts valid signup data', () => {
      const data = {
        email: 'newuser@example.com',
        password: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      }
      expect(signupSchema.parse(data)).toEqual(data)
    })

    it('rejects weak password', () => {
      expect(() =>
        signupSchema.parse({
          email: 'user@example.com',
          password: 'weakpass',
          confirmPassword: 'weakpass',
        }),
      ).toThrow()
    })

    it('rejects mismatched passwords', () => {
      expect(() =>
        signupSchema.parse({
          email: 'user@example.com',
          password: 'ValidPassword123',
          confirmPassword: 'DifferentPassword123',
        }),
      ).toThrow(/Passwords do not match/)
    })

    it('rejects case-sensitive password mismatch', () => {
      expect(() =>
        signupSchema.parse({
          email: 'user@example.com',
          password: 'ValidPassword123',
          confirmPassword: 'validpassword123',
        }),
      ).toThrow()
    })

    it('rejects invalid email', () => {
      expect(() =>
        signupSchema.parse({
          email: 'invalid-email',
          password: 'ValidPassword123',
          confirmPassword: 'ValidPassword123',
        }),
      ).toThrow()
    })

    it('rejects empty confirm password', () => {
      expect(() =>
        signupSchema.parse({
          email: 'user@example.com',
          password: 'ValidPassword123',
          confirmPassword: '',
        }),
      ).toThrow()
    })

    it('normalizes email to lowercase', () => {
      const data = {
        email: 'NEWUSER@EXAMPLE.COM',
        password: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      }
      const result = signupSchema.parse(data)
      expect(result.email).toBe('newuser@example.com')
    })

    it('handles multiple validation errors', () => {
      expect(() =>
        signupSchema.parse({
          email: 'invalid',
          password: 'weak',
          confirmPassword: 'different',
        }),
      ).toThrow()
    })
  })
})
