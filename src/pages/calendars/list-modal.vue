<template>
  <u-popup :show="localShow" @close="localShow = false" mode="bottom" :overlay="false">
    <view>
      <view class="rounded-t-[48rpx] p-[30rpx] bg-white">
        <view v-if="meetings.length" class="pt-[20rpx]">
          <view v-for="meeting in meetings" :key="meeting.id"
            class="relative rounded-[26rpx] py-[20rpx] pl-[120rpx] pr-[20rpx] mb-[16rpx] overflow-hidden"
            style="border: 2px solid #f0f0f0">
            <!-- 模拟 ::before 标记色条 -->
            <view class="absolute top-0 bottom-0 left-0 w-[100rpx]" :style="{ backgroundColor: meeting.color }">
              <view v-if="isTeacher" class="pl-10" @click="handleDelete(meeting)">
                <view class="absolute top-0 bottom-0 left-0 w-[100rpx]" :style="{ backgroundColor: meeting.color }">
                  <view class="pl-2 pt-1" @click="handleDelete(meeting)">
                    <text class="text-[10px] text-[#fff]">×</text>
                  </view>
                </view>
              </view>
            </view>

            <view class="flex justify-between">
              <view>
                <view class="flex">
                  <text class="text-[32rpx] font-bold">{{ meeting.title }}
                  </text>
                  <view class="pl-[12px] baseline text-[16px] text-blue-500" @click="handleLinkClick(meeting)">
                    <uni-icons size="20" color="blue" type="link"></uni-icons>
                  </view>
                </view>

                <view class="pt-4 flex flex-col text-[32rpx] mt-[6rpx]">
                  <text>{{ formatDateTime(meeting.start) }}-{{
                    dayjs(meeting.start)
                      .add(meeting.duration, "minute")
                      .format("HH:mm")
                  }}</text>
                  <view class="pt-4 text-[10px] max-w-[40ch]">{{
                    meeting.timezone_id.name
                  }}</view>
                </view>
              </view>

              <view class="flex flex-col items-center justify-start">
                <image class="w-[48px] h-[48px] rounded-full" mode="aspectFill" :src="getAvatarUrl(
                  isTeacher
                    ? meeting.student.avatar
                    : meeting.host_user_id.avatar
                )
                  " />
                <text class="text-[24rpx] text-gray-500 mt-[4rpx]">{{
                  isTeacher
                    ? (meeting.student.nickname || meeting.student.username)
                    : (meeting.host_user_id.nickname || meeting.host_user_id.username)
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

import { createMessage, deleteMeeting } from "@/utils/api";

const props = defineProps<{
  show: boolean;
  date: string | null;
  meetings: any[];
  isTeacher?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "linkClick", meeting: any): void;
  (e: "delete", meeting: any): void;
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

const handleLinkClick = (meeting: any) => {
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
import { useAuthStore } from "@/stores/authStore";
const authStore = useAuthStore();
const handleDelete = async (meeting: any) => {
  uni.showModal({
    title: "取消日程",
    content: "确定要取消日程吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteMeeting(meeting.id);
          emit("delete", meeting);
          const teacherName = authStore.nickname || "老师";
          const meetingTime = meeting.meeting_time;
          const meetingTitle = meeting.title;
          const messageContent = `${teacherName} 删除了 与 ${meeting.participant_user_id.nickname} ${meetingTime} 的 ${meetingTitle} 日程`;

          // 给学生
          await createMessage({
            sender_id: meeting.host_user_id,
            receiver_id: meeting.participant_user_id,
            content: messageContent,
            title: "日程取消",
          });
          // 给老师自己
          await createMessage({
            sender_id: meeting.host_user_id,
            receiver_id: meeting.host_user_id,
            content: messageContent,
            title: "日程取消",
          });
          uni.showToast({
            title: "删除成功",
            icon: "success",
          });
        } catch (error) {
          uni.showToast({
            title: "删除失败",
            icon: "error",
          });
        }
      }
    },
  });
};

const getAvatarUrl = (avatar: Array<{ url: string }>) => {
  return import.meta.env.VITE_BUCKET_ENDPOINT + (avatar[0]?.url || "");
};
</script>
