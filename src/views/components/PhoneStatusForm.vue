<script setup lang="ts">
import { useKakaoStore } from '@/stores/kakaoStore'

const kakaoStore = useKakaoStore()
const { phoneStatus } = kakaoStore

const handleBatteryInpout = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = parseInt(input.value)

  if (isNaN(value) || value < 1) {
    value = 1
  } else if (value > 100) {
    value = 100
  }

  phoneStatus.battery = value
  input.value = value.toString()
}
</script>

<template>
  <div class="card">
    <h3>휴대폰 상태</h3>
    <div class="two-column">
      <div class="form-group">
        <label for="phone-time">시간</label>
        <input id="phone-time" v-model="phoneStatus.time" type="text" placeholder="2:30" />
      </div>
      <div class="form-group">
        <label for="battery">배터리 (%)</label>
        <input
          id="battery"
          v-model.number="phoneStatus.battery"
          type="number"
          :min="1"
          :max="100"
          placeholder="85"
          @input="handleBatteryInpout"
        />
      </div>
      <div class="form-group">
        <label for="signal-level">수신 상태</label>
        <select id="signal-level" v-model.number="phoneStatus.signalLevel">
          <option v-for="n in 5" :key="n - 1" :value="n - 1">{{ n - 1 }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="wifi-level">와이파이 레벨</label>
        <select id="wifi-level" v-model="phoneStatus.wifiLevel">
          <option v-for="n in 4" :key="n - 1" :value="n - 1">
            {{ n - 1 }}
          </option>
          <option value="LTE">LTE</option>
          <option value="5G">5G</option>
        </select>
      </div>
    </div>
  </div>
</template>
