import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { directStockService } from '../services/directStockService';

/**
 * StockNumberSelect
 * Dropdown selector for Engine Number, Chassis Number, and Color options,
 * styled identically to RTN Payment / Voucher Entry options and showing only
 * relevant option details in the dropdown.
 */
export const StockNumberSelect = ({
  fieldType = 'engine_number',
  value = '',
  onChange,
  onSelectStock,
  placeholder = '',
  label = '',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stockList, setStockList] = useState(() => directStockService.getStoredStocks());
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const loadStocks = () => {
    const list = directStockService.getStoredStocks();
    setStockList(list);
  };

  useEffect(() => {
    loadStocks();
    const handleUpdate = () => loadStocks();
    window.addEventListener('directStockUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('directStockUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchVal = (value || '').toLowerCase().trim();

  // Extract only the relevant options for this field
  let options = [];
  if (fieldType === 'color') {
    // Unique list of colors
    const colorMap = new Map();
    stockList.forEach((item) => {
      const col = (item.color || '').trim();
      if (col && !colorMap.has(col.toUpperCase())) {
        colorMap.set(col.toUpperCase(), { display: col, stockItem: item });
      }
    });
    options = Array.from(colorMap.values()).filter((opt) =>
      !searchVal || opt.display.toLowerCase().includes(searchVal)
    );
  } else if (fieldType === 'chassis_number') {
    // Unique list of chassis numbers
    const chassisMap = new Map();
    stockList.forEach((item) => {
      const chs = (item.chassis_number || item.chassisNumber || '').trim();
      if (chs && !chassisMap.has(chs.toUpperCase())) {
        chassisMap.set(chs.toUpperCase(), { display: chs, stockItem: item });
      }
    });
    options = Array.from(chassisMap.values()).filter((opt) =>
      !searchVal || opt.display.toLowerCase().includes(searchVal)
    );
  } else {
    // Unique list of engine numbers
    const engineMap = new Map();
    stockList.forEach((item) => {
      const eng = (item.engine_number || item.engineNumber || '').trim();
      if (eng && !engineMap.has(eng.toUpperCase())) {
        engineMap.set(eng.toUpperCase(), { display: eng, stockItem: item });
      }
    });
    options = Array.from(engineMap.values()).filter((opt) =>
      !searchVal || opt.display.toLowerCase().includes(searchVal)
    );
  }

  const handleSelect = (option) => {
    if (onChange) onChange(option.display);
    if (onSelectStock && option.stockItem) onSelectStock(option.stockItem);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <fieldset
        className="outlined-fieldset"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen && inputRef.current) inputRef.current.focus();
        }}
      >
        {label && (
          <legend className="outlined-legend">
            {label} {required && '*'}
          </legend>
        )}
        <input
          ref={inputRef}
          type="text"
          required={required}
          value={value}
          placeholder={placeholder || `Select ${label || ''}`}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onClick={(e) => e.stopPropagation()}
          className="outlined-input"
          style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent' }}
        />
        <ChevronDown
          size={18}
          color="#64748b"
          style={{
            cursor: 'pointer',
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s ease'
          }}
        />
      </fieldset>

      {/* Dropdown list matching RTN Payment & CustomerSearchSelect UI */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
            marginTop: '4px',
            maxHeight: '220px',
            overflowY: 'auto'
          }}
        >
          {options.length === 0 ? (
            <div style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
              No stock records found
            </div>
          ) : (
            options.map((opt, idx) => (
              <div
                key={`${opt.display}-${idx}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(opt);
                }}
                style={{
                  padding: '0.65rem 1rem',
                  borderBottom: '1px solid #f1f5f9',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: '#0f172a',
                  backgroundColor: value === opt.display ? '#f1f5f9' : '#ffffff',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (value !== opt.display) e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  if (value !== opt.display) e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                {opt.display}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
