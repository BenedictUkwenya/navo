// src/pages/AuditMgtPage/AuditMgtPage.tsx

import React, { useState, useMemo } from 'react';
import './AuditMgtPage.css';
import { mockAuditLogs } from '../../data/mockAuditLogs';

// Icon Imports
import searchIcon from '../../assets/images/searchicon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';

const ITEMS_PER_PAGE = 9;

const AuditMgtPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = useMemo(() => {
    if (!searchTerm) return mockAuditLogs;
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return mockAuditLogs.filter(log =>
      log.userName.toLowerCase().includes(lowercasedSearchTerm) ||
      log.actionTaken.toLowerCase().includes(lowercasedSearchTerm) ||
      log.ipAddress.includes(lowercasedSearchTerm) ||
      log.browserPage.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="audit-mgt-page">
      <header className="page-header">
        <div className="page-search-bar">
          <img src={searchIcon} alt="Search" />
          <input
            type="text"
            placeholder="Search by service, location, date"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          {searchTerm && <button className="clear-btn" onClick={() => setSearchTerm('')}>×</button>}
        </div>
      </header>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Action taken</th>
              <th>Date</th>
              <th>Ip Address</th>
              <th>Phone type</th>
              <th>Browser page</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map(log => (
              <tr key={log.id}>
                <td data-label="Name">{log.userName}</td>
                <td data-label="Action taken">{log.actionTaken}</td>
                <td data-label="Date">{log.date}</td>
                <td data-label="Ip Address">{log.ipAddress}</td>
                <td data-label="Phone type">{log.phoneType}</td>
                <td data-label="Browser page">{log.browserPage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="page-footer">
        <div className="pagination-info">
          Showing {filteredLogs.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length}
        </div>
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            <img src={prevIcon} alt="Previous" />
          </button>
          <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
            <img src={nextIcon} alt="Next" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AuditMgtPage;