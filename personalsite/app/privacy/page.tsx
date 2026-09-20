import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CookieSettingsButton from "@/components/CookieSettingsButton";

export const metadata: Metadata = { title: "Privacy and cookies | Eduard Teodor", description: "How this site uses personal information, essential storage and optional Microsoft Clarity analytics." };

export default function PrivacyPage() {
  return <><Navigation /><main className="space-y-8 py-10 sm:py-12">
    <h1>Privacy and cookies</h1>
    <p>This website is operated by Eduard Teodor, based in London, United Kingdom. For privacy questions or requests, contact <a href="mailto:ed@eduardteodor.co.uk">ed@eduardteodor.co.uk</a>.</p>
    <section className="space-y-3"><h2>Optional analytics</h2>
      <p>If you accept analytics, this site uses Microsoft Clarity to understand how visitors use its pages and to improve their content and usability. Clarity captures interactions such as clicks, scrolling and navigation, together with page, browser and device information, to produce heatmaps and session recordings.</p>
      <p>Clarity is not loaded until you accept analytics. Rejecting analytics does not prevent you from using the site. This integration sends an analytics consent signal to Microsoft and keeps advertising storage consent denied. It does not send custom user identifiers.</p>
      <p>Microsoft receives and processes Clarity data. Its processing, retention and international transfers are described in the <a href="https://privacy.microsoft.com/privacystatement">Microsoft Privacy Statement</a>. See also <a href="https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-cookies">Microsoft’s current Clarity cookie information</a>.</p>
    </section>
    <section className="space-y-3"><h2>Cookies and local storage</h2>
      <ul className="list-disc space-y-3 pl-6">
        <li><strong>Cookie choice:</strong> this site stores your analytics choice in your browser’s local storage under <code>site-cookie-consent-v1</code>. The choice expires after 180 days, when you will be asked again. This preference storage is used only to remember your decision.</li>
        <li><strong>Admin sign-in:</strong> Supabase uses session cookies beginning with <code>sb-</code> when the site owner signs in. They keep the admin session working and are separate from optional analytics.</li>
        <li><strong>Clarity analytics:</strong> after acceptance, Clarity can set <code>_clck</code> to recognise a browser on this site and <code>_clsk</code> to connect page views within a recording. Microsoft documents its additional cookies and their purposes in the link above.</li>
      </ul>
    </section>
    <section className="space-y-3"><h2>Change your choice</h2>
      <p>Use Cookie settings at any time to accept or reject analytics. Withdrawing consent stops recording on this site, clears its Clarity first-party cookies and reloads the page. It does not automatically erase information already sent to Microsoft. Your browser settings can also clear cookies and local storage.</p>
      <CookieSettingsButton />
    </section>
    <section className="space-y-3"><h2>Messages and website services</h2>
      <p>If you contact me by email, I use the information you provide to respond and handle your enquiry. Hosting and database services process technical information needed to deliver and secure the website. These functions are separate from optional Clarity analytics.</p>
    </section>
    <section className="space-y-3"><h2>Your rights</h2>
      <p>Depending on the circumstances, you may have rights to access, correct or delete personal information, restrict or object to its use, and withdraw consent. Contact me using the email above. You can also raise a concern with the <a href="https://ico.org.uk/make-a-complaint/">UK Information Commissioner’s Office</a>.</p>
    </section>
  </main><Footer /></>;
}
