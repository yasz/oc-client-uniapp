import { reactive, ref } from "vue";
import { onReachBottom } from "@dcloudio/uni-app";
import { getAPI, throttle, toast } from "@/utils/common";
import { useI18n } from "vue-i18n";

const useReachBottom = (debounceDelay = 500) => {
  const list = ref([]); // 存储数据列表
  const params: any = reactive({ page: 1, limit: 5 }); // 支持动态添加额外参数

  let table: string = "";
  let total = 0;
  const { t } = useI18n();

  const reqApi = async (tableName: string) => {
    table = tableName;
    uni.showLoading();
    // 使用 getAPI，传递 params 作为查询条件
    const data = await getAPI(table, { ...params });

    uni.hideLoading();

    if (data.length > 0) {
      list.value = list.value.concat(data);
      console.log("【list】:", list.value);
      params.page++;
      total += data.length;
    }
  };

  const reset = () => {
    list.value = [];
    total = 0;
    params.page = 1;
  };

  const handleReachBottom = throttle(() => {
    if ((params.page - 1) * params.limit > total) {
      toast(t("no records"));
      uni.hideLoading();
    } else reqApi(table);
  }, debounceDelay);

  onReachBottom(() => {
    handleReachBottom();
  });

  return {
    list,
    reqApi,
    reset,
    params, // 暴露 params 以便外部调用
  };
};

export default useReachBottom;
