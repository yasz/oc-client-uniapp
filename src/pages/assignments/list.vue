<template>
  <view class="min-h-screen bg-gray-100">
    <!-- 顶部操作栏 -->
    <view
      class="fixed top-0 left-0 right-0 bg-white px-4 py-3 flex justify-between items-center shadow-sm z-10"
    >
    </view>

    <!-- 作业列表 -->
    <view class="pt-16 px-4">
      <view v-if="loading" class="flex justify-center items-center py-8">
        <text class="text-gray-500">加载中...</text>
      </view>

      <view
        v-else-if="assignments.length === 0"
        class="flex justify-center items-center py-8"
      >
        <text class="text-gray-500">暂无作业</text>
      </view>

      <view v-else class="space-y-4">
        <view
          v-for="assignment in assignments"
          :key="assignment.id"
          class="bg-white rounded-lg p-4 shadow-sm"
        >
          <view class="flex justify-between items-start">
            <view class="flex-1">
              <text class="text-lg font-medium">{{ assignment.title }}</text>
              <view class="mt-2 text-sm text-gray-500">
                <text>{{ assignment.course_id?.name }}</text>
                <text v-if="assignment.course_id?.parent" class="ml-2">
                  ({{ assignment.course_id.parent.name }})
                </text>
              </view>
            </view>
            <view class="ml-4">
              <text
                :class="[
                  'px-2 py-1 rounded text-xs',
                  assignment.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ assignment.status === "published" ? "已发布" : "草稿" }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { listAssignments } from "@/utils/api";

const assignments = ref<any[]>([]);
const loading = ref(true);

const fetchAssignments = async () => {
  try {
    loading.value = true;
    const response = await listAssignments();
    if (response?.data) {
      assignments.value = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch assignments:", error);
    uni.showToast({
      title: "获取作业列表失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
};

const handleCreate = () => {
  uni.navigateTo({
    url: "/pages/assignments/create",
  });
};

onMounted(() => {
  fetchAssignments();
});
</script>
