var WINDOW_WIDTH=1024;
var WINDOW_HEIGHT=500;
var RADIUS=8;				//小圆半径
var MARGIN_TOP=60;
var MARGIN_LEFT=30;

//const endTime = new Date(2015,6,9,22,40,10); //定义目标时间
var curShowTimeSecounds = 0;				 //初始化设置时间距离当前时间为0毫秒

var balls=[];
const colors=["#33b5e5" , "#0099cc" , "#aa66cc" , "#9933cc" , "#99cc00", "#669900" , "#ffbb33" , "#ff8800" , "#ff4444" , "#cc000c"];

window.onload=function () {
	
	WINDOW_WIDTH=document.body.clientWidth;
	WINDOW_HEIGHT=document.body.clientHeight;
	
	//钟表文字占屏幕的4/5，故左边空白占（1/5）/2
	MARGIN_LEFT=Math.round(WINDOW_WIDTH/10);
	RADIUS=Math.round(WINDOW_WIDTH*4 / 5 / 108)-1;
	//TOP是整个屏幕的1/5
	MARGIN_TOP=Math.round(WINDOW_HEIGHT/5);
	
	var canvas=document.getElementById('canvas');
	var context=canvas.getContext('2d');
	
	canvas.width=WINDOW_WIDTH;
	canvas.height=WINDOW_HEIGHT;
	
	curShowTimeSecounds = getCurrentShowTimeSecounds();	//计算当前目标时间距离截至时间的有多少秒。在这里curShowTimeSecounds被写在window.onload中，而nextShowTimeSecounds不在这里。
	setInterval(
		function () {
			render(context);							//调用render函数传入上下文绘图环境context画出数字与小球
			update();									//调用update函数实现动画
		},50)
}

function getCurrentShowTimeSecounds() {
	var curTime = new Date();							//获取当前时间
	
	//1.以下是倒计时时钟的算法
	//var ret = endTime.getTime() - curTime.getTime();	//获取目标时间到当前时间差的毫秒数
	//ret = Math.round(ret/1000); 						//将当前差的毫秒转换成秒（getTime默认获取的是毫秒数）	
	//return ret >=0 ? ret : 0;							//如果目标时间走到当前时间，则停止倒计时
	
	//2.以下是时钟的算法
	var ret=curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds(); //获取当前时间并换算成秒
	return ret;
}

//设置update函数实现动画；当上一个时间与当前时间不同（发生变化），则重画画布上的的时间，并且绘制小球，从而实现动画效果
function update() {
	
	var nextShowTimeSecounds = getCurrentShowTimeSecounds();
	
	//定义下一秒的时间
	var nextHours = parseInt(nextShowTimeSecounds / 3600);
	var nextMinutes = parseInt((nextShowTimeSecounds-nextHours*3600) /60 );
	var nextSecounds = nextShowTimeSecounds % 60;
	
	//定义当前时间
	var curHours = parseInt(curShowTimeSecounds / 3600);
	var curMinutes = parseInt((curShowTimeSecounds-curHours*3600) / 60);
	var curSecounds = curShowTimeSecounds % 60;
	
	if(nextSecounds != curSecounds){
		//小时产生小球（分别判断时，分，秒）
			//小时的十位数
		if(parseInt(curHours/10) != parseInt(nextHours/10)){
			addBalls(MARGIN_LEFT , MARGIN_TOP , parseInt(curHours/10));
		}
			//小时的个位数
		if(parseInt(curHours%10) != parseInt(nextHours%10)){
			addBalls(MARGIN_LEFT+15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours%10));	
		}
		
		if(parseInt(curMinutes/10) !=  parseInt(nextMinutes/10)){
			addBalls(MARGIN_LEFT+39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10));
		}
		if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
			addBalls(MARGIN_LEFT+54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10));	
		}
		
		if(parseInt(curSecounds/10) !=  parseInt(nextSecounds/10)){
			addBalls(MARGIN_LEFT+78*(RADIUS+1) , MARGIN_TOP , parseInt(curSecounds/10));
		}
		if(parseInt(curSecounds%10) != parseInt(nextSecounds%10)){
			addBalls(MARGIN_LEFT+93*(RADIUS+1) , MARGIN_TOP , parseInt(curSecounds%10));	
		}
		
		curShowTimeSecounds = nextShowTimeSecounds;
	}
	updateBalls();
	// console.log(balls.length);
}

