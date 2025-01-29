<template>
  <view>

    <uni-collapse>
      <treeData :items="content"></treeData>
    </uni-collapse>
    <view style="height: 4000rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import treeData from './treeData.vue';  // 引入 TreeData 组件
defineProps<{ content: any }>();
// const items = [
//   {
//     "id": 4,
//     "name": "我上学了",
//     "children": []  // 无子节点
//   },
//   {
//     "id": 5,
//     "name": "第一单元 识字1",
//     "children": [
//       {
//         "id": 6,
//         "name": "第一课 天地人",
//         "children": [
//           {
//             "id": 7,
//             "name": "教学视频",
//             "file_id": {
//               "url": "/storage/uploads/7cb2a2494a1aa7ef72e35261d2663e0a.mp4"
//             },
//             "children": []
//           }
//         ]
//       }
//     ]
//   }
// ]
//   ;
</script>
