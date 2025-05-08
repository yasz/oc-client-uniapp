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
            <view class="justify-between">
              <view>
                <view class="delete-btn" @click="handleDelete(meeting)">
                  <text class="delete-icon">-</text>
                </view>
                <text class="t-16">{{ meeting.title }} 会议时间：</text>
                <view class="flex-col t-12 text-gray">
                  <text>{{ formatDateTime(meeting.start) }}</text>
                  <view>
                    <text class="label">链接：</text>
                    <text
                      class="value link"
                      @click="handleLinkClick(meeting)"
                      >{{ meeting.meeting_link }}</text
                    >
                  </view>
                </view>
              </view>
              <view class="flex-col baseline">
                <image
                  class="student-avatar"
                  mode="aspectFill"
                  :src="getAvatarUrl(meeting.student.avatar)"
                />
                <text class="t-12 text-gray">{{
                  meeting.student.nickname
                }}</text>
              </view></view
            >
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
};

const getAvatarUrl = (avatar: Array<{ url: string }>) => {
  return import.meta.env.VITE_BUCKET_ENDPOINT + (avatar[0]?.url || "");
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

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
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

.delete-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 50%;
  cursor: pointer;
}

.delete-icon {
  font-size: 20px;
  color: #666;
  line-height: 1;
}

.meeting-title {
  font-weight: bold;
  color: #333;
  padding-left: 8px;
}
</style>
