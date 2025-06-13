import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react';

const TermsConditions = () => {
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
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8">
            <div className="flex items-center space-x-4 mb-4">
              <FileText className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Terms & Conditions</h1>
            </div>
            <p className="text-emerald-100">
              Please read these terms carefully before using our service.
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <span>Acceptance of Terms</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using CampSite Finder Pro, you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the 
                above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Scale className="w-6 h-6 text-emerald-600" />
                <span>Use License</span>
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Permission is granted to temporarily use CampSite Finder Pro for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">Under this license you may not:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for commercial purposes or public display</li>
                  <li>Attempt to reverse engineer any software</li>
                  <li>Remove any copyright or proprietary notations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Description</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                CampSite Finder Pro provides real-time campground availability information. 
                We strive to provide accurate and up-to-date information, but we cannot guarantee 
                the accuracy of all data.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Users are responsible for verifying availability directly with campgrounds 
                before making travel plans.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <span>Disclaimer</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The materials on CampSite Finder Pro are provided on an 'as is' basis. 
                We make no warranties, expressed or implied, and hereby disclaim all other warranties 
                including, without limitation, implied warranties of merchantability, fitness for a 
                particular purpose, or non-infringement of intellectual property.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We do not warrant that the service will be uninterrupted, timely, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  When you create an account with us, you must provide accurate and complete information. 
                  You are responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Maintaining the confidentiality of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitations</h2>
              <p className="text-gray-600 leading-relaxed">
                In no event shall CampSite Finder Pro or its suppliers be liable for any damages 
                (including, without limitation, damages for loss of data or profit, or due to business 
                interruption) arising out of the use or inability to use the service, even if we have 
                been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications</h2>
              <p className="text-gray-600 leading-relaxed">
                We may revise these terms of service at any time without notice. By using this service, 
                you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at{' '}
                <a href="mailto:legal@campsitefinderPro.com" className="text-emerald-600 hover:underline">
                  legal@campsitefinderPro.com
                </a>
              </p>
            </section>

            <div className="pt-8 border-t border-gray-200">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
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

export default TermsConditions;