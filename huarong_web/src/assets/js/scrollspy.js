/*======== Scrollspy 滚动监听 ========
 * @param: el 被监听的外层元素
 *  规则：给菜单元素添加scroll-href="#item1"
 * 给内容元素添加data-scroll="item1"
 * */
export function scrollSpy( el ){
	var scrollMenuEl = el;
	var contentEls = scrollMenuEl[0].querySelectorAll('[data-scroll]') //内容区域	
	var menuEls = scrollMenuEl[0].querySelectorAll('[scroll-href]'); 
	
	var _scrollspy = {
		init: function(){
			window.addEventListener('scroll', this.onScroll); 
			for(var i = 0, l = menuEls.length; i < l; i++){
				let j = i;
				var _menuitem = menuEls[i];
				_menuitem.onclick = function( e ){  
					var _href = menuEls[j].getAttribute('scroll-href').replace('#', '');   
					_scrollspy.scrollMove( scrollMenuEl[0].querySelectorAll('[data-scroll="'+ _href +'"]')[0].offsetTop ); 
				}
			};  
		},
		//存监听菜单对应内容的起始位置  
		scrollPosition: function(){
			var _scroll = []; 
			for(var i = 0, l = contentEls.length; i < l; i++){
				var _top = contentEls[i].offsetTop +50; //20为列表的高度
				_scroll.push( _top );
			};  
			return _scroll;
		},
		scrollMove: function( scrollTo ) {
			var scrollFrom = this.getScrollTop(); 
         	var count = 0; 
         	var	time = 50;
         	var scrollTo = parseInt( scrollTo );
         	
         	var interval = setInterval(function () {
			   	count++;
			   	document.documentElement.scrollTop = document.body.scrollTop = (scrollTo - scrollFrom) / time * count + scrollFrom;
			   	if (count >= time) {
			     	clearInterval(interval);
			   	}
			 }, 10);
       },  
		//获取当前滚动条位置
		getScrollTop: function(){
			return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		},
		//滚动监听
		onScroll: function() {  
			
			let me = _scrollspy;
			let scrolled = me.getScrollTop();  
			let pos = me.scrollPosition(); 
			for( var i = 0, l = pos.length; i < l; i++){
				var _idx = i;
				var _start = ( _idx == 0 ? 0 : pos[ _idx - 1 ]);
				var _end = pos[ _idx ]; 
				
				
				if( scrolled >= _start && scrolled < _end ){ 
					var _currentIdx = ( _idx ==  l - 1 ? l - 1 : _idx); 
					 
					var _menuherf = contentEls[ _currentIdx ].getAttribute('data-scroll'); 
					
					for( var j = 0, len = menuEls.length; j < len; j++ ){
						var _menuitem = menuEls[j];
						if( _menuitem.getAttribute('scroll-href') == '#' + _menuherf){  
							_menuitem.className="current"; 
						}else{
							_menuitem.className="";
						}; 
					}; 
					break;
				};
			};  
		} 
	}; 
	_scrollspy.init();
}; 