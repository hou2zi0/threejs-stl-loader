import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
			
			var myCanvas = document.getElementById("myCanvasId");
			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera( 75, document.getElementById('container').clientWidth / document.getElementById('container').clientHeight, 0.1, 1000 );

			const renderer = new THREE.WebGLRenderer({antialias: true, canvas: myCanvas, alpha: true });
			renderer.setSize( document.getElementById('container').clientWidth, document.getElementById('container').clientHeight );
			renderer.setPixelRatio( window.devicePixelRatio );
			//document.getElementById('container').appendChild( renderer.domElement );

			const CONST = {
				threeTone: new THREE.DataTexture(
					Uint8Array.from([0, 0, 0, 128, 128, 128, 255, 255, 255]),3,1,THREE.RGBFormat
				),
				fourTone: new THREE.DataTexture(
					Uint8Array.from([0, 0, 0, 64, 64, 64, 128, 128, 128, 255, 255, 255]),4,1,THREE.RGBFormat
				),
				fiveTone: new THREE.DataTexture(
					Uint8Array.from([0, 0, 0, 64, 64, 64, 128, 128, 128, 192, 192, 192, 255, 255, 255]),5,1,THREE.RGBFormat
				),
				sixTone: new THREE.DataTexture(
					Uint8Array.from([0, 0, 0, 42, 42, 42, 84, 84, 84, 124, 124, 124, 164, 164, 164, 255, 255, 255]),6,1,THREE.RGBFormat
				),
				sevenTone: new THREE.DataTexture(
					Uint8Array.from([0, 0, 0, 42, 42, 42, 84, 84, 84, 124, 124, 124, 164, 164, 164, 206, 206, 206, 255, 255, 255]),7,1,THREE.RGBFormat
				),
				deepShadow: new THREE.DataTexture(
					Uint8Array.from([0, 0, 0, 100, 100, 100, 146, 146, 146, 192, 192, 192, 255, 255, 255]),5,1,THREE.RGBFormat
				),
				invertThree: new THREE.DataTexture(
					Uint8Array.from([255, 255, 255, 128, 128, 128, 0, 0, 0]),3,1,THREE.RGBFormat
				),
				invertFour: new THREE.DataTexture(
					Uint8Array.from([255, 255, 255, 128, 128, 128, 64, 64, 64, 0, 0, 0]),4,1,THREE.RGBFormat
				),
			};  

			const loader = new STLLoader();
			
			const mouse = new THREE.Vector2();

			window.addEventListener('mousemove', (event) => {
				var canvasBounds = renderer.domElement.getBoundingClientRect();
				//console.log(mouse.x, mouse.y);
				mouse.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
  				mouse.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;

				
			})

			const animate = function () {
				requestAnimationFrame( animate );
				if(status){
					CONST.objectPivot.rotation.y += 0.01;
				}

				/*
				raycaster.setFromCamera(mouse, camera);
				console.log('click');
				let l = [];
				scene.traverse(object => {
					if(object.isMesh){
						l.push(object)
					}
				})
				
				let o = raycaster.intersectObjects(l);
				o.forEach(o => {
					o.object.position.set( Math.random()/10, Math.random()/10, Math.random()/10);
				})
				*/

				renderer.render( scene, camera );
			};


			//
			// Raycaster
			//
			document.getElementById('myCanvasId').addEventListener('click', function(event) {
				var canvasBounds = renderer.domElement.getBoundingClientRect();
				//console.log(mouse.x, mouse.y);
				mouse.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
  				mouse.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;

				raycaster.setFromCamera(mouse, camera);
				console.log('click');
				let l = [];
				scene.traverse(object => {
					if(object.isMesh){
						l.push(object)
					}
				})
				
				//console.log(raycaster.intersectObjects(l));
				let o = raycaster.intersectObjects(l);
				o.forEach(o => {
					//o.object.material.color.setHex( 0xffffff );
					console.log(o.object.name);
				})
			})

			/*
			document.addEventListener( 'wheel', (event) => {
				camera.position.z += event.deltaY/500;
			});
			*/

			Array.from(document.getElementsByClassName('col-button')).forEach(n => {
				n.addEventListener('click', (e) => {

					scene.traverse(o => {
						if(o.isMesh){
							//o.material.color.set( e.target.dataset.hex );
							o.material = new THREE.MeshToonMaterial( { color: e.target.dataset.hex, gradientMap: CONST.deepShadow } );
						}
					})
				})
			})

			let status = false;

			document.getElementById('checkbox').addEventListener('change', function(){
				status = this.checked;
				//console.log(status);
			})

			const controls = new OrbitControls( camera, renderer.domElement );
			//controls.addEventListener( 'change', render ); // use this only if there is no animation loop
			controls.enableZoom = true;
			controls.enablePan = true;


			function turnDegrees(){
				const operator = this.textContent.slice(0,1).trim();
				console.log(operator);
				const degrees = this.textContent.slice(1).trim();
				switch (operator) {
					case '+':
						CONST.objectPivot.rotation[this.dataset.axis] += degrees * (Math.PI/180);
						break;
					case '-':
						CONST.objectPivot.rotation[this.dataset.axis] -= degrees * (Math.PI/180);
						break;
					default:
						break;
				}
			}

			

			Array.from(document.getElementsByClassName('button')).forEach((n) => n.addEventListener('click', turnDegrees));
		
			document.addEventListener('keydown', (e) => {
				if (!e.repeat){
					switch (e.key) {
						case 'ArrowRight':
							CONST.objectPivot.rotation.y += 0.05; 
							break;
						case 'ArrowLeft':
							CONST.objectPivot.rotation.y -= 0.05; 
							//camera.lookAt(new THREE.Vector3(0,0,0))
							//console.log('Hello 1');
							break;
						case 'ArrowUp':
							CONST.objectPivot.rotation.x += 0.05;
							//CONST.objectPivot.position.set(CONST.box.x, CONST.box.y, CONST.box.z)
							break;
						case 'ArrowDown':
							CONST.objectPivot.rotation.x -= 0.05;
							break;
						default:
							break;
					}
				}
				else{
					switch (e.key) {
						case 'ArrowRight':
							CONST.objectPivot.rotation.y += 0.05; 
							break;
						case 'ArrowLeft':
							CONST.objectPivot.rotation.y -= 0.05; 
							//camera.lookAt(new THREE.Vector3(0,0,0))
							//console.log('Hello 2');
							break;
						case 'ArrowUp':
							CONST.objectPivot.rotation.x += 0.05;
							break;
						case 'ArrowDown':
							CONST.objectPivot.rotation.x -= 0.05;
							break;
						default:
							break;
					}
				} 
				 
			  });
			  
			  const raycaster = new THREE.Raycaster();

			  function showObjects(){
				scene.traverse(function(child){
					console.log(child.name);
				});
			  }

			  document.getElementById('upload').addEventListener('change', function(){
		
				  	//console.log(this.files);
				  	var objectURL = window.URL.createObjectURL(this.files[0]);
				  	
					loader.loadAsync( objectURL )
						.then((geometry) => {
							scene.clear();
							var light = new THREE.DirectionalLight( 0xffffff );
							light.position.set( 0, 1, 1 ).normalize();
							light.name = "light";
							scene.add(light);
							var axesHelper = new THREE.AxesHelper( 20 );
							scene.add( axesHelper );
							return geometry;
						})
						.then( (geometry) => {
							const objectPivot = new THREE.Group(0,0,0);
							scene.add( objectPivot );
							const threeTone = new THREE.DataTexture(
								Uint8Array.from([0, 0, 0, 128, 128, 128, 255, 255, 255]),3,1,THREE.RGBFormat
							);
							//const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
							const material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
							//const material = new THREE.MeshToonMaterial( { color: 0xff5533, gradientMap: threeTone } );
							const mesh = new THREE.Mesh( geometry, material );
							const center = new THREE.Vector3();
							
							var box = new THREE.Box3().setFromObject( mesh ).getCenter(center);
							CONST.box = box;
							//mesh.position.set( 0-box.x,0-box.y,0);
							//mesh.rotation.set( 0-box.x,0-box.y,0 );
							mesh.geometry.center();

							mesh.castShadow = true;
							mesh.receiveShadow = true;
							mesh.name = 'object';
							CONST.object = mesh;
							CONST.objectPivot = objectPivot;
							objectPivot.position.set(0,0,0)
							objectPivot.add( mesh );
							return mesh;
						} )
						.then((mesh) => {
							var box = new THREE.Box3().setFromObject( mesh );
							//console.log( box.getSize() );
							const {x,y,z} = box.getSize();
							//mesh.scale.set( .05, .05, .05 );
							const b = (x/2) * Math.tan(
							//0.78539816339745
							1.0471975511966
							); 
							camera.position.z = b;
							return mesh;
						})
						.then((mesh) => {animate()})
						.catch( ( err ) => {
							console.log('In catch block');
							console.error('err', err);
							console.error('Failed to load the material file: ', url);
							// rethrow
							throw new Error('Error from MTLLoader::load()');
						});
			  });