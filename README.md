#iSlider -- jQuery slide plugin
##iSlider Options
```
/*
 * 切换效果
 * {string} show/fade/vslide/hslide/vcover/hcover
*/
effect: 'hslide', 

/*
 * 间隔时间
 * {number}
*/
speed: 4000,

/*
 * 初始显示项
 * {number}
*/
index: 0,

/*
 * mouseover延迟时间
 * {number}
*/
delay: 120,

/*
 * 是否定时切换
 * {boolean}
*/
timing: true,

/*
 * ctrl是否可操作
 * {boolean}
*/
ctrlHandle: true,

/*
 * ctrl和前后操作
 * {array}
*/
trigger: ['mouseover','click'],

/*
 * 鼠标覆盖是否暂停
 * {boolean}
*/
pauseHover: true,

/*
 * 当前显示className
 * {string}
*/
active: 'active',

/*
 * 配置可操作 htmlElement
 * roll 切换区域; 如: '.wrap .roll .item'
 * ctrl 操作; 如: '.ctrl li'
 * prev 前; 如: '.prev'
 * next 后; 如: '.next'
*/
elements: {
  	roll: '.slider-wrap .slider-roll .item',
	ctrl: '.slider-ctrl li',
  	prev: '.slider-prev',
  	next: '.slider-next'
}
```
