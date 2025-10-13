import { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

export interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * HelpModal - Help documentation and FAQs
 *
 * Provides quick access to common questions and support resources.
 */
export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I start a translation session?',
      answer: 'Click the "Start Translation" button on the host setup screen after selecting your source language, target languages, and tier (for PAYG users).'
    },
    {
      question: 'What is a "translation" vs "total languages"?',
      answer: '1 translation = 1 target language. Total languages = source + targets.\n\nExample: English (source) → Spanish (target) = 1 translation, 2 total languages.\nEnglish → Spanish + French = 2 translations, 3 total languages.'
    },
    {
      question: 'How many languages can I use?',
      answer: 'Depends on your tier (translation limits shown):\n• Daily Free: 2 translations (3 total languages)\n• Starter: 1 translation (2 total) - $45/hr + $10/hr per extra\n• Professional: 5 translations (6 total) - $75/hr + $8/hr per extra\n• Enterprise: 15 translations (16 total) - $105/hr + $6/hr per extra\n\nYou can add more languages as overages - billed per hour.'
    },
    {
      question: 'What are overage charges?',
      answer: 'If you select more target languages than your tier includes, extra languages are billed per hour:\n• Starter: +$10/hr per extra language\n• Professional: +$8/hr per extra language\n• Enterprise: +$6/hr per extra language\n\nOverages are prorated - if you add a language 30 minutes into a session, you only pay for 30 minutes.'
    },
    {
      question: 'What is the participant multiplier?',
      answer: 'For meetings over 100 participants, pricing increases by 25% per 100 participants:\n• 1-100 participants: 1.0x (no change)\n• 101-200 participants: 1.25x (+25%)\n• 201-300 participants: 1.5x (+50%)\n• 301-400 participants: 1.75x (+75%)\n• 401-500 participants: 2.0x (+100%)\n\nThis applies to both base rate and overage charges.'
    },
    {
      question: 'How does pay-as-you-go billing work?',
      answer: 'PAYG users are charged monthly for actual hours used:\n• Select your tier when starting each session\n• Pricing: $45/hr (Starter), $75/hr (Pro), $105/hr (Enterprise)\n• Same price for up to 100 participants (then +25% per 100 more)\n• Overage languages billed per hour\n• Pay at end of month for all usage'
    },
    {
      question: 'Can I change languages during a session?',
      answer: 'Participants can change their selected language at any time by clicking "Change Language" in the caption view. Hosts can add extra target languages during a session (as overages), but cannot remove the initial languages.'
    },
    {
      question: 'What is a session template?',
      answer: 'Templates let you save frequently-used session configurations (meeting type, languages, glossary) for quick reuse in future meetings.'
    },
    {
      question: 'How do glossaries improve translations?',
      answer: 'Custom glossaries provide domain-specific terminology (medical, legal, technical terms) to improve translation accuracy. Upload CSV files with term pairs.'
    },
    {
      question: 'What is the daily free tier?',
      answer: 'Users without a payment method get 15 minutes of free translation per day:\n• 2 translations (3 total languages)\n• Resets daily at midnight UTC\n• No payment method required\n• Upgrade to PAYG anytime for unlimited usage'
    },
    {
      question: 'Can I download transcripts?',
      answer: 'Yes! Hosts can download PDF transcripts with all translations after each session ends (if enabled in preferences).'
    },
    {
      question: 'Why can\'t I see the translation app?',
      answer: 'Make sure the host has started a translation session. Participants can only access translations during active sessions.'
    },
    {
      question: 'How do I contact support?',
      answer: 'Email us at support@meetingsync.com or use the Zoom chat to contact your meeting host for immediate assistance.'
    }
  ];

  // Filter FAQs based on search
  const filteredFaqs = searchQuery
    ? faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Help & Support"
      size="lg"
    >
      <div className="space-y-6">
        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open('https://docs.meetingsync.com', '_blank')}
            className="w-full"
          >
            Documentation
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open('mailto:support@meetingsync.com', '_blank')}
            className="w-full"
          >
            Email Support
          </Button>
        </div>

        {/* Search */}
        <Input
          type="text"
          placeholder="Search help topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* FAQs */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Frequently Asked Questions
          </h3>

          {filteredFaqs.length === 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
              No results found for "{searchQuery}"
            </p>
          )}

          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              {/* Question */}
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {faq.question}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {expandedFaq === index ? '−' : '+'}
                </span>
              </button>

              {/* Answer */}
              {expandedFaq === index && (
                <div className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line border-t border-gray-200 dark:border-gray-700 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-4">
          <p className="text-sm font-semibold text-teal-900 dark:text-teal-100 mb-2">
            Still need help?
          </p>
          <p className="text-sm text-teal-800 dark:text-teal-200 mb-3">
            Our support team is here to help you 24/7.
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-teal-900 dark:text-teal-100">
              <strong>Email:</strong>{' '}
              <a href="mailto:support@meetingsync.com" className="underline hover:no-underline">
                support@meetingsync.com
              </a>
            </p>
            <p className="text-teal-900 dark:text-teal-100">
              <strong>Response Time:</strong> Within 2 hours during business hours
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
