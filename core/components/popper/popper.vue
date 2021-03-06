<template>
	<div class="zov-popper">
		<slot></slot>
		<span
			v-show="!this.noArrow"
			class="zov-popper-arrow"
			ref="zov-popper-arrow"
		></span>
	</div>
</template>
<script>
import Popper from 'popper.js'
const prefix = 'zov-popper'
export default {
	name: prefix,
	props: {
		value: {
			type: Boolean,
			default: false
		},
		placement: {
			type: String,
			default: 'bottom'
		},
		fix: {
			type: Boolean,
			default: true
		},
		noArrow: {
			type: Boolean,
			default: false
		},
		size: {
			// 父节点尺寸
			type: String,
			default: ''
		},
		gpuAcceleration: {
			// 使用CSS 3D转换来定位popper
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			popper: null
		}
	},
	watch: {
		size() {
			this.popper.update()
		},
		placement(val) {
			this.popper.options.placement = val
			this.popper.update()
		}
	},
	methods: {
		// 为了配合css变形动画，所以在popper更新后重设origin
		resetTransformOrigin(origin) {
			let transObj = {
				right: 'left',
				left: 'right',
				bottom: 'top',
				top: 'bottom'
			}
			this.popper.popper.style.transformOrigin = transObj[origin]
		},
		createPopper() {
			let _this = this
			_this.popper = new Popper(_this.$el.parentNode, _this.$el, {
				placement: _this.placement, // 默认位置，默认【'bottom'】
				positionFixed: _this.fix, // 定位是否为position: fixed，默认【false】
				// eventsEnabled: true, // 是否启用事件，默认【true】
				// removeOnDestroy: false, // 在销毁（调用destroy）时，是否移除popper节点，默认【false】
				onCreate: data => {
					this.resetTransformOrigin(data.placement)
				},
				onUpdate: data => {
					this.resetTransformOrigin(data.placement)
				},
				// 自定义修饰
				modifiers: {
					arrow: {
						element: this.$refs['zov-popper-arrow']
					},
					computeStyle: {
						gpuAcceleration: this.gpuAcceleration // 使用CSS 3D转换来定位popper
					},
					flip: {
						// behavior: 'clockwise' // 转换方式，默认【'flip'】
					},
					preventOverflow: {
						padding: 5,
						boundariesElement: 'window' // 边界元素， 'window'、 'viewport' 默认【scrollParent】
					}
				}
			})
		}
	},
	mounted() {
		this.createPopper()
	},
	destroyed() {
		this.popper.destroy()
	},
	updated() {
		this.popper.update()
	}
}
</script>
