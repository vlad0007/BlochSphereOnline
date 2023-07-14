// buttons.js
var btn_measurement;

var lbl_electron_polar, lbl_electron_az;

var btn_electron_polar_0, btn_electron_polar_30, 
    btn_electron_polar_60, btn_electron_polar_90, btn_electron_polar_120, 
	btn_electron_polar_150, btn_electron_polar_180, btn_electron_polar_270, 
	btn_electron_polar_360, btn_electron_polar_450, btn_electron_polar_540, 
	btn_electron_polar_540, btn_electron_polar_630, btn_electron_polar_720;
	
var btn_electron_azim_0, btn_electron_azim_30, btn_electron_azim_60,
    btn_electron_azim_90, btn_electron_azim_120, btn_electron_azim_150, 
	btn_electron_azim_180, btn_electron_azim_210, btn_electron_azim_240,
	btn_electron_azim_270, btn_electron_azim_300, btn_electron_azim_330,
	btn_electron_azim_360;
	
function Lbl (name, left, top )
{
	this.name = name;
	this.name = document.createElement('input');
	this.name.type = 'button';
	this.name.value = name;
	this.id = gui_container.appendChild(this.name);
	this.id.style = "position: absolute";
	this.id.style.background='#aaaaaa';
	this.id.style.color='#440000';
	this.id.style.top = top;
	this.id.style.left = left;
	// this.id.style.width = "110px";
	this.id.style.font = '10px  "Times New Roman"';
	this.id.disabled = true;
	//this.id.style.cursor = "pointer";
}	

function AddLabels()
{
	lbl_electron_polar = new Lbl("Electron polar  θ\n Spinor polar  θ/2", "2px", "110px" );
	lbl_electron_polar.id.style.background='#ccccff';
	lbl_electron_polar.id.style.color='#000000';
	lbl_electron_polar.id.style.width = "110px";
	
	lbl_electron_az = new Lbl("Electron azimuth φ\nSpinor azimuth φ", "130px", "110px" );
	lbl_electron_az.id.style.background='#ccccff';	
	lbl_electron_az.id.style.color='#000000';
	lbl_electron_az.id.style.width = "110px";
}

function Btn (name, left, top )
{
	this.name = name;
	this.name = document.createElement('input');
	this.name.type = 'button';
	this.name.value = name;
	this.id = gui_container.appendChild(this.name);
	this.id.style = "position: absolute";
	this.id.style.background='#ccccff';
	this.id.style.color='#000000';
	this.id.style.top = top;
	this.id.style.left = left;
	this.id.style.width = "80px";
	this.id.style.cursor = "pointer";
}	

function Btn2 (name, left, top )
{
	this.name = name;
	this.name = document.createElement('input');
	this.name.type = 'button';
	this.name.value = name;
	this.id = gui_container.appendChild(this.name);
	this.id.style = "position: absolute";
	this.id.style.background='#bbbbff';
	this.id.style.color='#000000';
	this.id.style.top = top;
	this.id.style.left = left;
	this.id.style.width = "80px";
	this.id.style.cursor = "pointer";
}	

