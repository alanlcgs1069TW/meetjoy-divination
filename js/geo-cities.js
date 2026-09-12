/**
 * geo-cities.js
 * 癒見幸福官方排盤引擎 · 全球出生地座標、時區與歷史夏令時間（DST）資料庫
 * 遵循愛倫院長指示：嚴格排盤流程，杜絕無出生地或時間誤差導致之占星/人類圖偏差。
 */

const CITIES_DB = [
  // 台灣主要城市 (預設群組)
  { group: '台灣 (Taiwan)', id: 'tw_taipei', name: '台北市 (Taipei · 121°31′E 25°03′N)', lat: 25.0500, lng: 121.5167, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_new_taipei', name: '新北市 (New Taipei · 121°28′E 25°01′N)', lat: 25.0169, lng: 121.4627, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_taoyuan', name: '桃園市 (Taoyuan)', lat: 24.9936, lng: 121.3009, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_taichung', name: '台中市 (Taichung)', lat: 24.1477, lng: 120.6736, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_tainan', name: '台南市 (Tainan)', lat: 22.9997, lng: 120.2270, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_kaohsiung', name: '高雄市 (Kaohsiung)', lat: 22.6273, lng: 120.3014, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_keelung', name: '基隆市 (Keelung)', lat: 25.1276, lng: 121.7392, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_hsinchu', name: '新竹市 (Hsinchu)', lat: 24.8138, lng: 120.9675, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_hsinchu_county', name: '新竹縣 (Hsinchu County)', lat: 24.8387, lng: 121.0177, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_miaoli', name: '苗栗縣 (Miaoli)', lat: 24.5602, lng: 120.8214, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_changhua', name: '彰化縣 (Changhua)', lat: 24.0518, lng: 120.5161, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_nantou', name: '南投縣 (Nantou)', lat: 23.9609, lng: 120.9719, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_yunlin', name: '雲林縣 (Yunlin)', lat: 23.7092, lng: 120.4313, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_chiayi', name: '嘉義市 (Chiayi)', lat: 23.4801, lng: 120.4491, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_chiayi_county', name: '嘉義縣 (Chiayi County)', lat: 23.4518, lng: 120.2555, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_pingtung', name: '屏東縣 (Pingtung)', lat: 22.5519, lng: 120.5487, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_yilan', name: '宜蘭縣 (Yilan)', lat: 24.7021, lng: 121.7378, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_hualien', name: '花蓮縣 (Hualien)', lat: 23.9872, lng: 121.6016, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_taitung', name: '台東縣 (Taitung)', lat: 22.7583, lng: 121.1444, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_penghu', name: '澎湖縣 (Penghu)', lat: 23.5712, lng: 119.5793, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_kinmen', name: '金門縣 (Kinmen)', lat: 24.4493, lng: 118.3766, tz: 8, country: 'TW' },
  { group: '台灣 (Taiwan)', id: 'tw_matsu', name: '連江縣/馬祖 (Matsu)', lat: 26.1505, lng: 119.9499, tz: 8, country: 'TW' },

  // 港澳地區
  { group: '港澳 (Hong Kong & Macau)', id: 'hk_hong_kong', name: '香港 (Hong Kong)', lat: 22.3193, lng: 114.1694, tz: 8, country: 'HK' },
  { group: '港澳 (Hong Kong & Macau)', id: 'mo_macau', name: '澳門 (Macau)', lat: 22.1987, lng: 113.5439, tz: 8, country: 'MO' },

  // 中國大陸主要城市
  { group: '中國大陸 (China Mainland)', id: 'cn_shanghai', name: '上海 (Shanghai)', lat: 31.2304, lng: 121.4737, tz: 8, country: 'CN' },
  { group: '中國大陸 (China Mainland)', id: 'cn_beijing', name: '北京 (Beijing)', lat: 39.9042, lng: 116.4074, tz: 8, country: 'CN' },
  { group: '中國大陸 (China Mainland)', id: 'cn_guangzhou', name: '廣州 (Guangzhou)', lat: 23.1291, lng: 113.2644, tz: 8, country: 'CN' },
  { group: '中國大陸 (China Mainland)', id: 'cn_shenzhen', name: '深圳 (Shenzhen)', lat: 22.5431, lng: 114.0579, tz: 8, country: 'CN' },
  { group: '中國大陸 (China Mainland)', id: 'cn_chengdu', name: '成都 (Chengdu)', lat: 30.5728, lng: 104.0668, tz: 8, country: 'CN' },
  { group: '中國大陸 (China Mainland)', id: 'cn_hangzhou', name: '杭州 (Hangzhou)', lat: 30.2741, lng: 120.1551, tz: 8, country: 'CN' },

  // 東亞與東南亞
  { group: '亞洲主要城市 (Asia)', id: 'jp_tokyo', name: '日本 東京 (Tokyo)', lat: 35.6762, lng: 139.6503, tz: 9, country: 'JP' },
  { group: '亞洲主要城市 (Asia)', id: 'jp_osaka', name: '日本 大阪 (Osaka)', lat: 34.6937, lng: 135.5023, tz: 9, country: 'JP' },
  { group: '亞洲主要城市 (Asia)', id: 'sg_singapore', name: '新加坡 (Singapore)', lat: 1.3521, lng: 103.8198, tz: 8, country: 'SG' },
  { group: '亞洲主要城市 (Asia)', id: 'my_kuala_lumpur', name: '馬來西亞 吉隆坡 (KL)', lat: 3.1390, lng: 101.6869, tz: 8, country: 'MY' },

  // 北美與歐洲主要城市
  { group: '北美與歐洲 (Global Hubs)', id: 'us_san_francisco', name: '美西 舊金山 (San Francisco)', lat: 37.7749, lng: -122.4194, tz: -8, country: 'US' },
  { group: '北美與歐洲 (Global Hubs)', id: 'us_los_angeles', name: '美西 洛杉磯 (Los Angeles)', lat: 34.0522, lng: -118.2437, tz: -8, country: 'US' },
  { group: '北美與歐洲 (Global Hubs)', id: 'us_new_york', name: '美東 紐約 (New York)', lat: 40.7128, lng: -74.0060, tz: -5, country: 'US' },
  { group: '北美與歐洲 (Global Hubs)', id: 'ca_vancouver', name: '加拿大 溫哥華 (Vancouver)', lat: 49.2827, lng: -123.1207, tz: -8, country: 'CA' },
  { group: '北美與歐洲 (Global Hubs)', id: 'uk_london', name: '英國 倫敦 (London)', lat: 51.5074, lng: -0.1278, tz: 0, country: 'GB' },
  { group: '北美與歐洲 (Global Hubs)', id: 'au_sydney', name: '澳洲 雪梨 (Sydney)', lat: -33.8688, lng: 151.2093, tz: 10, country: 'AU' }
];

