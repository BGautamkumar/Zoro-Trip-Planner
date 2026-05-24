'use client';

import React, { useState } from 'react';
import { X, Link2, Copy, Check, QrCode, Share2, Twitter, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripUrl: string;
  tripName: string;
}

export function ShareModal({ isOpen, onClose, tripUrl, tripName }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tripUrl);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = tripUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      label: 'WhatsApp',
      icon: <MessageCircle className="w-4 h-4" />,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my trip to ${tripName}! ${tripUrl}`)}`, '_blank'),
    },
    {
      label: 'Twitter',
      icon: <Twitter className="w-4 h-4" />,
      color: 'bg-sky-500 hover:bg-sky-600',
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just planned an amazing trip to ${tripName} with @ZoroTripPlanner! 🌍✈️`)}&url=${encodeURIComponent(tripUrl)}`, '_blank'),
    },
  ];

  // Simple QR code using a public API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tripUrl)}&bgcolor=FFFFFF&color=0B1D3A&margin=10`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deep to-ocean flex items-center justify-center shadow-md">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-deep dark:text-white">Share Trip</h3>
                  <p className="text-xs text-gray-500">{tripName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              {/* Copy Link */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                  Trip Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 truncate border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Link2 className="w-4 h-4 shrink-0 text-gray-400" />
                      <span className="truncate">{tripUrl}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleCopy}
                    className={`rounded-xl px-4 shrink-0 transition-all duration-300 ${
                      copied
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gradient-to-r from-deep to-ocean hover:from-deep-light hover:to-ocean-light text-white'
                    }`}
                  >
                    {copied ? (
                      <><Check className="w-4 h-4 mr-1.5" /> Copied</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-1.5" /> Copy</>
                    )}
                  </Button>
                </div>
              </div>

              {/* Share to apps */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                  Share via
                </label>
                <div className="flex gap-2">
                  {shareOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={opt.onClick}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${opt.color} text-white text-sm font-medium transition-colors shadow-sm hover:shadow-md`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code */}
              <div>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center gap-2 text-sm text-ocean hover:text-ocean-dark font-medium transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  {showQR ? 'Hide QR Code' : 'Show QR Code'}
                </button>

                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 dark:border-gray-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrCodeUrl}
                          alt={`QR code for ${tripName}`}
                          width={200}
                          height={200}
                          className="rounded-lg"
                        />
                        <p className="text-[10px] text-gray-400 text-center">
                          Scan to open this trip on your phone
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ShareModal;
