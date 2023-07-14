// sphere.js
var DEGREE = 0.01745329251994; // величина углового градуса в радианах

var canvas; 	// Ссылка на элемент по его идентификатору (id = "canvas_draw") для отображения 3D-модели.

var hud_1; 		// Ссылка на элемент id = "hud_1". Двумерный канвас для отображения текста в левой части окна.
var ctx_hud_1;	// контекст для рисования на холсте в левой части окна	значения |ψ〉

var hud_2; 		// Ссылка на элемент id = "hud_2". Двумерный канвас для отображения текста в средней части окна.
var ctx_hud_2; 	// контекст для рисования на холсте в средней части окна значений углов и вероятностей

var hud_3;		// Ссылка на элемент id = "hud_3". Двумерный канвас.
var ctx_hud_3;	// В этой области выводим значения |ψ〉

var gui; 		// объект dat.GUI
var controller; // В объекте controller определяем свойства для параметров модели и их начальные значения.
				
var scene, camera, renderer, orbitControl;

var polar_electron = 60 * DEGREE;
var azimuth_electron = 0 * DEGREE; 

var sphere;		// Большая сфера
var rs = 14;	// Sphere radius
var particle;	// Маленькая сфера - Электрон

var mesh_spinor_arrow;
var mesh_electron_arrow;

var line_parall_X;	// green line
var line_parall_Z;	// green line
var line_XY;		// green line
var sp1, sp2;		// green points
var ellipse_spin;	// green circle

var meshText_B;
var meshText_Psi;

var mesh_line_N;
var mesh_line_S;

var meshText_sp1;
var meshText_sp2;

var regim = false;

var meshText_a;
var meshText_b;

	var xC, yC, SCALE;
	
	SCALE = 100;

function init()
{	
	canvas = document.getElementById("canvas_draw");
	hud_1 = document.getElementById("hud_1");
	ctx_hud_1 = hud_1.getContext('2d');
	if (!ctx_hud_1) 
	{
		console.log('Failed to get rendering context');
		return;
	}	
	
	hud_2 = document.getElementById("hud_2");
	ctx_hud_2 = hud_2.getContext('2d');
	if (!ctx_hud_2) 
	{
		console.log('Failed to get rendering context');
		return;
	}

	hud_3 = document.getElementById("quant_params");
	ctx_hud_3 = hud_3.getContext('2d');
	if (!ctx_hud_3) 
	{
		console.log('Failed to get rendering context');
		return;
	}	
	
	/////////////////////////////////////////////////////////////////////////
	// Для задания значений параметров будем использовать библиотеку dat.GUI
	// В объекте controller определяем свойства для параметров модели и их
	// начальные значения.
	/////////////////////////////////////////////////////////////////////////
    controller = new function() 
	{
		this.azimuth_electron = azimuth_electron / DEGREE;
		this.polar_electron = polar_electron / DEGREE;
    }();	
	
	// Создаем новый объект dat.GUI.
	gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container.appendChild(gui.domElement);  // id = "gui_container"

    var f1 = gui.addFolder('    Angles electron (°)');
	f1.add(controller, 'polar_electron', 0.0, 720.0).onChange( function() 
	{
	   orbitControl.enabled = false;
       polar_electron = (controller.polar_electron)* DEGREE;
	   recalc();
	   gui.updateDisplay();
	   polar_background();
    });
    f1.add(controller, 'azimuth_electron', 0.0, 360.0).onChange( function() 
	{
	   orbitControl.enabled = false;
       azimuth_electron = (controller.azimuth_electron)* DEGREE;
	   recalc();
	   gui.updateDisplay();
	   azim_background();
    });	
	f1.open();
	
	///////////////////////////////////////////////	
	// Создаем трехмерную сцену, камеру и рендерер
	///////////////////////////////////////////////
	scene = new THREE.Scene();

	var width = canvas.width;
	var height = canvas.height;
	var aspect = width / height;
	
	camera = new THREE.OrthographicCamera( -22, 22, 22/aspect, -22/aspect, 1, 2000 ); 

	camera.position.x = 200;
	camera.position.y = 240;
	camera.position.z = 200;
	
	camera.lookAt(new THREE.Vector3(0, 0, 0));	
	scene.add(camera);
	
	// Создаем renderer
	renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true});
	renderer.setSize(canvas.width, canvas.height);

	// Элемент управления дающий возможность осматривать модель пирамиды со всех сторон.
	orbitControl = new THREE.OrbitControls(camera, canvas);	
	
/*		
	//////// Истинные оси координат /////
	var axes = new THREE.AxesHelper(5);
	axes.position.set(21, 25, -5);		
	scene.add(axes);
*/	
	
	create_scene();
	
	AddLabels();
	AddButtons();	
	
	// Отображение на экран.
	render();
	
	add_symbol_text_1();
}	