function AddButtons()
{
	btn_electron_polar_0 = new Btn("0°/0°", "20px", "140px" );
	btn_electron_polar_30 = new Btn("30°/15°", "20px", "160px" );
	btn_electron_polar_60 = new Btn("60°/30°", "20px", "180px" );
	btn_electron_polar_90 = new Btn("90°/45°", "20px", "200px" );
	btn_electron_polar_120 = new Btn("120°/60°", "20px", "220px" );
	btn_electron_polar_150 = new Btn("150°/75°", "20px", "240px" );	
	btn_electron_polar_180 = new Btn("180°/90°", "20px", "260px" );		
	
	btn_electron_polar_270 = new Btn("270°/135°", "20px", "280px" );
	btn_electron_polar_360 = new Btn("360°/180°", "20px", "300px" );
	btn_electron_polar_450 = new Btn("450°/225°", "20px", "320px" );
	btn_electron_polar_540 = new Btn("540°/270°", "20px", "340px" );
	btn_electron_polar_630 = new Btn("630°/315°", "20px", "360px" );
	btn_electron_polar_720 = new Btn("720°/360°", "20px", "380px" );
	

	btn_electron_polar_0.name.addEventListener("click", electron_polar_0);
	btn_electron_polar_30.name.addEventListener("click", electron_polar_30);
	btn_electron_polar_60.name.addEventListener("click", electron_polar_60);
	btn_electron_polar_90.name.addEventListener("click", electron_polar_90);
	btn_electron_polar_120.name.addEventListener("click", electron_polar_120);
	btn_electron_polar_150.name.addEventListener("click", electron_polar_150);
	btn_electron_polar_180.name.addEventListener("click", electron_polar_180);
	
	btn_electron_polar_270.name.addEventListener("click", electron_polar_270);
	btn_electron_polar_360.name.addEventListener("click", electron_polar_360);
	btn_electron_polar_450.name.addEventListener("click", electron_polar_450);
	btn_electron_polar_540.name.addEventListener("click", electron_polar_540);
	btn_electron_polar_630.name.addEventListener("click", electron_polar_630);
	btn_electron_polar_720.name.addEventListener("click", electron_polar_720);
	
	//////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////
	
	btn_electron_azim_0 = new Btn2("0°", "150px", "140px" );
	btn_electron_azim_30 = new Btn2("30°", "150px", "160px" );
	btn_electron_azim_60 = new Btn2("60°", "150px", "180px" );
	btn_electron_azim_90 = new Btn2("90°", "150px", "200px" );
	btn_electron_azim_120 = new Btn2("120°", "150px", "220px" );
	btn_electron_azim_150 = new Btn2("150°", "150px", "240px" );
	btn_electron_azim_180 = new Btn2("180°", "150px", "260px" );
	btn_electron_azim_210 = new Btn2("210°", "150px", "280px" );
	btn_electron_azim_240 = new Btn2("240°", "150px", "300px" );
	btn_electron_azim_270 = new Btn2("270°", "150px", "320px" );
	btn_electron_azim_300 = new Btn2("300°", "150px", "340px" );
	btn_electron_azim_330 = new Btn2("330°", "150px", "360px" );
	btn_electron_azim_360 = new Btn2("360°", "150px", "380px" );

	btn_electron_azim_0.name.addEventListener("click", electron_azim_0);
	btn_electron_azim_30.name.addEventListener("click", electron_azim_30);
	btn_electron_azim_60.name.addEventListener("click", electron_azim_60);
	btn_electron_azim_90.name.addEventListener("click", electron_azim_90);5
	btn_electron_azim_120.name.addEventListener("click", electron_azim_120);
	btn_electron_azim_150.name.addEventListener("click", electron_azim_150);
	btn_electron_azim_180.name.addEventListener("click", electron_azim_180);
	btn_electron_azim_210.name.addEventListener("click", electron_azim_210);
	btn_electron_azim_240.name.addEventListener("click", electron_azim_240);
	btn_electron_azim_270.name.addEventListener("click", electron_azim_270);
	btn_electron_azim_300.name.addEventListener("click", electron_azim_300);
	btn_electron_azim_330.name.addEventListener("click", electron_azim_330);
	btn_electron_azim_360.name.addEventListener("click", electron_azim_360);
}