// 台灣歷史夏令時間（日光節約時間 Daylight Saving Time, DST）
// 若在該期間內出生，台灣官方時間快 1 小時，真太陽時需減去 1 小時校準
const TAIWAN_DST_PERIODS = [
  { start: '1945-05-01', end: '1945-09-30' },
  { start: '1946-05-15', end: '1946-09-30' },
  { start: '1947-04-15', end: '1947-10-31' },
  { start: '1948-05-01', end: '1948-09-30' },
  { start: '1949-05-01', end: '1949-09-30' },
  { start: '1950-05-15', end: '1950-10-31' },
  { start: '1951-05-01', end: '1951-09-30' },
  { start: '1952-03-01', end: '1952-10-31' },
  { start: '1953-04-01', end: '1953-10-31' },
  { start: '1954-04-01', end: '1954-10-31' },
  { start: '1955-04-01', end: '1955-10-31' },
  { start: '1956-04-01', end: '1956-10-31' },
  { start: '1957-04-01', end: '1957-10-31' },
  { start: '1958-04-01', end: '1958-10-31' },
  { start: '1959-04-01', end: '1959-10-31' },
  { start: '1960-06-01', end: '1960-09-30' },
  { start: '1961-06-01', end: '1961-09-30' },
  { start: '1974-04-01', end: '1974-09-30' },
  { start: '1975-04-01', end: '1975-09-30' },
  { start: '1979-07-01', end: '1979-09-30' }
];

/**
 * 檢查是否處於台灣歷史夏令時間
 */
function isTaiwanDST(dateStr) {
  for (const p of TAIWAN_DST_PERIODS) {
    if (dateStr >= p.start && dateStr <= p.end) {
      return true;
    }
  }
  return false;
}

/**
 * 精準換算 UTC Date 物件
 * @param {string} dateStr YYYY-MM-DD
 * @param {string} timeStr HH:MM
 * @param {number} timeZoneOffset 時區偏移小時數 (例如台灣為 8)
 * @param {boolean} applyDST 是否啟用夏令時間校正 (扣回 1 小時)
 * @returns {Date} 絕對 UTC Date 物件
 */
function calculateUTCDatetime(dateStr, timeStr, timeZoneOffset, applyDST = false) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);

  // 若符合夏令時間，實際天文時間比鐘錶時間慢 1 小時
  const effectiveHour = applyDST ? hour - 1 : hour;

  // 轉換為 UTC 時間：本地時間 - 時區
  const utcDate = new Date(Date.UTC(year, month - 1, day, effectiveHour, minute, 0));
  utcDate.setUTCHours(utcDate.getUTCHours() - timeZoneOffset);
  return utcDate;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CITIES_DB, TAIWAN_DST_PERIODS, isTaiwanDST, calculateUTCDatetime };
}
