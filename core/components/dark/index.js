let _isSupported = window.CSS && window.CSS.supports && window.CSS.supports('--zovtest', 0)
if (!_isSupported) {
    console.warn('ZOV主题：浏览器不支持css自定义属性，不支持主题切换')
}
let _style = window.getComputedStyle(document.querySelector('body'), null)
let _styles = document.querySelector('body').style
let colorsName = [
    // 主题色
    'color-light-primary',
    'color-dark-primary',
    // 标题色，正文色，占位符，图标色，失效色，边框，分割线，背景色
    'color-title',
    'color-text',
    'color-sub',
    'color-placeholder',
    'color-disabled',
    'color-border',
    'color-divider',
    'color-background',
    'color-shadow'
]
let dark = {
    open (callback) {
        colorsName.forEach((item) => {
            _styles.setProperty('--' + item, _style.getPropertyValue('--dark-' + item))
        })
        callback()
    },
    close (callback) {
        colorsName.forEach((item) => {
            _styles.setProperty('--' + item, _style.getPropertyValue('--light-' + item))
        })
        callback()
    }
}
export default dark