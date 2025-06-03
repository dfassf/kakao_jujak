<script setup lang="ts">
import Main from './views/Main.vue'
</script>

<template>
  <div id="app">
    <Main />
  </div>
</template>
<style scoped>
.app-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 0;
  background: linear-gradient(135deg, #fee500 0%, #fdd835 100%);
  border-radius: 15px;
  margin-bottom: 30px;
}

.app-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  color: #3c1e1e;
}

.app-header p {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.app-main {
  max-width: 100%;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  align-items: start;
}

.forms-section {
  display: flex;
  flex-direction: column;
}

.preview-section {
  position: sticky;
  top: 20px;
}

.actions {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.preview {
  background: #f8f9fa;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.preview-header h3 {
  margin: 0;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.9rem;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.data-preview {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 5px;
  padding: 15px;
  font-size: 12px;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
  max-width: 690px;
}

@media (max-width: 1200px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .preview-section {
    position: static;
    order: -1;
  }
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .action-buttons button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
