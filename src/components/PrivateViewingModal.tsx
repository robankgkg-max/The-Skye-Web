import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { X, ChevronDown, CheckCircle2 } from 'lucide-react';

interface PrivateViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivateViewingModal({ isOpen, onClose }: PrivateViewingModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [configuration, setConfiguration] = useState('4 BHK Luxury Residence');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key press & prevent background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('has-modal-open');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove('has-modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val.startsWith('+91')) {
      setPhone('+91 ');
    } else {
      setPhone(val);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFullName('');
    setPhone('+91 ');
    setEmail('');
    setConfiguration('4 BHK Luxury Residence');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
      }}
      onClick={handleResetAndClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-[90%] max-w-[560px] animate-scaleUp overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111111',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxHeight: 'calc(100vh - 40px)',
          boxSizing: 'border-box',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85)',
        }}
      >
        <div className="p-[28px_24px] sm:p-[40px_40px_36px]">
          {/* CARD HEADER (top of card) */}
          <div className="flex items-start justify-between w-full">
            {/* Brand logo top-left */}
            <div className="flex items-center select-none">
              <img
                src="https://res.cloudinary.com/pcodbmuo/image/upload/v1786068596/ChatGPT_Image_Aug_7_2026_07_39_16_AM_ihq1lg.jpg"
                alt="Creator Group"
                className="w-[145px] sm:w-[165px] h-[36px] sm:h-[40px] object-cover object-[center_48%]"
                style={{
                  mixBlendMode: 'screen',
                  filter: 'contrast(1.12)',
                }}
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Close (×) button top-right */}
            <button
              type="button"
              onClick={handleResetAndClose}
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '20px',
                lineHeight: 1,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)')}
              aria-label="Close modal"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {isSubmitted ? (
            /* Confirmation State */
            <div className="py-10 text-center flex flex-col items-center">
              <CheckCircle2 size={44} className="text-[#C9AA71] mb-4 stroke-[1.3]" />
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', 'EB Garamond', serif",
                  fontSize: '32px',
                  fontWeight: 300,
                  color: '#FFFFFF',
                  marginBottom: '12px',
                }}
              >
                Request Confirmed
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.55)',
                  lineHeight: 1.6,
                  maxWidth: '380px',
                  marginBottom: '28px',
                }}
              >
                Thank you{fullName ? `, ${fullName}` : ''}. Our residences concierge team from Crietor Group will personally contact you with floor plans and bespoke viewing details.
              </p>
              <button
                type="button"
                onClick={handleResetAndClose}
                style={{
                  background: '#C9AA71',
                  color: '#0A0A0A',
                  fontSize: '12px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  height: '48px',
                  padding: '0 32px',
                  borderRadius: '4px',
                  border: 'none',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          ) : (
            /* Main Presentation Form */
            <>
              {/* HEADING & SUBTEXT */}
              <h2
                id="modal-title"
                className="text-[28px] sm:text-[40px]"
                style={{
                  textAlign: 'left',
                  fontFamily: "'Cormorant Garamond', 'EB Garamond', serif",
                  fontWeight: 300,
                  color: '#FFFFFF',
                  marginTop: '20px',
                  lineHeight: 1.15,
                }}
              >
                Schedule a Private Presentation
              </h2>

              <p
                style={{
                  textAlign: 'left',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.55)',
                  lineHeight: 1.6,
                  marginBottom: '28px',
                  marginTop: '8px',
                }}
              >
                Connect with our dedicated private residences team for floor plans, bespoke pricing, and site visits at Kashmir Kunnu.
              </p>

              {/* FORM FIELDS */}
              <form onSubmit={handleSubmit}>
                {/* Field 1: FULL NAME */}
                <div style={{ marginBottom: '20px' }}>
                  <label
                    htmlFor="pv-fullname"
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      fontVariant: 'small-caps',
                      marginBottom: '8px',
                      textAlign: 'left',
                    }}
                  >
                    FULL NAME
                  </label>
                  <input
                    id="pv-fullname"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pv-input-field"
                    style={{
                      width: '100%',
                      background: '#1E1E1E',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '5px',
                      padding: '14px 16px',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Field 2: PHONE NUMBER */}
                <div style={{ marginBottom: '20px' }}>
                  <label
                    htmlFor="pv-phone"
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      fontVariant: 'small-caps',
                      marginBottom: '8px',
                      textAlign: 'left',
                    }}
                  >
                    PHONE NUMBER
                  </label>
                  <input
                    id="pv-phone"
                    type="tel"
                    required
                    placeholder="+91"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="pv-input-field"
                    style={{
                      width: '100%',
                      background: '#1E1E1E',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '5px',
                      padding: '14px 16px',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Field 3: EMAIL ADDRESS */}
                <div style={{ marginBottom: '20px' }}>
                  <label
                    htmlFor="pv-email"
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      fontVariant: 'small-caps',
                      marginBottom: '8px',
                      textAlign: 'left',
                    }}
                  >
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="pv-email"
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pv-input-field"
                    style={{
                      width: '100%',
                      background: '#1E1E1E',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '5px',
                      padding: '14px 16px',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Field 4: RESIDENCE CONFIGURATION */}
                <div style={{ marginBottom: '20px' }}>
                  <label
                    htmlFor="pv-config"
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      fontVariant: 'small-caps',
                      marginBottom: '8px',
                      textAlign: 'left',
                    }}
                  >
                    RESIDENCE CONFIGURATION
                  </label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <select
                      id="pv-config"
                      value={configuration}
                      onChange={(e) => setConfiguration(e.target.value)}
                      className="pv-input-field"
                      style={{
                        width: '100%',
                        background: '#1E1E1E',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '5px',
                        padding: '14px 44px 14px 16px',
                        color: '#FFFFFF',
                        fontSize: '15px',
                        boxSizing: 'border-box',
                        appearance: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="4 BHK Luxury Residence" style={{ background: '#1E1E1E', color: '#FFFFFF' }}>
                        4 BHK Luxury Residence
                      </option>
                      <option value="3 BHK Luxury Residence" style={{ background: '#1E1E1E', color: '#FFFFFF' }}>
                        3 BHK Luxury Residence
                      </option>
                      <option value="Penthouse Sky Villa" style={{ background: '#1E1E1E', color: '#FFFFFF' }}>
                        Penthouse Sky Villa
                      </option>
                      <option value="Presidential Duplex" style={{ background: '#1E1E1E', color: '#FFFFFF' }}>
                        Presidential Duplex
                      </option>
                    </select>
                    <ChevronDown
                      size={18}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 255, 255, 0.5)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* CTA BUTTON */}
                <div style={{ marginTop: '24px' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      background: '#C9AA71',
                      color: '#0A0A0A',
                      fontSize: '12px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      height: '56px',
                      borderRadius: '4px',
                      border: 'none',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s ease, opacity 0.2s ease',
                      opacity: isSubmitting ? 0.8 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) e.currentTarget.style.backgroundColor = '#D4B77E';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) e.currentTarget.style.backgroundColor = '#C9AA71';
                    }}
                  >
                    {isSubmitting ? 'CONFIRMING...' : 'CONFIRM PRIVATE VIEWING'}
                  </button>
                </div>

                {/* DISCLAIMER TEXT */}
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.3)',
                    marginTop: '14px',
                    marginBottom: '0',
                    lineHeight: 1.5,
                  }}
                >
                  Private &amp; confidential. Direct developer communication.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

