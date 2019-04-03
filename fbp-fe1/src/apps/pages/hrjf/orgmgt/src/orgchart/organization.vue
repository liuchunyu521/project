<!--
	作者：liuchym
	时间：2018-08-28
	支持：组织机构图
-->

<template>
	<ifbp-page>
		<ifbp-breadcrumb name="组织机构图"></ifbp-breadcrumb>
			<el-row :gutter="0">
				<el-col :span="4">
					<div class="orgleftnav" style="border:1px solid #ddd;overflow: auto;background: #fff;" :style="{height:maxheight+'px'}">
						<el-tree 
							id="orgTree"
							:empty-text="'加载中...'"
							:data="resdata" 
							:props="defaultProps" 
							node-key="id"
							:default-expanded-keys="[initpid]"  
							highlight-current 
							:render-content="renderContent"
							:expand-on-click-node="false" 
							@node-click="handleNodeClick">
						</el-tree>		
					</div>
				</el-col>
				<el-col :span="20">
					<div id="orgright"  style="border: 1px solid #ddd" :style="{marginLeft: '16px',position: 'relative',height:maxheight+'px'}">
						<div id="orgWrap">
							<div id="myDiagramDiv" :style="{backgroundColor:'#fff',height:maxheight+'px'}"></div>
						</div>
						<div id="orgview">
							<div id="orgChartView" style="height: 100px;"></div>
						</div>
						<div id="zoomIn" @click.stop="zoomIn()"><span>+</span></div>
						<div id="zoomOut" @click.stop="zoomOut()"><span>-</span></div>
					</div>
				</el-col>
			</el-row>
		
			<div class="el-loading-mask">
				<svg viewBox="25 25 50 50" class="circular">
					<circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
				</svg>
			</div>
  </ifbp-page>
