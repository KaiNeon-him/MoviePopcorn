import { motion } from 'framer-motion';
import { Copyright, Calendar, AlertTriangle } from 'lucide-react';

export default function DMCAPage() {
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
              <Copyright size={24} strokeWidth={2.5} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                DMCA Policy
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
            <h2 className="text-xl font-bold text-white mb-4">Digital Millennium Copyright Act (DMCA) Notice</h2>
            <p className="text-white/70 leading-relaxed">
              MoviePopcorn respects the intellectual property rights of others and expects its users to do the same. 
              We will respond to notice of alleged copyright infringement that complies with the Digital Millennium 
              Copyright Act (DMCA) and other applicable laws.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Important Notice</h2>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-4">
              <p className="text-yellow-200 text-sm flex items-start gap-2">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Disclaimer:</strong> MoviePopcorn does not host, store, or distribute any video content. 
                  We act solely as a discovery and aggregation platform that links to third-party services. All content 
                  is provided by external providers.
                </span>
              </p>
            </div>
            <p className="text-white/70 leading-relaxed">
              If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement 
              and is accessible through our platform, please provide our Copyright Agent with the following information:
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">DMCA Takedown Notice Requirements</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              Your DMCA notice must contain all of the following elements:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-white/70 ml-4">
              <li>
                <strong>Physical or electronic signature</strong> of a person authorized to act on behalf of the owner 
                of the copyright that is allegedly being infringed
              </li>
              <li>
                <strong>Identification of the copyrighted work</strong> claimed to have been infringed, or, if multiple 
                copyrighted works at a single online site are covered by a single notification, a representative list of 
                such works
              </li>
              <li>
                <strong>Identification of the material</strong> that is claimed to be infringing or to be the subject of 
                infringing activity and that is to be removed or access to which is to be disabled, and information 
                reasonably sufficient to permit us to locate the material (including the specific URL)
              </li>
              <li>
                <strong>Information reasonably sufficient</strong> to permit us to contact the complaining party, such 
                as an address, telephone number, and, if available, an electronic mail address
              </li>
              <li>
                <strong>A statement</strong> that the complaining party has a good faith belief that use of the material 
                in the manner complained of is not authorized by the copyright owner, its agent, or the law
              </li>
              <li>
                <strong>A statement</strong> that the information in the notification is accurate, and under penalty of 
                perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right 
                that is allegedly infringed
              </li>
            </ol>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              Please send DMCA takedown notices to our designated Copyright Agent:
            </p>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4 space-y-2">
              <p className="text-white/80">
                <strong>MoviePopcorn Copyright Agent</strong>
              </p>
              <p className="text-white/70">
                Email: <a href="mailto:dmca@moviepopcorn.com" className="text-primary hover:underline">dmca@moviepopcorn.com</a>
              </p>
              <p className="text-white/70">
                Subject: DMCA Takedown Notice
              </p>
            </div>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Counter-Notification</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              If you believe that your content that was removed (or to which access was disabled) is not infringing, or 
              that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the 
              law, to upload and use the content in your submission, you may send a counter-notice containing the 
              following information to the Copyright Agent:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>Your physical or electronic signature</li>
              <li>
                Identification of the content that has been removed or to which access has been disabled and the location 
                at which the content appeared before it was removed or disabled
              </li>
              <li>
                A statement that you have a good faith belief that the content was removed or disabled as a result of 
                mistake or a misidentification of the content
              </li>
              <li>
                Your name, address, telephone number, and email address, a statement that you consent to the jurisdiction 
                of the federal court located within the district in which you are located, and a statement that you will 
                accept service of process from the person who provided notification of the alleged infringement
              </li>
            </ul>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Repeat Infringers</h2>
            <p className="text-white/70 leading-relaxed">
              In accordance with the DMCA and other applicable laws, MoviePopcorn has adopted a policy of terminating, 
              in appropriate circumstances, users who are deemed to be repeat infringers. MoviePopcorn may also, at its 
              sole discretion, limit access to the service and/or terminate the accounts of any users who infringe any 
              intellectual property rights of others, whether or not there is any repeat infringement.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Our Response to DMCA Notices</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              Upon receipt of a valid DMCA notice, MoviePopcorn will:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>Remove or disable access to the allegedly infringing material</li>
              <li>Notify the user who provided the content that we have removed or disabled access</li>
              <li>Take reasonable steps to contact the user so that they may provide a counter-notification</li>
              <li>Respond to valid counter-notifications by restoring the material</li>
            </ul>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Good Faith Belief</h2>
            <p className="text-white/70 leading-relaxed">
              Please note that under the DMCA, if you knowingly materially misrepresent that material or activity is 
              infringing, you may be liable for damages. If you are unsure whether material available online is protected 
              by copyright, we suggest that you first contact a lawyer.
            </p>
          </section>

          {/* Footer */}
          <motion.div
            className="flex items-center gap-2 text-white/40 text-sm mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Copyright size={16} />
            <span>We respect intellectual property rights and expect our users to do the same.</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
