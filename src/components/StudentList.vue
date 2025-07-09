<template>
    <view class="student-selector">
      <view class="student-list">
        <view
          v-for="student in students"
          :key="student.id"
          class="student-item"
          :class="{ 'student-item--active': selectedId === student.id }"
          @click="handleClick(student)"
        >
          <image
            class="student-avatar"
            mode="aspectFill"
            :src="student.avatarUrl || '/static/avatars/wechat/defaultAvatar.png'"
          />
          <text class="student-name">{{ student.nickname }}</text>
          <view class="progress-info">
            <!-- 默认插槽：可自定义右侧内容，如进度、按钮等 -->
            <slot name="itemRight" :student="student">
              <text v-if="student.brick_completed_count !== undefined" class="progress-text">
                已完成: {{ student.brick_completed_count }}幅
              </text>
            </slot>
          </view>
        </view>
      </view>
    </view>
  </template>
  
  <script setup lang="ts">
  import { PropType } from 'vue';
  
  const props = defineProps({
    students: {
      type: Array as PropType<any[]>,
      required: true
    },
    selectedId: {
      type: Number,
      default: undefined
    }
  });
  
  const emit = defineEmits(['select']);
  
  const handleClick = (student: any) => {
    emit('select', student);
  };
  </script>
  
  <style lang="scss" scoped>
  .student-selector {
    padding: 20rpx;
  }
  
  .student-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }
  
  .student-item {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  
    &--active {
      background-color: #fff5e6;
      border: 2rpx solid #f8ae3d;
    }
  }
  
  .student-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }
  
  .student-name {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }
  
  .progress-info {
    font-size: 24rpx;
    color: #666;
  }
  
  .progress-text {
    color: #f8ae3d;
  }
  </style>