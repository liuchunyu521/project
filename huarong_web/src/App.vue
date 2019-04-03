<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
	body,
	div,
	dl,
	dt,
	dd,
	ul,
	ol,
	li,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	p,
	th,
	td,
	form,
	textarea,
	input,
	select,
	textarea,
	button {
		margin:0;padding:0;
	}
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-weight: normal;
	}
	body {
		font: 12px/1.5 "microsoft yahei",arial;
		background-color: #fff;
	}
	a {
		text-decoration:none
	}
	i {
		font-style: normal;
	}
	a:active, a:hover {
		text-decoration:none;
	}
	img{
		vertical-align:top;
		border: 0;
	}
	dl,ul,ol,li {
		list-style:none
	} 
	/*下面是移动端默认样式*/
	input,
	button{
		border-radius: 0;
		outline: none;
		/*-webkit-appearance:none;*/
	}
	input,
	button,
	a{
		-webkit-tap-highlight-color: rgba(0,0,0,0); 
	}
	.clearfix:after {
		content: "";
		display: block;
		clear: both;
	}
	html,
	body{
		height: 100%;
		background: #fafafa;
	}
</style>
