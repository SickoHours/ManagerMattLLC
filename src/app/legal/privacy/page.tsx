import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Manager Matt LLC",
  description: "Privacy policy for Manager Matt LLC",
};

export default function PrivacyPage() {
  return (
    <article className="bg-surface rounded-2xl p-8 md:p-12 shadow-sm border border-border-default">
      <h1 className="text-h1 text-foreground mb-2">Privacy Policy</h1>
      <p className="text-body-sm text-secondary-custom mb-8">
        Last updated: January 2025
      </p>

      <div className="space-y-8 text-body text-secondary-custom">
        <section>
          <h2 className="text-h3 text-foreground mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Contact information (name, email address)</li>
            <li>Project details and requirements you share</li>
            <li>Communication preferences</li>
            <li>Payment information (processed securely by Stripe)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Generate project estimates and quotes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">3. Information Sharing</h2>
          <p className="mb-4">
            We do not sell, trade, or rent your personal information to third parties.
            We may share information only in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>With your consent or at your direction</li>
            <li>With service providers who assist in our operations (e.g., payment processors)</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights, privacy, safety, or property</li>
          </ul>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect
            your personal information against unauthorized access, alteration,
            disclosure, or destruction. This includes encryption of data in transit
            and at rest, regular security assessments, and access controls.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">5. Cookies and Tracking</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Remember your preferences and settings</li>
            <li>Analyze site traffic and usage patterns</li>
            <li>Improve our website and services</li>
          </ul>
          <p className="mt-4">
            You can control cookies through your browser settings. Note that disabling
            cookies may affect the functionality of our website.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">6. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to or restrict certain processing</li>
            <li>Data portability where applicable</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us at hello@managermatt.com.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">7. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide
            our services and fulfill the purposes described in this policy. We may
            also retain and use information as necessary to comply with legal
            obligations, resolve disputes, and enforce agreements.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you
            of any changes by posting the new policy on this page and updating the
            &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">9. Contact Us</h2>
          <p>
            If you have questions about this privacy policy or our privacy practices,
            please contact us at:
          </p>
          <p className="mt-4">
            <strong className="text-foreground">Manager Matt LLC</strong>
            <br />
            Email: hello@managermatt.com
          </p>
        </section>
      </div>
    </article>
  );
}
