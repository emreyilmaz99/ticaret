// src/pages/admin/Reviews/BannedWordsTab.jsx
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import {
  FaPlus, FaTrash, FaSearch, FaBan, FaRegSadTear,
  FaCheck, FaTimes, FaExclamationTriangle, FaCode
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const BannedWordsTab = ({ styles }) => {
  const queryClient = useQueryClient();
  
  // Local state
  const [newWord, setNewWord] = useState('');
  const [isRegex, setIsRegex] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWords, setSelectedWords] = useState([]);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkWords, setBulkWords] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch banned words
  const { 
    data: bannedWordsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['admin-banned-words'],
    queryFn: async () => {
      const response = await api.get('/admin/banned-words');
      return response.data;
    },
  });

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ['admin-banned-words-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/banned-words/stats');
      return response.data;
    },
  });

  // Add word mutation
  const addWordMutation = useMutation({
    mutationFn: async ({ word, is_regex }) => {
      const response = await api.post('/admin/banned-words', { word, is_regex });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banned-words']);
      queryClient.invalidateQueries(['admin-banned-words-stats']);
      setNewWord('');
      setIsRegex(false);
      toast.success('Yasaklı kelime eklendi');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Kelime eklenirken hata oluştu');
    },
  });

  // Bulk add mutation
  const bulkAddMutation = useMutation({
    mutationFn: async (words) => {
      const response = await api.post('/admin/banned-words/bulk', { words });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['admin-banned-words']);
      queryClient.invalidateQueries(['admin-banned-words-stats']);
      setBulkWords('');
      setShowBulkAdd(false);
      toast.success(`${data.added} kelime eklendi${data.skipped > 0 ? `, ${data.skipped} atlandı` : ''}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Toplu ekleme başarısız');
    },
  });

  // Delete word mutation
  const deleteWordMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/banned-words/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banned-words']);
      queryClient.invalidateQueries(['admin-banned-words-stats']);
      setDeleteConfirmId(null);
      toast.success('Yasaklı kelime silindi');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Silme işlemi başarısız');
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => {
      await api.post('/admin/banned-words/bulk-delete', { ids });
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries(['admin-banned-words']);
      queryClient.invalidateQueries(['admin-banned-words-stats']);
      setSelectedWords([]);
      toast.success(`${ids.length} kelime silindi`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Toplu silme başarısız');
    },
  });

  // Filter words based on search
  const filteredWords = useMemo(() => {
    if (!bannedWordsData?.data) return [];
    if (!searchQuery.trim()) return bannedWordsData.data;
    
    return bannedWordsData.data.filter(word => 
      word.word.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bannedWordsData, searchQuery]);

  // Handle add word
  const handleAddWord = (e) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    addWordMutation.mutate({ word: newWord.trim(), is_regex: isRegex });
  };

  // Handle bulk add
  const handleBulkAdd = () => {
    const words = bulkWords
      .split('\n')
      .map(w => w.trim())
      .filter(w => w.length > 0)
      .map(w => ({ word: w, is_regex: false }));
    
    if (words.length === 0) {
      toast.error('En az bir kelime giriniz');
      return;
    }
    
    bulkAddMutation.mutate(words);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedWords.length === filteredWords.length) {
      setSelectedWords([]);
    } else {
      setSelectedWords(filteredWords.map(w => w.id));
    }
  };

  // Handle toggle selection
  const toggleWordSelection = (id) => {
    setSelectedWords(prev => 
      prev.includes(id) 
        ? prev.filter(wId => wId !== id)
        : [...prev, id]
    );
  };

  const stats = statsData?.data;

  return (
    <div>
      {/* Stats Cards */}
      <div style={styles.bannedWordsStats}>
        <div style={styles.bannedWordStatCard}>
          <div style={styles.bannedWordStatValue}>{stats?.total_words || 0}</div>
          <div style={styles.bannedWordStatLabel}>Toplam Kelime</div>
        </div>
        <div style={styles.bannedWordStatCard}>
          <div style={{ ...styles.bannedWordStatValue, color: '#8b5cf6' }}>
            {stats?.regex_count || 0}
          </div>
          <div style={styles.bannedWordStatLabel}>Regex Kalıpları</div>
        </div>
        <div style={styles.bannedWordStatCard}>
          <div style={{ ...styles.bannedWordStatValue, color: '#ef4444' }}>
            {stats?.blocked_reviews || 0}
          </div>
          <div style={styles.bannedWordStatLabel}>Engellenen Yorum</div>
        </div>
      </div>

      {/* Add Word Form */}
      <div style={styles.bannedWordsAddSection}>
        <h3 style={styles.bannedWordsSectionTitle}>
          <FaBan style={{ marginRight: '8px' }} />
          Yeni Yasaklı Kelime Ekle
        </h3>
        
        <form onSubmit={handleAddWord} style={styles.addWordForm}>
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Yasaklanacak kelime veya kalıp..."
            style={styles.addWordInput}
          />
          
          <label style={styles.regexToggle}>
            <input
              type="checkbox"
              checked={isRegex}
              onChange={(e) => setIsRegex(e.target.checked)}
              style={{ marginRight: '6px' }}
            />
            <FaCode style={{ marginRight: '4px' }} />
            Regex
          </label>
          
          <button 
            type="submit" 
            style={styles.addWordBtn}
            disabled={addWordMutation.isPending || !newWord.trim()}
          >
            <FaPlus /> Ekle
          </button>
          
          <button 
            type="button" 
            style={styles.bulkAddBtn}
            onClick={() => setShowBulkAdd(!showBulkAdd)}
          >
            Toplu Ekle
          </button>
        </form>

        {/* Bulk Add Modal */}
        {showBulkAdd && (
          <div style={styles.bulkAddSection}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
              Her satıra bir kelime yazın:
            </p>
            <textarea
              value={bulkWords}
              onChange={(e) => setBulkWords(e.target.value)}
              placeholder="kelime1&#10;kelime2&#10;kelime3"
              style={styles.bulkAddTextarea}
              rows={6}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button 
                style={styles.addWordBtn}
                onClick={handleBulkAdd}
                disabled={bulkAddMutation.isPending}
              >
                {bulkAddMutation.isPending ? 'Ekleniyor...' : 'Toplu Ekle'}
              </button>
              <button 
                style={styles.cancelBulkBtn}
                onClick={() => {
                  setShowBulkAdd(false);
                  setBulkWords('');
                }}
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search & Actions */}
      <div style={styles.bannedWordsToolbar}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kelime ara..."
            style={styles.searchInput}
          />
        </div>
        
        {selectedWords.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              {selectedWords.length} seçili
            </span>
            <button
              style={styles.bulkDeleteBtn}
              onClick={() => bulkDeleteMutation.mutate(selectedWords)}
              disabled={bulkDeleteMutation.isPending}
            >
              <FaTrash /> Seçilenleri Sil
            </button>
          </div>
        )}
      </div>

      {/* Words Grid */}
      <div style={styles.bannedWordsGrid}>
        {isLoading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p>Yükleniyor...</p>
          </div>
        ) : error ? (
          <div style={styles.errorState}>
            <FaExclamationTriangle size={32} color="#ef4444" />
            <p>Veriler yüklenirken hata oluştu</p>
          </div>
        ) : filteredWords.length === 0 ? (
          <div style={styles.emptyState}>
            <FaRegSadTear size={48} color="#9ca3af" />
            <p style={{ marginTop: '12px', color: '#6b7280' }}>
              {searchQuery ? 'Arama sonucu bulunamadı' : 'Henüz yasaklı kelime eklenmemiş'}
            </p>
          </div>
        ) : (
          <>
            {/* Select All Header */}
            <div style={styles.selectAllRow}>
              <label style={styles.selectAllLabel}>
                <input
                  type="checkbox"
                  checked={selectedWords.length === filteredWords.length && filteredWords.length > 0}
                  onChange={handleSelectAll}
                  style={{ marginRight: '8px' }}
                />
                Tümünü Seç ({filteredWords.length} kelime)
              </label>
            </div>
            
            {/* Words */}
            <div style={styles.wordsContainer}>
              {filteredWords.map((word) => (
                <div 
                  key={word.id} 
                  style={{
                    ...styles.wordCard,
                    borderColor: selectedWords.includes(word.id) ? '#6366f1' : '#e5e7eb',
                    backgroundColor: selectedWords.includes(word.id) ? '#eef2ff' : '#fff',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedWords.includes(word.id)}
                    onChange={() => toggleWordSelection(word.id)}
                    style={styles.wordCheckbox}
                  />
                  
                  <div style={styles.wordContent}>
                    <span style={styles.wordText}>{word.word}</span>
                    {word.is_regex && (
                      <span style={styles.regexBadge}>
                        <FaCode size={10} /> Regex
                      </span>
                    )}
                  </div>
                  
                  {deleteConfirmId === word.id ? (
                    <div style={styles.deleteConfirm}>
                      <button
                        style={styles.confirmYes}
                        onClick={() => deleteWordMutation.mutate(word.id)}
                        disabled={deleteWordMutation.isPending}
                      >
                        <FaCheck />
                      </button>
                      <button
                        style={styles.confirmNo}
                        onClick={() => setDeleteConfirmId(null)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <button
                      style={styles.wordDeleteBtn}
                      onClick={() => setDeleteConfirmId(word.id)}
                      title="Sil"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BannedWordsTab;