function create_scene()
{	
	/////////////////////////////
	// Sphere
	var sphereGeometry = new THREE.SphereGeometry(rs, 36, 18);
	var sphereMaterial = new THREE.MeshPhongMaterial({color: 0xaabbff, opacity: 0.5, transparent: true });

	sphereMaterial.side = THREE.FrontSide;
	sphereMaterial.shading = THREE.FlatShading;
	sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

	// position the sphere
	sphere.position.x = 0;
	sphere.position.y = 0;
	sphere.position.z = 0;

	/////////////////////////////////////////////////////////////

	// Три окружности на сфере (sphereSG)
	const curve = new THREE.EllipseCurve(
		0,  0,            // ax, aY
		rs, rs,           // xRadius, yRadius
		0,  2 * Math.PI,  // aStartAngle, aEndAngle
		false,            // aClockwise
		0                 // aRotation
	);

	const points_ellipse = curve.getPoints( 50 );
	const geometry_ellipse = new THREE.BufferGeometry().setFromPoints( points_ellipse );
	const material_ellipse = new THREE.LineBasicMaterial( { color : 0x000000 } );
	const material_ellipse_spin = new THREE.LineBasicMaterial( { color : 0x0000f0 } );
	
	const ellipse_1 = new THREE.Line( geometry_ellipse, material_ellipse );
	const ellipse_2 = new THREE.Line( geometry_ellipse, material_ellipse );
	const ellipse_3 = new THREE.Line( geometry_ellipse, material_ellipse );
	ellipse_spin = new THREE.Line( geometry_ellipse, material_ellipse_spin );
	
	ellipse_1.position.x = 0;
	ellipse_1.position.y = 0;
	ellipse_1.position.z = 0;
	ellipse_1.rotation.x = Math.PI/2;
	
	ellipse_2.position.x = 0;
	ellipse_2.position.y = 0;
	ellipse_2.position.z = 0;
	ellipse_2.rotation.y = Math.PI/2;
	
	ellipse_3.position.x = 0;
	ellipse_3.position.y = 0;
	ellipse_3.position.z = 0;
	ellipse_3.rotation.z = Math.PI/2;
	
	scene.add(ellipse_1);
	scene.add(ellipse_2);
	scene.add(ellipse_3);
	
	ellipse_spin.position.x = 0;
	ellipse_spin.position.y = 0;
	ellipse_spin.position.z = 0;
	ellipse_spin.rotation.y = Math.PI/2 + azimuth_electron;
	scene.add(ellipse_spin);
	
	// Axes X, Y, Z
	const axis_length = 16;
	var points = [];
	
	const material_axis_X = new THREE.LineBasicMaterial( { color: 0x000000 } );
	const material_axis_Y = new THREE.LineBasicMaterial( { color: 0x000000 } );
	const material_axis_Z = new THREE.LineBasicMaterial( { color: 0x000000 } );
	
	// Axis X
	points = [];
	points.push( new THREE.Vector3(0, 0,  axis_length ) );
	points.push( new THREE.Vector3(0, 0, - rs - 0.8 ) );
	const geometry_axis_X = new THREE.BufferGeometry().setFromPoints( points );
	const axis_X = new THREE.Line( geometry_axis_X, material_axis_X  );
	scene.add(axis_X);
	
	// Axis Y
	points = [];
	points.push( new THREE.Vector3( axis_length, 0, 0 ) );
	points.push( new THREE.Vector3(- rs - 0.8, 0, 0 ) );
	const geometry_axis_Y = new THREE.BufferGeometry().setFromPoints( points );
	const axis_Y = new THREE.Line( geometry_axis_Y, material_axis_Y  );
	scene.add(axis_Y);
	
	// Axis Z
	points = [];
	points.push( new THREE.Vector3(0,  axis_length, 0 ) );
	points.push( new THREE.Vector3(0, - rs - 0.8, 0 ) );
	const geometry_axis_Z = new THREE.BufferGeometry().setFromPoints( points );
	const axis_Z = new THREE.Line( geometry_axis_Z, material_axis_Z  );
	scene.add(axis_Z);
	
	// Cones - стрелки на осях X, Y, Z
	const geometry_cone = new THREE.ConeGeometry( 0.3, 1, 10 );
	const material_cone = new THREE.MeshBasicMaterial( {color: 0x000000} );
	const cone_X = new THREE.Mesh( geometry_cone, material_cone );
	const cone_Y = new THREE.Mesh( geometry_cone, material_cone );
	const cone_Z = new THREE.Mesh( geometry_cone, material_cone );
	
	cone_X.position.set(0, 0, axis_length);
	cone_X.rotation.x = Math.PI / 2;	
	scene.add(cone_X);
	
	cone_Y.position.set(axis_length, 0, 0);
	cone_Y.rotation.x = Math.PI / 2;
	cone_Y.rotation.z = Math.PI * 3 / 2;
	scene.add(cone_Y );
	
	cone_Z.position.set(0, axis_length, 0);
	scene.add(cone_Z);
	
	// Наименование осей координат
	// X
	const meshText_X = new THREE.Object3D();
	meshText_X.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_X.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_X, "X" );
	meshText_X.scale.set(0.15, 0.15, 0.15);	
	var x = 0;
	var y = 0; 
	var z = axis_length + 1.2;
	meshText_X.position.set(x, y, z);
	
	// Y
	const meshText_Y = new THREE.Object3D();
	meshText_Y.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_Y.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_Y, "Y" );
	meshText_Y.scale.set(0.15, 0.15, 0.15);	
	var x = axis_length + 1.2;
	var y = 0; 
	var z = 0;
	meshText_Y.position.set(x, y, z);
	
	// Z
	const meshText_Z = new THREE.Object3D();
	meshText_Z.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_Z.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_Z, "Z" );
	meshText_Z.scale.set(0.15, 0.15, 0.15);	
	var x = 0;
	var y = axis_length + 1.4;
	var z = 0;
	meshText_Z.position.set(x, y, z);
	
	scene.add(meshText_X); 
	scene.add(meshText_Y); 
	scene.add(meshText_Z);

	/////////////////////////////////////////////////////////////
	// Спин spinor_arrow 
	var diam1 = 0.05;
	var diam2 = 0.6;
	var length_1 = rs - 2;
	var length_2 = rs;

	const spinor_arrow = new THREE.Shape();
	
	spinor_arrow.moveTo( 0, diam1 );
	spinor_arrow.lineTo( length_1, diam1 );
	spinor_arrow.lineTo( length_1, diam2/2 );
	spinor_arrow.lineTo( length_2, 0 );
	spinor_arrow.lineTo( length_1, -diam2/2 );
	spinor_arrow.lineTo( length_1, -diam1 );
	spinor_arrow.lineTo( 0, -diam1 );
	spinor_arrow.lineTo( 0, diam1 );
	
	var extrudeSettings = {
	  depth: 0.3,
	  bevelEnabled: false
	};

	const geometry_spinor_arrow = new THREE.ExtrudeGeometry( spinor_arrow, extrudeSettings );
	const material_spinor_arrow = new THREE.MeshBasicMaterial( { color: 0x0000a0 } );
	mesh_spinor_arrow = new THREE.Mesh( geometry_spinor_arrow, material_spinor_arrow ) ;
	mesh_spinor_arrow.position.set(0, 0, 0);	

	mesh_spinor_arrow.rotation.y = azimuth_electron + Math.PI/2;
	mesh_spinor_arrow.rotation.z = polar_electron/2 + Math.PI/2;
	
	scene.add(mesh_spinor_arrow);
	scene.add(sphere);
	
	// *************************************************************
	
		// electron_arrow
	diam_1 = 0.05;
	diam_2 = 0.6;

	const electron_arrow = new THREE.Shape();

	electron_arrow.moveTo( 0, diam1 );
	electron_arrow.lineTo( length_1, diam1 );
	electron_arrow.lineTo( length_1, diam2/2 );
	electron_arrow.lineTo( length_2, 0 );
	electron_arrow.lineTo( length_1, -diam2/2 );
	electron_arrow.lineTo( length_1, -diam1 );
	electron_arrow.lineTo( 0, -diam1 );
	electron_arrow.lineTo( 0, diam1 );

	const geometry_electron_arrow = new THREE.ExtrudeGeometry( electron_arrow, extrudeSettings );
	const material_electron_arrow = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	mesh_electron_arrow = new THREE.Mesh( geometry_electron_arrow, material_electron_arrow ) ;
	mesh_electron_arrow.position.set(0, 0, 0);	
	mesh_electron_arrow.rotation.y = azimuth_electron + Math.PI/2;
	mesh_electron_arrow.rotation.z = polar_electron + Math.PI/2;
	
	scene.add(mesh_electron_arrow);
	
	///////////////////////////////////
	spinor_text();
	symbol_text();
	///////////////////////////////////

	// свет
	const light_1 = new THREE.PointLight( 0xffffff, 0.8, 0 );
	light_1.position.set( 100, 200, 100 );
	scene.add( light_1 );

	const light_2 = new THREE.PointLight( 0xffffff, 0.8, 0 );
	light_2.position.set( - 100, - 200, - 100 );
	scene.add( light_2 );	
	
	print_spin_1();
	print_hud_2();
	print_hud_3();
	
	//////////////////////////////////////////
	
	// Отображаем символ spin "B" на 3D-холсте
	meshText_B = new THREE.Object3D();
	meshText_B.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0xaa0000, 
										 sside: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_B.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_B, "B" );
	meshText_B.scale.set(0.2, 0.2, 0.2);	
	var r1 = 15.0;
	var x = r1 * Math.sin(polar_electron) * Math.sin(azimuth_electron);
	var y = r1 * Math.cos(polar_electron);
	var z = r1 * Math.sin(polar_electron) * Math.cos(azimuth_electron); 
	//meshText_B.rotation.z = -Math.PI/2;
	meshText_B.position.set(x, y, z);	
	scene.add(meshText_B);
	
	// Рисуем два красных отрезка, которыые образуют прямой угол (a и b)
	var r2 = 14.0;
	var x = r2 * Math.sin(polar_electron) * Math.sin(azimuth_electron);
	var y = r2 * Math.cos(polar_electron);
	var z = r2 * Math.sin(polar_electron) * Math.cos(azimuth_electron); 

	var lineTubeMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

	var startVector = new THREE.Vector3( x, y, z );
	var endVector = new THREE.Vector3( 0, r2, 0 );

	points = [];
	points.push(startVector, endVector);

	  // Create Tube Geometry
	var tubeGeometry = new THREE.TubeGeometry
	(		
		new THREE.CatmullRomCurve3(points),
		256,// path segments
		0.05,// THICKNESS
		4, //Roundness of Tube
		false //closed
	);

	line_N = new THREE.Line(tubeGeometry, lineTubeMaterial);
	scene.add(line_N);
	
	
	//////////////////////////////////////////////
	
	// b'
	meshText_b = new THREE.Object3D();
	meshText_b.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0xaa0000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_b.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_b, "b'" );
	meshText_b.scale.set(0.15, 0.15, 0.05);	
	meshText_b.position.set(x/3 - 0.8, (y + 2*r2)/3, z/3 - 0.5);
	scene.add(meshText_b);
	///////////////////////
	
	// a'
	meshText_a = new THREE.Object3D();
	meshText_a.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0xaa0000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_a.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_a, "a'" );
	meshText_a.scale.set(0.15, 0.15, 0.05);	
	meshText_a.position.set(x/2 - 0.5, (y - r2)/2, z/2 - 0.5);
	scene.add(meshText_a);
	///////////////////////

	endVector = new THREE.Vector3( 0, - r2, 0 );

	points = [];
	points.push(startVector, endVector);

	  // Create Tube Geometry
	var tubeGeometry = new THREE.TubeGeometry
	(		
		new THREE.CatmullRomCurve3(points),
		256,// path segments
		0.05,// THICKNESS
		4, //Roundness of Tube
		false //closed
	);

	line_S = new THREE.Line(tubeGeometry, lineTubeMaterial);
	scene.add(line_S);	
	
	/////////////////////////////////////////////////////////////
	// Отображаем символ spin "ψ" на 3D-холсте
	meshText_Psi = new THREE.Object3D();
	meshText_Psi.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x0000a0, 
										 sside: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_Psi.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_Psi, "Iψ>" );
	meshText_Psi.scale.set(0.22, 0.17, 0.05);	
	var r1 = 15.0;
	var x = r1 * Math.sin(polar_electron/2) * Math.sin(azimuth_electron); //  + 0.5;
	var y = r1 * Math.cos(polar_electron/2);
	var z = r1 * Math.sin(polar_electron/2) * Math.cos(azimuth_electron); 
	//meshText_Psi.rotation.z = -Math.PI/2;
	meshText_Psi.position.set(x, y, z);	
	scene.add(meshText_Psi);
	
	///////////////////////////
	// O - центр
	const meshText_O = new THREE.Object3D();
	meshText_O.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0xaa0000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_O.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_O, "O" );
	meshText_O.scale.set(0.15, 0.20, 0.05);	
	var x = 0 - 0.9;
	var y = 0 + 0.5; 
	var z = 0 + 0.9;
	meshText_O.position.set(x, y, z);
	scene.add(meshText_O);
	
	// N - северный полюс
	
