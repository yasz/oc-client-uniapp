<template>
  <view class="bg-white p-1 rounded-lg shadow">
    <template v-if="filteredTree.length > 0">
      <uni-collapse>
        <TreeNode v-for="item in filteredTree" :key="item.path" :node="item" @download="downloadAttachment"
          @preview="previewAttachment" />
      </uni-collapse>
    </template>
    <view v-else class="text-center py-4 text-gray-500">
      <text>暂无目录结构</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TreeNode from '@/components/TreeNode.vue';
import { parseContentToTree, type TreeNode as TreeNodeType } from '@/utils/xmlTreeParser';
import { useAuthStore } from '@/stores/authStore';

// --- Props ---
const props = defineProps<{
  content: string;
  courseId?: number; // 添加课程ID属性
}>();

const authStore = useAuthStore();

// --- 计算属性：使用独立的解析工具 ---
const tree = computed((): TreeNodeType[] => {
  return parseContentToTree(props.content);
});

// --- 权限控制：根据用户权限过滤目录 ---
const filteredTree = computed((): TreeNodeType[] => {
  if (!tree.value || tree.value.length === 0) return [];

  // 检查用户是否有该课程的权限
  const hasCourseAccess = checkCourseAccess();

  return tree.value.filter(node => {
    // 如果是管理员，显示所有内容
    if (authStore.roles.includes('admin')) {
      return true;
    }

    // 根据目录名称进行权限控制
    const nodeName = node.name.toLowerCase();

    // 如果用户没有课程权限，隐藏学生资源和教师资源
    if (!hasCourseAccess) {
      return !nodeName.includes('学生资源') && !nodeName.includes('教师资源');
    }

    // 如果用户有课程权限
    if (hasCourseAccess) {
      // 显示学生资源
      if (nodeName.includes('学生资源')) {
        return true;
      }

      // 如果是教师且有课程权限，显示教师资源
      if (nodeName.includes('教师资源') && authStore.roles.includes('teacher')) {
        return true;
      }

      // 其他目录正常显示
      return !nodeName.includes('教师资源');
    }

    return true;
  });
});

// 检查用户是否有该课程的权限
const checkCourseAccess = (): boolean => {
  if (!props.courseId) return false;

  // 管理员有所有权限
  if (authStore.roles.includes('admin')) {
    return true;
  }

  // 检查用户的课程列表
  if (authStore.userInfo?.user_courses && authStore.userInfo.user_courses.length > 0) {
    const assignedCourseIds = authStore.userInfo.user_courses.map((c: any) => c.id);
    return assignedCourseIds.includes(props.courseId);
  }

  return false;
};

const downloadAttachment = (path: string) => {
  // 这里可以添加下载逻辑
  uni.showLoading({ title: '准备下载...' });
  let encodedPath = path;

  // 如果路径已经被编码过，先解码再重新编码
  try {
    const decodedPath = decodeURIComponent(path);
    // 对路径的每个部分分别编码，保留路径分隔符
    encodedPath = decodedPath.split('/').map(part => encodeURIComponent(part)).join('/');
  } catch (e) {
    // 如果解码失败，说明原路径可能没有编码，直接编码
    encodedPath = path.split('/').map(part => encodeURIComponent(part)).join('/');
  }
  const fullUrl = `${import.meta.env.VITE_CDN_URL}/${encodedPath}`;


  let downloadStarted = false;
  const a = document.createElement('a');
  a.href = fullUrl;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  downloadStarted = true;
  setTimeout(() => {
    if (!downloadStarted) {
      uni.hideLoading();
      uni.showToast({ title: '下载超时', icon: 'none' });
    } else {
      uni.hideLoading();
    }
  }, 1000);



};
// --- 文件处理逻辑 ---
const previewAttachment = (path: string) => {
  // 对路径进行正确的编码处理
  let encodedPath = path;
  try {
    const decodedPath = decodeURIComponent(path);
    encodedPath = decodedPath.split('/').map(part => encodeURIComponent(part)).join('/');
  } catch (e) {
    encodedPath = path.split('/').map(part => encodeURIComponent(part)).join('/');
  }
  const fullUrl = `${import.meta.env.VITE_CDN_URL}/${encodedPath}`;
  // 判断文件类型
  const ext = path.split('.').pop()?.toLowerCase() || '';
  // 支持微软Office在线预览的类型
  if (["doc", "docx", "ppt", "pptx"].includes(ext)) {
    // 微软Office在线预览链接
    const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullUrl)}`;
    // #ifdef H5
    window.open(officeUrl, '_blank');
    // #endif
    // #ifndef H5
    uni.showModal({
      title: '请在浏览器中预览',
      content: '该文档类型建议在PC端浏览器中预览',
      showCancel: false
    });
    // #endif
    return;
  }
  // 其它类型走原有预览逻辑
  uni.showLoading({ title: '准备预览...' });
  uni.downloadFile({
    url: fullUrl,
    success: res => {
      if (res.statusCode === 200) {
        uni.openDocument({
          filePath: res.tempFilePath,
          showMenu: true,
          success: () => {
            console.log('文档打开成功');
          },
          fail: (err) => {
            console.error('文档打开失败:', err);
            uni.showToast({ title: '文件打开失败', icon: 'none' });
          }
        });
      } else {
        console.error('文件下载失败，状态码:', res.statusCode);
        uni.showToast({ title: `文件获取失败 (${res.statusCode})`, icon: 'none' });
      }
    },
    fail: (err) => {
      console.error('下载失败:', err);
      uni.showToast({ title: '下载失败', icon: 'none' });
    },
    complete: () => uni.hideLoading(),
  });
};

const getIconByType = (url: string): string => {
  const ext = url.split('.').pop()?.toLowerCase() || '';
  if (['mp3', 'wav'].includes(ext)) return 'volume';
  if (['mp4', 'mov'].includes(ext)) return 'play-circle';
  if (['pdf', 'doc', 'docx'].includes(ext)) return 'file-text';
  return 'download';
};
</script>

<style>
::v-deep .is-open+.uni-collapse-item__wrap {
  height: auto !important;
}

.children-item {
  color: #9298a5;
  font-size: 14px;
  line-height: 20px;
}
</style>
