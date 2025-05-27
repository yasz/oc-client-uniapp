<template>
  <u-popup :show="show" @close="handleClose" mode="bottom">
    <view class="container bg-primary">
      <view class="popup-content bg-primary">
        <view class="modal-content">
          <view class="form-item">
            <text class="label">会议名称</text>
            <u-input v-model="formData.title" placeholder="请输入会议名称" />
          </view>

          <view class="form-item">
            <text class="label">会议链接</text>
            <u-input
              v-model="formData.meeting_link"
              placeholder="请输入会议链接"
            />
          </view>

          <view class="form-item">
            <text class="label">标记颜色</text>
            <view class="color-picker">
              <view
                v-for="color in colors"
                :key="color"
                class="color-item"
                :style="{ backgroundColor: color }"
                :class="{ active: formData.mark_color === color }"
                @click="formData.mark_color = color"
              />
            </view>
          </view>

          <view class="form-item">
            <text class="label">时区</text>
            <u-picker
              :columns="[timezones.map((t) => t.name)]"
              @confirm="handleTimezoneConfirm"
              :defaultIndex="[8]"
            >
              <view class="picker-trigger">
                <text>{{ selectedTimezone?.name || "请选择时区" }}</text>
                <text class="arrow">▼</text>
              </view>
            </u-picker>
          </view>

          <view class="form-item">
            <text class="label">会议时间</text>
            <uni-datetime-picker
              v-model="formData.meeting_time"
              type="datetime"
              :start="minDate"
              @change="handleDateTimeChange"
            />
          </view>

          <view class="form-item">
            <text class="label">持续时间（分钟）</text>
            <u-number-box v-model="formData.duration" :min="15" :step="15" />
          </view>

          <view class="button-group">
            <u-button type="primary" @click="handleSubmit">创建</u-button>
            <u-button @click="handleClose">取消</u-button>
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import { createMeeting } from "@/utils/api";
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
    const response = await fetch(
      "https://a.praise.site:3002/api/dim_timezone:list?pageSize=20&filter=%7B%7D",
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${authStore.token}`,
        },
      }
    );
    const data = await response.json();
    timezones.value = data.data;
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

.form-item {
  margin-bottom: 20px;

  .label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
  }
}

.color-picker {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-item {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;

  &.active {
    border-color: #333;
  }
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;

  .u-button {
    flex: 1;
  }
}

.picker-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  cursor: pointer;

  .arrow {
    font-size: 12px;
    color: #909399;
  }
}
</style>
