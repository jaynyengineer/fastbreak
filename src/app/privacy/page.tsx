export const dynamic = 'force-static'

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 prose">
      <h1>Privacy Policy</h1>
      <p>Last updated: October 30, 2025</p>
      <p>
        This demo application collects only the minimum information required to
        authenticate users (email address) using Supabase Auth and, if you
        choose, Google Sign-In. No personal information is sold or shared.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Email address for account authentication</li>
        <li>Events and venues you create within the application</li>
      </ul>
      <h2>How we use data</h2>
      <p>
        Data is used solely to provide the app&apos;s core functionality: creating,
        viewing, and managing sports events. Data is stored in Supabase and is
        protected with Row Level Security (RLS).
      </p>
      <h2>Third parties</h2>
      <p>
        Authentication is handled by Supabase and optionally Google. Usage of
        Google Sign-In is subject to Google’s Privacy Policy.
      </p>
      <h2>Contact</h2>
      <p>
        For questions or data requests, contact the developer at the email used
        in the project README.
      </p>
    </main>
  )
}