function electron_azim_0() 
{ 
   azimuth_electron = 0 * DEGREE;
   recalc();
   controller.azimuth_electron = 0;
   gui.updateDisplay();
   azim_background();
   btn_electron_azim_0.id.style.background = '#ffaaaa';
}
function electron_azim_30() 
{ 
   azimuth_electron = 30 * DEGREE;
   recalc();
   controller.azimuth_electron = 30;
   gui.updateDisplay();
   azim_background();
   btn_electron_azim_30.id.style.background = '#ffaaaa';
}
function electron_azim_60() 
{ 
   azimuth_electron = 60 * DEGREE;
   recalc();
   controller.azimuth_electron = 60;
   gui.updateDisplay();
   azim_background();
   btn_electron_azim_60.id.style.background = '#ffaaaa';
}
function electron_azim_90() 
{ 
   azimuth_electron = 90 * DEGREE;
   recalc();
   controller.azimuth_electron = 90;
   gui.updateDisplay();
   azim_background();
   btn_electron_azim_90.id.style.background = '#ffaaaa';
}
function electron_azim_120() 
{ 
   azimuth_electron = 120 * DEGREE;
   recalc();
   controller.azimuth_electron = 120;
   gui.updateDisplay();
   azim_background();
   btn_electron_azim_120.id.style.background = '#ffaaaa';
}
function electron_azim_150() 
{ 
   azimuth_electron = 150 * DEGREE;
   recalc();
   controller.azimuth_electron = 150;
   gui.updateDisplay();
   azim_background();
   btn_electron_azim_150.id.style.background = '#ffaaaa';
}
function electron_azim_180() 
{ 
   azimuth_electron = 180 * DEGREE;
   recalc();
   controller.azimuth_electron = 180;
   gui.updateDisplay();
   azim_background();
   btn_electron_azim_180.id.style.background = '#ffaaaa';
}
function electron_azim_210() 
{ 
   azimuth_electron = 210 * DEGREE;
   recalc();
   controller.azimuth_electron = 210;
   gui.updateDisplay();
   azim_background();
   btn_electron_azim_210.id.style.background = '#ffaaaa';
}
function electron_azim_240() 
{ 
   azimuth_electron = 240 * DEGREE;
   recalc();
   controller.azimuth_electron = 240;
   gui.updateDisplay();
   azim_background();
   btn_electron_azim_240.id.style.background = '#ffaaaa';
}
function electron_azim_270() 
{ 
   azimuth_electron = 270 * DEGREE;
   recalc();
   controller.azimuth_electron = 270;
   gui.updateDisplay();
   azim_background();
   btn_electron_azim_270.id.style.background = '#ffaaaa';
}
function electron_azim_300() 
{ 
   azimuth_electron = 300 * DEGREE;
   recalc();
   controller.azimuth_electron = 300;
   gui.updateDisplay();
   azim_background();
   btn_electron_azim_300.id.style.background = '#ffaaaa';
}
function electron_azim_330() 
{ 
   azimuth_electron = 330 * DEGREE;
   recalc();
   controller.azimuth_electron = 330;
   gui.updateDisplay();
   azim_background();
   btn_electron_azim_330.id.style.background = '#ffaaaa';
}
function electron_azim_360() 
{ 
   azimuth_electron = 360 * DEGREE;
   recalc();
   controller.azimuth_electron = 360;
   gui.updateDisplay();
   azim_background();
   btn_electron_azim_360.id.style.background = '#ffaaaa';
}

////////////////////////////////
////////////////////////////////

function electron_polar_0() 
{ 
   polar_electron = 0 * DEGREE;
   recalc();
   controller.polar_electron = 0;
   gui.updateDisplay();
   polar_background();
   btn_electron_polar_0.id.style.background = '#ffaaaa';
}
function electron_polar_30() 
{ 
   polar_electron = 30 * DEGREE;
   recalc();
   controller.polar_electron = 30;
   gui.updateDisplay();
   polar_background();
   btn_electron_polar_30.id.style.background = '#ffaaaa';
}
function electron_polar_60() 
{ 
   polar_electron = 60 * DEGREE;
   recalc();
   controller.polar_electron = 60;
   gui.updateDisplay();
   polar_background();
   btn_electron_polar_60.id.style.background = '#ffaaaa';
}
function electron_polar_90() 
{ 
   polar_electron = 90 * DEGREE;
   recalc();
   controller.polar_electron = 90;
   gui.updateDisplay();
   polar_background();
   btn_electron_polar_90.id.style.background = '#ffaaaa';
}
function electron_polar_120() 
{ 
   polar_electron = 120 * DEGREE;
   recalc();
   controller.polar_electron = 120;
   gui.updateDisplay();
   polar_background();
   btn_electron_polar_120.id.style.background = '#ffaaaa';
}
function electron_polar_150() 
{ 
   polar_electron = 150 * DEGREE;
   recalc();
   controller.polar_electron = 150;
   gui.updateDisplay();
   polar_background();
   btn_electron_polar_150.id.style.background = '#ffaaaa';
}
function electron_polar_180() 
{ 
   polar_electron = 180 * DEGREE;
   recalc();
   controller.polar_electron = 180;
   gui.updateDisplay();
   polar_background();
   btn_electron_polar_180.id.style.background = '#ffaaaa';
}