</template>
<script>

  export default {
     data(){
		  return {
		  	resdata:[],
	        defaultProps:{
	       	 children:'children',
	       	 label: 'orgname'
	        },
	        maxheight:'',//设置自适应高度
	        myDiagram:'',//画图变量
	        initpid:'',//获取组织时候获取跟节点的id
	        orgArry:[],//右侧渲染数据
	        innercode:'',
	        orgtype:"",
	        dept_org:'',
	        tree:''
		 } 
	 },
	 created(){
	 	var _this=this;
	 	//设置自适应高度
	 	var winHeight='';
		if (window.innerHeight){
			winHeight = window.innerHeight;
		}else if ((document.body) && (document.body.clientHeight)){
			winHeight = document.body.clientHeight;
		}
		_this.maxheight=winHeight-160;//减掉内容上方的高度；
	 	
	 	
		//setTimeout(function(){//初始请求数据
			requirejs(['/i_hr/ifbp_hr/assets/hrjf/orgmgt/orgChart/go-simple.js'], (a) => {
				_this.resquestnav();//请求左侧菜单
				_this.resquest(_this.initpid, _this.innercode, _this.orgtype, _this.dept_org,_this.tree);
			});
		//},0)
	 },
	methods: {
		renderContent (createElement, { node, data, store }) {
        	let prop = {
		        'class': [
		            
		            parseInt(data.orgtype) === 1 ? 'orgclass ifbp-icon-business' : 'orgclass hr-icon-people'
		        ],
		        domProps: {
		            innerHTML: '<span style="color:#727171;margin-left:4px;position:relative;top:-2px;">'+data.orgname+'</span>'
		        }
		    };
		    return createElement(
		        'span', prop
		    );
		},
		orgchart(){
			
		   
				    this.createSelfButton();//自定义加号样式
			       //画图
			        var org_goJs = go.GraphObject.make;
			        this.myDiagram = org_goJs(go.Diagram, "myDiagramDiv", {
			        initialContentAlignment: go.Spot.Center,
			        validCycle: go.Diagram.CycleDestinationTree,
			        "undoManager.isEnabled": true,
			        layout: org_goJs(
			          go.TreeLayout, {
			            arrangement: go.TreeLayout.AlignmentCenterChildren,
			            angle: 90,
			            layerSpacing: 35
			          }
			        )
			      });
					
			      //节点面板配置
			      this.myDiagram.nodeTemplate = org_goJs(go.Node, "Vertical", {
			          selectionObjectName: "BODY"
			        }, {
		//		          mouseEnter: orgChart.nodeOver,
		//		          mouseLeave: orgChart.nodeLeave,
		//		          click: orgChart.selectTree
			        },
			        org_goJs(go.Panel, "Auto",
			          // 边框
			          org_goJs(go.Shape,{
			            name: "SHAPE",
			            stroke: '#fff',
			            strokeWidth: 2,
			            fill: "#fff"
			          },new go.Binding("stroke", "orgtype", function (value) {
			            value==2 ?
			              value = '#FF9500'
			              : value = '#5AC8FA';
			            return value;
			          })),
			          
			          org_goJs(go.Panel, "Horizontal", {
			              name: "BODY",
			              width: 264,
			              defaultAlignment: go.Spot.Center
			            },
			            org_goJs(go.Panel, "Vertical",
			              org_goJs(go.Panel, "Vertical", {
			                  width: 264,
			                  toShortLength:5,
			                  background: "#fff",
			                  alignment: go.Spot.Center
			                },
			                new go.Binding("background", "orgtype", function (value) {
				                value==2 ?
				                  value = '#FF9500'
				                  : value = '#5AC8FA';
				                return value;
				              }),
			                
			               // 部门名称
			                org_goJs(go.TextBlock, {
			                	width: 264,
			                    name: "ORGNAME",
			                    textAlign:"center",
			                    margin: 10, maxSize: new go.Size(80, NaN),
			                    font: "16px Microsoft YaHei",
			                    cursor: "pointer",
			                    stroke: "#fff"
			                  },
			                  new go.Binding("text", "orgname")), {
				                      click: this.linkorgname
			                  }),
			              org_goJs(go.Panel, "Horizontal", {
			                  width: 264
			                },
			                org_goJs(go.Picture, 'Horizontal', {
			                    margin: new go.Margin(12, 10, 16, 16),
			                    width: 50,
			                    height: 60,
			                    background: "#F2F2F2"
			                  },
			                  new go.Binding("source", "principal_photo", function (value) {
			                    value ?
			                      value = '/hrhi/psndoc/getPhotoByPK?pk_psndoc='+value
			                      : value = '/i_hr/ifbp_hr/assets/images/hrjf/orgmgt/orgChart/peple.png'
			                    return value;
			                  })),
			                org_goJs(go.Panel, "Table", {
			                    defaultAlignment: go.Spot.Left
			                  },
			                  org_goJs(go.RowColumnDefinition, {
			                    column: 2
			                  }),
			                  org_goJs(go.Panel,
			                    "Horizontal", {
			                      row: 0,
			                      column: 0,
			                      columnSpan: 2
			                    },
			                    // 姓名
			                    org_goJs(go.TextBlock, {
			                        name: "PRINCIPAL",
			                        font: "12pt Microsoft YaHei",
			                        margin: new go.Margin(3, 5, 3, 0),
			                        stroke: "#191919"
			                      },
//			                      new go.Binding("text", "principal_photo", function (value) {
//		                        	$.ajax({
//								        type: 'get',
//								        dataType: 'json',
//								        url: '/hrjf/orgChart/qryPsnNameByPk?pk_psndoc='+value,
//								        success: function (res) {
//								         value=res.data;
//								        },
//								        error: function () {
//											
//								        }
//			                        });
//			                        return value;
//			                      })),
			                      
			                      new go.Binding("text", "principal_showname", function (v) {
			                        if (!v) {
			                          v = "";
			                        }
			                        return v + " ";
			                      })),
			                    // 职位
			                    org_goJs(go.TextBlock, {
			                        name: "POST",
			                        font: "12pt Microsoft YaHei",
			                        margin: new go.Margin(3, 5, 3, 5),
			                        stroke: "#191919"
			                      },
			                      new go.Binding("text", "principal_post"))
			                  ),
			                  // 岗位人数
			                  org_goJs(go.TextBlock, {
			                      name: "postCount",
			                      row: 1,
			                      column: 0,
			                      font: "9pt Microsoft YaHei",
			                      margin: new go.Margin(3, 5, 3, 5),
			                      stroke: "#333333",
			                      isUnderline: true
			                    },
			                    new go.Binding("text", "org_post_count", function (v) {
			                      return "职位 " + v;
			                    }), {
		//		                      click: orgChart.linkPosition
			                    }),
			                  // 人员人数
			                  org_goJs(go.TextBlock, {
			                      name: "staffCount",
			                      row: 1,
			                      column: 0,
			                      font: "9pt Microsoft YaHei",
			                      margin: new go.Margin(3, 5, 3, 0),
			                      stroke: "#0089FA",
			                      cursor: "pointer",
			                    },
			                    new go.Binding("text", "num", function (v) {
			                      if (v === null) {
			                        return;
			                      }else if(v ==0){
			                      	return;
			                      } else {
			                        return "人员:  " + v;
			                      }
			                    })
			                    , {
				                       click: this.linkStaff
			                    }
			                  )
			                ) // panel table
			              ) // panel h
			            ), // panel v
			            org_goJs(go.Panel, "Table", {
			                defaultAlignment: go.Spot.RightCenter
			              },
			              org_goJs(go.RowColumnDefinition, {
			                column: 1
			              }),
			              org_goJs(go.Picture, {
			                  name: 'editIcon',
			                  row: 1,
			                  column: 0,
			                  width: 15,
			                  height: 15,
			                  margin: new go.Margin(0, 0, 14, 14)
			                }, {
			                  // 编辑
		//		                  click: orgChart.edit
			                },
			                new go.Binding("source", "key", function (v) {
			                  return "";
			                })),
			              org_goJs(go.Picture, {
			                  name: 'deleteIcon',
			                  row: 2,
			                  column: 0,
			                  width: 15,
			                  height: 15,
			                  margin: new go.Margin(0, 0, 0, 14)
			                }, {
			                  // 删除
		//		                  click: orgChart.chartDelete
			                },
			                new go.Binding("source", "key", function (v) {
			                  return "";
			                })) // delete-button
			            ) // man panel
			          ) // panelh
			        ), // panel auto
			        org_goJs(go.Panel, org_goJs("selfTreeExpanderButton", {
			          defaultAlignment: go.Spot.Bottom
			        }))
			      ); // node
			      //链接样式设置
			      this.myDiagram.linkTemplate = org_goJs(go.Link, {
			          selectable: false,
			          routing: go.Link.Orthogonal,
			          corner: 5
			        },
			        org_goJs(go.Shape, {
			          strokeWidth: 1,
			          stroke: "#6FB5FF"
			        })
			      ); // the link shape
			     
			    
		  		// 获取数据源
		  		var model = go.GraphObject.make(go.TreeModel);
		        //渲染两层
			    model.nodeDataArray = this.orgArry;//请求数据
		        this.myDiagram.model = model;
		        var node = this.myDiagram.findNodeForKey(this.initpid);
		        node.collapseTree(2);
		        this.myDiagram.select(node);
			    org_goJs(go.Overview, "orgChartView",  // the HTML DIV element for the Overview
			        { observed: this.myDiagram, contentAlignment: go.Spot.Center });   // tell it which Diagram to show and pan
		},
		createSelfButton() {
	      go.GraphObject.defineBuilder("Button", function (args) {
	        // default brushes for "Button" shape
	        var buttonFillNormal = go.GraphObject.make(go.Brush, "Linear", {
	          0: "white",
	          1: "#e0f1fb"
	        });
	        var buttonStrokeNormal = "#5596e6";
	
	        var buttonFillOver = go.GraphObject.make(go.Brush, "Linear", {
	          0: "white",
	          1: "dodgerblue"
	        });
	        var buttonStrokeOver = "#5596e6";
	        // offset identical to that needed to match the original RoundedRectangle figure, to keep the same size
	        var offset = 2.761423749153968;
	        var button = /** @type {Panel} */ (
	          go.GraphObject.make(go.Panel, "Auto", {
	              isActionable: true
	            }, // needed so that the ActionTool intercepts mouse events
	            { // save these values for the mouseEnter and mouseLeave event handlers
	              "_buttonFillNormal": buttonFillNormal,
	              "_buttonStrokeNormal": buttonStrokeNormal,
	              "_buttonFillOver": buttonFillOver,
	              "_buttonStrokeOver": buttonStrokeOver
	            },
	            go.GraphObject.make(go.Shape, // the border
	              {
	                name: "ButtonBorder",
	                figure: "Ellipse",
	                spot1: new go.Spot(0, 0, offset, offset),
	                spot2: new go.Spot(1, 1, -offset, -offset),
	                fill: buttonFillNormal,
	                stroke: buttonStrokeNormal
	              }))
	        );
	        // There"s no GraphObject inside the button shape -- it must be added as part of the button definition.
	        // This way the object could be a TextBlock or a Shape or a Picture or arbitrarily complex Panel.
	        // mouse-over behavior
	        button.mouseEnter = function (e, button, prev) {
	          var shape = button.findObject("ButtonBorder"); // the border Shape
	          if (shape instanceof go.Shape) {
	            var brush = button["_buttonFillOver"];
	            button["_buttonFillNormal"] = shape.fill;
	            shape.fill = brush;
	            brush = button["_buttonStrokeOver"];
	            button["_buttonStrokeNormal"] = shape.stroke;
	            shape.stroke = brush;
	          }
	        };
	        button.mouseLeave = function (e, button, prev) {
	          var shape = button.findObject("ButtonBorder"); // the border Shape
	          if (shape instanceof go.Shape) {
	            shape.fill = button["_buttonFillNormal"];
	            shape.stroke = button["_buttonStrokeNormal"];
	          }
	        };
	        return button;
	      });
	      go.GraphObject.defineBuilder("selfTreeExpanderButton", function (args) {
	        var button = /** @type {Panel} */ (
	          go.GraphObject.make("Button", { // set these values for the isTreeExpanded binding conversion
	              "_treeExpandedFigure": "MinusLine",
	              "_treeCollapsedFigure": "PlusLine"
	            },
	            go.GraphObject.make(go.Shape, // the icon
	              {
	                name: "ButtonIcon",
	                figure: "MinusLine", // default value for isTreeExpanded is true
	                desiredSize: new go.Size(16, 16),
	                stroke: '#5596e6',
	                fill: 'blue'
	              },
	              // bind the Shape.figure to the Node.isTreeExpanded value using this converter:
	              new go.Binding("figure", "isTreeExpanded",
	                function (exp, shape) {
	                  var button = shape.panel;
	                  return exp ? button["_treeExpandedFigure"] : button["_treeCollapsedFigure"];
	                })
	                .ofObject()),
	            // assume initially not visible because there are no links coming out
	            {
	              visible: false
	            },
	            // bind the button visibility to whether it's not a leaf node
	            new go.Binding("visible", "isTreeLeaf",
	              function (leaf) {
	                return !leaf;
	              })
	              .ofObject())
	
	        );
	        // tree expand/collapse behavior
	        button.click = function (e, button) {
	          var node = button.part;
	          if (node instanceof go.Adornment) node = node.adornedPart;
	          if (!(node instanceof go.Node)) return;
	          //获取点击的id
	          e.handled = true;
	          var diagram = node.diagram;
	          var fromData = node.data;
	          var model = diagram.model;
	          var fromID = model.getKeyForNodeData(fromData);
	          var fromInnercode = fromData.innercode;
	          var fromOrgtype = fromData.orgtype;
	          var fromDept_org = fromData.dept_org;
	          //var diagram = node.diagram;
	          if (diagram === null) return;
	          var cmd = diagram.commandHandler;
	          if (node.isTreeExpanded) {
	            if (!cmd.canCollapseTree(node)) return;
	          } else {
	            if (!cmd.canExpandTree(node)) return;
	          }
	          e.handled = true;
	          if (node.isTreeExpanded) {
	            cmd.collapseTree(node);
	          } else {
	          	cmd.expandTree(node);
	          	node.collapseTree(2);
	          	//点击加号的时候触发请求数据
	          	//return;//放弃请求
	            //先清空
	            var chl = node.findTreeChildrenNodes();
	            chl.each(function (v) {
	              diagram.removeParts(v.findTreeParts());
	            });
	            //请求并添加子数据
	            $.ajax({
	              type: 'get',
	              dataType: 'json',
	              url: '/hrjf/orgChart/queryGraphList/getByPk',
	              data: {
	                'pk_org': fromID,
	                'innercode': fromInnercode,
	                'orgtype': fromOrgtype,
	                'dept_org': fromDept_org,
	                'tree': 'child'
	              },
	              success: function (res) {
	                if (res.success === true) {
	                  res = res.data;
	                  for (var i = 0; i < res.length; i++) {
	                    res[i].pid === null ? res[i].pid = '' : res[i].pid = res[i].pid;
	                    res[i].key = res[i].id;
	                    delete res[i].id;
	                    res[i].parent = res[i].pid;
	                    delete res[i].pid;
	                    diagram.model.addNodeData(res[i]);
	                  }
	                  var node = diagram.findNodeForKey(fromID);
	                  node.collapseTree(2);
	                  diagram.select(node);
	                }
	              }
	            });
	            cmd.expandTree(node);
	          }
	        };
	        return button;
	      });
	      function getNextKey(diagram, nodeIdCounter = -1) {
	        var key = nodeIdCounter;
	        while (diagram.model.findNodeDataForKey(key.toString()) !== null) {
	          key = nodeIdCounter -= 1;
	        }
	        return key.toString();
	      }
	    },
	    resquestnav(){
	    	console.log('左侧菜单begin'+new Date().getTime())
	    	var _this=this;
		    $.ajax({
		        type: 'get',
		        dataType: 'json',
		        url: '/hrjf/orgChart/queryTreeList/getAll',//左侧菜单数据
		        success: function success(res) {
		          if (res.status === true) {
		            var res = res.data;
		            for (var i = 0; i < res.length; i++) {
		            	if(res[i].pid==''){
		            		_this.initpid=res[i].id;
		            		_this.innercode=res[i].innercode;
		            		_this.orgtype=res[i].orgtype;
		            		_this.dept_org=res[i].dept_org;
		            		
		            	}
		            }
		            console.log(_this.initpid)
		            _this.resdata=_this.fntran(res, '');
		            
		            console.log(_this.resdata)
		             console.log('左侧菜单over' + new Date().getTime())
		          }
		        },
		        error: function () {
					_this.$message({
			          showClose: true,
			          message: '数据请求失败',
			          type: 'error'
			        });
		        }
		      });
	    },
	    resquest(id, innercode, orgtype, dept_org,tree){
	    	$(".el-loading-mask")[0].style.display="block";
	    	var _this=this;
	    	_this.orgArry=[];
	        if (id === undefined) {
	        	var url = '/hrjf/orgChart/queryGraphList/getByPk?pk_org=&innercode=&orgtype=&dept_org=&tree=';
	      	} else {
	        	var url = '/hrjf/orgChart/queryGraphList/getByPk?pk_org=' + id + '&innercode=' + innercode + '&orgtype=' + orgtype + '&dept_org=' + dept_org + '&tree=' + tree;
	      	}
	      	$.ajax({
		        type: 'get',
		        dataType: 'json',
		        url: url,
		        success: function (res) {
		          if (res.status === true) {
		            var res = res.data;
//		            console.log(new Date().getTime())
		            
					for (var i = 0; i < res.length; i++) {
		              if(res[i].pid === null || res[i].pid=='') {
		              	res[i].pid = '';
		              	_this.initpid=res[i].id;
		              } else{
		              	res[i].pid = res[i].pid;
		              } 
		              res[i].key = res[i].id;
		              delete res[i].id;
		              res[i].parent = res[i].pid;
		              delete res[i].pid;
		              _this.orgArry.push(res[i]);
		            }
//		            console.log(new Date().getTime())
					
					$(".el-loading-mask")[0].style.display="none";
			    	_this.orgchart();//渲染右侧架构图
			    	
		          }
		        },
		        error: function () {
					_this.$message({
			          showClose: true,
			          message: '数据请求失败',
			          type: 'error'
			        });
		        }
			});
	    },
	    linkorgname:function(e,obj){
	    	var getUrlParam = function () {
					var r=window.parent.vueInstance.$route.query.tilecode
					if (r != null) return r;
					return null;
				}
				var res=getUrlParam();
	    	
	    	var clicked = obj.part;
//		      orgChart.jumpFlag = false;
	      if (clicked !== null) {
	        var value = clicked.data.key;
	        var searchKey = clicked.data.orgtype === 2 ? '/hrjf/hrDept/deptNoEditDetail/' : '/hrjf/hrOrg/orgsReadOnlyDetails/'
	        var funcode = clicked.data.orgtype === 2 ? '&funcode=60050deptinfo' : '&funcode=60050orginfo'
	      }
	      window.vueInstance.$router.push(searchKey + value+'?isOrgLink=true&tilecode='+res + funcode);
	    },
	    /**
	     * 跳转人员
	     */
	    linkStaff: function (e, obj) {
	      var clicked = obj.part;
//		      orgChart.jumpFlag = false;
	      if (clicked !== null) {
	        var value = clicked.data.key;
	        var org_namevalue=clicked.data.orgname
	        var org_pid_name=clicked.data.pid_name
	        var dept_orgValue=clicked.data.dept_org;
	        var searchKey = clicked.data.orgtype === 1 ? 'search_pk_org' : 'search_pk_dept';
	      }
	      
	      
	      var getUrlParam = function () {
					var r=window.parent.vueInstance.$route.query.tilecode
					if (r != null) return r;
					return null;
				}
				var res=getUrlParam();
				if(clicked.data.orgtype == 1){
					//联查组织
	      	window.vueInstance.$router.push("/hrhi/psndoc" + '?'  + "pk_org" + '=' + value+"&org_name" + '=' + org_namevalue+'&tilecode='+res+'&funcode=60070psninfo');
				
			}else {
					//联查部门
	      	window.vueInstance.$router.push("/hrhi/psndoc" + '?' + "dept_org" + '=' + dept_orgValue + "&pk_dept" + '=' + value+"&org_name" + '=' + org_pid_name+"&dept_name" + '=' + org_namevalue+'&tilecode='+res+'&funcode=60070psninfo');
			}
		},
	    //放大
	    zoomIn() {
//		      var elem = $('.zoom')[0];
//		      elem.onselectstart = function () {
//		        return false;
//		      };
	      var diagram = this.myDiagram;
	      diagram.scale += 0.1;
	    },
	    //缩小
	    zoomOut() {
//		      var elem = $('.zoom')[1];
//		      elem.onselectstart = function () {
//		        return false;
//		      };
//		      arguments[1].preventDefault();
	      var diagram = this.myDiagram;
	      diagram.scale -= 0.1;
	    },
	 	 handleNodeClick(data) {
			$("#orgWrap").html("");
			$("#orgview").html("");
//			debugger;
			this.initpid=data.id;
	        this.resquest(data.id, data.innercode, data.orgtype, data.dept_org,'');
    		var str='<div id="myDiagramDiv" style="background-color:#fff;height:'+this.maxheight+'px;"></div>'
    		var strview='<div id="orgChartView" style="height:100px"></div>';
	    	$("#orgWrap").html(str);
	    	$("#orgview").html(strview);
	 	},
	 	 fntran(data,pid){
		    var result = [] , temp;
		    for(var i in data){
		        if(data[i].pid==pid){
		            result.push(data[i]);
		            temp = this.fntran(data,data[i].id);           
		            if(temp.length>0){
		                data[i].children=temp;
		            }           
		        }       
		    }
		   
		    return result;
		}
	 }

  };

