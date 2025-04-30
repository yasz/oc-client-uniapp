<template>
  <u-popup :show="localShow" @close="localShow = false" mode="bottom">
    <view style="background-color: rgba(0, 0, 0, 0.5)">
      <view class="popup-content bg-primary">
        <view class="modal-content pt-40" v-if="meetings.length">
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
              <text class="value link" @click="handleLinkClick(meeting)">{{
                meeting.meeting_link
              }}</text>
            </view>
            <view class="divider"></view>
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import { go } from "@/utils/common";

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

const formatDateTime = (dateTime: string) => {
  return dayjs(dateTime).format("YYYY-MM-DD HH:mm");
};
const handleLinkClick = (meeting: Meeting) => {
  if (meeting.meeting_link) {
    // #ifdef APP-PLUS
    // @ts-ignore
    plus.runtime.openWeb(meeting.meeting_link);
    // #endif

    // #ifdef H5
    window.open(meeting.meeting_link, "_blank");
    // #endif
  }
};
</script>

<style lang="scss" scoped>
.popup-content {
  border-radius: 0 48px 0 0;
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}
</style>
