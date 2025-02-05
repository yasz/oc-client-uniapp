<script setup lang="ts">
import FileUploader from '@/components/fileUploader.vue';
import { useAuthStore } from '@/stores/authStore';
import { createAssignmentSubmission } from '@/utils/api';
import { onLoad } from '@dcloudio/uni-app';
import { defineProps, ref } from 'vue';

defineProps<{ content: any[] }>();

const show = ref(false);
const assignmentId = ref(0);
const currentDescription = ref("");
const file = ref([]);
function openContent(item: any) {
  currentDescription.value = item.description;
  assignmentId.value = item.id
  show.value = true;
}

function close() {
  show.value = false;
}
async function save() {
  const data = {
    userId: useAuthStore().userId,
    courseSessionId: id.value,
    assignmentId: assignmentId.value,
    content: detailContent.value,
    attachments: file.value,
  }
  console.log('【调试】:【', data, '】');
  await createAssignmentSubmission({
    userId: useAuthStore().userId,
    courseSessionId: id.value,
    assignmentId: assignmentId.value,
    content: detailContent.value,
    attachments: file.value,
  });

}
const id = ref(0);
const detailContent = ref("");

onLoad(async (e: any) => {
  id.value = +e.id;
})
</script>

<template>
  <view>

    <view v-for="item in content" :key="item.id" class="p-20 border-b">
      <view class="flex baseline pl-20">
        <uni-icons type="circle" size="22" color="#9298a5"></uni-icons>
        <text @click="openContent(item)" class="children-item py-10 pl-10">
          {{ item.title }}
        </text>
      </view>
    </view>

    <up-popup :closeOnClickOverlay="false" mode="center" :round="10" :show="show" @close="close">
      <view style="width: calc(100vw - 20px); height: 50vh; overflow: hidden; margin: 0 auto;">
        <scroll-view style="width: 100%; height: 100%;" scroll-y>
          <view class="pd-10">
            <up-parse :content="currentDescription"></up-parse>
          </view>
        </scroll-view>
        <view style="
  position: fixed;
  bottom: 20rpx;
  left: 50%;
  width: calc(100vw - 20px);
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transform: translateX(-50%);
">
          <view style="
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
  ">
            <up-textarea v-model="detailContent" style="width: 100%;" />
            <FileUploader v-model="file" style="width: 100%;" />
            <view style="
      display: flex;
      justify-content: center;
      gap: 20px;
      width: 100%;
    ">
              <u-button @click="close"
                style="flex: 1; padding: 10px 20px; background: #ccc; border-radius: 5px; border: none;">取消</u-button>
              <u-button @click="save"
                style="flex: 1; padding: 10px 20px; background: #007AFF; color: white; border-radius: 5px; border: none;">保存</u-button>
            </view>
          </view>
        </view>


      </view>
    </up-popup>

  </view>
</template>

<style lang="scss">
.children-item {
  color: #9298a5;
  font-size: 24rpx;
  line-height: 20px;
}
</style>