</script>
<style >
	#orgright #myDiagramDiv {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
	}
	#orgright #orgview {
		height: 100px;
		width: 200px;
		position: absolute;
		right: -1px;
		top: -1px;
		border: 1px solid #ddd;
		background: #f8fdff;
		z-index: 99;
	}
	#orgright #zoomIn {
		height: 40px;
		width: 40px;
		position: absolute;
		right: 10px;
		bottom: 100px;
		z-index: 99;
		background: #5CB0E6;
		text-align: center;
		line-height: 40px;
		font-size: 40px;
		color: #fff;
		border-radius:100%;
		cursor: pointer;
	}
	#orgright #zoomOut {
		height: 40px;
		width: 40px;
		position: absolute;
		right: 10px;
		bottom: 50px;
		z-index: 99;
		background: #5CB0E6;
		text-align: center;
		line-height: 40px;
		font-size: 40px;
		color: #fff;
		border-radius: 100%;
		cursor: pointer;
	}
	.orgleftnav #orgTree {
		width: 400px;
	}
	#orgTree .el-tree {
		border: none !important;
	} 
	/*加载中弹框*/
	.el-loading-mask {
		display: none;
	    position: absolute;
	    z-index: 10000;
	    background-color: rgba(255,255,255,.9);
	    margin: 0;
	    top: 0;
	    right: 0;
	    bottom: 0;
	    left: 0;
	    transition: opacity .3s;
	}
	
	.circular {
	    width: 42px;
	    height: 42px;
	    animation: loading-rotate 2s linear infinite;
	    position: absolute;
	    top: 50%;
	    left: 50%;
	}
	@keyframes loading-ratate{
		100% {
		    transform: rotate(360deg);
		}
	}
	.path {
	    animation: loading-dash 1.5s ease-in-out infinite;
	    stroke-dasharray: 90,150;
	    stroke-dashoffset: 0;
	    stroke-width: 2;
	    stroke: #5CB0E6;
	    stroke-linecap: round;
	}
	
	@keyframes loading-dash{
		0% {
		    stroke-dasharray: 1,200;
		    stroke-dashoffset: 0;
		}
		
		50% {
		    stroke-dasharray: 90,150;
		    stroke-dashoffset: -40px;
		}
		100% {
		    stroke-dasharray: 90,150;
		    stroke-dashoffset: -120px;
		}
	}
	.orgclass {
		    font-size: 14px !important;
		    margin-right: 6px;
		    color: #5CB0E6;
		    position: relative;
		    top: 4px;
	}
	
	#orgTree .el-tree__empty-text {
		left:28%;
	}
</style>
