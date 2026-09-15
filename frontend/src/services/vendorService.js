import { fetchWithAuth } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const DEFAULT_VENDORS = [
  {
    id: 1,
    vendor_code: 'VEND-0001',
    display_name: 'ROYAL ENFIELD DISTRIBUTORS',
    contact_no: '9840112233',
    email: 'contact@royalenfielddist.com',
    gst: '33AABCR1234F1Z5',
    status: 'Active',
    payment_terms: 'Net 30',
    website: 'https://royalenfield.com',
    billing_address: 'No 45, Anna Salai, Guindy, Chennai - 600032',
    shipping_address: 'No 45, Anna Salai, Guindy, Chennai - 600032',
    bank_name: 'HDFC Bank',
    account_number: '50200012345678',
    ifsc_code: 'HDFC0001234',
    branch: 'Guindy Chennai'
  },
  {
    id: 2,
    vendor_code: 'VEND-0002',
    display_name: 'HARDEEP HONDA',
    contact_no: '9841234567',
    email: 'sales@hardeephonda.com',
    gst: '33AAACH5678B1Z2',
    status: 'Active',
    payment_terms: 'Net 15',
    website: 'https://hardeephonda.in',
    billing_address: '12 Mount Road, Thousand Lights, Chennai - 600006',
    shipping_address: '12 Mount Road, Thousand Lights, Chennai - 600006',
    bank_name: 'State Bank of India',
    account_number: '30012345678',
    ifsc_code: 'SBIN0000842',
    branch: 'Mount Road'
  },
  {
    id: 3,
    vendor_code: 'VEND-0003',
    display_name: 'HERO MOTOCORP DEALERS',
    contact_no: '9940123890',
    email: 'info@herodealers.com',
    gst: '33AAACH9988G1Z9',
    status: 'Active',
    payment_terms: 'Immediate',
    website: 'https://heromotocorp.com',
    billing_address: '89 GST Road, Tambaram, Chennai - 600045',
    shipping_address: '89 GST Road, Tambaram, Chennai - 600045',
    bank_name: 'ICICI Bank',
    account_number: '001205001234',
    ifsc_code: 'ICIC0000012',
    branch: 'Tambaram'
  }
];

export const vendorService = {
  getStoredVendors() {
    try {
      const stored = localStorage.getItem('royalbikes_vendors');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_VENDORS;
  },

  setStoredVendors(vendors) {
    try {
      localStorage.setItem('royalbikes_vendors', JSON.stringify(vendors));
    } catch (e) {}
  },

  async getVendors(params = {}) {
    const local = this.getStoredVendors();
    try {
      const query = new URLSearchParams(params).toString();
      const url = `${API_ENDPOINTS.VENDORS.BASE}${query ? `?${query}` : ''}`;
      const res = await fetchWithAuth(url);
      if (res && res.success && Array.isArray(res.data)) {
        this.setStoredVendors(res.data);
        return { success: true, data: res.data };
      }
    } catch (err) {
      console.warn('Backend API unreachable, using local vendor cache:', err);
    }
    return { success: true, data: local };
  },

  async getVendorById(id) {
    try {
      const res = await fetchWithAuth(API_ENDPOINTS.VENDORS.BY_ID(id));
      if (res && res.success) return res;
    } catch (err) {
      console.warn('Backend API unreachable for vendor details:', err);
    }
    const local = this.getStoredVendors();
    const vendor = local.find(v => String(v.id) === String(id));
    return { success: !!vendor, data: vendor };
  },

  async createVendor(vendorData) {
    let created = null;
    try {
      const res = await fetchWithAuth(API_ENDPOINTS.VENDORS.BASE, {
        method: 'POST',
        body: JSON.stringify(vendorData)
      });
      if (res && res.success) {
        created = res.data;
      }
    } catch (err) {
      console.warn('Saving vendor locally:', err);
    }

    if (!created) {
      const local = this.getStoredVendors();
      const newId = Date.now();
      created = {
        id: newId,
        vendor_code: vendorData.vendor_code || `VEND-${(local.length + 1).toString().padStart(4, '0')}`,
        ...vendorData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    const local = this.getStoredVendors();
    const updated = [created, ...local.filter(v => v.id !== created.id)];
    this.setStoredVendors(updated);
    return { success: true, data: created };
  },

  async updateVendor(id, vendorData) {
    let updated = null;
    try {
      const res = await fetchWithAuth(API_ENDPOINTS.VENDORS.BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(vendorData)
      });
      if (res && res.success) {
        updated = res.data;
      }
    } catch (err) {
      console.warn('Updating vendor locally:', err);
    }

    const local = this.getStoredVendors();
    const index = local.findIndex(v => String(v.id) === String(id));
    if (index !== -1) {
      local[index] = { ...local[index], ...vendorData, ...(updated || {}) };
      this.setStoredVendors(local);
      return { success: true, data: local[index] };
    }

    return { success: true, data: updated };
  },

  async deleteVendor(id) {
    try {
      await fetchWithAuth(API_ENDPOINTS.VENDORS.BY_ID(id), {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Deleting vendor locally:', err);
    }

    const local = this.getStoredVendors();
    const filtered = local.filter(v => String(v.id) !== String(id));
    this.setStoredVendors(filtered);
    return { success: true };
  }
};
