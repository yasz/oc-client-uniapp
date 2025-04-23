<template>
  <view class="bg-primary" style="height: calc(100vh - 44px)">
    <view class="pt-40">
      <view class="flex flex-center-row">
        <image
          src="/static/puzzles/title1.png"
          style="width: 50vw"
          mode="widthFix"
        />
      </view>

      <view class="flex flex-center-row pt-20">
        <image
          :src="
            isAllCompleted
              ? '/static/puzzles/title3.png'
              : '/static/puzzles/title2.png'
          "
          :style="{ width: isAllCompleted ? '40vw' : '30vw' }"
          mode="widthFix"
        />
      </view>
      <view class="pt-20">
        <PuzzleGrid
          :scale="0.2"
          :completed="completedPieces"
          @pieceClick="handlePieceClick"
        />
      </view>
      <view> 继续下一幅拼图 </view>
    </view>

    <!-- <u-button
      :text="$t('apply logoff')"
      shape="circle"
      @click="submit"
    ></u-button> -->
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import PuzzleGrid from "@/components/PuzzleGrid.vue";
//接下来是要做一个互动提示，点击灰色false块拼图会提示，是否赠送确认发放一块拼图给XX同学；

const completedPieces = ref(Array(9).fill(false));
const isAllCompleted = computed(() => {
  return completedPieces.value.every((piece) => piece === true);
});
const handlePieceClick = (index: number) => {
  uni.showModal({
    title: "赠送确认",
    content: "是否赠送一块拼图给XX同学？",
    success: (res) => {
      if (res.confirm) {
        completedPieces.value[index] = true;
      }
    },
  });
};

const handlePuzzleComplete = () => {
  uni.showModal({
    title: "拼图完成",
    content: "XX同学已经收集完一副拼图！",
    showCancel: false,
    success: () => {
      // 重置所有拼图块
      // completedPieces.value = Array(9).fill(false)
    },
  });
};
</script>

<style lang="scss"></style>
