import { motion } from 'framer-motion';
import { Shield, Calendar, Lock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
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
              <Shield size={24} strokeWidth={2.5} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Privacy Policy
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
            <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              We collect information you provide directly to us when you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4 mb-3">
              <li>Create an account</li>
              <li>Use our services</li>
              <li>Contact us for support</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="text-white/70 leading-relaxed">
              This information may include: name, email address, password, profile picture, watch history, watchlist, 
              and preferences.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Personalize your experience and recommendations</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">3. Information Sharing</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              We do not share your personal information with third parties except in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist us in our operations</li>
            </ul>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">4. Data Security</h2>
            <p className="text-white/70 leading-relaxed mb-3 flex items-start gap-2">
              <Lock size={16} className="text-primary mt-1 flex-shrink-0" />
              <span>
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </span>
            </p>
            <p className="text-white/70 leading-relaxed">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we 
              strive to use commercially acceptable means to protect your information, we cannot guarantee its 
              absolute security.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">5. Cookies and Tracking</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              We use cookies and similar tracking technologies to track activity on our service and hold certain 
              information. For more information, please see our{' '}
              <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
            </p>
            <p className="text-white/70 leading-relaxed">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
              if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">6. Your Rights</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
              <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
            </ul>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">7. Children's Privacy</h2>
            <p className="text-white/70 leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you are a parent or guardian and you are aware that your child 
              has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">8. International Transfers</h2>
            <p className="text-white/70 leading-relaxed">
              Your information may be transferred to and maintained on computers located outside of your state, 
              province, country, or other governmental jurisdiction where the data protection laws may differ than 
              those from your jurisdiction.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">9. Changes to This Policy</h2>
            <p className="text-white/70 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">10. Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@moviepopcorn.com" className="text-primary hover:underline">
                privacy@moviepopcorn.com
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
            <Eye size={16} />
            <span>Your privacy is important to us. We are committed to protecting your personal information.</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