/*
	const meshText_N = new THREE.Object3D();
	meshText_N.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x0000f0, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_N.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_N, "I0>" );
	meshText_N.scale.set(0.13, 0.17, 0.05);	
	var x = 0 - 0.9;
	var y = r1 - 0.2; 
	var z = 0;
	meshText_N.position.set(x, y, z);
	scene.add(meshText_N);
*/	
	
	// N - северный полюс
	const meshText_North = new THREE.Object3D();
	meshText_North.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0xdd0000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_North.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_North, "N" );
	meshText_North.scale.set(0.15, 0.15, 0.15);	
	var x = 1;
	var y = r1 + 1.0; 
	var z = 0;
	meshText_North.position.set(x, y, z);
	scene.add(meshText_North);

	
	// S - южный полюс
/*
	const meshText_S = new THREE.Object3D();
	meshText_S.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x0000f0, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_S.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_S, "I1>" );
	meshText_S.scale.set(0.13, 0.17, 0.13);	
	var x = 0 - 1.1;
	var y = - r1 + 0.25; 
	var z = 0;
	meshText_S.position.set(x, y, z);
	scene.add(meshText_S);
*/
	
	// S - южный полюс
	const meshText_South = new THREE.Object3D();
	meshText_South.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0xdd0000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_South.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_South, "S" );
	meshText_South.scale.set(0.15, 0.15, 0.15);	
	var x = 0.5;
	var y = -r1 - 0.7; 
	var z = 0;
	meshText_South.position.set(x, y, z);
	scene.add(meshText_South);
	
	
	// Рисуем проекции Psi

	var spinor_teta = 0.5 * polar_electron;
	var spinor_fi = azimuth_electron;
	
	var r = 14;

	var spinor_x = r * Math.sin(spinor_teta) * Math.cos(spinor_fi);
	var spinor_y = r * Math.sin(spinor_teta) * Math.sin(spinor_fi);
	var spinor_z = r * Math.cos(spinor_teta);
	
	var X = spinor_y;
	var Y = spinor_z;
	var Z = spinor_x;

	var SPIN = new THREE.Vector3(X, Y, Z);
	var proj_OXY = new THREE.Vector3(X, Y, 0);
	var proj_OXZ = new THREE.Vector3(X, 0, Z);
	var proj_OYZ = new THREE.Vector3(0, Y, Z);
	var CENTER = new THREE.Vector3(0, 0, 0);
	
	// Прямые line_parall_X и line_parall_z - это проецирующие прямые
	points = [];
	points.push(new THREE.Vector3(X, Y, Z));
	points.push(new THREE.Vector3(0, Y, 0));
	var geometry_line_parall_X = new THREE.BufferGeometry().setFromPoints( points );
	var material_line_parall_X = new THREE.LineBasicMaterial( { color: 0x0000a0 } );
	line_parall_X = new THREE.Line( geometry_line_parall_X, material_line_parall_X );
	scene.add( line_parall_X );

	var points = [];
	points.push(SPIN);
	points.push(proj_OXZ);
	var geometry_line_parall_Z = new THREE.BufferGeometry().setFromPoints( points );
	var material_line_parall_Z = new THREE.LineBasicMaterial( {color: 0x0000a0} );
	line_parall_Z = new THREE.Line( geometry_line_parall_Z, material_line_parall_Z );
	scene.add(line_parall_Z);

	var X1 = r * Math.sin(spinor_fi);
	var Z1 = r * Math.cos(spinor_fi);
	var pt1 = new THREE.Vector3(X1, 0, Z1);
	
	var X2 = r * Math.sin(spinor_fi + Math.PI);
	var Z2 = r * Math.cos(spinor_fi + Math.PI);
	var pt2 = new THREE.Vector3(X2, 0, Z2);
	
	// Прямая line_XY лежит в плоскости OXY
	points = [];
	points.push(pt1);
	points.push(pt2);
	var geometry_line_XY = new THREE.BufferGeometry().setFromPoints( points );
	var material_line_XY = new THREE.LineBasicMaterial( { color: 0x0000a0 } );
	line_XY = new THREE.Line( geometry_line_XY, material_line_XY );
	scene.add( line_XY );
	
	// sphere1 & sphere2 - зеленые точки проекций
	var spGeometry = new THREE.CubeGeometry(0.5, 0.5, 0.5);
	var spMaterial_sp = new THREE.MeshBasicMaterial({color: 0x0000a0});
	spMaterial_sp.side = THREE.FrontSide;
	spMaterial_sp.FlatShading = true;
	sp1 = new THREE.Mesh(spGeometry, spMaterial_sp);
	sp2 = new THREE.Mesh(spGeometry, spMaterial_sp);

	sp1.position.set(0, Y, 0);
	sp2.position.set(X, 0, Z);
	
	scene.add(sp1);
	scene.add(sp2);
	
	///////////////////////
	// sp1 - a
	meshText_sp1 = new THREE.Object3D();
	meshText_sp1.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x0000f0, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_sp1.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_sp1, "a" );
	meshText_sp1.scale.set(0.15, 0.15, 0.05);	
	meshText_sp1.position.set(0.5, Y, 0.5);
	scene.add(meshText_sp1);
	///////////////////////
	// sp2 - b
	meshText_sp2 = new THREE.Object3D();
	meshText_sp2.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x0000f0, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_sp2.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_sp2, "b" );
	meshText_sp2.scale.set(0.15, 0.15, 0.05);	
	meshText_sp2.position.set(X + 0.5, 0.5, Z + 0.5);
	scene.add(meshText_sp2);
}

