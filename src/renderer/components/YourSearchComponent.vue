<script setup lang="ts">
import { ref } from 'vue';
import { musicAPI } from '@/api/musicAPI';

const keyword = ref('');
const results = ref([]);
const loading = ref(false);
const currentPlatform = ref('netease');

// 搜索函数
const handleSearch = async () => {
  if (!keyword.value.trim()) return;
  
  loading.value = true;
  try {
    let result;
    
    switch (currentPlatform.value) {
      case 'netease':
        result = await musicAPI.searchNetease(keyword.value);
        results.value = result.data.result?.songs || [];
        break;
      case 'qq':
        result = await musicAPI.searchQQ(keyword.value);
        results.value = result.data.data || [];
        break;
      case 'kugou':
        result = await musicAPI.searchKugou(keyword.value);
        results.value = result.data.data || [];
        break;
      case 'kuwo':
        result = await musicAPI.searchKuwo(keyword.value);
        results.value = result.data.data || [];
        break;
    }
    
    console.log(`使用 API #${result.apiIndex + 1} 搜索成功`);
  } catch (error) {
    console.error('搜索失败:', error);
    results.value = [];
  } finally {
    loading.value = false;
  }
};

// 播放歌曲
const playSong = async (song: any) => {
  if (currentPlatform.value === 'netease') {
    const url = await musicAPI.getNeteaseUrl(song.id);
    if (url) {
      console.log('播放 URL:', url);
      // 播放音乐...
    }
  }
};
</script>

<template>
  <div class="music-search">
    <!-- 平台选择 -->
    <div class="platform-selector">
      <button
        v-for="platform in ['netease', 'qq', 'kugou', 'kuwo']"
        :key="platform"
        @click="currentPlatform = platform"
        :class="{ active: currentPlatform === platform }"
      >
        {{ { netease: '网易云', qq: 'QQ 音乐', kugou: '酷狗', kuwo: '酷我' }[platform] }}
      </button>
    </div>

    <!-- 搜索框 -->
    <div class="search-box">
      <input
        v-model="keyword"
        placeholder="搜索歌曲..."
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch" :disabled="loading">
        {{ loading ? '搜索中...' : '搜索' }}
      </button>
    </div>

    <!-- 搜索结果 -->
    <div class="results">
      <div
        v-for="song in results"
        :key="song.id"
        class="song-item"
        @click="playSong(song)"
      >
        <div class="song-info">
          <h3>{{ song.name }}</h3>
          <p>{{ song.artists?.[0]?.name || song.ar?.[0]?.name || '未知艺术家' }}</p>
        </div>
        <button class="play-btn">播放</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.music-search {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.platform-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.platform-selector button {
  flex: 1;
  padding: 10px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.platform-selector button.active {
  border-color: #007bff;
  background: #007bff;
  color: white;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-box input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-box button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-box button:hover:not(:disabled) {
  background: #0056b3;
}

.search-box button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.results {
  display: grid;
  gap: 10px;
}

.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.song-item:hover {
  background: #f5f5f5;
  border-color: #007bff;
}

.song-info {
  flex: 1;
}

.song-info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.song-info p {
  margin: 0;
  color: #666;
  font-size: 12px;
}

.play-btn {
  padding: 8px 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.play-btn:hover {
  background: #218838;
}
</style>
