<template>
  <u-popup :show="localShow" @close="localShow = false" mode="bottom">
    <view class="popup-content bg-primary">
      <view class="popup-header">
        <text class="popup-title">{{ title }}</text>
      </view>
      <view class="modal-content" v-if="meetings.length">
        <view
          v-for="meeting in meetings"
          :key="meeting.id"
          class="meeting-item"
        >
          <view class="meeting-header">
            <text class="meeting-title">{{ meeting.title }}</text>
            <view
              class="meeting-dot"
              :style="{ backgroundColor: meeting.color }"
            ></view>
          </view>
          <view class="info-item">
            <text class="label">时间：</text>
            <text class="value">{{ formatDateTime(meeting.start) }}</text>
          </view>
          <view class="info-item">
            <text class="label">会议链接：</text>
            <text class="value link" @click="handleLinkClick(meeting)"
              >点击进入会议</text
            >
          </view>
          <view class="divider"></view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";

interface Meeting {
  id: number;
  title: string;
  start: string;
  end: string;
  teacher: string;
  student: string;
  date: string;
  color: string;
  meeting_link?: string;
}

const props = defineProps<{
  show: boolean;
  date: string | null;
  meetings: Meeting[];
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "linkClick", meeting: Meeting): void;
}>();

const localShow = ref(props.show);

watch(
  () => props.show,
  (newVal) => {
    localShow.value = newVal;
  }
);

watch(
  () => localShow.value,
  (newVal) => {
    emit("update:show", newVal);
  }
);

const title = computed(() => {
  return props.date ? dayjs(props.date).format("YYYY年MM月DD日") : "";
});

const formatDateTime = (dateTime: string) => {
  return dayjs(dateTime).format("YYYY-MM-DD HH:mm");
};

const handleLinkClick = (meeting: Meeting) => {
  emit("linkClick", meeting);
};
</script>

<style lang="scss" scoped>
.popup-content {
  border-radius: 0 48px 0 0;
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.popup-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
}

.popup-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.modal-content {
  padding: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;

  .label {
    width: 80px;
    color: #666;
  }

  .value {
    flex: 1;
    color: #333;
  }

  .link {
    color: #2979ff;
    text-decoration: underline;
  }
}

.meeting-item {
  margin-bottom: 16px;
}

.meeting-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.meeting-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-right: 8px;
}

.meeting-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 12px 0;
}
</style>
