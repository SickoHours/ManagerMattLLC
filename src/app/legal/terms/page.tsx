import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Manager Matt LLC",
  description: "Terms of service for Manager Matt LLC",
};

export default function TermsPage() {
  return (
    <article className="bg-surface rounded-2xl p-8 md:p-12 shadow-sm border border-border-default">
      <h1 className="text-h1 text-foreground mb-2">Terms of Service</h1>
      <p className="text-body-sm text-secondary-custom mb-8">
        Last updated: January 2025
      </p>

      <div className="space-y-8 text-body text-secondary-custom">
        <section>
          <h2 className="text-h3 text-foreground mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using the services provided by Manager Matt LLC
            (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not
            use our services.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">2. Services</h2>
          <p className="mb-4">
            Manager Matt LLC provides software development and consulting services,
            including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Custom software development</li>
            <li>Web and mobile application development</li>
            <li>Technical consulting</li>
            <li>Project estimation and scoping</li>
          </ul>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">3. Estimates and Pricing</h2>
          <p className="mb-4">
            Our AI-powered estimation tool provides preliminary cost ranges based on
            the information you provide. These estimates are:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Indicative and subject to change based on detailed requirements</li>
            <li>Presented as ranges (P10/P50/P90) to reflect uncertainty</li>
            <li>Not binding until a formal quote is accepted</li>
          </ul>
          <p className="mt-4">
            Final pricing is determined after a discovery process and provided in a
            formal quote or statement of work.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">4. Payment Terms</h2>
          <p className="mb-4">Payment terms are specified in individual project agreements. Generally:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>A deposit is required before work begins</li>
            <li>Payment schedules may be milestone-based for larger projects</li>
            <li>Invoices are due within 14 days unless otherwise specified</li>
            <li>Late payments may incur additional fees</li>
          </ul>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">5. Intellectual Property</h2>
          <p className="mb-4">
            Upon full payment, you own all custom code developed specifically for your
            project, unless otherwise agreed. We retain ownership of:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Pre-existing code, libraries, and tools</li>
            <li>General-purpose components and frameworks</li>
            <li>Our methodologies and processes</li>
          </ul>
          <p className="mt-4">
            We may use anonymized project information for portfolio and marketing
            purposes unless you explicitly opt out.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">6. Client Responsibilities</h2>
          <p className="mb-4">To ensure project success, you agree to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Provide timely feedback and approvals (within 48 hours unless otherwise agreed)</li>
            <li>Designate a primary point of contact</li>
            <li>Provide access to necessary systems and information</li>
            <li>Review and test deliverables within agreed timeframes</li>
          </ul>
          <p className="mt-4">
            Delays caused by client unresponsiveness may result in timeline adjustments
            and additional costs.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">7. Warranties and Limitations</h2>
          <p className="mb-4">
            We warrant that our services will be performed in a professional manner.
            We provide a 30-day warranty period after delivery during which we will
            fix bugs at no additional cost.
          </p>
          <p className="mt-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL OTHER WARRANTIES,
            EXPRESS OR IMPLIED. WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL,
            OR CONSEQUENTIAL DAMAGES.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">8. Limitation of Liability</h2>
          <p>
            Our total liability for any claim arising from our services is limited to
            the amount paid by you for the specific services giving rise to the claim.
            This limitation applies regardless of the form of action.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">9. Termination</h2>
          <p className="mb-4">
            Either party may terminate a project with 30 days written notice. Upon
            termination:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>You pay for all work completed to date</li>
            <li>We deliver all completed work and materials</li>
            <li>Outstanding invoices become immediately due</li>
          </ul>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">10. Confidentiality</h2>
          <p>
            Both parties agree to keep confidential any proprietary or sensitive
            information shared during the engagement. This obligation survives
            termination of any agreement.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">11. Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of Texas, without
            regard to conflict of law principles. Any disputes shall be resolved
            in the courts of Texas.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">12. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be
            posted on this page with an updated date. Continued use of our services
            constitutes acceptance of modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-h3 text-foreground mb-4">13. Contact</h2>
          <p>
            For questions about these terms, please contact us at:
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
