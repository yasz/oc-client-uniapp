import { ref, onMounted, onUnmounted } from 'vue'
// 自定义装饰函数
function useModal(fn) {
	async function modal1(title) {
		let confirmText = uni.getStorageSync('lang') == 'zh-CN' ? '确认' : 'confirm'
		let cancelText = uni.getStorageSync('lang') == 'zh-CN' ? '取消' : 'cancel'
		return new Promise((resolve) => {
			uni.showModal({
				title: title,
				confirmText,
				cancelText,
				editable: true,
				success: function (res) {
					resolve(res.content)
				},
			})
		})
	}
	async function modal2(title, confirmText, cancelText) {
		return new Promise((resolve) => {
			uni.showModal({
				title,
				confirmText,
				cancelText,
				success: function (res) {
					resolve(res.confirm)
				},
			})
		})
	}
	function modal3(title) {
		return new Promise((resolve) => {
			let confirmText = uni.getStorageSync('lang') == 'zh-CN' ? '确认' : 'confirm'
			let cancelText = uni.getStorageSync('lang') == 'zh-CN' ? '取消' : 'cancel'
			uni.showModal({
				title,
				confirmText,
				cancelText,
				editable: false,
				success: function (res) {
					resolve(res.confirm)
				},
			})
		})
	}

	async function loading(...args) {
		uni.showLoading({
			title: 'Loading...',
		})
		let res = null
		try {
			res = await fn(...args) // 执行传入的函数，并传递参数
		} catch (error) {
			return { code: 100, msg: error }
		}
		uni.hideLoading()
		// setTimeout(() => {
		// 	uni.hideLoading()
		// }, 50)
		return {
			code: 200, data: res
		}
	}




	return {
		loading,
		modal1, modal2, modal3
	}
}



export default useModal