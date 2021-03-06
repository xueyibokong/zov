<template>
	<div class="zov-select">
		<Drop
			zov-internal-reference-select
			:no-arrow="noArrow"
			:trigger="trigger"
			:never="disabled"
			v-model="dropShow"
		>
			<template #drop-head>
				<SelectHead
					ref="zov-select-head"
					:data="currentItemArr"
					:disabled="disabled"
					:size="size"
					:placeholder="placeholder"
					:filterable="filterable"
					:multiple="multiple"
					:clearable="clearable"
					:label-name="labelName"
					:value-name="valueName"
					v-model="query"
					:dropShow="dropShow"
					@on-remove-tag="select"
					@on-clear="clear"
					@click.native.stop="!disabled && dropShowFocus()"
				/>
			</template>
			<div
				class="zov-select-body"
				:style="{
					width: width + 'px'
				}"
			>
				<!-- 分组 -->
				<template v-if="group">
					<template v-if="filterable && query">
						<Option
							:data="queryResult"
							:selected-values="currentValueArr"
							:value-name="valueName"
							@on-click="select"
							v-slot="{ props }"
						>
							<slot :props="props">
								{{
									props.item[labelName] ||
										props.item[valueName]
								}}
							</slot>
						</Option>
					</template>
					<template v-else>
						<div
							v-for="(item, index) in currentData"
							:key="index + ''"
						>
							<div class="zov-select-option-group-title">
								{{
									item[labelName] || '第' + (index + 1) + '组'
								}}
							</div>
							<Option
								:data="item[childName]"
								:selected-values="currentValueArr"
								:value-name="valueName"
								@on-click="select"
								v-slot="{ props }"
							>
								<slot :props="props">
									{{
										props.item[labelName] ||
											props.item[valueName]
									}}
								</slot>
							</Option>
						</div>
					</template>
				</template>
				<!-- 不分组 -->
				<template v-else>
					<Option
						:data="filterable && query ? queryResult : currentData"
						:selected-values="currentValueArr"
						:value-name="valueName"
						@on-click="select"
						v-slot="{ props }"
					>
						<slot :props="props">
							{{ props.item[labelName] || props.item[valueName] }}
						</slot>
					</Option>
				</template>
			</div>
			<div
				class="zov-select-no-data"
				v-if="
					!currentData.length ||
						(!queryResult.length && filterable && query)
				"
			>
				<Spin v-if="queryLoading" />
				<span v-else>{{ noDataText }}</span>
			</div>
			<Spin cover v-show="loading" />
		</Drop>
	</div>
</template>
<script>
import Option from './option'
import SelectedMixin from './select-mixin'
const prefix = 'zov-select'
export default {
	name: prefix,
	components: {
		Option
	},
	mixins: [SelectedMixin],
	props: {
		// 可搜索
		filterable: {
			type: Boolean,
			default: false
		},
		childName: {
			type: String,
			default: 'children'
		}
	},
	data() {
		return {
			group:
				this.data[0] &&
				this.data[0].children &&
				this.data[0].children.length
		}
	},
	computed: {
		trigger() {
			return this.filterable ? 'focus' : 'click'
		}
	},
	watch: {
		query(val) {
			if (!this.filterable) return
			this.queryResult = []
			if (val === '') return
			this.queryLoading = true
			this.throttleFn(() => {
				if (this.group) {
					this.currentData.forEach(group => {
						group[this.childName].forEach(item => {
							if (
								new RegExp(val).test(
									(
										item[this.currentQueryName] ||
										item[this.valueName]
									).toString()
								)
							) {
								this.queryResult.push(item)
							}
						})
					})
				} else {
					this.currentData.forEach(item => {
						if (
							new RegExp(val).test(
								(
									item[this.currentQueryName] ||
									item[this.valueName]
								).toString()
							)
						) {
							this.queryResult.push(item)
						}
					})
				}
				this.queryLoading = false
			}, 10)
		}
	},
	methods: {
		defaultSelected(callback) {
			this.currentValueArr = []
			this.query = ''
			this.currentItemArr = []
			this.loading = false
			this.value instanceof Array
				? (this.currentValueArr = this.value)
				: (this.currentValueArr[0] = this.value)
			// 初始化选择
			this.currentValueArr.forEach(item => {
				for (let i = 0; i < this.currentData.length; i++) {
					if (
						String(item) ===
						String(this.currentData[i][this.valueName])
					) {
						this.select(this.currentData[i], 'default')
						break
					}
				}
			})
			this.loading = false
			callback && callback()
		}
	}
}
</script>
