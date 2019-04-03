/*======== Scrollspy 滚动监听 ========
 * @param: el 被监听的外层元素
 *  规则：给菜单元素添加scroll-href="#item1"
 * 给内容元素添加data-scroll="item1"
 * */
export function scrollSpy( el ){
	console.log(el)
	debugger;
	var contentEls = document.getElementsByClassName('navlist');
	var menuEls = document.getElementsByClassName('reportsub');
	
	var _scrollspy = {

	}; 
	_scrollspy.init();
}; 