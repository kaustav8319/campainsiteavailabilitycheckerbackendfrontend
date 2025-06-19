import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, Users } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8">
            <div className="flex items-center space-x-4 mb-4">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            </div>
            <p className="text-blue-100">
              Your privacy is important to us. Learn how we protect your data.
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Eye className="w-6 h-6 text-blue-600" />
                <span>Information We Collect</span>
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  use our services, or contact us for support.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Account information (name, email address)</li>
                  <li>Campground search preferences and history</li>
                  <li>Communication preferences</li>
                  <li>Device and usage information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Lock className="w-6 h-6 text-blue-600" />
                <span>How We Use Your Information</span>
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use the information we collect to provide, maintain, and improve our services.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Provide campground availability information</li>
                  <li>Send notifications about available campsites</li>
                  <li>Improve our search algorithms</li>
                  <li>Provide customer support</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Users className="w-6 h-6 text-blue-600" />
                <span>Information Sharing</span>
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except as described in this policy.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We may share information in response to legal requests, to protect our rights, 
                  or in connection with a business transaction.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, 
                no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@campsitefinderPro.com" className="text-blue-600 hover:underline">
                  admin@gizmofacts.com
                </a>
              </p>
            </section>

            <div className="pt-8 border-t border-gray-200">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;