function recalc()
{	
	mesh_electron_arrow.rotation.y = azimuth_electron + Math.PI/2;
	mesh_electron_arrow.rotation.z = polar_electron + Math.PI/2;	
	
	var spinor_teta = 0.5 * polar_electron;
	var spinor_fi = azimuth_electron;
	
	var r = 14;

	var spinor_x = r * Math.sin(spinor_teta) * Math.cos(spinor_fi);
	var spinor_y = r * Math.sin(spinor_teta) * Math.sin(spinor_fi);
	var spinor_z = r * Math.cos(spinor_teta);
	
	// console.log("****SPIN x = ", spinor_x);
	// console.log("****SPIN y = ", spinor_y);
	// console.log("****SPIN z = ", spinor_z);	
	// console.log("******");	
	
	var X = spinor_y;
	var Y = spinor_z;
	var Z = spinor_x;
	
	mesh_spinor_arrow.position.set(0, 0, 0);
	
	mesh_spinor_arrow.rotation.z = spinor_teta + Math.PI/2;
	mesh_spinor_arrow.rotation.y = spinor_fi + Math.PI/2;//!!!
	
	var SPIN = new THREE.Vector3(X, Y, Z);
	var proj_OXY = new THREE.Vector3(X, Y, 0);
	var proj_OXZ = new THREE.Vector3(X, 0, Z);
	var proj_OYZ = new THREE.Vector3(0, Y, Z);
	var CENTER = new THREE.Vector3(0, 0, 0);

	// Прямые line_parall_X и line_parall_z - это проецирующие прямые
	scene.remove( line_parall_X );
	points = [];
	points.push(new THREE.Vector3(X, Y, Z));
	points.push(new THREE.Vector3(0, Y, 0));
	var geometry_line_parall_X = new THREE.BufferGeometry().setFromPoints( points );
	var material_line_parall_X = new THREE.LineBasicMaterial( { color: 0x0000a0 } );
	line_parall_X = new THREE.Line( geometry_line_parall_X, material_line_parall_X );
	scene.add( line_parall_X );

	scene.remove( line_parall_Z );
	var points = [];
	points.push(SPIN);
	points.push(proj_OXZ);
	var geometry_line_parall_Z = new THREE.BufferGeometry().setFromPoints( points );
	var material_line_parall_Z = new THREE.LineBasicMaterial( {color: 0x0000a0} );
	line_parall_Z = new THREE.Line( geometry_line_parall_Z, material_line_parall_Z );
	scene.add(line_parall_Z);

	var X1 = r * Math.sin(spinor_fi);
	var Z1 = r * Math.cos(spinor_fi);
	var pt1 = new THREE.Vector3(X1, 0, Z1);
	
	var X2 = r * Math.sin(spinor_fi + Math.PI);
	var Z2 = r * Math.cos(spinor_fi + Math.PI);
	var pt2 = new THREE.Vector3(X2, 0, Z2);
	
	// Прямая line_XY лежит в плоскости OXY
	scene.remove( line_XY );
	points = [];
	points.push(pt1);
	points.push(pt2);
	var geometry_line_XY = new THREE.BufferGeometry().setFromPoints( points );
	var material_line_XY = new THREE.LineBasicMaterial( { color: 0x0000a0 } );
	line_XY = new THREE.Line( geometry_line_XY, material_line_XY );
	scene.add( line_XY );
	
	// sphere1 & sphere2 - зеленые точки проекций
	scene.remove(sp1);
	scene.remove(sp2);
	var spGeometry = new THREE.CubeGeometry(0.5, 0.5, 0.5);
	var spMaterial_sp = new THREE.MeshBasicMaterial({color: 0x0000a0});
	spMaterial_sp.side = THREE.FrontSide;
	spMaterial_sp.FlatShading = true;
	sp1 = new THREE.Mesh(spGeometry, spMaterial_sp);
	sp2 = new THREE.Mesh(spGeometry, spMaterial_sp);

	sp1.position.set(0, Y, 0);
	sp2.position.set(X, 0, Z);
	
	scene.add(sp1); // vert
	scene.add(sp2);	// hor
	
	///////////////////////
	scene.remove(meshText_sp1);
	scene.remove(meshText_sp2);
	
	// sp1 - a
	meshText_sp1.position.set(0.8, Y + 0.8, 0.8);
	scene.add(meshText_sp1);
	// sp2 - b
	meshText_sp2.position.set(X + 0.8, 0.8, Z + 0.8);
	scene.add(meshText_sp2);
/*	
	console.log("spinor x = ", spinor_x);
	console.log("spinor y = ", spinor_y);
	console.log("spinor z = ", spinor_z);
	
	console.log("X = ", spinor_x);
	console.log("Y = ", spinor_y);
	console.log("Z = ", spinor_z);
*/	
	print_spin_1();
	print_hud_2();
	print_hud_3();
	
	scene.remove(ellipse_spin);
	ellipse_spin.rotation.y = Math.PI/2 + azimuth_electron;
	scene.add(ellipse_spin);
	
	scene.remove(meshText_B);
	var r1 = 15.0;
	var x = r1 * Math.sin(polar_electron) * Math.sin(azimuth_electron);
	var y = r1 * Math.cos(polar_electron);
	var z = r1 * Math.sin(polar_electron) * Math.cos(azimuth_electron); 
	//meshText_B.rotation.z = -Math.PI/2;
	meshText_B.position.set(x, y, z);
	scene.add(meshText_B);
	
	scene.remove(meshText_Psi);
	var x = r1 * Math.sin(polar_electron/2) * Math.sin(azimuth_electron);
	var y = r1 * Math.cos(polar_electron/2);
	var z = r1 * Math.sin(polar_electron/2) * Math.cos(azimuth_electron); 
	//meshText_Psi.rotation.z = -Math.PI/2;
	meshText_Psi.position.set(x, y, z);
	scene.add(meshText_Psi);
	
	// Прямые B - N и B - S
	scene.remove(line_N);
	scene.remove(line_S);

	var r2 = 14.0;
	var x = r2 * Math.sin(polar_electron) * Math.sin(azimuth_electron);
	var y = r2 * Math.cos(polar_electron);
	var z = r2 * Math.sin(polar_electron) * Math.cos(azimuth_electron); 

	var lineTubeMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

	var startVector = new THREE.Vector3( x, y, z );
	var endVector = new THREE.Vector3( 0, r2, 0 );

	points = [];
	points.push(startVector, endVector);

	  // Create Tube Geometry
	var tubeGeometry = new THREE.TubeGeometry
	(		
		new THREE.CatmullRomCurve3(points),
		256,// path segments
		0.05,// THICKNESS
		4, //Roundness of Tube
		false //closed
	);

	line_N = new THREE.Line(tubeGeometry, lineTubeMaterial);
	scene.add(line_N);

	endVector = new THREE.Vector3( 0, - r2, 0 );

	points = [];
	points.push(startVector, endVector);

	  // Create Tube Geometry
	var tubeGeometry = new THREE.TubeGeometry
	(		
		new THREE.CatmullRomCurve3(points),
		256,// path segments
		0.05,// THICKNESS
		4, //Roundness of Tube
		false //closed
	);

	line_S = new THREE.Line(tubeGeometry, lineTubeMaterial);
	scene.add(line_S);	
	
	scene.remove(meshText_a);
	scene.remove(meshText_b);
	
	// b'
	var len = x*x + (r2 - y)*(r2 - y) + z*z;
	meshText_b.position.set(x/3 - 0.8, (y + 2*r2)/3, z/3 - 0.5);
	if (len > 7)
	{
		scene.add(meshText_b);
	}
	///////////////////////
	
	// a'
	len = x*x + (-r2 - y)*(-r2 - y) + z*z;
	meshText_a.position.set(x/3 - 0.5, (y - 2*r2)/3, z/3 - 0.5);
	if (len > 7)
	{
		scene.add(meshText_a);
	}
	///////////////////////
}

