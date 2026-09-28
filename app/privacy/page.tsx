import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Solve",
  description: "How Solve collects, uses, and protects your information when you use our mathematics practice app.",
};

const policySections = [
  {
    id: "information",
    title: "Information we collect",
    paragraphs: [
      <>
        When you sign in with Google, we receive basic account information such
        as your name, email address, profile picture, and Google account identifier.
        Supabase, our authentication provider, stores account and session information
        to recognise you and keep you signed in. We do not receive your Google password.
      </>,
      <>
        Our hosting and authentication providers may also process technical information
        such as your IP address, browser and device details, request timestamps, and
        error or security logs. If you contact us, we receive the information you choose
        to include in your message.
      </>,
    ],
  },
  {
    id: "use",
    title: "How we use information",
    paragraphs: [
      <>
        We use this information to create and authenticate your account, provide access
        to the question bank, maintain sessions, respond to enquiries, troubleshoot
        problems, and protect Solve against abuse. Google account information is used
        to support sign-in and your account. Solve does not request access to your
        Gmail messages, Google Drive files, calendar, or contacts.
      </>,
    ],
  },
  {
    id: "cookies",
    title: "Cookies and sessions",
    paragraphs: [
      <>
        Solve uses authentication cookies to manage sign-in and maintain your session.
        You can clear or block cookies in your browser settings, but features that
        require an account may stop working. Solve does not currently use advertising
        cookies or third-party marketing analytics.
      </>,
    ],
  },
  {
    id: "sharing",
    title: "Sharing information",
    paragraphs: [
      <>
        We do not sell your personal information or use Google account information
        for advertising. Information is processed by service providers needed to run
        Solve, including Google for sign-in, Supabase for authentication and database
        services, and our hosting provider for serving the app. We may also disclose
        information when required by law or when necessary to protect users, prevent
        abuse, or safeguard the service.
      </>,
      <>
        These providers may process information in countries other than the one you
        live in. Their own handling of information is described in their privacy
        policies, including the <a href="https://policies.google.com/privacy">Google Privacy Policy</a>{" "}
        and <a href="https://supabase.com/privacy">Supabase Privacy Policy</a>.
      </>,
    ],
  },
  {
    id: "retention",
    title: "Storage, retention, and security",
    paragraphs: [
      <>
        Account information is stored through Supabase. We retain personal information
        for as long as needed to provide your account and operate the service, unless
        you request deletion. Some information may need to be retained for legal
        obligations, security, or resolving disputes, and backup copies may remain
        until they are removed through normal backup cycles. We use authentication
        and access controls to protect information, but no online service can guarantee
        absolute security.
      </>,
    ],
  },
  {
    id: "choices",
    title: "Your choices and deletion requests",
    paragraphs: [
      <>
        You can request access to, correction of, or deletion of your personal
        information and Solve account by contacting us using the link below. Depending
        on where you live, you may have additional privacy rights. We may need to
        verify that you own the account before acting on a request; please never
        send your password or sign-in codes.
      </>,
      <>
        You can also remove Solve's access in your{" "}
        <a href="https://myaccount.google.com/connections">Google Account connections settings</a>.
        Removing access does not automatically delete information already stored
        by Solve; contact us to request account deletion.
      </>,
    ],
  },
  {
    id: "children",
    title: "Children's privacy",
    paragraphs: [
      <>
        Solve is intended for students practising H2 Mathematics and is not directed
        at children under 13. We do not knowingly collect personal information from
        children under 13. If you believe a child has provided personal information,
        please contact us so we can investigate and arrange deletion where appropriate.
      </>,
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      <>
        We may update this policy as Solve evolves. Updates will appear on this page
        with a revised date. Where required, we will provide additional notice of
        significant changes.
      </>,
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    paragraphs: [
      <>
        For privacy questions or account deletion requests, contact Solve's
        operator on <a href="https://t.me/FlyingDonkey1">Telegram at @FlyingDonkey1</a>.
        Please mention Solve and the nature of your request. Telegram is an external
        service with its own privacy policy.
      </>,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="page-container py-12 sm:py-16">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-border pb-8">
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Privacy policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: <time dateTime="2026-09-28">28 September 2026</time>          
          </p>
          <p className="mt-6 text-base leading-8 text-muted-foreground">
                Solve is a H2 Mathematics practice app with curated questions and solutions.
                This policy explains how Solve collects, uses, stores, and shares personal
                information when you visit the website or sign in to use the question bank.
          </p>
        </header>

        <div className="space-y-8 pt-8 text-sm leading-7 text-muted-foreground [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_a]:rounded-sm [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-accent-foreground">
          {policySections.map(({ id, title, paragraphs }, sectionIndex) => (
            <section key={id} aria-labelledby={id}>
              <h2 id={id}>{sectionIndex + 1}. {title}</h2>
              <div className="space-y-3">
                {paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
