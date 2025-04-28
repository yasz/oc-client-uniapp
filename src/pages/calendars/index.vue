<template>
  <view class="bg-primary" style="height: calc(100vh - 44px)">
    <view class="pt-40">
      <view class="flex flex-center-row">
        <image
          src="/static/calendars/title1.png"
          style="width: 50vw"
          mode="widthFix"
        />
      </view>

      <view class="pt-20 px-20">
        <view class="calendar-container">
          <view class="calendar-header">
            <text class="student-name">{{ student?.nickname }}的日历</text>
          </view>
        </view>
      </view>
    </view>
    <wn-calendar />
  </view>
</template>

<script setup lang="ts"></script>
