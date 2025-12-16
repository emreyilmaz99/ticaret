// src/pages/admin/Reviews/BannedWordsTab.jsx
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@lib/apiClient';
import {
  FaPlus, FaTrash, FaSearch, FaBan, FaRegSadTear,
  FaCheck, FaTimes, FaExclamationTriangle, FaCode,
  FaFileExport, FaFileImport, FaFlask, FaEdit,
  FaFilter, FaSortAlphaDown, FaSortAlphaUp, FaClock,
  FaChartLine, FaDownload, FaUpload, FaCopy, FaHistory,
  FaFileExcel, FaShieldAlt, FaEye, FaEyeSlash, FaThLarge,
  FaList, FaChevronDown
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const BannedWordsTab = ({ styles }) => {
  const queryClient = useQueryClient();
  
  // Add animation styles
  React.useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);
  
  // Local state
  const [newWord, setNewWord] = useState('');
  const [isRegex, setIsRegex] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWords, setSelectedWords] = useState([]);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkWords, setBulkWords] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  // Advanced features state
  const [showTestModal, setShowTestModal] = useState(false);
  const [testText, setTestText] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterType, setFilterType] = useState('all');
  const [showEditModal, setShowEditModal] = useState(null);
  const [editWord, setEditWord] = useState('');
  const [editIsRegex, setEditIsRegex] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Fetch banned words
  const { 
    data: bannedWordsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['admin-banned-words'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/admin/banned-words?all=true');
      return response.data;
    },
  });

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ['admin-banned-words-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/admin/banned-words/stats');
      return response.data;
    },
  });

  // Add word mutation
  const addWordMutation = useMutation({
    mutationFn: async ({ word, is_regex }) => {
      console.log('API çağrısı yapılıyor:', { word, is_regex });
      const response = await apiClient.post('/v1/admin/banned-words', { word, is_regex });
      console.log('API yanıtı:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Başarıyla eklendi:', data);
      queryClient.invalidateQueries(['admin-banned-words']);
      queryClient.invalidateQueries(['admin-banned-words-stats']);
      setNewWord('');
      setIsRegex(false);
      toast.success('Yasaklı kelime eklendi');
    },
    onError: (err) => {
      console.error('API hatası:', err);
      console.error('Hata detayı:', err.response?.data);
      toast.error(err.response?.data?.message || 'Kelime eklenirken hata oluştu');
    },
  });

  // Bulk add mutation
  const bulkAddMutation = useMutation({
    mutationFn: async (words) => {
      const wordList = Array.isArray(words) 
        ? words.map(w => typeof w === 'string' ? w : w.word) 
        : words.split('\n').map(w => w.trim()).filter(w => w);
      
      console.log('Toplu ekleme API çağrısı:', { wordList });
      const response = await apiClient.post('/v1/admin/banned-words/bulk', { words: wordList });
      console.log('Toplu ekleme yanıtı:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Toplu ekleme başarılı:', data);
      queryClient.invalidateQueries(['admin-banned-words']);
      queryClient.invalidateQueries(['admin-banned-words-stats']);
      setBulkWords('');
      setShowBulkAdd(false);
      toast.success(`${data.data?.created || 0} kelime eklendi${data.data?.skipped > 0 ? `, ${data.data.skipped} atlandı` : ''}`);
    },
    onError: (err) => {
      console.error('Toplu ekleme hatası:', err);
      console.error('Hata detayı:', err.response?.data);
      toast.error(err.response?.data?.message || 'Toplu ekleme başarısız');
    },
  });

  // Delete word mutation
  const deleteWordMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/v1/admin/banned-words/${id}`);
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
      await apiClient.post('/v1/admin/banned-words/bulk-delete', { ids });
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

  // Update word mutation
  const updateWordMutation = useMutation({
    mutationFn: async ({ id, word, is_regex }) => {
      const response = await apiClient.put(`/v1/admin/banned-words/${id}`, { word, is_regex });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banned-words']);
      setShowEditModal(null);
      toast.success('Kelime güncellendi');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Güncelleme başarısız');
    },
  });

  // Filter and sort words
  const filteredWords = useMemo(() => {
    if (!bannedWordsData?.data) return [];
    
    let words = Array.isArray(bannedWordsData.data) ? bannedWordsData.data : [];
    
    // Filter by type
    if (filterType === 'regex') {
      words = words.filter(w => w.is_regex);
    } else if (filterType === 'simple') {
      words = words.filter(w => !w.is_regex);
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      words = words.filter(word => 
        word.word.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort
    switch (sortOrder) {
      case 'oldest':
        words.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'newest':
        words.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'alpha-asc':
        words.sort((a, b) => a.word.localeCompare(b.word, 'tr'));
        break;
      case 'alpha-desc':
        words.sort((a, b) => b.word.localeCompare(a.word, 'tr'));
        break;
      default:
        break;
    }
    
    return words;
  }, [bannedWordsData, searchQuery, filterType, sortOrder]);

  // Handle add word
  const handleAddWord = (e) => {
    e.preventDefault();
    console.log('handleAddWord çağrıldı:', { newWord, isRegex });
    
    if (!newWord.trim()) {
      toast.error('Lütfen bir kelime girin');
      return;
    }
    
    try {
      addWordMutation.mutate({ word: newWord.trim(), is_regex: isRegex });
    } catch (error) {
      console.error('addWordMutation hatası:', error);
      toast.error('Kelime eklenirken hata oluştu');
    }
  };

  // Handle bulk add
  const handleBulkAdd = () => {
    console.log('handleBulkAdd çağrıldı:', { bulkWords });
    
    const words = bulkWords
      .split('\n')
      .map(w => w.trim())
      .filter(w => w.length > 0);
    
    console.log('İşlenmiş kelimeler:', words);
    
    if (words.length === 0) {
      toast.error('En az bir kelime giriniz');
      return;
    }
    
    try {
      bulkAddMutation.mutate(words);
    } catch (error) {
      console.error('bulkAddMutation hatası:', error);
      toast.error('Toplu ekleme sırasında hata oluştu');
    }
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

  // Handle export to Excel/CSV
  const handleExport = (format = 'csv') => {
    if (!bannedWordsData?.data || bannedWordsData.data.length === 0) {
      toast.error('Dışa aktarılacak kelime bulunamadı');
      return;
    }
    
    const words = Array.isArray(bannedWordsData.data) ? bannedWordsData.data : [];
    
    if (format === 'csv') {
      const csv = ['Kelime,Regex,Eklenme Tarihi'];
      words.forEach(w => {
        csv.push(`"${w.word}",${w.is_regex ? 'Evet' : 'Hayır'},${new Date(w.created_at).toLocaleDateString('tr-TR')}`);
      });
      
      const blob = new Blob(['\uFEFF' + csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `yasakli-kelimeler-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      toast.success('CSV olarak dışa aktarıldı');
    } else if (format === 'json') {
      const json = JSON.stringify(words, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `yasakli-kelimeler-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      toast.success('JSON olarak dışa aktarıldı');
    } else if (format === 'txt') {
      const txt = words.map(w => w.word).join('\n');
      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `yasakli-kelimeler-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      toast.success('TXT olarak dışa aktarıldı');
    }
    
    setShowExportMenu(false);
  };

  // Handle import
  const handleImport = async () => {
    if (!importFile) {
      toast.error('Lütfen dosya seçiniz');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      let words = [];
      
      if (importFile.name.endsWith('.json')) {
        try {
          const data = JSON.parse(content);
          words = Array.isArray(data) 
            ? data.map(w => (typeof w === 'string' ? w : w.word || w))
            : [];
        } catch {
          toast.error('Geçersiz JSON dosyası');
          return;
        }
      } else {
        // CSV or TXT
        words = content.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('Kelime'))
          .map(line => {
            const parts = line.split(',');
            return parts[0]?.replace(/"/g, '').trim();
          })
          .filter(w => w);
      }
      
      if (words.length === 0) {
        toast.error('Dosyada geçerli kelime bulunamadı');
        return;
      }
      
      bulkAddMutation.mutate(words);
      setShowImportModal(false);
      setImportFile(null);
    };
    
    reader.readAsText(importFile);
  };

  // Handle copy to clipboard
  const handleCopyAll = () => {
    const words = filteredWords.map(w => w.word).join('\n');
    navigator.clipboard.writeText(words);
    toast.success(`${filteredWords.length} kelime panoya kopyalandı`);
  };

  // Handle edit
  const handleOpenEdit = (word) => {
    setEditWord(word.word);
    setEditIsRegex(word.is_regex);
    setShowEditModal(word);
  };

  const handleSaveEdit = () => {
    if (!editWord.trim()) {
      toast.error('Kelime boş olamaz');
      return;
    }
    updateWordMutation.mutate({ 
      id: showEditModal.id, 
      word: editWord.trim(), 
      is_regex: editIsRegex 
    });
  };

  const stats = statsData?.data;
  const totalWords = stats?.total || bannedWordsData?.data?.length || 0;
  const regexCount = stats?.regex || bannedWordsData?.data?.filter(w => w.is_regex).length || 0;
  const simpleCount = stats?.simple || bannedWordsData?.data?.filter(w => !w.is_regex).length || 0;

  return (
    <div style={{ padding: '0' }}>
      {/* Stats Cards */}
      <div style={styles.bannedWordsStats}>
        <div 
          style={{
            ...styles.bannedWordStatCard,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: filterType === 'all' ? '2px solid #059669' : '1px solid #e5e7eb',
          }}
          onClick={() => setFilterType('all')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(5, 150, 105, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ ...styles.bannedWordStatValue, color: '#059669' }}>{totalWords}</div>
          <div style={styles.bannedWordStatLabel}>Toplam Kelime</div>
        </div>
        <div 
          style={{
            ...styles.bannedWordStatCard,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: filterType === 'regex' ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
          }}
          onClick={() => setFilterType('regex')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(139, 92, 246, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ ...styles.bannedWordStatValue, color: '#8b5cf6' }}>
            {regexCount}
          </div>
          <div style={styles.bannedWordStatLabel}>Düzenli İfadeler</div>
        </div>
        <div 
          style={{
            ...styles.bannedWordStatCard,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: filterType === 'simple' ? '2px solid #059669' : '1px solid #e5e7eb',
          }}
          onClick={() => setFilterType('simple')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(5, 150, 105, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ ...styles.bannedWordStatValue, color: '#059669' }}>
            {simpleCount}
          </div>
          <div style={styles.bannedWordStatLabel}>Basit Kelimeler</div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => handleExport('csv')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#047857';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaDownload /> CSV Olarak İndir
        </button>
        <button
          onClick={() => handleExport('json')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#047857';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaFileExport /> JSON Olarak İndir
        </button>
        <button
          onClick={() => handleExport('txt')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#047857';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaFileExcel /> TXT Olarak İndir
        </button>
        <button
          onClick={() => setShowImportModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#047857';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaUpload /> Dosyadan İçe Aktar
        </button>
        <button
          onClick={handleCopyAll}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#047857';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaCopy /> Tüm Kelimeleri Kopyala
        </button>
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
          
          <div 
            onClick={() => setIsRegex(!isRegex)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: isRegex ? '#059669' : '#f3f4f6',
              color: isRegex ? '#fff' : '#6b7280',
              border: isRegex ? '2px solid #059669' : '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{
              width: '44px',
              height: '24px',
              backgroundColor: isRegex ? '#fff' : '#d1d5db',
              borderRadius: '12px',
              position: 'relative',
              transition: 'all 0.3s ease',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: isRegex ? '#059669' : '#fff',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                left: isRegex ? '22px' : '2px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }} />
            </div>
            <FaCode style={{ fontSize: '16px' }} />
            <span>Düzenli İfade</span>
          </div>
          
          <button 
            type="submit" 
            onClick={(e) => {
              console.log('Ekle butonu tıklandı');
              // Form zaten handleAddWord'ü çağıracak ama yine de kontrol edelim
            }}
            style={{
              ...styles.addWordBtn,
              opacity: (addWordMutation.isPending || addWordMutation.isLoading || !newWord.trim()) ? 0.5 : 1,
              cursor: (addWordMutation.isPending || addWordMutation.isLoading || !newWord.trim()) ? 'not-allowed' : 'pointer',
              transform: 'scale(1)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!addWordMutation.isPending && !addWordMutation.isLoading && newWord.trim()) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            disabled={addWordMutation.isPending || addWordMutation.isLoading || !newWord.trim()}
          >
            {(addWordMutation.isPending || addWordMutation.isLoading) ? (
              <>
                <div style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid #fff',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }} />
                Ekleniyor...
              </>
            ) : (
              <>
                <FaPlus /> Ekle
              </>
            )}
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
                style={{
                  ...styles.addWordBtn,
                  opacity: (bulkAddMutation.isPending || bulkAddMutation.isLoading || !bulkWords.trim()) ? 0.5 : 1,
                  cursor: (bulkAddMutation.isPending || bulkAddMutation.isLoading || !bulkWords.trim()) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Toplu Ekle butonu tıklandı');
                  handleBulkAdd();
                }}
                disabled={bulkAddMutation.isPending || bulkAddMutation.isLoading || !bulkWords.trim()}
              >
                {(bulkAddMutation.isPending || bulkAddMutation.isLoading) ? (
                  <>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid #fff',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite',
                    }} />
                    Ekleniyor...
                  </>
                ) : (
                  <>
                    <FaPlus /> Toplu Ekle
                  </>
                )}
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

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '14px',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="all">Tüm Kelimeler</option>
            <option value="simple">Basit Kelimeler</option>
            <option value="regex">Düzenli İfadeler</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '14px',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="alpha-asc">A-Z</option>
            <option value="alpha-desc">Z-A</option>
          </select>
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
                        <FaCode size={10} /> Düzenli İfade
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#059669',
                        color: '#fff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                      onClick={() => handleOpenEdit(word)}
                      title="Düzenle"
                    >
                      <FaEdit size={12} />
                    </button>
                    
                    {deleteConfirmId === word.id ? (
                      <>
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
                      </>
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
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                <FaFileImport style={{ marginRight: '8px', color: '#059669' }} />
                Dosyadan İçe Aktar
              </h3>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaTimes />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                CSV, JSON veya TXT formatında dosya yükleyebilirsiniz.
              </p>
              <input
                type="file"
                accept=".csv,.json,.txt"
                onChange={(e) => setImportFile(e.target.files[0])}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px dashed #e5e7eb',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              />
              {importFile && (
                <p style={{ marginTop: '12px', fontSize: '14px', color: '#059669' }}>
                  <FaCheck style={{ marginRight: '4px' }} />
                  {importFile.name}
                </p>
              )}
            </div>
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
            }}>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                İptal
              </button>
              <button
                onClick={handleImport}
                disabled={!importFile}
                style={{
                  padding: '10px 20px',
                  backgroundColor: importFile ? '#059669' : '#d1d5db',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: importFile ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (importFile) e.currentTarget.style.backgroundColor = '#047857';
                }}
                onMouseLeave={(e) => {
                  if (importFile) e.currentTarget.style.backgroundColor = '#059669';
                }}
              >
                <FaUpload style={{ marginRight: '6px' }} />
                İçe Aktar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                <FaEdit style={{ marginRight: '8px', color: '#059669' }} />
                Kelime Düzenle
              </h3>
              <button
                onClick={() => setShowEditModal(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaTimes />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <input
                type="text"
                value={editWord}
                onChange={(e) => setEditWord(e.target.value)}
                placeholder="Kelime..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  marginBottom: '16px',
                  boxSizing: 'border-box',
                }}
              />
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  checked={editIsRegex}
                  onChange={(e) => setEditIsRegex(e.target.checked)}
                />
                <FaCode /> Düzenli İfade
              </label>
            </div>
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
            }}>
              <button
                onClick={() => setShowEditModal(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                İptal
              </button>
              <button
                onClick={handleSaveEdit}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#059669',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              >
                <FaCheck style={{ marginRight: '6px' }} />
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannedWordsTab;
