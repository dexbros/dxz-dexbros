<style>
h6 {
    line-height: 0;
    padding: 0;
    margin: 24px 10px 0px 10px;
}
h4{
	font-size:14px;
}
.ycopied {
    background: #d9ffd0;
    display: inline-block;
    padding: 0px 20px;
    border-radius: 5px;
    color: #000000;
    position: absolute;
    left: 320px;
}
.usagedex {
    background: #f5f5f5;
    display: inline-block;
    padding: 10px;
    border-radius: 5px;
    font-weight: bold;
    margin-bottom: 50px;
    width: 320px;
}
.npms {
    background: #f3f3f3;
    margin: 10px;
    padding: 7px;
    border-radius: 5px;
    display: block;
    max-width: 500px;
	border: 1px solid #e0e0e0;
	width:100%
}
span.cpclip {
    position: absolute;
    margin-left: 35px;
    margin-top: 6px;
    color: #1d9700;
    font-weight: bold;
}
ul.listwrapper li:hover {
    background: #f6f5f5;
    cursor: pointer;
}
ul.listwrapper {
    -webkit-column-count: 12;
    -moz-column-count: 12;
    column-count: 12;
    margin:0;
    padding:0;
    line-height:0px;
}
ul.listwrapper li {
    width: 95%;
    display:inline-block;
    border:1px solid  #cacaca;
    margin: 5px 0px;
    padding: 5px 1px;
    text-align:center;
    height: 44px;
    border-radius: 5px;
}
</style>

<style>
<?php include("style.css");?>
</style>

<div class="ccParent">

<h1>DexBros Icons</h1>
<div class="ycopied"></div>
<h3>Installation</h3>

<span class="icon icon-cream"></span>

<h6>NPM</h6>
<input type="text" class="npms yarn" id="npm install --save https://github.com/jayboro100/dexbrosicons.git" value="
npm install --save https://github.com/jayboro100/dexbrosicons.git">

<h6>YARN</h6>
<input type="text" class="npms yarn" id="yarn add dexbrosicons@https://github.com/jayboro100/dexbrosicons.git" value="yarn add dexbrosicons@https://github.com/jayboro100/dexbrosicons.git">


<h1>Usage</h1>
<div class="usagedex">
import 'dexbrosicons/style.css';</br></br>
&lt;span class="icon icon-btc">&lt;/span>
</div>


</div>


<h1>Available Icons</h1>
<?php
$entries = [];
$d = dir("icons"); // dir to scan
while (false !== ($entry = $d->read())) { // mind the strict bool check!
    if ($entry[0] == '.') continue; // ignore anything starting with a dot
    $entries[] = $entry;
}
$d->close();
sort($entries); // or whatever desired

$i=0;
echo '<ul class="listwrapper">';
foreach($entries as $name){
	$str = str_replace(".svg", "", $name);
	echo '<li class="thislist" id="'.$str.'"><span class="cpclip"></span><span class="icon icon-'.$str.'"><span class="path1"></span><span class="path2"></span></span><h4>'.$str.'</h4></li>'; echo '</br>';
}
echo '</ul>';
?>


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>

<script>
jQuery('body').on('click', ' ul.listwrapper li', function(){
	var copyText = jQuery(this).attr("id");
	$("ul.listwrapper li").css("background-color", "");
	$("ul.listwrapper li").find('span.cpclip').html("");
	navigator.clipboard.writeText(copyText).then(() => {
        // Alert the user that the action took place.
        // Nobody likes hidden stuff being done under the hood!
        //alert("Copied to clipboard");
		$(this).find('span.cpclip').html("<span class='icon icon-interest'></span> Copied!");
		$(this).css("background", "#efe8e8");
    });
	
})




jQuery("body").on('click','input[type=text]',function(){ 
$("ul.listwrapper li").find('span.cpclip').html("");
$("ul.listwrapper li").css("background-color", "");
var selected = $(this).attr("id");
navigator.clipboard.writeText(selected).then(() => {
		$(".ycopied").html("<span class='icon icon-interest'></span> Copied!").delay(3000).fadeOut(300);
		$(this).select();
		
    });


});

</script>
