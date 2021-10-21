function resize()
{
	var num_pixel_offset = 3;

     if(window.innerWidth != g_currentWindowWidth){
     	g_renderer.resize(window.innerWidth-num_pixel_offset, window.innerHeight-num_pixel_offset);

        //renderer.view.style.width = window.innerWidth + "px";
		//renderer.view.style.height = window.innerHeight + "px";
        g_currentWindowWidth = window.innerWidth-num_pixel_offset;
     }
}

function ObjManager()
{
	this.init = function()
	{
		this.objs = 
		{
			shapes:new ShapeEmitter(),
			shadow:new MascotShadow(),
			body:new MascotBody(),
			head:new MascotHead(),
		};

		for (var property in this.objs ) {
		    if (this.objs.hasOwnProperty(property)) {
		        
		        var obj = this.objs[property];
		        obj.init();
		    }
		}
	}

	this.update = function()
	{
		for (var property in this.objs ) {
		    if (this.objs.hasOwnProperty(property)) {
		        
		        var obj = this.objs[property];
		        obj.update();
		    }
		}
	}

	this.get = function( a_name )
	{
		return this.objs[a_name];
	}
}

function animate(time) {
    requestAnimFrame( animate );
    TWEEN.update( time );
    resize();

    g_time += 1.0/60.0;
    g_objs.update();

    // render the stage
    g_renderer.render(g_stage);
}

var g_currentWindowWidth = 0;
var g_stage = new PIXI.Stage(0xFFACA1);
var g_renderer = new PIXI.WebGLRenderer(1, 1);//autoDetectRenderer(400, 300);
g_renderer.view.style.display = "block";

// gfx
var g_gfx = new PIXI.Graphics();
g_stage.addChild(g_gfx);

var g_time = 0.0;
var g_mouseDown = false;
var g_mouseDownPos = {x:0, y:0};

g_stage.mousedown = function(mouseData){

	g_objs.get("head").onClick(mouseData);
	env.triggerAttack();
	g_mouseDown = true;
	g_mouseDownPos = {x:mouseData.global.x, y:mouseData.global.y};
}

g_stage.mouseup = function(mouseData){

	var shapeEmitter = g_objs.get("shapes");
	shapeEmitter.spawnAt( mouseData.global.x, mouseData.global.y );

	env.triggerRelease();
	g_mouseDown = false;
}

var getFreqAtPos = function( pos )
{
	var posClick = pos;
	var screenSize = { x:window.innerWidth, y:window.innerHeight };
	var posClickNormalized = {x:posClick.x/screenSize.x, y:posClick.x/screenSize.y };
	var numNotes = g_scale_0.length;
	var index = Math.floor(numNotes * posClickNormalized.x ) % numNotes;
	var freq = osc.noteToFrequency( g_scale_0[ index ] );
	return freq;
}

var onDragMouse = function(dragPos){

	var freq = getFreqAtPos(g_mouseDownPos);

	var deltaPos = {x:dragPos.x-g_mouseDownPos.x, y:dragPos.y-g_mouseDownPos.y };
	osc.setFrequency( freq - (deltaPos.y*0.2) );

	var headPos = g_objs.get("head").obj.position;

	g_gfx.clear();
	g_gfx.lineStyle(4, 0xFF6AC4);
	g_gfx.moveTo( g_mouseDownPos.x, g_mouseDownPos.y );
	g_gfx.lineTo( dragPos.x, dragPos.y );

	g_gfx.beginFill(0xFFFF00);
	g_gfx.drawCircle( g_mouseDownPos.x, g_mouseDownPos.y, 5);
	g_gfx.drawCircle( dragPos.x, dragPos.y, 15);
	g_gfx.endFill();
	
	g_gfx.lineStyle(4, 0xFFFFFF);
	g_gfx.drawCircle( dragPos.x, dragPos.y, 25);
}

g_stage.mousemove = function(mouseData){

	if ( g_mouseDown == true )
	{
		onDragMouse( mouseData.global);
	}
	else
	{
		g_gfx.clear();
	}
}

g_stage.touchstart = function(mouseData){
	g_objs.get("head").onClick(mouseData);
	env.triggerAttack();
	g_mouseDown = true;
	g_mouseDownPos = {x:mouseData.global.x, y:mouseData.global.y};
}

g_stage.touchend = function(mouseData){

	env.triggerRelease();
	g_mouseDown = false;
}

g_stage.touchmove = function(mouseData){

	if ( g_mouseDown == true )
	{
		onDragMouse( mouseData.global);
	}
	else
	{
		g_gfx.clear();
	}
}

document.body.appendChild(g_renderer.view);
var g_objs = new ObjManager();
g_objs.init();

requestAnimFrame( animate );


/////////////////////////////////////////
/*
var GuiControls = function() {
  this.message = 'dat.gui';
  this.speed = 0.8;
  this.displayOutline = false;

  this.toggleMute = function() 
  { 
  	var volume = osc.volume;
  	var volume_on_volume = -10;
  	var volume_off_volume = -10000;
  	osc.setVolume(volume_off_volume);
  };
};

window.onload = function() {
	var text = new GuiControls();
	var gui = new dat.GUI();
	gui.add(text, 'message');
	//gui.add(text, 'speed', -5, 5);
	//gui.add(text, 'displayOutline');
	gui.add(text, 'toggleMute');
};
*/