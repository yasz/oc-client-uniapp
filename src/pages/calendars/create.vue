<template>
  <view>
    <view class="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <view
        class="w-full bg-white rounded-t-[48px] p-[20px] max-h-[70vh] overflow-y-auto"
      >
        <view class="pt-[20px]">
          <view class="f-c-c">
            <text> 创建{{ props.nickname }}的日程</text>
          </view>
          <view class="mb-[20px]">
            <text class="block mb-[8px] text-[14px] text-[#333]">标题</text>
            <u-input v-model="formData.title" placeholder="请输入标题" />
          </view>
          <view class="mb-[20px]">
            <text class="block mb-[8px] text-[14px] text-[#333]">会议链接</text>
            <u-input
              v-model="formData.meeting_link"
              placeholder="请输入会议链接"
            />
          </view>
          <view class="mb-[20px]">
            <text class="block mb-[8px] text-[14px] text-[#333]">颜色标记</text>
            <view class="flex gap-[10px] flex-wrap">
              <view
                v-for="color in colors"
                :key="color"
                :style="{
                  backgroundColor: color,
                  border:
                    formData.mark_color === color
                      ? '3px solid #333'
                      : '3px solid transparent',
                }"
                class="w-[30px] h-[30px] rounded-full cursor-pointer"
                @click="formData.mark_color = color"
              ></view>
            </view>
          </view>
          <view class="mb-[20px]">
            <text class="block mb-[8px] text-[14px] text-[#333]">会议时间</text>
            <uni-datetime-picker
              v-model="formData.meeting_time"
              type="datetime"
              :min-date="minDate"
              :max-date="maxDate"
              @change="handleDateTimeChange"
            />
          </view>
          <view class="mb-[20px]">
            <text class="block mb-[8px] text-[14px] text-[#333]">时区</text>
            <picker
              class="text-[12px]"
              :range="timezones.map((t) => t.name)"
              :value="selectedIndex"
              @change="onTimezoneChange"
            >
              <view
                class="flex justify-between items-center px-[12px] py-[8px] bg-white rounded-[4px] border border-[#dcdfe6] cursor-pointer"
              >
                <text>{{ timezones[selectedIndex]?.name || "选择时区" }}</text>
                <text class="text-[12px] text-[#909399]">▼</text>
              </view>
            </picker>
          </view>
          <view class="mb-[20px]">
            <text class="block mb-[8px] text-[14px] text-[#333]"
              >持续时间（分钟）</text
            >
            <u-number-box v-model="formData.duration" :min="15" :step="15" />
          </view>
          <view class="flex gap-[10px] mt-[20px]">
            <u-button type="primary" class="flex-1" @click="handleSubmit"
              >创建</u-button
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import { createMeeting, getTimezoneList, createMessage } from "@/utils/api";
import { useAuthStore } from "@/stores/authStore";
import { back } from "@/utils/common";

interface Timezone {
  id: number;
  value: number;
  name: string;
}

const props = defineProps<{
  studentId: number | string;
  nickname: string;
}>();

const authStore = useAuthStore();
const timezones = ref<Timezone[]>([]);
const selectedTimezone = ref<any>(null);
const selectedIndex = computed(() =>
  timezones.value.findIndex((t) => t.id === formData.value.timezone_id)
);
function onTimezoneChange(e: any) {
  const idx = e.detail.value;
  formData.value.timezone_id = timezones.value[idx].id;
}
const colors = [
  "#F8AE3D", // 橙色
  "#4CAF50", // 绿色
  "#2196F3", // 蓝色
  "#9C27B0", // 紫色
  "#E91E63", // 粉色
  "#FF5722", // 深橙色
];

const formData = ref({
  title: "",
  meeting_link: "",
  mark_color: colors[0],
  meeting_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  duration: 60,
  timezone_id: 1, // 默认时区
  participant_user_id: props.studentId,
  host_user_id: Number(authStore.userId),
});

const minDate = computed(() => {
  return dayjs().valueOf();
});

const maxDate = computed(() => {
  return dayjs().add(1, "year").valueOf();
});

// 获取时区列表
const fetchTimezones = async () => {
  try {
    timezones.value = (await getTimezoneList()).data;

    // 默认选择 UTC+8
    selectedTimezone.value =
      timezones.value.find((t) => t.value === 8) || timezones.value[0];
    formData.value.timezone_id = selectedTimezone.value.id;
  } catch (error) {
    console.error("Failed to fetch timezones:", error);
    uni.showToast({
      title: "获取时区列表失败",
      icon: "none",
    });
  }
};

const handleTimezoneConfirm = (e: any) => {
  const selectedName = e.value[0];
  const timezone = timezones.value.find((t) => t.name === selectedName);
  if (timezone) {
    selectedTimezone.value = timezone;
    formData.value.timezone_id = timezone.id;
  }
};

const handleSubmit = async () => {
  try {
    await createMeeting(formData.value);
    // 发送消息给老师和学生
    const meetingTime = formData.value.meeting_time;
    const meetingTitle = formData.value.title;
    const teacherName = authStore.nickname || "老师";
    const messageContent = `${teacherName} 创建了 ${meetingTime} 的 ${meetingTitle} 日程`;
    // 给学生
    await createMessage({
      sender_id: formData.value.host_user_id,
      receiver_id: formData.value.participant_user_id,
      content: messageContent,
      title: "日程创建",
    });
    // 给老师自己
    await createMessage({
      sender_id: formData.value.host_user_id,
      receiver_id: formData.value.host_user_id,
      content: messageContent,
      title: "日程创建",
    });
    uni.showToast({
      title: "创建成功",
      icon: "success",
    });
    back();
  } catch (error) {
    uni.showToast({
      title: "创建失败",
      icon: "error",
    });
  }
};

const handleDateTimeChange = (value: string) => {
  // Handle date time change if needed
};

onMounted(() => {
  fetchTimezones();
});
</script>

<style lang="scss" scoped></style>
