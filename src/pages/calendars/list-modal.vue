<template>
  <u-popup
    :show="localShow"
    @close="localShow = false"
    mode="bottom"
    :overlay="false"
  >
    <view>
      <view class="rounded-t-[48rpx] p-[30rpx] bg-white">
        <view v-if="meetings.length" class="pt-[20rpx]">
          <view
            v-for="meeting in meetings"
            :key="meeting.id"
            class="relative rounded-[26rpx] py-[20rpx] pl-[120rpx] pr-[20rpx] mb-[16rpx] overflow-hidden"
            style="border: 2px solid #f0f0f0"
          >
            <!-- 模拟 ::before 标记色条 -->
            <view
              class="absolute top-0 bottom-0 left-0 w-[100rpx]"
              :style="{ backgroundColor: meeting.color }"
            >
              <view class="pl-10" @click="handleDelete(meeting)">
                <view
                  class="absolute top-0 bottom-0 left-0 w-[100rpx]"
                  :style="{ backgroundColor: meeting.color }"
                >
                  <view class="pl-2 pt-1" @click="handleDelete(meeting)">
                    <text class="text-[10px] text-[#fff]">×</text>
                  </view>
                </view>
              </view>
            </view>

            <view class="flex justify-between">
              <view>
                <text class="text-[32rpx] font-bold"
                  >{{ meeting.title }} 会议时间：</text
                >
                <view
                  class="flex flex-col text-[24rpx] text-gray-500 mt-[6rpx]"
                >
                  <text>{{ formatDateTime(meeting.start) }}</text>
                  <view class="flex mt-[4rpx]">
                    <text class="mr-[6rpx]">链接：</text>
                    <text
                      class="text-blue-500 underline"
                      @click="handleLinkClick(meeting)"
                    >
                      {{ meeting.meeting_link }}
                    </text>
                  </view>
                </view>
              </view>

              <view class="flex flex-col items-center justify-start">
                <image
                  class="w-[48px] h-[48px] rounded-full"
                  mode="aspectFill"
                  :src="getAvatarUrl(meeting.student.avatar)"
                />
                <text class="text-[24rpx] text-gray-500 mt-[4rpx]">{{
                  meeting.student.nickname
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

import { deleteMeeting } from "@/utils/api";

interface Meeting {
  id: number;
  title: string;
  start: string;
  end: string;
  teacher: string;
  student: any;
  date: string;
  color: string;
  meeting_link?: string;
  participant_user_id: {
    id: number;
    nickname: string;
    avatar: Array<{
      url: string;
    }>;
  };
}

const props = defineProps<{
  show: boolean;
  date: string | null;
  meetings: Meeting[];
  isTeacher?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "linkClick", meeting: Meeting): void;
  (e: "delete", meeting: Meeting): void;
}>();

const localShow = ref(props.show);

// 从第一个会议中获取学生信息
const studentInfo = computed(() => {
  if (props.meetings.length > 0) {
    const firstMeeting = props.meetings[0];
    return {
      nickname: firstMeeting.participant_user_id.nickname,
      avatarUrl:
        import.meta.env.VITE_BUCKET_ENDPOINT +
        (firstMeeting.participant_user_id.avatar[0]?.url || ""),
    };
  }
  return {
    nickname: "",
    avatarUrl: "",
  };
});

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

const handleDelete = async (meeting: Meeting) => {
  uni.showModal({
    title: "取消会议",
    content: "确定要取消会议吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteMeeting(meeting.id);
          emit("delete", meeting);
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
