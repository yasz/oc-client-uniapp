<template>
  <u-popup :show="show" mode="bottom" @close="handleClose">
    <view class="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <view
        class="w-full bg-white rounded-t-[48px] p-[20px] max-h-[70vh] overflow-y-auto"
      >
        <view class="pt-[20px]">
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
            <u-datetime-picker
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
              :range="timezones.map((t) => t.name)"
              :value="
                selectedTimezone
                  ? timezones.findIndex((t) => t.id === selectedTimezone.id)
                  : 0
              "
              @change="
                (e) => {
                  const idx = e.detail.value;
                  selectedTimezone.value = timezones.value[idx];
                  formData.value.timezone_id = selectedTimezone.value.id;
                }
              "
            >
              <view
                class="flex justify-between items-center px-[12px] py-[8px] bg-white rounded-[4px] border border-[#dcdfe6] cursor-pointer"
              >
                <text>{{ selectedTimezone?.name || "选择时区" }}</text>
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
            <u-button class="flex-1" @click="handleClose">取消</u-button>
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import { createMeeting, getTimezoneList } from "@/utils/api";
import { useAuthStore } from "@/stores/authStore";

interface Timezone {
  id: number;
  value: number;
  name: string;
}

const props = defineProps<{
  show: boolean;
  studentId: number;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "created"): void;
}>();

const authStore = useAuthStore();
const timezones = ref<Timezone[]>([]);
const selectedTimezone = ref<Timezone | null>(null);
const showTimezonePicker = ref(false);

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

const handleClose = () => {
  emit("update:show", false);
};

const handleSubmit = async () => {
  try {
    await createMeeting(formData.value);
    uni.showToast({
      title: "创建成功",
      icon: "success",
    });
    emit("created");
    handleClose();
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
