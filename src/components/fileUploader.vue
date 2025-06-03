<template>
  <view>
    <view
      class="flex baseline"
      v-for="(file, index) in localFileList"
      :key="file.srcname"
    >
      <view class="pr-10 pb-6" @click="open(file)">
        {{
          file.srcname.length > 20
            ? `${file.srcname.substr(0, 12)}..${
                file.srcname.match(/\.\w+$/)[0]
              }`
            : file.srcname
        }}
      </view>
      <u-image
        @click="deleteFile(index)"
        src="/static/delete.png"
        width="20rpx"
        height="20rpx"
      />
    </view>

    <view v-if="localFileList?.length < maxCount">
      <u-upload
        accept="all"
        @afterRead="afterRead"
        @oversize="oversize"
        multiple
        :maxCount="maxCount"
        :maxSize="5000000"
      >
        <view class="px-4">
          <u-image src="/static/add.png" width="20rpx" height="20rpx" />
        </view>
      </u-upload>
    </view>
  </view>
</template>

<script setup lang="ts">
import { toast, uploadFile } from "@/utils/common";
import { ref, watch, defineProps, defineEmits } from "vue";

function open(file: any) {
  console.log("【调试】:【", file, "】");
  uni.openDocument({
    filePath: file.path,
    success: function (res) {
      console.log("打开文档成功");
    },
  });
}
const props = defineProps<{
  modelValue: any[];
  maxCount?: number;
}>();

// Provide default value for maxCount
const maxCount = ref(props.maxCount ?? 3); // Default value if maxCount is not provided

const emit = defineEmits<{
  (e: "update:modelValue", value: any[]): void;
}>();

const localFileList = ref([...props.modelValue]);

watch(
  () => props.modelValue,
  (newValue) => {
    localFileList.value = [...newValue];
  }
);

import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const oversize = (e: any) => {
  toast(t("File size should be less than 5MB."));
};
const deleteFile = (index: number) => {
  const newFiles = [...props.modelValue]; // Start with the current files from props
  newFiles.splice(index, 1); // Remove the file at the specified index
  emit("update:modelValue", newFiles); // Emit the updated file list to the parent component
};

const afterRead = async (event: any) => {
  const files = event.file; // Assuming event.file is an array of files
  const newFiles = [...props.modelValue]; // Start with the current files from props
  for (const file of files) {
    try {
      let res = await uploadFile({
        file,
        url: "attachments:create?attachmentField=assignment_submission.attachment",
      });
      newFiles.push({
        id: res.data.id,
        srcname: res.data.title + res.data.extname,
        path: `${import.meta.env.VITE_BUCKET_ENDPOINT}${res.data.url}`,
      });
    } catch (error) {
      toast(t("File size should be less than 5MB."));
      console.log("【toast】:", error);
    }
  }

  emit("update:modelValue", newFiles); // Emit the updated file list to the parent component
};
</script>
