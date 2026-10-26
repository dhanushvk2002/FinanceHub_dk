import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  Clock,
  FileText,
  CheckCircle2,
  DollarSign,
  X,
  ExternalLink,
  RefreshCw,
  PlusCircle,
  Sparkles,
  Check,
} from 'lucide-react';
import { receivablesService } from '../../services/receivablesService';
import { payablesService } from '../../services/payablesService';
import { taxComplianceService } from '../../services/taxComplianceService';
import { gstService } from '../../services/gstService';
import { notificationService } from '../../services/notificationService';

function formatRelativeTime(isoString) {
  if (!isoString) return 'Just now';
  try {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recently';
  }
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auditNotifications, setAuditNotifications] = useState([]);
  const [newRecordNotifications, setNewRecordNotifications] = useState(() =>
    notificationService.getRecordNotifications()
  );
  const [hasNewPing, setHasNewPing] = useState(false);
  const [filter, setFilter] = useState('ALL'); // ALL, NEW, OVERDUE, UPCOMING, COMPLIANCE
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleNew = (e) => {
      if (e.detail) {
        setNewRecordNotifications(notificationService.getRecordNotifications());
        setHasNewPing(true);
        setTimeout(() => setHasNewPing(false), 4000);
      }
    };
    const handleUpdated = () => {
      setNewRecordNotifications(notificationService.getRecordNotifications());
    };

    window.addEventListener('finance:new-notification', handleNew);
    window.addEventListener('finance:notifications-updated', handleUpdated);
    window.addEventListener('storage', handleUpdated);
    return () => {
      window.removeEventListener('finance:new-notification', handleNew);
      window.removeEventListener('finance:notifications-updated', handleUpdated);
      window.removeEventListener('storage', handleUpdated);
    };
  }, []);

  const fetchAuditNotifications = async () => {
    setLoading(true);
    try {
      const [recRes, payRes, taxRes, gstRes] = await Promise.allSettled([
        receivablesService.getAll(),
        payablesService.getAll(),
        taxComplianceService.getAll(),
        gstService.getAll(),
      ]);

      const items = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. Receivables Overdue & Pending
      if (recRes.status === 'fulfilled' && recRes.value?.data) {
        const arList = recRes.value.data;
        arList.forEach((ar) => {
          if (ar.status === 'PAID' || ar.status === 'CANCELLED') return;
          const due = ar.dueDate ? new Date(ar.dueDate) : null;
          const isOverdue = due && due < today;
          const diffDays = due ? Math.ceil((due - today) / (1000 * 60 * 60 * 24)) : null;

          if (isOverdue || ar.status === 'OVERDUE') {
            items.push({
              id: `ar-${ar.id}`,
              type: 'RECEIVABLE',
              category: 'OVERDUE',
              priority: 'HIGH',
              title: `Overdue Invoice: ${ar.customerName}`,
              description: `Invoice #${ar.invoiceNumber || ar.id} is overdue by ${Math.abs(diffDays || 0)} day(s). Outstanding: $${Number(ar.outstandingBalance || ar.totalAmount || 0).toLocaleString()}`,
              route: '/finance/accounts-receivable',
              date: ar.dueDate,
              read: false,
            });
          } else if (diffDays !== null && diffDays <= 7 && diffDays >= 0) {
            items.push({
              id: `ar-up-${ar.id}`,
              type: 'RECEIVABLE',
              category: 'UPCOMING',
              priority: 'MEDIUM',
              title: `Invoice Due in ${diffDays} day(s)`,
              description: `${ar.customerName} - $${Number(ar.outstandingBalance || ar.totalAmount || 0).toLocaleString()}`,
              route: '/finance/accounts-receivable',
              date: ar.dueDate,
              read: false,
            });
          }
        });
      }

      // 2. Payables Overdue & Obligations Due Soon
      if (payRes.status === 'fulfilled' && payRes.value?.data) {
        const apList = payRes.value.data;
        apList.forEach((ap) => {
          if (ap.status === 'PAID') return;
          const due = ap.dueDate ? new Date(ap.dueDate) : null;
          const isOverdue = due && due < today;
          const diffDays = due ? Math.ceil((due - today) / (1000 * 60 * 60 * 24)) : null;

          if (isOverdue || ap.status === 'OVERDUE') {
            items.push({
              id: `ap-${ap.id}`,
              type: 'PAYABLE',
              category: 'OVERDUE',
              priority: 'HIGH',
              title: `Overdue Supplier Bill: ${ap.vendorName}`,
              description: `Bill #${ap.billNumber || ap.id} due on ${ap.dueDate}. Outstanding: $${Number(ap.outstandingBalance || ap.totalAmount || 0).toLocaleString()}`,
              route: '/finance/accounts-payable',
              date: ap.dueDate,
              read: false,
            });
          } else if (diffDays !== null && diffDays <= 7 && diffDays >= 0) {
            items.push({
              id: `ap-up-${ap.id}`,
              type: 'PAYABLE',
              category: 'UPCOMING',
              priority: 'MEDIUM',
              title: `Bill Due Soon: ${ap.vendorName}`,
              description: `Due in ${diffDays} day(s) ($${Number(ap.outstandingBalance || ap.totalAmount || 0).toLocaleString()})`,
              route: '/finance/accounts-payable',
              date: ap.dueDate,
              read: false,
            });
          }
        });
      }

      // 3. Tax Compliance & Statutory Filings
      if (taxRes.status === 'fulfilled' && taxRes.value?.data) {
        const taxList = taxRes.value.data;
        taxList.forEach((tax) => {
          if (tax.status === 'FILED' || tax.status === 'PAID') return;
          const due = tax.dueDate ? new Date(tax.dueDate) : null;
          const isOverdue = due && due < today;

          items.push({
            id: `tax-${tax.id}`,
            type: 'TAX',
            category: 'COMPLIANCE',
            priority: isOverdue ? 'HIGH' : 'MEDIUM',
            title: `${tax.taxType || 'Statutory Tax'} Filing (${tax.taxPeriod || 'Scheduled'})`,
            description: `${tax.jurisdiction || 'Federal'} • Due: ${tax.dueDate || 'Pending'} • Est: $${Number(tax.estimatedTaxAmount || 0).toLocaleString()}`,
            route: '/finance/tax-compliance',
            date: tax.dueDate,
            read: false,
          });
        });
      }

      // 4. GST Invoices Pending Filing
      if (gstRes.status === 'fulfilled' && gstRes.value?.data) {
        const gstList = gstRes.value.data;
        const pendingGst = gstList.filter((g) => g.filingStatus === 'PENDING');
        if (pendingGst.length > 0) {
          items.push({
            id: 'gst-pending-summary',
            type: 'GST',
            category: 'COMPLIANCE',
            priority: 'MEDIUM',
            title: `${pendingGst.length} Pending GST Invoices for GSTR Filing`,
            description: `Review unfiled GST tax invoices before reconciliation deadline.`,
            route: '/finance/gst-invoices',
            date: new Date().toISOString().split('T')[0],
            read: false,
          });
        }
      }

      // Sort: HIGH priority first, then by date
      items.sort((a, b) => {
        if (a.priority === 'HIGH' && b.priority !== 'HIGH') return -1;
        if (a.priority !== 'HIGH' && b.priority === 'HIGH') return 1;
        return (new Date(a.date || 0)) - (new Date(b.date || 0));
      });

      setAuditNotifications(items);
    } catch {
      // Keep empty if failed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditNotifications();
    const interval = setInterval(fetchAuditNotifications, 60000); // 1 min auto-refresh
    return () => clearInterval(interval);
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const combinedNotifications = [
    ...newRecordNotifications,
    ...auditNotifications,
  ];

  const unreadCount =
    newRecordNotifications.filter((n) => !n.read).length +
    auditNotifications.length;

  const filteredNotifications = combinedNotifications.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'NEW') return item.category === 'NEW';
    if (filter === 'OVERDUE') return item.category === 'OVERDUE';
    if (filter === 'UPCOMING') return item.category === 'UPCOMING';
    if (filter === 'COMPLIANCE') return item.category === 'COMPLIANCE';
    return true;
  });

  const handleItemClick = (item) => {
    if (item.id && item.category === 'NEW') {
      notificationService.markAsRead(item.id);
    }
    setIsOpen(false);
    if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        className="topbar-action-btn"
        style={{
          position: 'relative',
          cursor: 'pointer',
          backgroundColor: isOpen ? 'var(--bg-card-hover)' : undefined,
          boxShadow: hasNewPing ? '0 0 0 2px #10b981' : undefined,
        }}
        onClick={() => setIsOpen(!isOpen)}
        title="Audit & Financial Notifications"
        aria-label="Audit Notifications"
      >
        <Bell size={17} color={unreadCount > 0 ? 'var(--text-main)' : 'var(--text-muted)'} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: hasNewPing ? '#10b981' : '#f43f5e',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 800,
              minWidth: '18px',
              height: '18px',
              padding: '0 4px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 2px var(--bg-card)',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: '420px',
            maxWidth: '92vw',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '14px',
            boxShadow: 'var(--shadow-card-hover)',
            border: '1px solid var(--border-light)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeInSlide 0.2s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bell size={16} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                  Audit &amp; Alerts
                </h4>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {unreadCount} notification{unreadCount !== 1 ? 's' : ''}{' '}
                  {newRecordNotifications.length > 0 &&
                    `(${newRecordNotifications.length} newly added)`}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {newRecordNotifications.length > 0 && (
                <button
                  onClick={() => notificationService.clearAll()}
                  title="Clear newly added records"
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.68rem', padding: '3px 8px' }}
                >
                  Clear New
                </button>
              )}
              <button
                onClick={fetchAuditNotifications}
                title="Refresh alerts"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <RefreshCw size={14} className={loading ? 'spin' : ''} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div
            style={{
              padding: '10px 18px',
              backgroundColor: 'var(--bg-card-hover)',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'ALL', label: 'All' },
              {
                id: 'NEW',
                label: `New Added ${
                  newRecordNotifications.length > 0
                    ? `(${newRecordNotifications.length})`
                    : ''
                }`,
              },
              { id: 'OVERDUE', label: 'Overdue' },
              { id: 'UPCOMING', label: 'Upcoming' },
              { id: 'COMPLIANCE', label: 'Tax & GST' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  backgroundColor: filter === f.id ? 'var(--primary)' : 'var(--bg-card)',
                  color: filter === f.id ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div
            style={{
              maxHeight: '360px',
              overflowY: 'auto',
              padding: '8px 10px',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            {loading && combinedNotifications.length === 0 ? (
              <div
                style={{
                  padding: '30px 16px',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                }}
              >
                Checking financial ledger &amp; schedules...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div
                style={{
                  padding: '36px 16px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={32} color="#10b981" />
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                  {filter === 'NEW'
                    ? 'No New Records Added Yet'
                    : 'All Ledgers Reconciled'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '260px' }}>
                  {filter === 'NEW'
                    ? 'When you create an invoice, expense, or payment, it will immediately appear here.'
                    : 'No overdue invoices, outstanding bills, or pending statutory obligations detected.'}
                </div>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const isNew = item.category === 'NEW';
                const isOverdue = item.priority === 'HIGH' && !isNew;
                const iconColor = isNew
                  ? '#10b981'
                  : isOverdue
                  ? '#f43f5e'
                  : item.type === 'TAX'
                  ? '#a855f7'
                  : '#f59e0b';
                const iconBg = isNew
                  ? 'rgba(16, 185, 129, 0.12)'
                  : isOverdue
                  ? 'rgba(244, 63, 94, 0.12)'
                  : item.type === 'TAX'
                  ? 'rgba(168, 85, 247, 0.12)'
                  : 'rgba(245, 158, 11, 0.12)';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    style={{
                      padding: '11px 13px',
                      borderRadius: '10px',
                      marginBottom: '7px',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      transition: 'all 0.15s ease',
                      backgroundColor: isNew ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
                      border: isNew ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-light)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isNew
                        ? 'rgba(16, 185, 129, 0.08)'
                        : 'var(--bg-card)';
                    }}
                  >
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        backgroundColor: iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {isNew ? (
                        <PlusCircle size={16} color={iconColor} />
                      ) : isOverdue ? (
                        <AlertTriangle size={16} color={iconColor} />
                      ) : item.type === 'TAX' || item.type === 'GST' ? (
                        <FileText size={16} color={iconColor} />
                      ) : (
                        <Clock size={16} color={iconColor} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '6px',
                        }}
                      >
                        <span
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.title}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {isNew && (
                            <span
                              style={{
                                fontSize: '0.62rem',
                                backgroundColor: '#10b981',
                                color: '#ffffff',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              NEW
                            </span>
                          )}
                          {isOverdue && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                backgroundColor: 'rgba(244, 63, 94, 0.18)',
                                color: '#f43f5e',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              URGENT
                            </span>
                          )}
                          {isNew && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                notificationService.removeNotification(item.id);
                              }}
                              title="Dismiss"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '2px',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          marginTop: '3px',
                          lineHeight: 1.4,
                        }}
                      >
                        {item.description}
                      </div>
                      {isNew && item.timestamp && (
                        <div
                          style={{
                            fontSize: '0.68rem',
                            color: '#10b981',
                            marginTop: '3px',
                            fontWeight: 600,
                          }}
                        >
                          Added {formatRelativeTime(item.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Action */}
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: 'var(--bg-card-hover)',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Enterprise Financial Monitor</span>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/finance/tax-compliance');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0,
              }}
            >
              Statutory Center <ExternalLink size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
