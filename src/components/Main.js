require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';


let imageDatas = require('../data/imageDatas.json');

imageDatas = (function(imageDatasArr) {
	for (let i = 0; i < imageDatasArr.length; i++) {
		let image = imageDatasArr[i];
		image.url = require('../images/' + image.fileName);
		imageDatasArr[i] = image;
	}
	return imageDatasArr;
})(imageDatas);

var ImgFigure = React.createClass({

	handleClick:function(e){
		e.stopPropagation();
		e.preventDefault();
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
	},
	render(){

		let styleObj = {};

		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		if(this.props.arrange.rotate){
			(['Moz','ms','Webkit','']).forEach(function(value){
				styleObj[value+'Transform'] = 'rotate('+this.props.arrange.rotate+'deg)';
			}.bind(this));
		}
	

		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}

		let clazzName = 'img-figure';
		clazzName += this.props.arrange.isInverse?' is-inverse':'';
		return(
			<figure className={clazzName} style = {styleObj} onClick={this.handleClick}>
				<img src={this.props.data.url} alt={this.props.data.title} style={{'height':'240px','width':'240px'}} />
				<figcaption>
					<h2 className="img-title ">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		)
	}
});

function getRangeRandom(low,high){
	return Math.ceil(Math.random() * (high - low) + low);
}

function get30DegRandom(){
	return ((Math.random()>0.5?'':'-')+Math.ceil(Math.random() * 30));
}

var AppComponent = React.createClass({

	Constant:{
		centerPos:{
			left:0,
			right:0
		},
		hPosRange:{
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{
			x:[0,0],
			topY:[0,0]
		}
	},

	getInitialState:function(){
		return {
			imgsArrangeArr: [{
				pos: {
					left: '0px',
					top: '0px'
				},
				rotate:0,
				isInverse:false,
				isCenter:false
			}],
			play:false,
			active:imageDatas[0]
		};
	},

	rearRange:function(centerIndex){
		let imgsArrangeArr = this.state.imgsArrangeArr,
			  Constant = this.Constant,
			  centerPos =Constant.centerPos,
			  hPosRange = Constant.hPosRange,
			  vPosRange = Constant.vPosRange,
			  hPosRangeLeftSecX = hPosRange.leftSecX,
			  hPosRangeRightSecX = hPosRange.rightSecX,
			  hPosRangeY = hPosRange.y,
			  vPosRangeTopY = vPosRange.topY,
			  vPosRangeX = vPosRange.x,
			  imgsArrangeTopArr = [],
			  topImgNum = Math.ceil(Math.random()*2),
			  topImgSpliceIndex = 0,
			  imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

			  imgsArrangeCenterArr[0] = {
			  	pos:centerPos,
			  	rotate:0,
			  	isCenter:true
			  };
			  topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			  imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

			  imgsArrangeTopArr.forEach(function(value,index){
			  		imgsArrangeTopArr[index]= {
			  			pos:{
			  				top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1])+'px',
			  				left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])+'px'
			  			},
			  			rotate:get30DegRandom(),
			  			isCenter:false

			  		};

			  });

			  for(let i=0,j = imgsArrangeArr.length,k=j/2;i<j;i++){
			  		let hPosRangeLORX = null;
			  		if(i<k){
			  			hPosRangeLORX = hPosRangeLeftSecX;
			  		}else{
			  			hPosRangeLORX = hPosRangeRightSecX;
			  		}

			  		imgsArrangeArr[i] = {
			  			pos:{
			  				top:getRangeRandom(hPosRangeY[0],hPosRangeY[1])+'px',
			  				left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])+'px'
			  			},
			  			rotate:get30DegRandom(),
			  			isCenter:false
			  		};
			  }

			if(imgsArrangeArr && imgsArrangeTopArr[0]){
				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr:imgsArrangeArr
			});
			this.play(centerIndex);

	},

	componentDidMount:function(){
		const stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW/2),
			halfStageH = Math.ceil(stageH/2);

		const imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			  imgW = imgFigureDOM.scrollWidth,
			  imgH = imgFigureDOM.scrollHeight,
			  halfImgW = Math.ceil(imgW/2),
			  halfImgH = Math.ceil(imgH/2);

		this.Constant.centerPos = {
			left:(halfStageW - halfImgW)+'px',
			top :(halfStageH - halfImgH)+'px'
		};
		let hPosRange = this.Constant.hPosRange;

		hPosRange.leftSecX[0] = -halfImgW;
		hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		hPosRange.rightSecX[0] = halfStageW + halfImgW;
		hPosRange.rightSecX[1] = stageW - halfImgW;
		hPosRange.y[0] = -halfImgH;
		hPosRange.y[1] = stageH - halfImgH;

		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearRange(0);

	},

	inverse : function(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr:imgsArrangeArr
			});
		}.bind(this);
	},
	center:function(index){
		return function(){
			this.rearRange(index);
		}.bind(this);
	},
	play : function(index){
        this.setState({ 
        	play: true,
        	active:imageDatas[index]
        },()=>{
        	this.refs.player.play();
        });
    },
  render() {

  	let controllerUnits = [],
  		imgFigure = [];
  	imageDatas.map(function(item,i){
		if(!this.state.imgsArrangeArr[i]){
			this.state.imgsArrangeArr[i] = {
				pos:{
					left:'0px',
					top:'0px'
				},
				rotate:0,
				isInverse:false,
				isCenter:false
			};
		}
  		imgFigure.push(<ImgFigure key={i} data={item} ref={'imgFigure'+i}
  			arrange={this.state.imgsArrangeArr[i]} inverse={this.inverse(i)}
  			center={this.center(i)}></ImgFigure>);
  	}.bind(this));
    return (
      <section className="stage" ref="stage">
      	<section className="img-sec">
      		{imgFigure}
      	</section>
      	<nav className="controller-nav">
      		{controllerUnits}
      	</nav>
      	<audio src={"http://chenjingwei4518.github.io/react-gallery/music/1.mp3"} autoPlay={this.state.play} preload="auto" ref="player"></audio>
      </section>
    );
  }
});


export default AppComponent;