function print_hud_2() 
{ 
	var probab = "〈σ〉 = ";
	
	var elem2 = document.getElementById('hud_2');
	ctx_hud_2.clearRect(0, 0, elem2.width, elem2.height);
	
	ctx_hud_2.font = 'bold italic 22px "Times New Roman"';
	ctx_hud_2.fillStyle = "#000000";
	ctx_hud_2.fillText("Visualization of quantum spin", 10, 20);
	
	var d = 0;
	ctx_hud_2.font = 'bold 14px "Times New Roman"';
	ctx_hud_2.fillStyle = "#ff0000";
	ctx_hud_2.fillText("Electron", 28, 55);
	ctx_hud_2.fillStyle = "#000000";
	ctx_hud_2.fillText(" / ", 86, 55);
	ctx_hud_2.fillStyle = "#0000f0";
	ctx_hud_2.fillText("Spinor ", 101, 55);	
	ctx_hud_2.fillStyle = "#000000";
	ctx_hud_2.fillText("  polar  angles : ", 145, 55);		
/*
	var text_ang = roundNumber(polar_electron/DEGREE, 0) + "°" + " /  " +
				roundNumber(0.5 * polar_electron/DEGREE, 0) + "°";
				
	var polar_degree = polar_electron/DEGREE;
				
	ctx_hud_2.font = 'bold 18px "Times New Roman"';
	ctx_hud_2.fillStyle = "#000000";
	ctx_hud_2.fillText(text_ang, 120, 130);	
*/
	var text_ang_electron = roundNumber(polar_electron/DEGREE, 0) + "°";
	ctx_hud_2.font = 'bold 18px "Times New Roman"';
	ctx_hud_2.fillStyle = "#ff0000";
	ctx_hud_2.fillText(text_ang_electron, 65, 80);
	
	ctx_hud_2.fillStyle = "#000000";
	ctx_hud_2.fillText("    /    ", 85, 80);
	
	var text_ang_spin = roundNumber(0.5 * polar_electron/DEGREE, 0) + "°";
	ctx_hud_2.fillStyle = "#0000f0";
	ctx_hud_2.fillText(text_ang_spin, 117, 80);
	
	/////////////////////////////////////////////////
	ctx_hud_2.font = 'bold 14px "Times New Roman"';
	
	ctx_hud_2.fillStyle = "#ff0000";
	ctx_hud_2.fillText("Electron ", 22, 110);
	ctx_hud_2.fillStyle = "#000000";
	ctx_hud_2.fillText(" and ", 80, 110);
	ctx_hud_2.fillStyle = "#0000f0";
	ctx_hud_2.fillText("Spinor", 115, 110);
	ctx_hud_2.fillStyle = "#000000";
	text_ang = "azimuzh  angles : ";
	ctx_hud_2.fillText(text_ang, 165, 110);	
	
	ctx_hud_2.font = 'bold 18px "Times New Roman"';
	text_ang = roundNumber(azimuth_electron/DEGREE, 0) + "°";
	ctx_hud_2.fillText(text_ang, 120, 135);
	
	/////////////////////////////////////////////////
	
	var cos_teta = Math.cos(polar_electron/2);
	var sin_teta = Math.sin(polar_electron/2);
	
	var text_cos_teta = roundNumber(cos_teta, 3);
	var text_sin_teta = roundNumber(sin_teta, 3);
	

	// Probability
	var p0 = cos_teta * cos_teta * 100;
	var p1 = sin_teta * sin_teta * 100;
	var text_p0 = roundNumber(p0, 3);
	var text_p1 = roundNumber(p1, 3);
	
	ctx_hud_2.font = '16px "Times New Roman"';
	ctx_hud_2.fillStyle = "#000000";
	ctx_hud_2.fillText("  Вероятности получения значений ", 25, 160);	
	ctx_hud_2.fillText("направления спина  P(0)  и  P(1)", 45, 180);
	ctx_hud_2.font = 'bold 18px "Times New Roman"';
	ctx_hud_2.fillStyle = "#000000";
	ctx_hud_2.fillText("P(0) = " + text_p0 + "%", 80, 210);	
	ctx_hud_2.fillText("P(1) = " + text_p1 + "%", 80, 240);	

//	var index = 1234567890;
//	ctx_hud_2.fillText("N" + index, 0, 300);
//	ctx_hud_2.fillText("N" + toSub(index), 0, 340);
}	

