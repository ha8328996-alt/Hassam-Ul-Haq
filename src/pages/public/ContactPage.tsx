import React, { useState } from 'react';
import { Link } from '../../context/RouterContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import {
  Mail,
  User,
  Building2,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  Sparkles,
  HelpCircle,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react';

export function ContactPage() {
  const { success, error: toastError } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [inquiryType, setInquiryType] = useState('enterprise_demo');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      toastError('Missing Fields', 'Please fill in your name, email, and message.');
      return;
    }

    if (!email.includes('@')) {
      toastError('Invalid Email', 'Please enter a valid work email.');
      return;
    }

    setIsSubmitting(true);
    // Simulate professional message dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      success('Message Received', 'Thank you! A FlowPilot specialist will respond shortly.');
    }, 600);
  };

  return (
    <div className="space-y-16 pb-20 animate-in fade-in duration-300">
      {/* 1. Header */}
      <section className="pt-12 sm:pt-20 pb-4 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Contact Us</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.15]">
          Let’s Talk About Automating Your Business
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Have questions about AI agent deployments, custom workflow integrations, or enterprise plans? Our engineering team is here to assist.
        </p>
      </section>

      {/* 2. Main Form & Info Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 space-y-6">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                      Send Us a Message
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Fill out the form below and we'll reply within 2 business hours.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      leftIcon={<User className="w-4 h-4" />}
                      disabled={isSubmitting}
                    />

                    <Input
                      label="Work Email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      leftIcon={<Mail className="w-4 h-4" />}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Company Name"
                      type="text"
                      placeholder="Acme Corporation"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      leftIcon={<Building2 className="w-4 h-4" />}
                      disabled={isSubmitting}
                    />

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        Inquiry Topic
                      </label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
                      >
                        <option value="enterprise_demo">Enterprise Demo & Custom POC</option>
                        <option value="technical_support">Technical Support & API Help</option>
                        <option value="partnerships">Strategic Partnerships & Resellers</option>
                        <option value="general">General Inquiries</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Message / Project Details
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Tell us about the workflows or AI agents you are looking to automate..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 leading-relaxed resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="md"
                    isLoading={isSubmitting}
                    className="w-full"
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Send Message
                  </Button>

                  <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Your data is confidential and protected by FlowPilot AI privacy policies.</span>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Message Received!
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting FlowPilot AI,{' '}
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">{fullName}</span>.
                      We have routed your request to our solutions engineering team.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false);
                        setMessage('');
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Contact Information
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0">
                    <Mail className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-white block">Email Inquiries</span>
                    <a
                      href="mailto:support@flowpilot.ai"
                      className="text-neutral-500 hover:text-emerald-500 transition-colors font-mono"
                    >
                      support@flowpilot.ai
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0">
                    <Clock className="w-4 h-4 text-sky-500" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-white block">Response SLA</span>
                    <span className="text-neutral-500">Under 2 hours during business hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0">
                    <MapPin className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-white block">Headquarters</span>
                    <span className="text-neutral-500">San Francisco, CA • Distributed Global Team</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-3 bg-neutral-50/60 dark:bg-neutral-900/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <h4 className="font-bold text-xs text-neutral-900 dark:text-white">
                  Looking to start immediately?
                </h4>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                You can create a free workspace in under 60 seconds. Build your first autonomous AI agent with zero upfront commitment.
              </p>
              <div className="pt-1">
                <Link to="/signup">
                  <Button size="sm" className="w-full">
                    Create Free Workspace
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6 space-y-2">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold text-xs">
                <HelpCircle className="w-4 h-4 text-neutral-400" />
                <span>Frequently Asked Questions</span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Need quick answers on pricing, integrations, or security? Visit our{' '}
                <Link to="/" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                  Home FAQ
                </Link>
                .
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