function electron_polar_270() 
{ 
   polar_electron = 270 * DEGREE;
   recalc();
   controller.polar_electron = 270;
   gui.updateDisplay();
   polar_background();
   btn_electron_polar_270.id.style.background = '#ffaaaa';
}
function electron_polar_360() 
{ 
   polar_electron = 360 * DEGREE;
   recalc();
   controller.polar_electron = 360;
   gui.updateDisplay();
   polar_background();
   btn_electron_polar_360.id.style.background = '#ffaaaa';
}
function electron_polar_450() 
{ 
   polar_electron = 450 * DEGREE;
   recalc();
   controller.polar_electron = 450;
   gui.updateDisplay();
   polar_background();
   btn_electron_polar_450.id.style.background = '#ffaaaa';
}
function electron_polar_540() 
{ 
   polar_electron = 540 * DEGREE;
   recalc();
   controller.polar_electron = 540;
   gui.updateDisplay();
   polar_background();
   btn_electron_polar_540.id.style.background = '#ffaaaa';
}

function electron_polar_630() 
{ 
   polar_electron = 630 * DEGREE;
   recalc();
   controller.polar_electron = 630;
   gui.updateDisplay();
   polar_background();
   btn_electron_polar_630.id.style.background = '#ffaaaa';
}

function electron_polar_720() 
{ 
   polar_electron = 720 * DEGREE;
   recalc();
   controller.polar_electron = 720;
   gui.updateDisplay();
   polar_background();
   btn_electron_polar_720.id.style.background = '#ffaaaa';
}

/////////////////////////////////

function azim_background()
{
	var color = '#ccccff';
	btn_electron_azim_0.id.style.background = color;
	btn_electron_azim_30.id.style.background = color;
	btn_electron_azim_60.id.style.background = color;
	btn_electron_azim_90.id.style.background = color;
	btn_electron_azim_120.id.style.background = color;
	btn_electron_azim_150.id.style.background = color;
	btn_electron_azim_180.id.style.background = color;
	
	btn_electron_azim_210.id.style.background = color;
	btn_electron_azim_240.id.style.background = color;
	btn_electron_azim_270.id.style.background = color;
	btn_electron_azim_300.id.style.background = color;
	btn_electron_azim_330.id.style.background = color;
	btn_electron_azim_360.id.style.background = color;
}


function polar_background()
{
	var color = '#ccccff';
	btn_electron_polar_0.id.style.background = color;
	btn_electron_polar_30.id.style.background = color;
	btn_electron_polar_60.id.style.background = color;
	btn_electron_polar_90.id.style.background = color;
	btn_electron_polar_120.id.style.background = color;
	btn_electron_polar_150.id.style.background = color;
	btn_electron_polar_180.id.style.background = color;
	
	btn_electron_polar_270.id.style.background = color;
	btn_electron_polar_360.id.style.background = color;
	btn_electron_polar_450.id.style.background = color;
	btn_electron_polar_540.id.style.background = color;
	btn_electron_polar_630.id.style.background = color;
	btn_electron_polar_720.id.style.background = color;
}