function print_spin_1()
{
	var elem = document.getElementById('canvas_draw');
	ctx_hud_1.clearRect(0, 0, elem.width, elem.height);
	
	var fi = roundNumber(azimuth_electron/DEGREE, 0) + "°) · |1〉";
	
	var cos_teta = Math.cos(polar_electron/2);
	var sin_teta = Math.sin(polar_electron/2);
	var b = Math.sin(polar_electron/2) * Math.cos(azimuth_electron);
	var c = Math.sin(polar_electron/2) * Math.sin(azimuth_electron);
	
	var text_cos_teta = roundNumber(cos_teta, 3);
	var text_sin_teta = roundNumber(sin_teta, 3);
	text_b = roundNumber(b, 3);
	text_c = roundNumber(c, 3);	
	
	//ctx_hud_1.font = '16px "Times New Roman"';
	ctx_hud_1.font = 'bold 17px "Times New Roman"';
	var text_color = "#000";
	var value_color = "#00f";
	ctx_hud_1.fillStyle = text_color;
//	ctx_hud_1.fillText(text_cos_teta, 10, 100);	
//	ctx_hud_1.fillText(text_sin_teta, 10, 120);	
	
	var rez = "|ψ〉  =  " + 
				"(" + text_cos_teta + ") · |0〉 " + " + " +
			" (" + text_sin_teta + ") ";
	var rez = rez + "· exp(i ·" + fi;
	
	ctx_hud_1.fillText(rez, 200, 540);	
}

