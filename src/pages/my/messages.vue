<template>
  <div class="px-4 py-4">
    <!-- 顶部标题 -->
    <div class="flex items-center justify-between mb-4">
   
    </div>

    <!-- 消息列表 -->
    <div v-if="messages.length > 0" class="space-y-3">
      <div
        v-for="message in messages"
        :key="message.id"
        class="bg-white rounded-xl shadow p-4"
        :class="{ 'opacity-60': message.status }"
        @click="handleMessageClick(message)"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-3">
            <div class="text-base font-medium text-gray-900">
              {{ message.title || "无标题" }}
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <div
              v-if="!message.status"
              class="w-2 h-2 rounded-full bg-red-500"
            ></div>
            <div class="text-xs text-gray-400">
              {{ formatDate(message.createdAt) }}
            </div>
            <!-- 删除图标 -->
            <div 
              class="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500"
              @click.stop="handleDeleteMessage(message.id)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="text-sm text-gray-600 line-clamp-2">
          {{ message.content }}
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex flex-col items-center justify-center py-20">
      <div class="text-gray-400 text-sm">暂无消息</div>
    </div>

    <!-- 消息详情弹窗 -->
    <uni-popup ref="popup" type="center">
      <div
        class="bg-white rounded-xl p-4 w-[80vw] max-h-[80vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="text-lg font-medium text-gray-900">
            {{ currentMessage?.title || "无标题" }}
          </div>
          <div class="text-xs text-gray-400">
            {{ currentMessage ? formatDate(currentMessage.createdAt) : "" }}
          </div>
        </div>
        <div class="text-base text-gray-600 whitespace-pre-wrap">
          {{ currentMessage?.content }}
        </div>
        <div class="mt-4 flex justify-between">
          <button
            class="py-2 px-4 bg-gray-500 text-white rounded-lg text-base font-medium"
            @click="copyMessageContent"
          >
            复制内容
          </button>
          <button
            class="py-2 px-4 bg-primary text-white rounded-lg text-base font-medium"
            @click="closePopup"
          >
            关闭
          </button>
        </div>
      </div>
    </uni-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { listMessages, updateMessage, deleteMessage } from "@/utils/api";
import { useAuthStore } from "@/stores/authStore";

// 定义消息接口
interface Message {
  id: number;
  title?: string;
  content: string;
  status: boolean;
  createdAt: string;
  sender_id: number;
  receiver_id: number;
}

// 定义API响应接口
interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

const authStore = useAuthStore();
const messages = ref<Message[]>([]);
const popup = ref<any>(null); // uni-popup 类型暂时用 any
const currentMessage = ref<Message | null>(null);

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

// 获取消息列表
const fetchMessages = async () => {
  try {
    const response = (await listMessages(
      Number(authStore.userId)
    )) as ApiResponse<Message>;
    messages.value = response.data || [];
  } catch (error) {
    console.error("获取消息列表失败:", error);
    uni.showToast({
      title: "获取消息列表失败",
      icon: "none",
    });
  }
};

// 处理消息点击
const handleMessageClick = (message: Message) => {
  showMessageDetail(message);
};

// 删除单条消息
const handleDeleteMessage = async (messageId: number) => {
  // 显示确认对话框
  uni.showModal({
    title: "确认删除",
    content: "确定要删除这条消息吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteMessage(messageId);
          
          // 从本地列表中移除已删除的消息
          messages.value = messages.value.filter(
            message => message.id !== messageId
          );
          
          uni.showToast({
            title: "删除成功",
            icon: "success",
          });
        } catch (error) {
          console.error("删除消息失败:", error);
          uni.showToast({
            title: "删除失败",
            icon: "none",
          });
        }
      }
    }
  });
};

// 显示消息详情
const showMessageDetail = async (message: Message) => {
  currentMessage.value = message;
  popup.value.open();

  // 如果消息未读，更新状态
  if (!message.status) {
    try {
      await updateMessage(message.id);
      // 更新本地消息状态
      const index = messages.value.findIndex(
        (m: Message) => m.id === message.id
      );
      if (index !== -1) {
        messages.value[index].status = true;
      }
    } catch (error) {
      console.error("更新消息状态失败:", error);
    }
  }
};

// 复制消息内容
const copyMessageContent = () => {
  if (currentMessage.value?.content) {
    // 使用uni-app的剪贴板API
    uni.setClipboardData({
      data: currentMessage.value.content,
      success: () => {
        uni.showToast({
          title: "内容已复制到剪贴板",
          icon: "success",
        });
      },
      fail: () => {
        uni.showToast({
          title: "复制失败",
          icon: "none",
        });
      },
    });
  }
};

// 关闭弹窗
const closePopup = () => {
  popup.value.close();
  currentMessage.value = null;
};

onMounted(() => {
  fetchMessages();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
