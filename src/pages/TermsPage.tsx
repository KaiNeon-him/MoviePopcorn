import { motion } from 'framer-motion';
import { FileText, Calendar, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <motion.div
      className="min-h-screen bg-dark pt-24 px-4 sm:px-8 lg:px-12 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <FileText size={24} strokeWidth={2.5} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Terms of Service
              </h1>
              <p className="text-white/50 text-sm flex items-center gap-2 mt-1">
                <Calendar size={14} />
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="prose prose-invert max-w-none space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              By accessing and using MoviePopcorn ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of the terms, you may not access the Service.
            </p>
            <p className="text-white/70 leading-relaxed">
              These Terms apply to all users, including users who are contributors, content creators, and customers of the Service.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">2. Use License</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              Permission is granted to temporarily use the materials on MoviePopcorn for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
            <p className="text-white/70 leading-relaxed mb-3">Under this license, you may not:</p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">3. Disclaimer</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              The materials on MoviePopcorn are provided on an 'as is' basis. MoviePopcorn makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
              of intellectual property or other violation of rights.
            </p>
            <p className="text-white/70 leading-relaxed">
              Further, MoviePopcorn does not warrant or make any representations concerning the accuracy, likely results, 
              or reliability of the use of the materials on its website or otherwise relating to such materials or on any 
              sites linked to this site.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">4. Limitations</h2>
            <p className="text-white/70 leading-relaxed">
              In no event shall MoviePopcorn or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
              to use the materials on MoviePopcorn, even if MoviePopcorn or an authorized representative has been notified 
              orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">5. Content and Copyright</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              All content accessed through MoviePopcorn is provided by third-party services. MoviePopcorn does not host, 
              store, or distribute any video content. We act solely as a discovery and aggregation platform.
            </p>
            <p className="text-white/70 leading-relaxed">
              If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, 
              please see our <Link to="/dmca" className="text-primary hover:underline">DMCA Policy</Link>.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">6. User Accounts</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              When you create an account with us, you guarantee that the information you provide is accurate, complete, 
              and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate 
              termination of your account.
            </p>
            <p className="text-white/70 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password, including but not 
              limited to restricting access to your computer and/or account. You agree to accept responsibility for any 
              and all activities or actions that occur under your account.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">7. Age Requirement</h2>
            <p className="text-white/70 leading-relaxed">
              You must be at least 13 years of age to use our Service. By using the Service, you represent and warrant 
              that you have the legal capacity to enter into a binding agreement and meet all of the foregoing requirements. 
              If you are under 18, you represent that your parent or guardian has consented to these Terms.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">8. Termination</h2>
            <p className="text-white/70 leading-relaxed">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice 
              or liability, under our sole discretion, for any reason whatsoever, including without limitation if you 
              breach the Terms.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">9. Changes to Terms</h2>
            <p className="text-white/70 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision 
              is material, we will provide at least 30 days' notice prior to any new terms taking effect. What 
              constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">10. Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@moviepopcorn.com" className="text-primary hover:underline">
                legal@moviepopcorn.com
              </a>
            </p>
          </section>

          {/* Footer */}
          <motion.div
            className="flex items-center gap-2 text-white/40 text-sm mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Shield size={16} />
            <span>These terms are designed to protect both you and MoviePopcorn.</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