//////////////////////////////////////////////////////////////
// 3D-Text
//////////////////////////////////////////////////////////////
var loaderText = new THREE.FontLoader(); // загрузчик шрифтов

// характеристики создаваемого 3D текста
function create_text(txt)
{
	var t =
	{
		text : txt,          // текст номера, который небходимо отобразить
		size : 6,            // размер текста (высота символа)
		height : 1,          // толщина текста
		curveSegments : 12,  // количество точек (сегментов) 
              // кривой при рисовании буквы, отвечающие за качество изображения
		//     font : "gentilis",   // название шрифта
		bevelEnabled : false // включение фаски (при true)
	};	
	return t;
}
	
// Создание текста для оцифровки вершин огранки.			
function generateGeometry(meshText, text)
{
	var data = create_text(text);
	loaderText.load
	( 
		//'../libs/helvetiker_regular.typeface.js', // шрифт
		//'../libs/optimer_regular.typeface.js',
		//'../libs/bitstream_vera_sans_mono_roman.typeface.js',
		//'../libs/gentilis_regular.typeface.js',
		'../libs/helvetiker_regular.typeface.json',
		function ( font ) 
		{
			var geometryText = new THREE.TextGeometry
			( 
				data.text, 
				{
					font: font,
					size: data.size,
					height: data.height,
					curveSegments: data.curveSegments,
					bevelEnabled: data.bevelEnabled
				} 
			);
			geometryText.center();
			meshText.children[ 0 ].geometry.dispose(); 
			meshText.children[ 0 ].geometry = geometryText;			
		}
	);
}

