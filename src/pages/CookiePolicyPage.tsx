import { motion } from 'framer-motion';
import { Cookie, Calendar, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookiePolicyPage() {
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
              <Cookie size={24} strokeWidth={2.5} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Cookie Policy
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
            <h2 className="text-xl font-bold text-white mb-4">What Are Cookies?</h2>
            <p className="text-white/70 leading-relaxed">
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">How We Use Cookies</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              MoviePopcorn uses cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Marketing Cookies:</strong> Track visitors across websites to display relevant ads</li>
            </ul>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Essential Cookies</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-2">
                  These cookies are necessary for the website to function and cannot be switched off. They are usually 
                  only set in response to actions made by you such as setting your privacy preferences, logging in, or 
                  filling in forms.
                </p>
                <div className="bg-white/[0.02] rounded-lg p-3 text-xs text-white/60">
                  <strong>Examples:</strong> Authentication tokens, security cookies, session management
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Functional Cookies</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-2">
                  These cookies enable the website to provide enhanced functionality and personalization. They may be 
                  set by us or by third party providers whose services we have added to our pages.
                </p>
                <div className="bg-white/[0.02] rounded-lg p-3 text-xs text-white/60">
                  <strong>Examples:</strong> Watchlist storage, watch history, theme preferences, language settings
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Analytics Cookies</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-2">
                  These cookies help us understand how visitors interact with our website by collecting and reporting 
                  information anonymously. This helps us improve the way our website works.
                </p>
                <div className="bg-white/[0.02] rounded-lg p-3 text-xs text-white/60">
                  <strong>Examples:</strong> Page views, user behavior, performance metrics
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Marketing Cookies</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-2">
                  These cookies may be set through our site by our advertising partners. They may be used by those 
                  companies to build a profile of your interests and show you relevant adverts on other sites.
                </p>
                <div className="bg-white/[0.02] rounded-lg p-3 text-xs text-white/60">
                  <strong>Examples:</strong> Ad targeting, campaign tracking, conversion measurement
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Managing Cookies</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              You can manage your cookie preferences at any time by clicking the cookie settings button in the footer 
              of our website or by using the controls in your browser.
            </p>
            <p className="text-white/70 leading-relaxed mb-3">
              Most browsers allow you to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>View what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from particular sites</li>
              <li>Block all cookies from being set</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-200 text-sm flex items-start gap-2">
                <Info size={16} className="flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> If you block cookies, some features of our service may not function properly 
                  and your user experience may be affected.
                </span>
              </p>
            </div>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Third-Party Cookies</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              In some special cases we also use cookies provided by trusted third parties. The following section 
              details which third party cookies you might encounter through this site:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>
                <strong>TMDB API:</strong> We use The Movie Database API to fetch movie and TV show information. 
                They may set cookies for API authentication.
              </li>
              <li>
                <strong>VidAPI:</strong> Our video streaming provider may set cookies for video playback and 
                performance optimization.
              </li>
              <li>
                <strong>Analytics Services:</strong> We may use third-party analytics services that use cookies to 
                help us understand how our site is used.
              </li>
            </ul>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Consent</h2>
            <p className="text-white/70 leading-relaxed">
              By continuing to use our website, you consent to our use of cookies as described in this policy. 
              You can withdraw your consent at any time by adjusting your cookie preferences or by disabling cookies 
              in your browser settings.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Changes to This Policy</h2>
            <p className="text-white/70 leading-relaxed">
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the 
              new Cookie Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              If you have any questions about our use of cookies, please contact us at{' '}
              <a href="mailto:privacy@moviepopcorn.com" className="text-primary hover:underline">
                privacy@moviepopcorn.com
              </a>
            </p>
          </section>

          {/* Footer */}
          <motion.div
            className="flex items-center justify-between mt-12 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Cookie size={16} />
              <span>Manage your cookie preferences anytime</span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('moviepopcorn_cookie_consent');
                window.location.reload();
              }}
              className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/30 transition-colors"
            >
              Reset Cookie Consent
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
