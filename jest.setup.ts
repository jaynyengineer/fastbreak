import '@testing-library/jest-dom'

const originalConsoleError = console.error

beforeAll(() => {
	console.error = (...args: unknown[]) => {
		const first = args[0]
		if (typeof first === 'string' && first.startsWith('[Server Action Error]')) {
			return
		}
		// Forward everything else
		originalConsoleError(...(args as Parameters<typeof originalConsoleError>))
	}
})

afterAll(() => {
	console.error = originalConsoleError
})
