'use client';

import { useState } from 'react';
import { MessageCircle, Bug, Lightbulb, Handshake } from 'lucide-react';

export default function Contact() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', { firstName, lastName, email, message });
  };

  return (
    <section className="max-w-6xl mx-auto px-6 border-t border-white/5 pt-32">
      <div className="grid md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight mb-2">
            Get in Touch
          </h1>
          <h2 className="text-lg text-white font-medium mb-4">
            We&apos;d love to hear from you
          </h2>
          <p className="text-sm text-neutral-400 mb-10 leading-relaxed">
            Whether you have a question, feedback, or just want to say hi — we&apos;re here to listen.
          </p>

          <div className="border-t border-white/5 pt-10">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-6">
              Quick Links
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MessageCircle className="text-white mt-0.5" size={18} strokeWidth={1.5} />
                <div>
                  <div className="text-sm font-medium text-white mb-1">General Questions</div>
                  <a
                    href="mailto:hello@swiipy.com"
                    className="text-xs text-neutral-500 hover:text-white transition-colors"
                  >
                    hello@swiipy.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Bug className="text-white mt-0.5" size={18} strokeWidth={1.5} />
                <div>
                  <div className="text-sm font-medium text-white mb-1">Report a Bug</div>
                  <a
                    href="mailto:bugs@swiipy.com"
                    className="text-xs text-neutral-500 hover:text-white transition-colors"
                  >
                    bugs@swiipy.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lightbulb className="text-white mt-0.5" size={18} strokeWidth={1.5} />
                <div>
                  <div className="text-sm font-medium text-white mb-1">Feature Request</div>
                  <a
                    href="mailto:feedback@swiipy.com"
                    className="text-xs text-neutral-500 hover:text-white transition-colors"
                  >
                    feedback@swiipy.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Handshake className="text-white mt-0.5" size={18} strokeWidth={1.5} />
                <div>
                  <div className="text-sm font-medium text-white mb-1">Partnerships</div>
                  <a
                    href="mailto:partnerships@swiipy.com"
                    className="text-xs text-neutral-500 hover:text-white transition-colors"
                  >
                    partnerships@swiipy.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/10 border border-white/5 p-8 rounded-2xl h-fit">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-500 ml-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-neutral-500 ml-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-neutral-500 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
                placeholder="jane@company.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-neutral-500 ml-1">Message</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/40 transition-colors resize-none"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-white text-black font-medium text-sm rounded-lg hover:bg-neutral-200 transition-colors mt-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
