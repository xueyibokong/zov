<template>
	<div>
		<div ref="point" :class="classes" :style="styles">
			<slot></slot>
		</div>
		<div v-show="slot && placeholder" :style="slotStyle"></div>
	</div>
</template>
<script>
import { on, off } from '../../utils/dom'
const prefix = 'zov-affix'
// 获取滚动条的位置
function getScroll(target, top) {
	const prop = top ? 'pageYOffset' : 'pageXOffset'
	const method = top ? 'scrollTop' : 'scrollLeft'
	let ret = target[prop]
	if (typeof ret !== 'number') {
		ret = window.document.documentElement[method]
	}
	return ret
}
// 获取dom节点的offset属性,返回top&left
function getOffset(element) {
	const rect = element.getBoundingClientRect()
	const scrollTop = getScroll(window, true)
	const scrollLeft = getScroll(window)
	const docEl = window.document.body
	const clientTop = docEl.clientTop || 0
	const clientLeft = docEl.clientLeft || 0
	return {
		top: rect.top + scrollTop - clientTop,
		left: rect.left + scrollLeft - clientLeft
	}
}

export default {
	name: prefix,
	props: {
		offsetTop: {
			type: Number,
			default: 0
		},
		offsetBottom: {
			type: Number
		},
		placeholder: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			affix: false,
			styles: {},
			slot: false,
			slotStyle: {}
		}
	},
	computed: {
		offsetType() {
			let type = 'top'
			if (this.offsetBottom >= 0) {
				type = 'bottom'
			}

			return type
		},
		classes() {
			return [
				{
					[`${prefix}`]: this.affix
				}
			]
		}
	},
	mounted() {
		//            window.addEventListener('scroll', this.handleScroll, false);
		//            window.addEventListener('resize', this.handleScroll, false);
		on(window, 'scroll', this.handleScroll)
		on(window, 'resize', this.handleScroll)
		this.$nextTick(() => {
			this.handleScroll()
		})
	},
	beforeDestroy() {
		//            window.removeEventListener('scroll', this.handleScroll, false);
		//            window.removeEventListener('resize', this.handleScroll, false);
		off(window, 'scroll', this.handleScroll)
		off(window, 'resize', this.handleScroll)
	},
	methods: {
		handleScroll() {
			const affix = this.affix // 该组件是否浮动,true为浮动,false为非浮动
			const scrollTop = getScroll(window, true) // 获取滚动条的位置
			const elOffset = getOffset(this.$el) // 获取挂载目标(该组件)的offset属性,返回left&top
			const windowHeight = window.innerHeight // 返回窗口的文档显示区的高度
			const elHeight = this.$el.getElementsByTagName('div')[0]
				.offsetHeight // 组件节点的实际高度
			// Fixed Top
			if (
				elOffset.top - this.offsetTop < scrollTop &&
				this.offsetType === 'top' &&
				!affix
			) {
				this.affix = true
				this.slotStyle = {
					width: this.$refs.point.clientWidth + 'px',
					height: this.$refs.point.clientHeight + 'px'
				}
				this.slot = true
				this.styles = {
					top: `${this.offsetTop}px`,
					left: `${elOffset.left}px`,
					width: `${this.$el.offsetWidth}px`
				}

				this.$emit('on-change', true)
			} else if (
				elOffset.top - this.offsetTop > scrollTop &&
				this.offsetType === 'top' &&
				affix
			) {
				this.slot = false
				this.slotStyle = {}
				this.affix = false
				this.styles = null

				this.$emit('on-change', false)
			}

			// Fixed Bottom
			if (
				elOffset.top + this.offsetBottom + elHeight >
					scrollTop + windowHeight &&
				this.offsetType === 'bottom' &&
				!affix
			) {
				this.affix = true
				this.slotStyle = {
					width: this.$refs.point.clientWidth + 'px',
					height: this.$refs.point.clientHeight + 'px'
				}
				this.slot = true
				this.styles = {
					bottom: `${this.offsetBottom}px`,
					left: `${elOffset.left}px`,
					width: `${this.$el.offsetWidth}px`
				}

				this.$emit('on-change', true)
			} else if (
				elOffset.top + this.offsetBottom + elHeight <
					scrollTop + windowHeight &&
				this.offsetType === 'bottom' &&
				affix
			) {
				this.slot = false
				this.slotStyle = {}
				this.affix = false
				this.styles = null

				this.$emit('on-change', false)
			}
		}
	}
}
</script>
