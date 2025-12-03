export const cities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

// Örnek ilçeler (Tam liste çok uzun olacağı için büyük şehirler ve örnekler eklendi)
export const districts = {
  "İstanbul": ["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"],
  "Ankara": ["Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk", "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kalecik", "Kahramankazan", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle"],
  "İzmir": ["Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"],
  "Bursa": ["Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey", "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Nilüfer", "Orhaneli", "Orhangazi", "Osmangazi", "Yenişehir", "Yıldırım"],
  "Antalya": ["Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike", "Gazipaşa", "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Korkuteli", "Kumluca", "Manavgat", "Muratpaşa", "Serik"],
  "Adana": ["Aladağ", "Ceyhan", "Çukurova", "Feke", "İmamoğlu", "Karaisalı", "Karataş", "Kozan", "Pozantı", "Saimbeyli", "Sarıçam", "Seyhan", "Tufanbeyli", "Yumurtalık", "Yüreğir"]
};

// Mahalleler için basit bir simülasyon fonksiyonu (Gerçek API olmadan binlerce mahalleyi tutamayız)
export const getNeighborhoods = (district) => {
  const commonNeighborhoods = ["Merkez", "Cumhuriyet", "Atatürk", "Fatih", "Yeni", "Bahçelievler", "Hürriyet", "İstiklal", "Zafer", "Gazi", "Mimar Sinan", "Yavuz Selim", "Barış", "Çamlıca", "Esentepe"];
  // İlçe adına göre özelleştirilmiş gibi davran
  return commonNeighborhoods.map(n => `${n} Mah.`);
};

export const cityPlateCodes = {
  "Adana": "01", "Adıyaman": "02", "Afyonkarahisar": "03", "Ağrı": "04", "Amasya": "05", "Ankara": "06", "Antalya": "07", "Artvin": "08", "Aydın": "09", "Balıkesir": "10",
  "Bilecik": "11", "Bingöl": "12", "Bitlis": "13", "Bolu": "14", "Burdur": "15", "Bursa": "16", "Çanakkale": "17", "Çankırı": "18", "Çorum": "19", "Denizli": "20",
  "Diyarbakır": "21", "Edirne": "22", "Elazığ": "23", "Erzincan": "24", "Erzurum": "25", "Eskişehir": "26", "Gaziantep": "27", "Giresun": "28", "Gümüşhane": "29", "Hakkari": "30",
  "Hatay": "31", "Isparta": "32", "Mersin": "33", "İstanbul": "34", "İzmir": "35", "Kars": "36", "Kastamonu": "37", "Kayseri": "38", "Kırklareli": "39", "Kırşehir": "40",
  "Kocaeli": "41", "Konya": "42", "Kütahya": "43", "Malatya": "44", "Manisa": "45", "Kahramanmaraş": "46", "Mardin": "47", "Muğla": "48", "Muş": "49", "Nevşehir": "50",
  "Niğde": "51", "Ordu": "52", "Rize": "53", "Sakarya": "54", "Samsun": "55", "Siirt": "56", "Sinop": "57", "Sivas": "58", "Tekirdağ": "59", "Tokat": "60",
  "Trabzon": "61", "Tunceli": "62", "Şanlıurfa": "63", "Uşak": "64", "Van": "65", "Yozgat": "66", "Zonguldak": "67", "Aksaray": "68", "Bayburt": "69", "Karaman": "70",
  "Kırıkkale": "71", "Batman": "72", "Şırnak": "73", "Bartın": "74", "Ardahan": "75", "Iğdır": "76", "Yalova": "77", "Karabük": "78", "Kilis": "79", "Osmaniye": "80", "Düzce": "81"
};