function updateBalls() {
	for (var i = 0; i<balls.length ; i++){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;
		
		//地板碰撞检测
		if(balls[i].y >= WINDOW_HEIGHT-RADIUS){
			balls[i].y=WINDOW_HEIGHT-RADIUS;  //让小球落地
			balls[i].vy = -balls[i].vy*0.75;
		 }
	}
	//让在屏幕中的小球在数组中，出屏幕的小球不在数组中
	var cnt = 0;
	for(var i = 0; i< balls.length; i++){
		if(balls[i].x+RADIUS > 0 && balls[i].x-RADIUS < WINDOW_WIDTH){
			balls[cnt++]=balls[i];
		}
	}
	while(balls.length > cnt){
		balls.pop();
	}
}

function addBalls(x , y, num) {
	for(var i=0 ; i<digit[num].length ; i++){
		for (var j=0 ; j<digit[num][i].length ; j++){
			if(digit[num][i][j]==1){
				var aBall={
					x:x+j*2*(RADIUS+1) + (RADIUS+1),
					y:y+i*2*(RADIUS+1) + (RADIUS+1),
					g:1.5+Math.random(),
					//Math.pow返回指定数字的指定次幂
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4, //-1的多少次方
					vy:-5,
					
					color:colors[Math.floor(Math.random()*colors.length)]
				}
				balls.push(aBall);
			}
		}
	}
}

function render(cxt) {			//根据传入的时间cxt（上下文绘图环境）画出时间
	
	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
	//根据getCurrentShowTimeSecounds计算出时，分，秒
	var hour=parseInt( curShowTimeSecounds / 3600);
	var minute= parseInt((curShowTimeSecounds-hour*3600)/60);
	var secound=curShowTimeSecounds % 60;
	
	renderDigit(MARGIN_LEFT , MARGIN_TOP , parseInt(hour/10) , cxt);    //传入参数 画数字的起始位置，由于要一个数字一个数字的绘制，所以取出该十位数，转换为整形，传入时间
	renderDigit(MARGIN_LEFT+15*(RADIUS+1) , MARGIN_TOP ,parseInt(hour%10) , cxt);  //小时的个位数，上面绘制了小时的十位数
	renderDigit(MARGIN_LEFT+30*(RADIUS+1) , MARGIN_TOP , 10 ,cxt);
	renderDigit(MARGIN_LEFT+39*(RADIUS+1) , MARGIN_TOP , parseInt(minute/10) ,cxt );
	renderDigit(MARGIN_LEFT+54*(RADIUS+1) , MARGIN_TOP , parseInt(minute%10) ,cxt );
	renderDigit(MARGIN_LEFT+69*(RADIUS+1) , MARGIN_TOP , 10 ,cxt);
	renderDigit(MARGIN_LEFT+78*(RADIUS+1) , MARGIN_TOP , parseInt(secound/10) ,cxt );
	renderDigit(MARGIN_LEFT+93*(RADIUS+1) , MARGIN_TOP , parseInt(secound%10) ,cxt );
	
	//绘制五彩小球
	for(var i=0;i<balls.length;i++){
		cxt.fillStyle=balls[i].color;
		
		cxt.beginPath();
		cxt.arc(balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true) ;
		cxt.closePath();
		
		cxt.fill();
	}
	
}

function renderDigit(x,y,num,cxt) {
	cxt.fillStyle="rgb(0,102,153)";
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				cxt.beginPath();
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI);
				cxt.closePath();
				
				cxt.fill();
			}
		}
	}
}