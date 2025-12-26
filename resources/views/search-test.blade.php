<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elasticsearch Search Test - Debugbar</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 { 
            color: #333; 
            margin-bottom: 10px;
            font-size: 32px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
        }
        .search-box {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        input, select {
            flex: 1;
            min-width: 200px;
            padding: 15px 20px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 16px;
            transition: all 0.3s;
        }
        input:focus, select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .btn-group {
            display: flex;
            gap: 10px;
        }
        button {
            padding: 15px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            white-space: nowrap;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        button:active {
            transform: translateY(0);
        }
        .results {
            margin-top: 30px;
        }
        .result-item {
            background: #f8f9fa;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
            transition: all 0.3s;
        }
        .result-item:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .result-name {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }
        .result-price {
            color: #667eea;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .result-vendor {
            color: #666;
            font-size: 14px;
            margin-bottom: 5px;
        }
        .result-score {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
            font-size: 18px;
        }
        .performance-info {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 20px;
        }
        .perf-item {
            text-align: center;
        }
        .perf-value {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .perf-label {
            font-size: 14px;
            opacity: 0.9;
        }
        .filters {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .filter-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
        }
        .filter-label {
            font-size: 14px;
            font-weight: 600;
            color: #555;
            margin-bottom: 5px;
        }
        .no-results {
            text-align: center;
            padding: 60px;
            color: #999;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Elasticsearch Search Test</h1>
        <p class="subtitle">Laravel Debugbar ile performans takibi - Sayfanın altında debugbar görünecek</p>
        
        <div style="background: #f0f0f0; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0;">📊 Test Adımları:</h3>
            <ol style="margin: 0; padding-left: 20px;">
                <li><strong>1. İlk Arama:</strong> "Hızlı Arama" butonuna bas → ~40-100ms (Fresh data)</li>
                <li><strong>2. İkinci Arama:</strong> Aynı butona tekrar bas → ~2-10ms (Cached data)</li>
                <li><strong>3. Cache Status:</strong> Yukarıdaki badge'i kontrol et (⚡ CACHED vs 🔍 FRESH)</li>
            </ol>
        </div>

        <div class="performance-info" id="perfInfo" style="display: none;">
            <div class="perf-item">
                <div class="perf-value" id="perfTime">-</div>
                <div class="perf-label">Response Time (ms)</div>
            </div>
            <div class="perf-item">
                <div class="perf-value" id="perfResults">-</div>
                <div class="perf-label">Sonuç Sayısı</div>
            </div>
            <div class="perf-item">
                <div class="perf-value" id="perfTotal">-</div>
                <div class="perf-label">Toplam Ürün</div>
            </div>
            <div class="perf-item">
                <div class="perf-value" id="perfCache">-</div>
                <div class="perf-label">Cache Status</div>
            </div>
        </div>

        <div class="search-box">
            <input type="text" id="searchInput" placeholder="Ürün ara... (örn: telefon, laptop)" />
            <div class="btn-group">
                <button onclick="quickSearch()">🚀 Hızlı Arama</button>
                <button onclick="advancedSearch()">🎯 Detaylı Arama</button>
            </div>
        </div>

        <div class="filters">
            <h3 style="margin-bottom: 15px; color: #333;">🎛️ Gelişmiş Filtreler</h3>
            <div class="filter-row">
                <div>
                    <div class="filter-label">Kategori</div>
                    <select id="categoryFilter">
                        <option value="">Tüm Kategoriler</option>
                        <option value="1">Elektronik</option>
                        <option value="2">Giyim</option>
                        <option value="3">Ev & Yaşam</option>
                    </select>
                </div>
                <div>
                    <div class="filter-label">Min Fiyat</div>
                    <input type="number" id="minPrice" placeholder="Min (₺)" />
                </div>
                <div>
                    <div class="filter-label">Max Fiyat</div>
                    <input type="number" id="maxPrice" placeholder="Max (₺)" />
                </div>
                <div>
                    <div class="filter-label">Sıralama</div>
                    <select id="sortBy">
                        <option value="relevance">İlgililik</option>
                        <option value="price_asc">Fiyat (Düşük → Yüksek)</option>
                        <option value="price_desc">Fiyat (Yüksek → Düşük)</option>
                        <option value="date_desc">En Yeni</option>
                    </select>
                </div>
            </div>
            <div class="filter-row">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="checkbox" id="inStockFilter" />
                    <span>Sadece Stokta Olanlar</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="checkbox" id="featuredFilter" />
                    <span>Öne Çıkan Ürünler</span>
                </label>
            </div>
        </div>

        <div id="results"></div>
    </div>

    <script>
        // Enter tuşu ile arama
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                quickSearch();
            }
        });

        async function quickSearch() {
            const query = document.getElementById('searchInput').value;
            if (!query.trim()) {
                alert('Lütfen bir arama terimi girin');
                return;
            }

            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<div class="loading">🔄 Aranıyor...</div>';
            
            const startTime = performance.now();
            
            try {
                const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                
                const endTime = performance.now();
                const timeTaken = (endTime - startTime).toFixed(2);
                
                displayResults(data, timeTaken);
            } catch (error) {
                resultsDiv.innerHTML = '<div class="no-results">❌ Hata: ' + error.message + '</div>';
            }
        }

        async function advancedSearch() {
            const query = document.getElementById('searchInput').value;
            const category = document.getElementById('categoryFilter').value;
            const minPrice = document.getElementById('minPrice').value;
            const maxPrice = document.getElementById('maxPrice').value;
            const sortBy = document.getElementById('sortBy').value;
            const inStock = document.getElementById('inStockFilter').checked;
            const featured = document.getElementById('featuredFilter').checked;

            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<div class="loading">🔄 Detaylı arama yapılıyor...</div>';
            
            const startTime = performance.now();
            
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            if (category) params.append('category_id', category);
            if (minPrice) params.append('min_price', minPrice);
            if (maxPrice) params.append('max_price', maxPrice);
            if (sortBy) params.append('sort_by', sortBy);
            if (inStock) params.append('in_stock', '1');
            if (featured) params.append('is_featured', '1');
            params.append('highlight', '1');
            
            try {
                const response = await fetch(`/api/v1/products/search?${params.toString()}`);
                const data = await response.json();
                
                const endTime = performance.now();
                const timeTaken = (endTime - startTime).toFixed(2);
                
                displayResults(data, timeTaken);
            } catch (error) {
                resultsDiv.innerHTML = '<div class="no-results">❌ Hata: ' + error.message + '</div>';
            }
        }

        function displayResults(data, timeTaken) {
            const resultsDiv = document.getElementById('results');
            const perfInfo = document.getElementById('perfInfo');
            
            // API response'da data.data yerine data.data.products olarak dönüyor
            const products = data.data?.products || data.data || [];
            
            if (!data.success || !products || products.length === 0) {
                resultsDiv.innerHTML = '<div class="no-results">😕 Sonuç bulunamadı</div>';
                perfInfo.style.display = 'none';
                return;
            }

            // Performance bilgileri göster
            perfInfo.style.display = 'flex';
            document.getElementById('perfTime').textContent = timeTaken;
            document.getElementById('perfResults').textContent = products.length;
            document.getElementById('perfTotal').textContent = data.data?.pagination?.total || data.data?.total || products.length;
            
            // Cache status
            const cached = data.data?.cached;
            const cacheEl = document.getElementById('perfCache');
            console.log('📊 Performance:', {
                time: timeTaken + 'ms',
                cached: cached,
                products: products.length
            });
            
            if (cached) {
                cacheEl.textContent = '🚀 CACHED';
                cacheEl.style.color = '#38ef7d';
                console.log('✅ Cache HIT - Ultra hızlı!');
            } else {
                cacheEl.textContent = '⚡ FRESH';
                cacheEl.style.color = '#ffd93d';
                console.log('🔍 Cache MISS - Fresh Elasticsearch query');
            }

            let html = '<h2 style="margin-bottom: 20px; color: #333;">📦 Sonuçlar</h2>';
            
            products.forEach(product => {
                const name = product.highlight?.name || product.name;
                const description = product.highlight?.description || product.description || '';
                
                html += `
                    <div class="result-item">
                        <div class="result-name">${name}</div>
                        <div class="result-price">₺${parseFloat(product.min_price).toLocaleString('tr-TR', {minimumFractionDigits: 2})}</div>
                        <div class="result-vendor">🏪 ${product.vendor?.name || 'N/A'} | 📁 ${product.category?.name || 'N/A'}</div>
                        ${description ? `<div style="color: #666; font-size: 14px; margin-top: 8px;">${description.substring(0, 150)}...</div>` : ''}
                        <div style="margin-top: 10px;">
                            <span class="result-score">Skor: ${product._score?.toFixed(2) || 'N/A'}</span>
                            ${product.in_stock ? '<span style="margin-left: 10px; color: #38ef7d;">✅ Stokta</span>' : '<span style="margin-left: 10px; color: #ff6b6b;">❌ Stok Yok</span>'}
                            ${product.is_featured ? '<span style="margin-left: 10px; color: #ffd93d;">⭐ Öne Çıkan</span>' : ''}
                        </div>
                    </div>
                `;
            });

            if (data.data?.pagination) {
                html += `
                    <div style="text-align: center; margin-top: 30px; color: #666;">
                        📊 Sayfa ${data.data.pagination.current_page} / ${data.data.pagination.last_page} 
                        (Toplam ${data.data.pagination.total} ürün)
                    </div>
                `;
            }

            resultsDiv.innerHTML = html;
        }

        // Sayfa yüklendiğinde otomatik arama yapma (manuel test için)
        window.addEventListener('load', () => {
            document.getElementById('searchInput').value = 'telefon';
            // Otomatik arama devre dışı - sadece manuel test
            console.log('Hazır! "Hızlı Arama" butonuna bas ve sürelerini karşılaştır');
        });
    </script>
</body>
</html>
