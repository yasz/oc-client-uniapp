<template>
  <u-popup :show="localShow" @close="localShow = false" mode="bottom">
    <view class="container bg-primary">
      <view class="popup-content bg-primary">
        <view class="modal-content" v-if="meetings.length">
          <view
            v-for="meeting in meetings"
            :key="meeting.id"
            class="meeting-item"
            :style="{ '--mark-color': meeting.color }"
          >
            <text class="t-16">{{ meeting.title }} 会议时间：</text>
            <view class="flex-col t-12 text-gray">
              <text>{{ formatDateTime(meeting.start) }}</text>
              <view>
                <text class="label">链接：</text>
                <text class="value link" @click="handleLinkClick(meeting)">{{
                  meeting.meeting_link
                }}</text>
              </view>
            </view>
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
.container {
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  border-radius: 0 48px 0 0;
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-content {
  padding-top: 20px;
}

.meeting-item {
  background-color: #fff;
  border-radius: 26px;
  padding: 10px;
  padding-left: 120rpx;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100rpx;
    background-color: var(--mark-color);
  }
}

.meeting-title {
  font-weight: bold;
  color: #333;
  padding-left: 8px;
}
</style>
