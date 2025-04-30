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
            <text class="label">会议时间</text>
            <uni-datetime-picker
              v-model="formData.meeting_time"
              type="datetime"
              :start="minDate"
              :end="maxDate"
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
import { ref, computed } from "vue";
import dayjs from "dayjs";
import { createMeeting } from "@/utils/api";
import { useAuthStore } from "@/stores/authStore";

const props = defineProps<{
  show: boolean;
  studentId: number;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "created"): void;
}>();

const authStore = useAuthStore();

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
</style>