function roundNumber(num, places) 
{
	return ( Math.round(num * Math.pow(10, places)) / Math.pow(10, places) );
}
	
	
function toSub(value)
{
  var str = "";
  //  Get the number of digits, with a minimum at 0 in case the value itself is 0
  var mag = Math.max(0, Math.floor(Math.log10(value)));
  //  Loop through all digits
  while (mag >= 0)
  {
    //  Current digit's value
    var digit = Math.floor(value/Math.pow(10, mag))%10;
    //  Append as subscript character
    str += String.fromCharCode(8320 + digit);
    mag--;
  }
  return str;
}

function render() 
{
	orbitControl.enabled = true;
	renderer.render(scene, camera);		
	requestAnimationFrame(render);
}

function print_hud_3() 
{ 
	var probab = "〈σ〉 = ";
	
	var elem = document.getElementById('quant_params');
	ctx_hud_3.clearRect(0, 0, elem.width, elem.height);
	
	var fi = roundNumber(azimuth_electron/DEGREE, 0) + "°)";
	
	var cos_teta = Math.cos(polar_electron/2);
	var sin_teta = Math.sin(polar_electron/2);
	
	var text_cos_teta = roundNumber(cos_teta, 3);
	var text_sin_teta = roundNumber(sin_teta, 3);
	
	ctx_hud_3.font = '20px "Arial"';
	ctx_hud_3.fillStyle = "#000000";
	
	var rez1 = "|ψ〉 = " + "(" + text_cos_teta + ") " + " + " + " (" + text_sin_teta + ") ";
	var rez = rez1 + " · exp(i · " + fi;
	
	//fi = roundNumber(azimuth_electron/DEGREE, 0) + "°) · |1〉";
	fi = roundNumber(azimuth_electron/DEGREE, 0) + "°) · |1〉";
	var rez = "|ψ〉 = " + 
				"(" + text_cos_teta + ") · |0〉 " + " + " +
			" (" + text_sin_teta + ") ";
	var rez = rez + " · exp(i · " + fi;
	
	ctx_hud_3.fillText(rez, 100, 40);	
	
	var a = Math.sin(polar_electron/2) * Math.cos(azimuth_electron);
	var b = Math.sin(polar_electron/2) * Math.sin(azimuth_electron);
	text_a = roundNumber(a, 3);
	text_b = roundNumber(b, 3);	
	
	var rez;
	var rez1, rez2;
	
	if ( (cos_teta > -0.0000001) && (cos_teta < 0.0000001) )
	{
		rez1 = "|ψ〉 = " + "(0) · " + "|0〉";
	}
	else 
	{
		rez1 = "|ψ〉 = " + "(" + roundNumber(cos_teta, 3) + ") · " + "|0〉 ";
	}
	
	////////////////////////////////////////////////////////////////////
	
	if ( (Math.abs(a) < 0.00001) && (Math.abs(b) < 0.00001) )
	{
		rez2 = " + (0) · " + "|1〉";
	}
	else if ( (Math.abs(a) < 0.00001) && (Math.abs(b) > 0.00001) )
	{
		rez2 = " + " + "i · (" + roundNumber(b, 3) + ")" + " · " + "|1〉";
	}
	else if ( (Math.abs(a) > 0.00001) && (Math.abs(b) < 0.00001) )
	{
		rez2 = " + " + "(" + roundNumber(a, 3) + ")" + " · " + "|1〉";
	}
	else if ( (Math.abs(a) > 0.00001) && (Math.abs(b) > 0.00001) )
	{
	rez2 = " + [ (" + roundNumber(a, 3) + ") + " + "i · (" + roundNumber(b, 3) + ")]" + " · " + "|1〉";
	}
	
	rez = rez1 + rez2;

	ctx_hud_3.fillText(rez, 100, 80);		
}

function bas0(a, b)
{
	ctx_hud_3.fillStyle = "#0000ff";
	ctx_hud_3.fillText("|0〉", a, b);
	ctx_hud_3.fillStyle = "#000000";
}

function bas1(a, b)
{
	ctx_hud_3.fillStyle = "#0000ff";
	ctx_hud_3.fillText("|1〉", a, b);
	ctx_hud_3.fillStyle = "#000000";
}

//window.onload = init;

