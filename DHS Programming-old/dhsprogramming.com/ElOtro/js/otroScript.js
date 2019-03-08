//Start Menu

//Title
//Credits: http://codepen.io/moklick/pen/DxHCm

$(document).ready(function(){

	if(($(window).width())>900){
		var canvas = document.getElementById('title')
		  , context = canvas.getContext('2d')
		  , img = new Image()
		  , w
		  , h
		  , offset
		  , glitchInterval;

		img.src = 'images/title.png';
		img.onload = function() {
		  init();
			window.onresize = init;
		};

		var init = function() {
			clearInterval(glitchInterval);
			canvas.width = w = window.innerWidth*.9;
			offset = w * .1;
			canvas.height = h = ~~(175 * ((w - (offset * 2)) / img.width));
			glitchInterval = setInterval(function() {
				clear();
				context.drawImage(img, 0, 110, img.width, 175, offset, 0, w - (offset * 2), h);
				setTimeout(glitchImg, randInt(250, 1000));
			}, 2500);
		};

		var clear = function() {
			context.rect(0, 0, w, h);
			context.fill();
		};
			
		var glitchImg = function() {
			for (var i = 0; i < randInt(1, 13); i++) {
				var x = Math.random() * w;
				var y = Math.random() * h;
				var spliceWidth = w - x;
				var spliceHeight = randInt(5, h / 3);
				context.drawImage(canvas, 0, y, spliceWidth, spliceHeight, x, y, spliceWidth, spliceHeight);
				context.drawImage(canvas, spliceWidth, y, x, spliceHeight, 0, y, x, spliceHeight);
			}
		};

		var randInt = function(a, b) {
			return ~~(Math.random() * (b - a) + a);
		};
		
		//Button
		//Credits: http://codepen.io/NobodyRocks/pen/qzfoc
		$("#start").click(function(){
			$("#title").remove();
			$("#start").remove();
			$("#music").trigger("play");
			$("body").css("background-color", "#fff");
			platformerTime();
		});

		///////////////////////////////////
		//Platformer

		function platformerTime(){
		var story = 0;
			var text;
			var container;
			var button;
			var label;

				var Q = Quintus()
					.include("Sprites, Scenes, Input, 2D, Touch, UI, Anim")
					.setup({maximize:true, scaleToFit: true
					}).controls().touch();            
				
			  
				//player
				Q.Sprite.extend("Player", {
					init: function(p) {
						this._super(p, { sheet: "sprites", sprite: "player", x: 100, y: 190, speed: 120, jumpSpeed: -150});
						this.add('2d, platformerControls, animation');
						this.p.flip = 'x'; 
						
						this.on("hit.sprite",function(collision) {
							if(collision.obj.isA("elOtro")) {
								static1();
								this.destroy();
							}
						});
					}, 
					step: function(dt) {
						if(this.p.vx<0) {
							this.p.flip = 'x';
							this.play("walk_left");
						} 
						else if(this.p.vx>0) {
							this.p.flip = false;
							this.play("walk_right");                    
						}
				
						//if (this.p.x > 2180){
							//MOVE ON
						//	static1();
						//}
					}                    
				});

			Q.Sprite.extend("elOtro",{
				init: function(p){
					this._super(p,{sheet: "sprites", sprite: "elOtro", x:2191, y: 200});
					this.add('2d, animation');
					this.play('otroStand');		
				}	
			});
							   
				
				Q.scene("level1",function(stage) {
				  
					var background = new Q.TileLayer({ dataAsset: 'otroMap.tmx', layerIndex: 0, sheet: 'blocks', tileW: 32, tileH: 32, type: Q.SPRITE_NONE });
					stage.insert(background);
					
					stage.collisionLayer(new Q.TileLayer({ dataAsset: 'otroMap.tmx', layerIndex:1,  sheet: 'blocks', tileW: 32, tileH: 32 }));
				  
					var player = stage.insert(new Q.Player());
					
					stage.add("viewport").follow(player);
				stage.viewport.scale = 3;
				//stage.viewport.offsetX = 175;
			   // stage.viewport.offsetY = 140;

				stage.insert(new Q.elOtro());
				  
				});
				
				//load assets
				Q.load("blocks.png, sprites.png, otroMap.tmx", function() {
				  Q.sheet("blocks","blocks.png", { tilew: 32, tileh: 32});
			  Q.sheet("sprites", "sprites.png", {tilew: 15, tileh: 24});
			  Q.animations("player", {
					walk_right: { frames: [0,1,2,1], rate: 1/3, flip: false, loop: false },
					walk_left: { frames:  [0,1,2,1], rate: 1/3, flip:"x", loop: false }
				  });
			  Q.animations("elOtro", {
					otroStand: { frames: [3], rate: 1/3, flip: false, loop: true }
				  });           
				  Q.stageScene("level1", 0);
				});
		}
		
		////////////////////////////////////////////////
		//1st Static Transition
		function static1(){
			$("#static")[0].play();
			$("#static").show();
			setTimeout(function(){
				$("#quintus_container").remove();
				$("#static").hide();
				$("#static")[0].pause();
				$("body").css("background-color", "black");
				dialog();
			}, 2000);
		}
		
		//////////////////////////////////////////////
		//Dialog
		
		function dialog(){
		
			var story = 0;
			$(".dialog, .borges").show();
			
			$(window).keypress(function(){
				story++;
				if(story === 1){
					$(".dialog").fadeOut("slow", "linear", function(){
						$(".dialog").text("Argentino, pero desde el catorce vivo en Ginebra.")
						.delay(200)
						.removeClass("dialogLeft")
						.addClass("dialogRight")
						.fadeIn("slow", "linear");
					});
				}
				
				else if(story === 2){
					$(".dialog").fadeOut("slow", "linear", function(){
						$(".dialog").text("¿En el número diecisiete de Malagnou, frente a la iglesia rusa?")
						.delay(200)
						.removeClass("dialogRight")
						.addClass("dialogLeft")
						.fadeIn("slow", "linear");
					});
				}
				
				else if(story === 3){
					$(".dialog").fadeOut("slow", "linear", function(){
						$(".dialog").text("Sí...")
						.delay(200)
						.removeClass("dialogLeft")
						.addClass("dialogRight")
						.fadeIn("slow", "linear");
					});
				}
				
				else if(story === 4){
					$(".dialog").fadeOut("slow", "linear", function(){
						$(".dialog").text("En tal caso... usted se llama Jorge Luis Borges.")
						.delay(200)
						.removeClass("dialogRight")
						.addClass("dialogLeft")
						.fadeIn("slow", "linear");
					});
				}
				
				else if(story >= 5){
					$(".dialog").text("Yo también soy Jorge Luis Borges.")
					.delay(200)
					.removeClass("dialogLeft")
					.addClass("dialogCenter");
						
					$("img").remove();
					
					setTimeout(function(){
						static2();
					}, 4000);
				}
			});
		}
		
		/////////////////////////////////////////////////////////////
		//2nd Static Transition
		
		function static2(){
			$("#static")[0].play();
			$("#static").show();
			$(".dialog").remove();
			
			setTimeout(function(){
				$("#static").hide();
				$("#static")[0].pause();
			}, 1000);
		}
	}
	else{
		$("#title").hide();
		$("#start").text("Usted necesita más de 900 píxeles en ancho.")
		.css("font-size", "3em");
	}
});