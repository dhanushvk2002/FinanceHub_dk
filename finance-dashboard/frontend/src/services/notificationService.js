const STORAGE_KEY = 'finance_recent_notifications';

export const notificationService = {
  getRecordNotifications: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addRecordNotification: ({
    moduleName = 'Finance Record',
    title,
    description,
    amount,
    route = '/dashboard',
    type = 'RECORD_ADDED',
  }) => {
    try {
      const existing = notificationService.getRecordNotifications();
      const newNotif = {
        id: `new-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: type,
        category: 'NEW',
        priority: 'HIGH',
        title: title || `New ${moduleName} Added`,
        description:
          description ||
          `A new record has been successfully added to ${moduleName}${
            amount != null ? ` ($${Number(amount).toLocaleString()})` : ''
          }.`,
        route: route,
        amount: amount,
        moduleName: moduleName,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        read: false,
        isNewRecord: true,
      };

      // Keep up to 50 most recent notifications
      const updated = [newNotif, ...existing].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Emit custom browser event for live UI reactivity
      window.dispatchEvent(
        new CustomEvent('finance:new-notification', { detail: newNotif })
      );

      return newNotif;
    } catch (err) {
      console.error('Failed to save notification:', err);
      return null;
    }
  },

  markAsRead: (id) => {
    try {
      const existing = notificationService.getRecordNotifications();
      const updated = existing.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('finance:notifications-updated'));
    } catch (err) {
      console.error(err);
    }
  },

  markAllAsRead: () => {
    try {
      const existing = notificationService.getRecordNotifications();
      const updated = existing.map((n) => ({ ...n, read: true }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('finance:notifications-updated'));
    } catch (err) {
      console.error(err);
    }
  },

  removeNotification: (id) => {
    try {
      const existing = notificationService.getRecordNotifications();
      const updated = existing.filter((n) => n.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('finance:notifications-updated'));
    } catch (err) {
      console.error(err);
    }
  },

  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('finance:notifications-updated'));
    } catch (err) {
      console.error(err);
    }
  },
};

export function parseCreationNotification(url, reqData = {}, resData = {}) {
  const cleanUrl = url.replace(/^\/api\/v1/, '').split('?')[0];

  if (cleanUrl.includes('/expenses')) {
    return {
      moduleName: 'Operating Expenses',
      route: '/finance/operating-expenses',
      title: `New Expense: ${reqData.expenseCategory || 'OPEX Record'}`,
      description: `${reqData.vendorName || reqData.description || 'Expense recorded'} • $${Number(reqData.amount || 0).toLocaleString()}`,
      amount: reqData.amount,
    };
  }

  if (cleanUrl.includes('/revenue')) {
    const amt = reqData.netAmount || (reqData.unitsSold && reqData.unitPrice ? reqData.unitsSold * reqData.unitPrice : reqData.grossAmount);
    return {
      moduleName: 'Revenue Intelligence',
      route: '/finance/revenue',
      title: `New Revenue: ${reqData.customerName || 'Customer Contract'}`,
      description: `${reqData.productCategory || 'Revenue'} (${reqData.channel || 'Direct'}) • $${Number(amt || 0).toLocaleString()}`,
      amount: amt,
    };
  }

  if (cleanUrl.includes('/receivables')) {
    return {
      moduleName: 'Accounts Receivable',
      route: '/finance/accounts-receivable',
      title: `New Invoice: ${reqData.customerName || 'Customer'}`,
      description: `Invoice #${reqData.invoiceNumber || resData.invoiceNumber || 'Created'} • $${Number(reqData.totalAmount || 0).toLocaleString()}`,
      amount: reqData.totalAmount,
    };
  }

  if (cleanUrl.includes('/payables')) {
    return {
      moduleName: 'Accounts Payable',
      route: '/finance/accounts-payable',
      title: `New Supplier Bill: ${reqData.vendorName || 'Vendor'}`,
      description: `Bill #${reqData.billNumber || resData.billNumber || 'Created'} • $${Number(reqData.totalAmount || 0).toLocaleString()}`,
      amount: reqData.totalAmount,
    };
  }

  if (cleanUrl.includes('/gst-invoices')) {
    return {
      moduleName: 'GST Invoices',
      route: '/finance/gst-invoices',
      title: `New GST Invoice: ${reqData.invoiceNumber || reqData.customerSupplierName}`,
      description: `${reqData.customerSupplierName || 'GST Record'} • Taxable: $${Number(reqData.taxableValue || 0).toLocaleString()}`,
      amount: reqData.totalInvoiceAmount || reqData.taxableValue,
    };
  }

  if (cleanUrl.includes('/payments')) {
    return {
      moduleName: 'Payments & Settlement',
      route: '/finance/payments',
      title: `New Payment: ${reqData.paymentRef || 'Transaction'}`,
      description: `${reqData.gateway || 'Gateway'} (${reqData.paymentMethod || 'Card'}) • Gross: $${Number(reqData.grossAmount || 0).toLocaleString()}`,
      amount: reqData.grossAmount,
    };
  }

  if (cleanUrl.includes('/refunds')) {
    return {
      moduleName: 'Refunds & Reversals',
      route: '/finance/refunds',
      title: `New Refund: ${reqData.customerName || reqData.refundId || 'Reversal'}`,
      description: `${reqData.reason || 'Processed reversal'} • $${Number(reqData.refundAmount || 0).toLocaleString()}`,
      amount: reqData.refundAmount,
    };
  }

  if (cleanUrl.includes('/cogs')) {
    return {
      moduleName: 'Cost of Goods Sold',
      route: '/finance/cogs',
      title: `New COGS Batch: ${reqData.productLine || 'Production'}`,
      description: `${reqData.unitsProduced || 0} units • Direct Material: $${Number(reqData.directMaterialCost || 0).toLocaleString()}`,
      amount: reqData.directMaterialCost,
    };
  }

  if (cleanUrl.includes('/balance-sheet')) {
    return {
      moduleName: 'Balance Sheet',
      route: '/finance/balance-sheet',
      title: `New Account: ${reqData.accountName || 'Asset/Liability'}`,
      description: `${reqData.classification || 'Account item'} • $${Number(reqData.amount || 0).toLocaleString()}`,
      amount: reqData.amount,
    };
  }

  if (cleanUrl.includes('/cash-flow')) {
    const amt = reqData.cashInflow || reqData.cashOutflow || 0;
    return {
      moduleName: 'Cash Flow',
      route: '/finance/cash-flow',
      title: `New Cash Movement: ${reqData.itemDescription || reqData.activityType}`,
      description: `${reqData.activityType || 'Movement'} • $${Number(amt).toLocaleString()}`,
      amount: amt,
    };
  }

  if (cleanUrl.includes('/forecasts')) {
    return {
      moduleName: 'Financial Forecast',
      route: '/finance/forecasting',
      title: `New Forecast: ${reqData.modelName || 'Horizon'}`,
      description: `Month ${reqData.forecastMonth || 'Next'} • Projected Rev: $${Number(reqData.projectedRevenue || 0).toLocaleString()}`,
      amount: reqData.projectedRevenue,
    };
  }

  if (cleanUrl.includes('/breakeven')) {
    return {
      moduleName: 'Breakeven Model',
      route: '/finance/breakeven',
      title: `New Breakeven Model: ${reqData.modelTitle || 'Scenario'}`,
      description: `${reqData.productOrService || 'Product'} • Price: $${Number(reqData.sellingPricePerUnit || 0).toLocaleString()}`,
      amount: reqData.monthlyFixedCosts,
    };
  }

  if (cleanUrl.includes('/tax-compliance')) {
    return {
      moduleName: 'Tax Compliance',
      route: '/finance/tax-compliance',
      title: `New Tax Filing: ${reqData.taxType || 'Obligation'}`,
      description: `${reqData.jurisdiction || 'Tax'} • Est: $${Number(reqData.estimatedTaxAmount || 0).toLocaleString()}`,
      amount: reqData.estimatedTaxAmount,
    };
  }

  return {
    moduleName: 'Finance System',
    route: '/dashboard',
    title: 'New Financial Record Created',
    description: 'A new financial record was successfully added and saved to the database.',
    amount: null,
  };
}
